import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { safeFormUrl, safeWhatsAppUrl } from '../src/utils/editorial.mjs';
import { loadEditorial } from './editorial-lib.mjs';
test('WhatsApp accepts a clean international clinic number and rejects sensitive query payloads and lookalike hosts', () => {
  assert.equal(
    safeWhatsAppUrl('https://wa.me/919346825723'),
    'https://wa.me/919346825723',
  );
  for (const value of [
    '',
    'javascript:alert(1)',
    'https://wa.me.evil.test/919346825723',
    'https://evil@wa.me/919346825723',
    'https://wa.me/919346825723?text=medical-data',
    'https://wa.me/abc',
    'http://wa.me/919346825723',
  ])
    assert.equal(safeWhatsAppUrl(value), null);
});
test('legacy form URL validator rejects blank and unsafe inputs', () => {
  assert.equal(safeFormUrl(''), null);
  assert.equal(safeFormUrl('https://docs.google.com.evil.test/forms/'), null);
  assert.equal(
    safeFormUrl('https://forms.gle/clinic'),
    'https://forms.gle/clinic',
  );
});
test('educational video relationships resolve to real public services and articles', () => {
  const { services, records } = loadEditorial();
  const source = fs.readFileSync('src/data/expert-videos.ts', 'utf8');
  for (const [property, valid] of [
    [
      'relatedServices',
      new Set(
        services.filter((s) => s.approved && !s.aliasOf).map((s) => s.slug),
      ),
    ],
    [
      'relatedArticles',
      new Set(
        records
          .filter((r) => r.data.status === 'published')
          .map((r) => r.data.slug),
      ),
    ],
  ]) {
    const matches = [
      ...source.matchAll(new RegExp(property + ':\\s*(\\[[\\s\\S]*?\\])', 'g')),
    ];
    assert.equal(matches.length, 5);
    for (const match of matches)
      for (const [, slug] of match[1].matchAll(/['"]([a-z0-9-]+)['"]/g))
        assert(valid.has(slug), `${property}: ${slug}`);
  }
});
test('production indexing stays disabled and preview has an independent noindex override', () => {
  assert.match(
    fs.readFileSync('src/config/site.ts', 'utf8'),
    /productionIndexing: false/,
  );
  assert.match(
    fs.readFileSync('src/components/seo/Meta.astro', 'utf8'),
    /preview \|\| !site.productionIndexing/,
  );
  assert.match(
    fs.readFileSync('src/pages/robots.txt.ts', 'utf8'),
    /BASE_URL === '\/'/,
  );
});
