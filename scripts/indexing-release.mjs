import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  robotsDirective,
  isIndexingExcluded,
} from '../src/utils/indexing-policy.mjs';
export function configuredIndexing() {
  const match = fs
    .readFileSync('src/config/site.ts', 'utf8')
    .match(/productionIndexing:\s*(true|false)\b/g);
  assert.equal(match?.length, 1, 'Use one explicit productionIndexing boolean');
  return match[0].endsWith('true');
}
// Bind a future readiness approval to the content, contact and policy actually reviewed.
export function publicationInventorySha256() {
  const files = [];
  for (const dir of ['src']) {
    for (const file of fs.readdirSync(dir, { recursive: true })) {
      const full = path.join(dir, String(file));
      if (fs.statSync(full).isFile()) files.push(full);
    }
  }
  const hash = createHash('sha256');
  for (const file of files.sort())
    hash.update(file).update('\0').update(fs.readFileSync(file)).update('\0');
  return hash.digest('hex');
}
export function assertIndexingApproval({
  indexing,
  request,
  readiness,
  inventorySha256,
  today = new Date().toISOString().slice(0, 10),
}) {
  assert.equal(
    request.approved,
    true,
    'Explicit production deployment request required',
  );
  assert.equal(request.target, 'github-pages-production');
  assert.equal(
    request.productionIndexing,
    indexing,
    'Deployment request and site indexing flag disagree',
  );
  assert.equal(
    readiness.patientVideos,
    'withheld',
    'This release may not restore patient videos',
  );
  assert.equal(
    request.indexingApproved,
    indexing,
    'Explicit indexing approval value must match release mode',
  );
  if (!indexing) return;
  assert.equal(
    request.indexingApproved,
    true,
    'Explicit indexing approval required',
  );
  assert.equal(typeof request.indexingApprovalRef, 'string');
  assert(
    request.indexingApprovalRef.trim(),
    'Record non-sensitive indexing authorization reference',
  );
  for (const key of ['privacyPolicy', 'clinicalReadiness']) {
    const approval = readiness[key];
    assert.equal(
      approval?.approved,
      true,
      `${key} requires explicit clinic approval`,
    );
    for (const field of ['approvedBy', 'evidenceRef'])
      assert(
        typeof approval[field] === 'string' && approval[field].trim(),
        `${key}.${field} missing`,
      );
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(approval.approvedAt || ''),
      `${key} actual approval date required`,
    );
    assert(
      !Number.isNaN(Date.parse(approval.approvedAt)) &&
        new Date(approval.approvedAt).toISOString().slice(0, 10) ===
          approval.approvedAt &&
        approval.approvedAt <= today,
      `${key} invalid/future approval date`,
    );
  }
  assert.equal(
    readiness.publicationInventorySha256,
    inventorySha256,
    'Publication approval does not match current content/policy inventory',
  );
}
export function verifyIndexingRelease() {
  const indexing = configuredIndexing();
  assertIndexingApproval({
    indexing,
    request: JSON.parse(
      fs.readFileSync('.github/pages-deployment-request.json', 'utf8'),
    ),
    readiness: JSON.parse(
      fs.readFileSync('.github/publication-readiness.json', 'utf8'),
    ),
    inventorySha256: publicationInventorySha256(),
  });
  return indexing;
}
export function expectedRobots(file, preview = false) {
  const route =
    String(file) === '404.html'
      ? '/404/'
      : '/' + String(file).replace(/index\.html$/, '');
  return robotsDirective({
    preview,
    indexing: configuredIndexing(),
    excluded: isIndexingExcluded(route),
  });
}
