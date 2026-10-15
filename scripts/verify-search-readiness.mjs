import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { loadEditorial } from './editorial-lib.mjs';
import { safeWhatsAppUrl, safeFormUrl } from '../src/utils/editorial.mjs';
const preview = process.env.VERIFY_PAGES_PREVIEW === 'true';
const base = preview ? '/drvasundara/' : '/';
const root = path.resolve('dist');
const seen = new Set();
let articles = 0,
  services = 0,
  assets = 0;
const inventory = loadEditorial();
const doctorId = 'https://www.drvasundaragynec.com/#doctor';
for (const file of fs
  .readdirSync(root, { recursive: true })
  .filter((f) => String(f).endsWith('.html'))) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  // No withheld patient identifiers in links, embeds, text or metadata.
  assert.doesNotMatch(html, /LQ5VBo9wZhw|ZjGuZZEki4w|Tn6soQyuW68|FcWkoQz6dko|gyG40rv_UOQ/);
  const route =
    file === '404.html'
      ? '/404/'
      : '/' + String(file).replace(/index\.html$/, '');
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(
    canonical,
    'https://www.drvasundaragynec.com' + route,
    `Canonical mismatch: ${file}`,
  );
  assert(!seen.has(canonical));
  seen.add(canonical);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  if (preview)
    assert.doesNotMatch(
      html,
      /name="(?:google-site-verification|msvalidate\.01)"/,
    );
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag[0], /\balt(?:=|\s|>)/);
    assert.match(tag[0], /\bwidth="\d+"/);
    assert.match(tag[0], /\bheight="\d+"/);
  }
  for (const tag of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(tag[0], /rel="[^"]*noopener/);
    assert.match(tag[0], /rel="[^"]*noreferrer/);
  }
  // Every local URL in href/src/srcset and CSS, including responsive sources and fonts.
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"?#]+)"/g)) {
    assert(url.startsWith(base), `Unprefixed asset ${url}`);
    const file = path.join(
      root,
      url.slice(base.length),
      url.endsWith('/') ? 'index.html' : '',
    );
    assert(fs.existsSync(file), url);
    assets++;
  }
  for (const [, list] of html.matchAll(/srcset="([^"]+)"/g))
    for (const entry of list.split(',')) {
      const url = entry.trim().split(' ')[0];
      if (url.startsWith('/')) {
        assert(url.startsWith(base));
        assert(fs.existsSync(path.join(root, url.slice(base.length))));
      }
    }
  const nodes = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((m) => {
    const g = JSON.parse(m[1]);
    return g['@graph'] || [g];
  });
  const website = nodes.find((n) => n['@type'] === 'WebSite');
  assert.equal(website.about['@id'], doctorId);
  assert.equal(
    website.publisher['@id'],
    'https://www.drvasundaragynec.com/#publisher',
  );
  if (file.startsWith('services/') && file !== 'services/index.html') {
    services++;
    const medical = nodes.find((n) => n['@type'] === 'MedicalWebPage');
    assert.equal(medical.reviewedBy['@id'], doctorId);
    const source = inventory.services.find(
      (s) => file === `services/${s.slug}/index.html`,
    );
    assert.equal(medical.lastReviewed, source.medicalReviewedAt);
  }
  const article = nodes.find((n) => n['@type'] === 'BlogPosting');
  if (article) {
    articles++;
    assert.equal(article.author['@type'], 'Organization');
    assert.equal(
      article.author['@id'],
      'https://www.drvasundaragynec.com/#publisher',
    );
    const source = inventory.records.find(
      (r) => file === `blog/${r.data.slug}/index.html`,
    ).data;
    assert.equal(
      article.datePublished.slice(0, 10),
      String(source.publishedAt).slice(0, 10),
    );
    assert.equal(
      article.dateModified.slice(0, 10),
      String(
        source.updatedAt || source.lastUpdated || source.publishedAt,
      ).slice(0, 10),
    );
    assert.match(article.image, /\/images\/journal\/[^/]+\.png$/);
    const asset = new URL(article.image).pathname;
    assert(asset.startsWith(base));
    assert(fs.existsSync(path.join(root, asset.slice(base.length))));
    assert.equal(
      nodes.find((n) => n['@type'] === 'MedicalWebPage').reviewedBy['@id'],
      doctorId,
    );
  }
  assert(
    !nodes.some((n) => n['@type'] === 'VideoObject'),
    'Unverified video rich-result metadata',
  );
  assert.doesNotMatch(
    html,
    /googletagmanager\.com|google-analytics\.com|G-[A-Z0-9]{8,}/,
  );
}
for (const file of fs
  .readdirSync(root, { recursive: true })
  .filter((f) => String(f).endsWith('.css'))) {
  const css = fs.readFileSync(path.join(root, file), 'utf8');
  for (const [, url] of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) {
    assert(url.startsWith(base));
    assert(fs.existsSync(path.join(root, url.slice(base.length))), url);
  }
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8');
for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const pathname = new URL(url).pathname;
  assert(pathname.startsWith(base));
  assert(
    fs.existsSync(path.join(root, pathname.slice(base.length), 'index.html')),
  );
}
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.equal([...home.matchAll(/data-video-kind="educational"/g)].length, 5);
assert.equal(
  [...home.matchAll(/data-video-kind="patient-experience"/g)].length,
  0,
);
assert.doesNotMatch(home, /<iframe[^>]*youtube/);
assert.match(home, /https:\/\/wa\.me\/919346825723/);
assert.doesNotMatch(home, /wa\.me\/[^"\s]*\?/);
assert.equal(
  safeWhatsAppUrl('https://wa.me/919346825723'),
  'https://wa.me/919346825723',
);
for (const u of [
  'javascript:alert(1)',
  'https://evil.test/919346825723',
  'https://wa.me/919346825723?text=private',
  'https://user@wa.me/919346825723',
  'http://wa.me/919346825723',
])
  assert.equal(safeWhatsAppUrl(u), null);
assert.equal(safeFormUrl(''), null);
assert.equal(safeFormUrl('https://evil.test/forms/'), null);
assert.match(
  fs.readFileSync(path.join(root, 'appointment/index.html'), 'utf8'),
  /clinic will confirm your appointment/,
);
assert.doesNotMatch(
  fs.readFileSync(path.join(root, 'appointment/index.html'), 'utf8'),
  /requests are submitted|request submitted/,
);
assert.equal(articles, 12);
assert.equal(services, 28);
console.log(
  `Verified ${preview ? 'preview' : 'production-root'} SEO contracts: ${seen.size} canonicals, ${assets} asset references, 28 services, 12 article schemas, 5 expert videos, WhatsApp and disabled analytics.`,
);
