import { expectedRobots, configuredIndexing } from './indexing-release.mjs';
import { robotsText } from '../src/utils/indexing-policy.mjs';
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
const titles = new Set();
const descriptions = new Set();
for (const f of files) {
  const html = fs.readFileSync(path.join(root, String(f)), 'utf8');
  assert.match(html, /<title>[^<]+<\/title>/);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert.ok(description, `Missing description in ${f}`);
  assert.ok(!titles.has(title), `Duplicate title in ${f}`);
  assert.ok(!descriptions.has(description), `Duplicate description in ${f}`);
  titles.add(title);
  descriptions.add(description);
  assert.equal(
    [...html.matchAll(/<h1(?:\s|>)/g)].length,
    1,
    `Expected one H1 in ${f}`,
  );
  assert.equal(
    html.match(/name="robots" content="([^"]+)"/)?.[1],
    expectedRobots(f, preview),
  );
  assert.match(html, /rel="canonical"/);
  assert.match(html, /id="main"/);
  assert.match(html, /Skip to content/);
  const ids = [...html.matchAll(/(?:^|\s)id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${f}`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.includes('#') || (!href.startsWith('#') && !href.startsWith('/')))
      continue;
    const [destination, fragment] = href.split('#');
    if (!fragment) continue;
    let targetHtml = html;
    if (destination) {
      let pathname = destination.split('?')[0];
      if (preview) pathname = '/' + pathname.slice(base.length);
      const location = path.join(
        root,
        pathname,
        pathname.endsWith('/') ? 'index.html' : '',
      );
      if (!fs.existsSync(location)) continue;
      targetHtml = fs.readFileSync(location, 'utf8');
    }
    assert.ok(
      targetHtml.includes(`id="${decodeURIComponent(fragment)}"`),
      `Broken anchor ${href} in ${f}`,
    );
  }
  for (const [, src] of html.matchAll(/<img[^>]*src="([^"]+)"/g)) {
    if (!src.startsWith('/')) continue;
    let imagePath = src.split('?')[0];
    if (preview) {
      assert.ok(imagePath.startsWith(base));
      imagePath = '/' + imagePath.slice(base.length);
    }
    assert.ok(
      fs.existsSync(path.join(root, imagePath)),
      `Missing image ${src} in ${f}`,
    );
  }
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
      : 'https://www.drvasundaragynec.com/',
  ),
);
if (preview)
  assert.ok(
    !fs.existsSync(path.join(root, 'CNAME')),
    'Preview must not claim the production domain',
  );
assert.doesNotMatch(sitemap, /\/404\//);
assert.equal(
  fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'),
  robotsText({ preview, indexing: configuredIndexing() }),
);
console.log(
  `Verified ${files.length} pages, ${links} internal links, metadata, structured data, 404, sitemap and staging robots policy.`,
);
