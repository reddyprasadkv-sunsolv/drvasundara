import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPublicArticle, safeFormUrl } from '../src/utils/editorial.mjs';
const now = new Date('2026-10-13');
const approved = {
  status: 'published',
  publishedAt: new Date('2026-10-01'),
  approvedAt: new Date('2026-09-30'),
  medicalReviewedAt: new Date('2026-09-30'),
  reviewer: 'verified-doctor',
};
test('editorial states and incomplete review cannot enter publication', () => {
  for (const status of ['draft', 'doctor-review', 'approved'])
    assert.equal(isPublicArticle({ ...approved, status }, now), false);
  for (const key of ['approvedAt', 'medicalReviewedAt', 'reviewer'])
    assert.equal(
      isPublicArticle({ ...approved, [key]: undefined }, now),
      false,
    );
  assert.equal(isPublicArticle(approved, now), true);
  assert.equal(
    isPublicArticle({ ...approved, publishedAt: new Date('2099-01-01') }, now),
    false,
  );
});
test('appointment URLs must be HTTPS Google Forms endpoints', () => {
  assert.equal(safeFormUrl(''), null);
  assert.equal(safeFormUrl('javascript:alert(1)'), null);
  assert.equal(safeFormUrl('https://forms.gle.evil.com/a'), null);
  assert.equal(safeFormUrl('https://docs.google.com/document/d/x'), null);
  assert.equal(safeFormUrl('http://forms.gle/x'), null);
  assert.equal(
    safeFormUrl('https://forms.gle/example'),
    'https://forms.gle/example',
  );
  assert.equal(
    safeFormUrl('https://docs.google.com/forms/d/e/example/viewform'),
    'https://docs.google.com/forms/d/e/example/viewform',
  );
});
