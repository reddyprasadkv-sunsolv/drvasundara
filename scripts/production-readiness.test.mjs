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
  else assert.equal(assertRootReadiness('dist').pageCount, 58);
});
