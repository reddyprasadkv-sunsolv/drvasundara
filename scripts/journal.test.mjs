import { editorialDate } from '../src/utils/date-fields.ts';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadEditorial, editorialReport } from './editorial-lib.mjs';
import {
  canPublishArticleRecord,
  publishedSearchRecords,
} from '../src/utils/publication.mjs';
import {
  filterSearchIndex,
  categoryId,
  relevantReading,
} from '../src/utils/journal.mjs';
import { serviceKnowledge, uniqueKnowledge } from '../src/utils/faqs.ts';
const repo = loadEditorial();
const baseline = JSON.parse(
  readFileSync('scripts/fixtures/phase3-publication-baseline.json', 'utf8'),
);
const now = new Date('2026-10-18T12:00:00Z');
const ready = repo.records[0];
test('Phase 3 preserves every existing slug, clinical narrative, publication state and real date', () => {
  assert.ok(repo.records.length >= baseline.length);
  for (const previous of baseline) {
    const current = repo.records.find((r) => r.data.slug === previous.slug);
    assert.ok(current);
    assert.equal(current.data.publishedAt, previous.publishedAt);
    assert.ok(
      new Date(current.data.medicalReviewedAt) >=
        new Date(previous.medicalReviewedAt),
    );
    assert.ok(
      new Date(current.data.approvedAt) >= new Date(previous.approvedAt),
    );
    if (
      current.data.status === 'published' &&
      current.data.medicalReviewedAt === previous.medicalReviewedAt
    ) {
      assert.equal(
        createHash('sha256')
          .update(
            JSON.stringify([
              current.data.introduction,
              current.data.keyTakeaways,
              current.data.medicalFaqs.map((f) => [f.question, f.answer]),
            ]),
          )
          .digest('hex'),
        previous.clinicalMetadataHash,
      );
      assert.equal(
        createHash('sha256')
          .update(current.body.replace(/\s+/g, ' ').trim())
          .digest('hex'),
        previous.bodyHash,
      );
    }

    assert.equal(
      canPublishArticleRecord(
        current.data,
        current.body,
        current.author,
        current.reviewer,
        now,
      ),
      current.data.status === 'published',
    );
  }
});
test('publication and search reject drafts, missing approval evidence, unreviewed FAQs and unverified identities', () => {
  const changed = [
    ...['draft', 'medical-review', 'approved'].map((status) => ({
      ...ready,
      data: { ...ready.data, status, editorialStatus: status },
    })),
    { ...ready, data: { ...ready.data, approvalRecord: undefined } },
    { ...ready, data: { ...ready.data, approvedBy: undefined } },
    { ...ready, reviewer: { ...ready.reviewer, verified: false } },
    { ...ready, author: { ...ready.author, verified: false } },
    {
      ...ready,
      data: {
        ...ready.data,
        medicalFaqs: [{ question: 'q', answer: 'a', reviewed: false }],
      },
    },
    { ...ready, body: '' },
    { ...ready, data: { ...ready.data, sources: [] } },
    { ...ready, data: { ...ready.data, medicalReviewedAt: '2099-01-01' } },
    { ...ready, data: { ...ready.data, clinicalDisclaimer: '' } },
    { ...ready, data: { ...ready.data, authorship: 'doctor-authored' } },
  ];
  for (const record of changed) {
    assert.equal(
      canPublishArticleRecord(
        record.data,
        record.body,
        record.author,
        record.reviewer,
        now,
      ),
      false,
    );
    assert.equal(
      publishedSearchRecords([record], repo.categories, '/drvasundara/', now)
        .length,
      0,
    );
  }
  const index = publishedSearchRecords(
    [ready, ...changed],
    repo.categories,
    '/drvasundara/',
    now,
  );
  assert.equal(index.length, 1);
  assert.deepEqual(Object.keys(index[0]).sort(), [
    'categoryId',
    'categoryName',
    'slug',
    'summary',
    'title',
    'url',
  ]);
  assert.ok(index[0].url.startsWith('/drvasundara/blog/'));
});
test('search matches title and summary, respects category and handles spaces, case and empty results', () => {
  const index = publishedSearchRecords(repo.records, repo.categories, '/', now);
  assert.equal(filterSearchIndex(index, '', '').length, index.length);
  assert.ok(
    filterSearchIndex(index, '  PCOS ', '').some(
      (a) => a.slug === 'pcos-pcod-terms',
    ),
  );
  assert.ok(
    filterSearchIndex(index, 'pregnancy', 'pregnancy-obstetrics').every(
      (a) => a.categoryId === 'pregnancy-obstetrics',
    ),
  );
  assert.equal(filterSearchIndex(index, 'qxyz-no-such-topic', '').length, 0);
});
test('taxonomy and curated relationships resolve without duplicate or self article links', () => {
  const slugs = new Set(repo.records.map((r) => r.data.slug));
  const serviceSlugs = new Set(
    repo.services.filter((s) => !s.aliasOf).map((s) => s.slug),
  );
  for (const r of repo.records.filter((r) => r.data.status === 'published')) {
    assert.ok(repo.categories.some((c) => c.id === categoryId(r.data)));
    assert.ok(r.data.relatedServices.length);
    assert.equal(
      new Set(r.data.relatedArticles).size,
      r.data.relatedArticles.length,
    );
    assert.ok(!r.data.relatedArticles.includes(r.data.slug));
    assert.ok(r.data.relatedArticles.every((s) => slugs.has(s)));
    assert.ok(r.data.relatedServices.every((s) => serviceSlugs.has(s)));
  }
  assert.ok(
    relevantReading(
      repo.services.find((s) => s.slug === 'primary-secondary-infertility'),
      repo.records,
    ).some((a) => a.data.slug === 'fertility-first-steps'),
  );
});
test('clinical FAQs require service approval and administrative duplicates are separated', () => {
  const service = repo.services[0];
  assert.equal(serviceKnowledge(service).length, 2);
  assert.equal(
    serviceKnowledge({ ...service, contentReviewed: false }).length,
    0,
  );
  assert.equal(
    uniqueKnowledge([
      ...serviceKnowledge(service),
      ...serviceKnowledge(service),
    ]).length,
    2,
  );
});
test('local editorial report preserves incomplete-review warnings without disclosing evidence URLs', () => {
  const report = editorialReport(repo, now);
  assert.equal(
    report.counts.published,
    repo.records.filter((r) =>
      canPublishArticleRecord(r.data, r.body, r.author, r.reviewer, now),
    ).length,
  );
  assert.equal(
    report.counts.unscheduledReview,
    repo.records.filter((r) => !r.data.nextReviewDueAt).length,
  );
  assert.equal(report.counts.brokenRelatedReferences, 0);
  assert.ok(
    report.articles
      .filter(
        (a) =>
          !repo.records.find((r) => r.data.slug === a.slug)?.reviewer
            ?.medicalRegistration?.verified,
      )
      .every((a) => a.problems.some((p) => p.includes('registration'))),
  );
  assert.ok(!JSON.stringify(report).includes('https://'));
});

