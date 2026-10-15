import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = 'dist';
const preview = process.env.VERIFY_PAGES_PREVIEW === 'true';
const origin = 'https://www.drvasundaragynec.com';
const sitemapOrigin = preview
  ? 'https://reddyprasadkv-sunsolv.github.io'
  : origin;
const base = preview ? '/drvasundara/' : '/';
const files = fs
  .readdirSync(root, { recursive: true })
  .filter((f) => String(f).endsWith('.html'));
let schemaUrls = 0;
function checkUrls(value) {
  if (typeof value === 'string' && /^https?:\/\//.test(value)) {
    const url = new URL(value);
    if (
      url.hostname === 'drvasundaragynec.com' ||
      url.hostname === 'www.drvasundaragynec.com'
    ) {
      assert.equal(url.origin, origin, `Noncanonical schema URL: ${value}`);
      schemaUrls++;
    }
  } else if (Array.isArray(value)) value.forEach(checkUrls);
  else if (value && typeof value === 'object')
    Object.values(value).forEach(checkUrls);
}
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.doesNotMatch(
    html,
    /https?:\/\/drvasundaragynec\.com(?=[/"#\s])/,
    `Old production host in ${file}`,
  );
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical).origin, origin);
  assert.equal(
    html.match(/property="og:url" content="([^"]+)"/)?.[1],
    canonical,
  );
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ))
    checkUrls(JSON.parse(json));
  for (const [, href] of html.matchAll(
    /href="(https:\/\/www\.drvasundaragynec\.com[^\"]*)"/g,
  )) {
    const url = new URL(href);
    if (url.pathname === '/404/') continue;
    const target = path.join(
      root,
      url.pathname,
      url.pathname.endsWith('/') ? 'index.html' : '',
    );
    assert(
      fs.existsSync(target),
      `Missing absolute internal destination: ${href}`,
    );
    if (url.hash)
      assert(
        fs
          .readFileSync(target, 'utf8')
          .includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        href,
      );
  }
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8');
const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]),
);
assert.equal(entries.length, 58);
for (const url of entries) {
  assert.equal(url.origin, sitemapOrigin);
  assert(url.pathname.startsWith(base));
  assert(
    fs.existsSync(
      path.join(root, url.pathname.slice(base.length), 'index.html'),
    ),
  );
}
const index = fs.readFileSync(path.join(root, 'sitemap-index.xml'), 'utf8');
assert(index.includes(`${sitemapOrigin}${base}sitemap-0.xml`));
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /Disallow: \//);
assert(!robots.includes('Allow: /'));
if (preview) assert(!robots.includes('Sitemap:'));
else assert(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`));
assert.equal(files.length, 59);
console.log(
  `Verified ${files.length - 1} public pages plus 404, ${entries.length} sitemap entries and ${schemaUrls} production schema URLs; www host consistent and ${preview ? 'preview' : 'production'} noindex retained.`,
);
