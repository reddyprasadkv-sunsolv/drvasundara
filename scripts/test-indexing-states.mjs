// CI-only integration fixtures. Never modify the working source or upload a site.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const state = process.argv[2];
assert(
  ['disabled', 'enabled'].includes(state),
  'Specify disabled or enabled fixture',
);
const source = process.cwd();
const temporary = fs.mkdtempSync(
  path.join(os.tmpdir(), 'indexing-state-fixture-'),
);
const evidence = path.join(source, 'qa/indexing-fixtures', state);
const indexing = state === 'enabled';
function run(command, args, env) {
  execFileSync(command, args, {
    cwd: temporary,
    env,
    stdio: 'inherit',
    timeout: 10 * 60_000,
  });
}
function saveReports(mode) {
  const report = path.join(temporary, 'playwright-report');
  if (fs.existsSync(report)) {
    const destination = path.join(evidence, mode);
    fs.mkdirSync(destination, { recursive: true });
    fs.cpSync(report, destination, { recursive: true });
    fs.rmSync(report, { recursive: true, force: true });
  }
}
try {
  assert.notEqual(fs.realpathSync(source), fs.realpathSync(temporary));
  for (const file of [
    'src',
    'public',
    'scripts',
    'tests',
    'docs',
    '.github',
    'package.json',
    'pnpm-lock.yaml',
    'astro.config.mjs',
    'tsconfig.json',
    'playwright.config.ts',
  ])
    fs.cpSync(path.join(source, file), path.join(temporary, file), {
      recursive: true,
    });
  // Reuse dependencies only; source/data/config files are independent copies.
  fs.symlinkSync(
    path.join(source, 'node_modules'),
    path.join(temporary, 'node_modules'),
    'dir',
  );
  const configFile = path.join(temporary, 'src/config/site.ts');
  fs.writeFileSync(
    configFile,
    fs
      .readFileSync(configFile, 'utf8')
      .replace(
        /productionIndexing:\s*(?:true|false)/,
        `productionIndexing: ${indexing}`,
      ),
  );
  const requestFile = path.join(
    temporary,
    '.github/pages-deployment-request.json',
  );
  const request = JSON.parse(fs.readFileSync(requestFile, 'utf8'));
  request.productionIndexing = indexing;
  request.indexingApproved = indexing;
  request.indexingApprovalRef = indexing
    ? 'SYNTHETIC-CI-FIXTURE-NOT-CLINIC-APPROVAL'
    : null;
  fs.writeFileSync(requestFile, JSON.stringify(request));
  const readinessFile = path.join(
    temporary,
    '.github/publication-readiness.json',
  );
  const readiness = JSON.parse(fs.readFileSync(readinessFile, 'utf8'));
  if (indexing) {
    const synthetic = {
      approved: true,
      approvedBy: 'SYNTHETIC CI FIXTURE ONLY',
      approvedAt: new Date().toISOString().slice(0, 10),
      evidenceRef: 'SYNTHETIC-CI-FIXTURE-NOT-CLINIC-APPROVAL',
    };
    readiness.privacyPolicy = synthetic;
    readiness.clinicalReadiness = synthetic;
  }
  execFileSync('git', ['init', '--quiet'], { cwd: temporary });
  const env = {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    GITHUB_SHA: process.env.GITHUB_SHA || 'synthetic-ci-fixture',
  };
  process.chdir(temporary);
  const { publicationInventorySha256 } = await import('./indexing-release.mjs');
  if (indexing)
    readiness.publicationInventorySha256 = publicationInventorySha256();
  fs.writeFileSync(readinessFile, JSON.stringify(readiness));
  console.log(
    `SYNTHETIC ${state} state: disposable test repository; no deployment authorization.`,
  );
  for (const preview of [false, true]) {
    const mode = preview ? 'preview' : 'production';
    const modeEnv = {
      ...env,
      PAGES_PREVIEW: String(preview),
      VERIFY_PAGES_PREVIEW: String(preview),
    };
    run('pnpm', ['build'], modeEnv);
    if (preview) run('node', ['scripts/prepare-pages-preview.mjs'], modeEnv);
    run('pnpm', ['test'], modeEnv);
    run('pnpm', ['seo:audit'], modeEnv);
    if (!preview) {
      run('pnpm', ['release:prepare'], modeEnv);
      run('pnpm', ['release:verify'], modeEnv);
    }
    try {
      run('pnpm', ['test:accessibility'], modeEnv);
    } finally {
      saveReports(mode);
    }
    console.log(
      `PASS: ${state} configuration / ${mode}; metadata, robots, sitemap, schema, links, publication, accessibility and artifact policy.`,
    );
  }
} finally {
  process.chdir(source);
  fs.rmSync(temporary, { recursive: true, force: true });
}
