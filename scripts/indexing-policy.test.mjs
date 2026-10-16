import test from 'node:test';
import assert from 'node:assert/strict';
import {
  robotsDirective,
  robotsText,
  isIndexingExcluded,
  excludedIndexingPaths,
} from '../src/utils/indexing-policy.mjs';
import {
  assertIndexingApproval,
  clinicDate,
  publicationInventorySha256,
} from './indexing-release.mjs';
import { loadEditorial } from './editorial-lib.mjs';
import { categoryId } from '../src/utils/journal.mjs';
import { canPublishArticleRecord } from '../src/utils/publication.mjs';

test('production/preview indexing and intentional page exclusions remain independent', () => {
  for (const preview of [false, true])
    for (const indexing of [false, true])
      for (const excluded of [false, true]) {
        assert.equal(
          robotsDirective({ preview, indexing, excluded }),
          !preview && indexing && !excluded
            ? 'index, follow'
            : 'noindex, nofollow',
        );
        const robots = robotsText({ preview, indexing });
        assert(
          robots.includes(!preview && indexing ? 'Allow: /' : 'Disallow: /'),
        );
        assert.equal(robots.includes('Sitemap:'), !preview);
        if (!preview)
          assert(
            robots.includes(
              'Sitemap: https://www.drvasundaragynec.com/sitemap-index.xml',
            ),
          );
      }
  assert(isIndexingExcluded('/404/'));
  assert.equal(isIndexingExcluded('/testimonials/'), false);
  assert.equal(
    robotsDirective({
      indexing: true,
      excluded: isIndexingExcluded('/testimonials/'),
    }),
    'index, follow',
  );
  assert.equal(
    robotsDirective({
      preview: true,
      indexing: true,
      excluded: isIndexingExcluded('/testimonials/'),
    }),
    'noindex, nofollow',
  );
});
test('single-article category exclusions match the actual publication inventory', () => {
  const { records } = loadEditorial();
  const counts = new Map();
  for (const r of records.filter((r) =>
    canPublishArticleRecord(r.data, r.body, r.author, r.reviewer),
  )) {
    const id = categoryId(r.data);
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  assert.deepEqual(
    excludedIndexingPaths.filter((p) => p.startsWith('/blog/category/')).sort(),
    [...counts]
      .filter(([, count]) => count < 2)
      .map(([id]) => `/blog/category/${id}/`)
      .sort(),
  );
});
test('indexing release rejects missing/partial approvals, configuration mismatch and stale inventory', () => {
  // Synthetic records exercise the guard; these are not clinic approvals.
  const approval = {
    approved: true,
    approvedBy: 'Synthetic test reviewer',
    approvedAt: '2026-01-01',
    evidenceRef: 'synthetic-fixture-only',
  };
  const args = {
    indexing: true,
    request: {
      approved: true,
      target: 'github-pages-production',
      productionIndexing: true,
      indexingApproved: true,
      indexingApprovalRef: 'synthetic-fixture-only',
    },
    readiness: {
      patientVideos: 'withheld',
      privacyPolicy: approval,
      clinicalReadiness: approval,
      publicationInventorySha256: 'fixture-digest',
    },
    inventorySha256: 'fixture-digest',
    today: '2026-10-15',
  };
  assert.doesNotThrow(() => assertIndexingApproval(args));
  const reject = (mutate) => {
    const fixture = structuredClone(args);
    mutate(fixture);
    assert.throws(() => assertIndexingApproval(fixture));
  };
  reject((x) => (x.request.approved = false));
  reject((x) => (x.request.productionIndexing = false));
  reject((x) => (x.request.indexingApproved = false));
  reject((x) => (x.request.indexingApprovalRef = ''));
  for (const key of ['privacyPolicy', 'clinicalReadiness']) {
    reject((x) => (x.readiness[key].approved = false));
    reject((x) => (x.readiness[key].approvedBy = ''));
    reject((x) => (x.readiness[key].evidenceRef = ''));
    reject((x) => (x.readiness[key].approvedAt = null));
    reject((x) => (x.readiness[key].approvedAt = '2099-01-01'));
  }
  reject((x) => (x.readiness.patientVideos = 'published'));
  reject((x) => (x.readiness.publicationInventorySha256 = 'stale'));
  assert.match(publicationInventorySha256(), /^[a-f0-9]{64}$/);
  const disabled = structuredClone(args);
  disabled.indexing = false;
  disabled.request.productionIndexing = false;
  disabled.request.indexingApproved = false;
  disabled.readiness.privacyPolicy.approved = false;
  disabled.readiness.clinicalReadiness.approved = false;
  assert.doesNotThrow(() => assertIndexingApproval(disabled));
});

test('clinic confirmation dates follow India calendar rather than UTC build dates', () => {
  assert.equal(clinicDate(new Date('2026-10-15T18:29:59Z')), '2026-10-15');
  assert.equal(clinicDate(new Date('2026-10-15T18:30:00Z')), '2026-10-16');
});