test('service clinical explanations and answers remain unchanged without a new review', () => {
  const previous = JSON.parse(
    readFileSync('scripts/fixtures/phase3-service-baseline.json', 'utf8'),
  );
  for (const original of previous) {
    const service = repo.services.find((s) => s.slug === original.slug);
    assert.ok(service);
    if (service.medicalReviewedAt !== original.medicalReviewedAt) continue;
    const parts = [
      'introduction',
      'understanding',
      'reasons',
      'whenToSeek',
      'evaluation',
      'benefitsRisks',
    ].map((k) => service[k]);
    parts.push(...service.faqs.map((f) => [f.question, f.answer]));
    const text = JSON.stringify(parts);
    assert.equal(
      createHash('sha256').update(text).digest('hex'),
      original.hash,
    );
  }
});

test('schema dates reject null, numeric coercion and impossible calendar dates', () => {
  for (const value of [null, true, 42, '', '2026-02-30', '2026-13-01'])
    assert.equal(editorialDate.safeParse(value).success, false);
  assert.equal(editorialDate.safeParse('2026-10-13').success, true);
});


test('PR22 publishes approved prose without duplicate bleeding or menopause pages', () => {
  const draft = readFileSync('docs/DRAFT_PATIENT_FRIENDLY_JOURNAL_ARTICLES_2026-10-18.md', 'utf8');
  const drafts = draft.split(/^# Article \d: /m).slice(1);
  const slugs = ['abnormal-uterine-bleeding', 'menopause-support', 'urine-leakage-in-women'];
  const normalize = (v) => v.replace(/[#*]/g, '').replace(/\s+/g, ' ').trim();
  assert.equal(repo.records.filter(r => r.data.status === 'published').length, 13);
  for (const [i, slug] of slugs.entries()) {
    const matches = repo.records.filter(r => r.data.slug === slug);
    assert.equal(matches.length, 1);
    const r = matches[0];
    assert.equal(r.data.approvedAt, '2026-10-18');
    assert.equal(r.data.medicalReviewedAt, '2026-10-18');
    assert.match(r.data.approvalRecord, /DRAFT_PATIENT_FRIENDLY_JOURNAL_ARTICLES_2026-10-18/);
    const approved = drafts[i].split('\n---')[0].split('**Suggested description:** ')[1].split('\n\n').slice(1).join('\n\n').split(/\*\*Internal link/)[0].trim();
    const published = normalize([r.data.introduction, r.body, ...r.data.medicalFaqs.map(f => f.question+' '+f.answer)].join(' '));
    for (const paragraph of approved.split(/\n\n+/)) {
      if (paragraph.trim() === '## Common questions') continue;
      assert(published.includes(normalize(paragraph)), slug+': approved paragraph must be retained: '+paragraph);
    }
    assert(canPublishArticleRecord(r.data, r.body, r.author, r.reviewer, now));
  }
});
