import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  isApprovedClaim,
  isPublicService,
  validPastDate,
} from '../src/utils/medical-gates.mjs';
const services = JSON.parse(
  readFileSync(new URL('../src/data/services.json', import.meta.url)),
);
const profile = JSON.parse(
  readFileSync(new URL('../src/data/doctor-profile.json', import.meta.url)),
);
const now = new Date('2026-10-13T12:00:00Z');
test('29 proposed services and reference profile claims remain unpublished', () => {
  assert.equal(services.length, 29);
  assert.equal(new Set(services.map((s) => s.slug)).size, 29);
  assert.equal(services.filter((s) => isPublicService(s, now)).length, 0);
  assert.ok(profile.claims.every((c) => !isApprovedClaim(c, now)));
  assert.ok(profile.experienceTimeline.every((c) => !isApprovedClaim(c, now)));
});
test('service availability, clinical review and approval evidence are independently required', () => {
  const ready = {
    ...services[0],
    approved: true,
    status: 'published',
    availabilityConfirmed: true,
    contentReviewed: true,
    approvedBy: 'QA approval actor',
    approvedAt: '2026-10-01',
    medicalReviewedBy: 'QA review actor',
    medicalReviewedAt: '2026-10-01',
    approvalRecord: 'https://example.org/approval-record',
  };
  assert.equal(isPublicService(ready, now), true);
  for (const key of ['approved', 'availabilityConfirmed', 'contentReviewed'])
    assert.equal(isPublicService({ ...ready, [key]: false }, now), false);
  for (const key of [
    'approvedBy',
    'approvedAt',
    'medicalReviewedBy',
    'medicalReviewedAt',
    'approvalRecord',
  ])
    assert.equal(isPublicService({ ...ready, [key]: null }, now), false);
  assert.equal(
    isPublicService({ ...ready, approvedAt: '2099-01-01' }, now),
    false,
  );
  assert.equal(isPublicService({ ...ready, aliasOf: 'other' }, now), false);
  assert.equal(isPublicService({ ...ready, sources: [] }, now), false);
  assert.equal(isPublicService({ ...ready, evaluation: '' }, now), false);
  assert.equal(isPublicService({ ...ready, description: '' }, now), false);
  assert.equal(
    isPublicService({ ...ready, faqs: [{ question: '', answer: '' }] }, now),
    false,
  );
  assert.equal(
    isPublicService({ ...ready, medicalReviewedAt: '2026-10-02' }, now),
    false,
  );
});
test('sourcing alone cannot authorize a professional claim', () => {
  const ready = {
    ...profile.claims[0],
    approvedForPublication: true,
    doctorApprovalStatus: 'approved',
    approvedBy: 'QA approval actor',
    approvedAt: '2026-10-01',
  };
  assert.equal(isApprovedClaim(ready, now), true);
  assert.equal(
    isApprovedClaim({ ...ready, verificationStatus: 'source-only' }, now),
    false,
  );
  assert.equal(
    isApprovedClaim({ ...ready, doctorApprovalStatus: 'pending' }, now),
    false,
  );
  assert.equal(isApprovedClaim({ ...ready, approvedAt: null }, now), false);
  assert.equal(isApprovedClaim({ ...ready, sources: [] }, now), false);
});
test('invalid, missing and future dates never authorize publication', () => {
  for (const value of [
    null,
    undefined,
    '',
    'not-a-date',
    '2026-02-30',
    true,
    42,
    '2099-01-01',
  ])
    assert.equal(validPastDate(value, now), false);
  assert.equal(validPastDate('2026-10-01', now), true);
});
test('all twelve outlines have honest authorship and no invented publication or review dates', () => {
  const files = readdirSync(
    new URL('../src/content/blog/', import.meta.url),
  ).filter((f) => f.endsWith('.mdx'));
  assert.equal(files.length, 12);
  for (const name of files) {
    const text = readFileSync(
      new URL('../src/content/blog/' + name, import.meta.url),
      'utf8',
    );
    const fm = text.split('---')[1];
    assert.match(fm, /status:\s*['"]?draft/);
    assert.match(fm, /contentType:\s*['"]?outline/);
    assert.match(fm, /authorship:\s*['"]?ai-assisted/);
    assert.doesNotMatch(
      fm,
      /^(publishedAt|medicalReviewedAt|approvedAt|reviewer):/m,
    );
  }
});
