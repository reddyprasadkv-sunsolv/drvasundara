import test from 'node:test';
import { execFileSync } from 'node:child_process';
test('live SEO verifier rejects crawl defects and distinguishes inconclusive network evidence', () => {
  execFileSync(
    'python3',
    ['-m', 'unittest', 'discover', '-s', 'tests', '-p', 'test_live_seo.py'],
    { stdio: 'pipe' },
  );
});

import fs from 'node:fs';
import assert from 'node:assert/strict';
test('live monitoring retains manual, scheduled and successful-production triggers without deployment permissions', () => {
  const workflow = fs.readFileSync(
    '.github/workflows/live-seo-verify.yml',
    'utf8',
  );
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /workflows: \['Deploy approved production website'\]/);
  assert.match(workflow, /workflow_run\.conclusion == 'success'/);
  assert.match(workflow, /contents: read/);
  assert.doesNotMatch(
    workflow,
    /pages: write|id-token: write|actions\/deploy-pages|workflow_dispatch.*pages/,
  );
  assert.match(workflow, /if: always\(\)/);
  assert.match(workflow, /retention-days: 30/);
});
