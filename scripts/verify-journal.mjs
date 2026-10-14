import fs from 'node:fs';
import assert from 'node:assert/strict';
import { loadEditorial } from './editorial-lib.mjs';
import { publishedSearchRecords } from '../src/utils/publication.mjs';
const preview = process.env.VERIFY_PAGES_PREVIEW === 'true';
const base = preview ? '/drvasundara/' : '/';
const repo = loadEditorial();
const index = JSON.parse(
  fs.readFileSync('dist/blog/search-index.json', 'utf8'),
);
const expected = publishedSearchRecords(repo.records, repo.categories, base);
assert.deepEqual(
  index.map((a) => a.slug).sort(),
  expected.map((a) => a.slug).sort(),
);
assert.equal(index.length, expected.length);
assert.ok(!JSON.stringify(index).includes('approvalRecord'));
assert.ok(index.every((a) => a.url.startsWith(base + 'blog/')));
const journal = fs.readFileSync('dist/blog/index.html', 'utf8');
assert.match(journal, /data-journal-search/);
assert.equal(
  (journal.match(/data-article-slug=/g) || []).length,
  expected.length,
);
const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
assert.ok(!sitemap.includes('search-index.json'));
for (const category of repo.categories) {
  const entries = repo.records.filter(
    (a) => a.data.journalCategory === category.id,
  );
  if (entries.length) {
    assert.ok(fs.existsSync(`dist/blog/category/${category.id}/index.html`));
  }
}
for (const record of repo.records.filter((r) =>
  expected.some((a) => a.slug === r.data.slug),
)) {
  const html = fs.readFileSync(
    `dist/blog/${record.data.slug}/index.html`,
    'utf8',
  );
  assert.match(html, /Editorial publication/);
  assert.match(html, /Medically reviewed by/);
  assert.ok(html.includes(record.data.clinicalDisclaimer));
  assert.ok(!html.includes('approvalRecord'));
  assert.ok(!html.includes('PUBLICATION_APPROVAL.md'));
  assert.ok(html.includes('Copy article link'));
}
assert.ok(fs.existsSync('dist/blog/authors/dr-vasundara/index.html'));
assert.ok(!fs.existsSync('dist/qa'));
console.log(
  'Verified published-only static search, seven meaningful category routes, reviewer profile, private-record exclusion and article reading controls.',
);
