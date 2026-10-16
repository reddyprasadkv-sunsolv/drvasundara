import { approvedPatientVideoIds } from '../src/utils/patient-video-policy.mjs';
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
// Readiness dates are clinic calendar dates, not UTC build-server dates.
export function clinicDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
export function assertIndexingApproval({
  indexing,
  request,
  readiness,
  inventorySha256,
  today = clinicDate(),
  patientVideoApproval,
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
  assert(
    ['withheld', 'approved'].includes(readiness.patientVideos),
    'Unknown patient-video publication state',
  );
  const patientIds = approvedPatientVideoIds(patientVideoApproval, today);
  if (readiness.patientVideos === 'approved') {
    assert(
      patientIds.length > 0,
      'Patient videos require a valid scoped publication attestation',
    );
    assert.equal(
      request.patientVideoPublicationApproved,
      true,
      'Explicit patient-video release authorization required',
    );
    assert.equal(
      request.patientVideoApprovalRef,
      patientVideoApproval.evidenceRef,
    );
    assert.equal(
      readiness.patientVideoApprovalRef,
      patientVideoApproval.evidenceRef,
    );
  } else {
    assert.equal(
      patientIds.length,
      0,
      'Approved source videos conflict with withheld release state',
    );
  }
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
  const request = JSON.parse(
    fs.readFileSync('.github/pages-deployment-request.json', 'utf8'),
  );
  const patientVideoApproval = JSON.parse(
    fs.readFileSync('src/data/patient-video-publication.json', 'utf8'),
  );
  if (indexing && !isIndexingExcluded('/testimonials/')) {
    const approval = patientVideoApproval.testimonialsIndexing;
    assert.equal(
      request.testimonialsIndexingApproved,
      true,
      'Explicit testimonials indexing authorization required',
    );
    assert.equal(approval?.approved, true);
    assert(approval?.evidenceRef?.trim());
    assert.equal(request.testimonialsIndexingApprovalRef, approval.evidenceRef);
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(approval.approvedAt || '') &&
        approval.approvedAt <= clinicDate(),
    );
    assert.equal(
      new Date(approval.approvedAt).toISOString().slice(0, 10),
      approval.approvedAt,
    );
  }
  assertIndexingApproval({
    indexing,
    request,
    readiness: JSON.parse(
      fs.readFileSync('.github/publication-readiness.json', 'utf8'),
    ),
    inventorySha256: publicationInventorySha256(),
    patientVideoApproval,
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
