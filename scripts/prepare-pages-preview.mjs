import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const base = '/drvasundara/';
for (const file of fs
  .readdirSync(root, { recursive: true })
  .filter((f) => String(f).endsWith('.html'))) {
  const name = path.join(root, String(file));
  const html = fs
    .readFileSync(name, 'utf8')
    .replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (match, attribute, url) =>
      url.startsWith(base) ? match : `${attribute}="${base}${url.slice(1)}"`,
    );
  fs.writeFileSync(name, html);
}
fs.rmSync(path.join(root, 'CNAME'), { force: true });
console.log('Prepared GitHub Pages project paths; custom domain omitted.');
