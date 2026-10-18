import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  inventoryFiles,
  sha256,
  assertRootReadiness,
} from './release-artifact.mjs';
const require = createRequire(import.meta.url);
const yaml = createRequire(require.resolve('astro'))('yaml');
test('production preparation workflow cannot deploy Pages or mutate settings', () => {
  const text = fs.readFileSync(
    '.github/workflows/production-readiness.yml',
    'utf8',
  );
  const workflow = yaml.parse(text);
  assert.equal(workflow.permissions.contents, 'read');
  assert(!('push' in workflow.on));
  assert(!('pull_request_target' in workflow.on));
  assert(!text.includes('pages: write'));
  assert(!text.includes('id-token: write'));
  assert(
    !/actions\/(deploy-pages|configure-pages|upload-pages-artifact)/.test(text),
  );
  assert.equal(workflow.jobs.artifact.env.PAGES_PREVIEW, 'false');
  assert.equal(workflow.jobs.artifact.env.VERIFY_PAGES_PREVIEW, 'false');
  assert(workflow.jobs.artifact.steps.some((s) => s.run === 'pnpm test'));
  assert(
    workflow.jobs.artifact.steps.some((s) => s.run === 'pnpm release:prepare'),
  );
});
test('hashed inventory is deterministic and rejects private exports and symlinks', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'phase5a-test-'));
  try {
    fs.writeFileSync(path.join(root, 'index.html'), 'static fixture');
    const before = inventoryFiles(root);
    assert.equal(before[0].sha256, sha256('static fixture'));
    assert.deepEqual(inventoryFiles(root), before);
    fs.writeFileSync(path.join(root, '.env'), 'nonsecret QA fixture');
    assert.throws(() => inventoryFiles(root), /Private path/);
    fs.unlinkSync(path.join(root, '.env'));
    fs.symlinkSync('index.html', path.join(root, 'linked.html'));
    assert.throws(() => inventoryFiles(root), /Symlink/);
    fs.unlinkSync(path.join(root, 'linked.html'));
    fs.writeFileSync(path.join(root, 'index.html'), 'changed fixture');
    assert.notEqual(inventoryFiles(root)[0].sha256, before[0].sha256);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
test('production artifact preparation rejects a project preview build', () => {
  if (process.env.VERIFY_PAGES_PREVIEW === 'true')
    assert.throws(() => assertRootReadiness('dist'));
  else assert.equal(assertRootReadiness('dist').pageCount, 60);
});

test('complete production inventory preserves every public destination and Urogynecology contracts', () => {
  const root = 'dist';
  const pages = inventoryFiles(root).filter(
    (f) => f.path.endsWith('.html') && f.path !== '404.html',
  );
  const urls = pages
    .map(
      (p) =>
        'https://www.drvasundaragynec.com/' +
        p.path.replace(/index\.html$/, ''),
    )
    .sort();
  const report = fs.readFileSync(
    'docs/PHASE5A_BASELINE_URL_INVENTORY.md',
    'utf8',
  );
  const listed = [
    ...report.matchAll(/^\| (https:\/\/www\.drvasundaragynec\.com\/\S*) \|/gm),
  ]
    .map((m) => m[1])
    .sort();
  assert.deepEqual(
    listed,
    urls,
    'Public URL inventory must match the complete build',
  );
  const route = '/services/urogynecology-consultation/';
  const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
  const nodes = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((m) => {
    const graph = JSON.parse(m[1]);
    return graph['@graph'] || [graph];
  });
  const service = JSON.parse(
    fs.readFileSync('src/data/services.json', 'utf8'),
  ).find((s) => s.slug === 'urogynecology-consultation');
  assert.equal(
    nodes.find((n) => n['@type'] === 'MedicalWebPage').lastReviewed,
    service.medicalReviewedAt,
  );
  const base =
    process.env.VERIFY_PAGES_PREVIEW === 'true' ? '/drvasundara' : '';
  const origin = base
    ? 'https://reddyprasadkv-sunsolv.github.io'
    : 'https://www.drvasundaragynec.com';
  assert(
    fs
      .readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8')
      .includes(`<loc>${origin}${base}${route}</loc>`),
  );
  assert(
    pages.some(
      (p) =>
        p.path !== 'services/urogynecology-consultation/index.html' &&
        fs
          .readFileSync(path.join(root, p.path), 'utf8')
          .includes(`href="${base}${route}"`),
    ),
    'Urogynecology must retain an inbound internal link',
  );
});

test('production deployment requires both-mode CI validation before artifact publication', () => {
  const deploy = yaml.parse(
    fs.readFileSync('.github/workflows/pages.yml', 'utf8'),
  );
  const validation = yaml.parse(
    fs.readFileSync('.github/workflows/validate.yml', 'utf8'),
  );
  assert.equal(deploy.jobs.validation.uses, './.github/workflows/validate.yml');
  assert.equal(deploy.jobs.build.needs, 'validation');
  assert.equal(deploy.jobs.deploy.needs, 'build');
  assert('workflow_call' in validation.on);
  assert.deepEqual(validation.jobs.validate.strategy.matrix.mode, [
    'production',
    'preview',
  ]);
  for (const command of [
    'pnpm check',
    'pnpm build',
    'pnpm test',
    'pnpm seo:audit',
    'pnpm test:accessibility',
  ])
    assert(
      validation.jobs.validate.steps.some((s) => s.run === command),
      command,
    );
});

test('deployment approval guard checks the controlled indexing release before building', () => {
  const deploy = yaml.parse(
    fs.readFileSync('.github/workflows/pages.yml', 'utf8'),
  );
  const steps = deploy.jobs.build.steps;
  const gate = steps.findIndex(
    (s) => s.run === 'node scripts/verify-indexing-release.mjs',
  );
  assert(gate >= 0);
  assert(gate < steps.findIndex((s) => s.run === 'pnpm build'));
});

test('both indexing states run isolated output validation without site deployment', () => {
  const validation = yaml.parse(
    fs.readFileSync('.github/workflows/validate.yml', 'utf8'),
  );
  const job = validation.jobs['indexing-states'];
  assert.deepEqual(job.strategy.matrix.state, ['disabled', 'enabled']);
  assert(
    job.steps.some(
      (s) =>
        s.run === 'node scripts/test-indexing-states.mjs ${{ matrix.state }}',
    ),
  );
  assert(
    !job.steps.some((s) =>
      /deploy-pages|upload-pages-artifact|configure-pages/.test(s.uses || ''),
    ),
  );
  assert.equal(
    job.steps.find((s) => s.uses === 'actions/upload-artifact@v4').with.path,
    'qa/indexing-fixtures/',
  );
});
