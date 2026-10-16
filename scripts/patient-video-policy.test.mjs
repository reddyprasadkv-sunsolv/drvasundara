import test from 'node:test';
import assert from 'node:assert/strict';
import { approvedPatientVideoIds } from '../src/utils/patient-video-policy.mjs';
import { assertIndexingApproval } from './indexing-release.mjs';

test('patient publication fails closed without dated scope, approver, reference and exact recording IDs', () => {
  const approval = {
    approved: true,
    websitePublication: true,
    approvedBy: 'Synthetic test only',
    approvedAt: '2026-01-01',
    evidenceRef: 'synthetic-test',
    videoIds: ['ABCDEFGHIJK'],
  };
  assert.deepEqual(approvedPatientVideoIds(approval, '2026-10-16'), [
    'ABCDEFGHIJK',
  ]);
  for (const mutation of [
    (a) => (a.approved = false),
    (a) => (a.websitePublication = false),
    (a) => (a.approvedBy = ''),
    (a) => (a.approvedBy = 42),
    (a) => (a.evidenceRef = ''),
    (a) => (a.approvedAt = '2099-01-01'),
    (a) => (a.approvedAt = '2026-02-30'),
    (a) => a.videoIds.push('ABCDEFGHIJK'),
    (a) => (a.videoIds = ['bad']),
    (a) => (a.videoIds = []),
  ]) {
    const invalid = structuredClone(approval);
    mutation(invalid);
    assert.deepEqual(approvedPatientVideoIds(invalid, '2026-10-16'), []);
  }
  assert(
    !approvedPatientVideoIds(approval, '2026-10-16').includes('UNLISTED123'),
  );
});

test('approved patient release requires matching source and deployment attestation references', () => {
  const args = {
    indexing: false,
    request: {
      approved: true,
      target: 'github-pages-production',
      productionIndexing: false,
      indexingApproved: false,
      patientVideoPublicationApproved: true,
      patientVideoApprovalRef: 'synthetic-test',
    },
    readiness: {
      patientVideos: 'approved',
      patientVideoApprovalRef: 'synthetic-test',
    },
    patientVideoApproval: {
      approved: true,
      websitePublication: true,
      approvedBy: 'Synthetic test only',
      approvedAt: '2026-01-01',
      evidenceRef: 'synthetic-test',
      videoIds: ['ABCDEFGHIJK'],
    },
    today: '2026-10-16',
  };
  assert.doesNotThrow(() => assertIndexingApproval(args));
  for (const mutation of [
    (a) => (a.request.patientVideoPublicationApproved = false),
    (a) => (a.request.patientVideoApprovalRef = 'mismatch'),
    (a) => (a.readiness.patientVideoApprovalRef = 'mismatch'),
    (a) => (a.patientVideoApproval.websitePublication = false),
    (a) => (a.readiness.patientVideos = 'withheld'),
  ]) {
    const invalid = structuredClone(args);
    mutation(invalid);
    assert.throws(() => assertIndexingApproval(invalid));
  }
});
