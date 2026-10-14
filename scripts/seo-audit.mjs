import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const preview = process.env.VERIFY_PAGES_PREVIEW === 'true';
const origin = preview
  ? 'https://reddyprasadkv-sunsolv.github.io'
  : 'https://drvasundaragynec.com';
const base = preview ? '/drvasundara/' : '/';
const pages = fs
  .readdirSync(root, { recursive: true })
  .filter((f) => String(f).endsWith('.html'))
  .map((file) => {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const route =
      file === '404.html'
        ? '/404.html'
        : '/' + String(file).replace(/index\.html$/, '');
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const graphs = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].map((m) => JSON.parse(m[1]));
    const nodes = graphs.flatMap((g) => g['@graph'] || [g]);
    return {
      file,
      route,
      url: origin + base + route.slice(1),
      title: html.match(/<title>([^<]+)<\/title>/)?.[1],
      description: html.match(/name="description" content="([^"]+)"/)?.[1],
      canonical: html.match(/rel="canonical" href="([^"]+)"/)?.[1],
      robots: html.match(/name="robots" content="([^"]+)"/)?.[1],
      headings: [
        ...html.matchAll(/<h([1-6])(?:\s[^>]*|)>([\s\S]*?)<\/h\1>/g),
      ].map((m) => ({
        level: Number(m[1]),
        text: m[2].replace(/<[^>]*>/g, '').trim(),
      })),
      imageCount: [...html.matchAll(/<img\b/g)].length,
      internalLinks: links.filter((l) => l.startsWith('/')),
      referenceLinks: links.filter((l) =>
        /^https:\/\/(www\.)?(nhs|nice|who|acog|pubmed)/.test(l),
      ),
      schemaTypes: nodes.map((n) => n['@type']),
      schema: nodes,
      jsBytes: [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].reduce(
        (sum, m) => {
          const f = path.join(root, m[1].replace(base, ''));
          return sum + (fs.existsSync(f) ? fs.statSync(f).size : 0);
        },
        0,
      ),
    };
  });
const inbound = new Map(pages.map((p) => [p.route, new Set()]));
for (const page of pages)
  for (const href of page.internalLinks) {
    const route = '/' + href.split(/[?#]/)[0].replace(base, '');
    inbound.get(route)?.add(page.route);
  }
const orphans = pages
  .filter(
    (p) =>
      p.route !== '/' && p.route !== '/404.html' && !inbound.get(p.route)?.size,
  )
  .map((p) => p.route);
const assetFiles = fs
  .readdirSync(root, { recursive: true })
  .filter((f) => /\.(png|jpe?g|webp|svg|woff2|js|css)$/.test(String(f)))
  .map((file) => ({ file, bytes: fs.statSync(path.join(root, file)).size }));
const report = {
  mode: preview ? 'preview' : 'production-root',
  pageCount: pages.length,
  visitorPages: pages.length - 1,
  orphans,
  pages,
  assetFiles,
};
fs.mkdirSync('qa/phase4', { recursive: true });
fs.writeFileSync(
  `qa/phase4/crawl-${preview ? 'preview' : 'production'}.json`,
  JSON.stringify(report, null, 2),
);
console.log(
  `Audited ${pages.length} generated pages; ${orphans.length} orphan visitor pages.`,
);
