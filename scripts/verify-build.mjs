import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('dist');
const preview = process.env.VERIFY_PAGES_PREVIEW === 'true';
const base = '/drvasundara/';
const files = fs
  .readdirSync(root, { recursive: true })
  .filter((f) => String(f).endsWith('.html'));
assert.ok(files.length >= 10, 'Expected complete public page set');
let links = 0;
for (const f of files) {
  const html = fs.readFileSync(path.join(root, String(f)), 'utf8');
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /id="main"/);
  assert.match(html, /Skip to content/);
  for (const [, href] of html.matchAll(/href="([^"#]+)"/g)) {
    if (!href.startsWith('/')) continue;
    let target = href.split(/[?#]/)[0];
    if (preview) {
      assert.ok(target.startsWith(base), `Unprefixed Pages link ${href}`);
      target = '/' + target.slice(base.length);
    }
    assert.ok(
      fs.existsSync(
        path.join(root, target, target.endsWith('/') ? 'index.html' : ''),
      ),
      `Broken link ${href} in ${f}`,
    );
    links++;
  }
  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ))
    JSON.parse(json);
}
assert.ok(fs.existsSync(path.join(root, '404.html')));
const sitemap = fs.readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8');
assert.ok(
  sitemap.includes(
    preview
      ? 'https://reddyprasadkv-sunsolv.github.io/drvasundara/'
      : 'https://drvasundaragynec.com/',
  ),
);
if (preview)
  assert.ok(
    !fs.existsSync(path.join(root, 'CNAME')),
    'Preview must not claim the production domain',
  );
assert.doesNotMatch(sitemap, /\/404\//);
assert.match(
  fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'),
  /Disallow: \//,
);
console.log(
  `Verified ${files.length} pages, ${links} internal links, metadata, structured data, 404, sitemap and staging robots policy.`,
);
