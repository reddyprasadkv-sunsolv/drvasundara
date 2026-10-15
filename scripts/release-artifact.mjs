import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
export const sha256 = (data) => createHash('sha256').update(data).digest('hex');
export function inventoryFiles(root) {
  const files = [];
  function walk(dir = '') {
    for (const entry of fs.readdirSync(path.join(root, dir), {
      withFileTypes: true,
    })) {
      const relative = path.posix.join(dir, entry.name);
      const full = path.join(root, relative);
      assert(
        !fs.lstatSync(full).isSymbolicLink(),
        `Symlink forbidden: ${relative}`,
      );
      assert(
        !relative
          .split('/')
          .some(
            (p) =>
              ['qa', 'docs', '.git', 'node_modules', 'backups'].includes(p) ||
              (p.startsWith('.') && p !== '.nojekyll'),
          ),
        `Private path forbidden: ${relative}`,
      );
      if (entry.isDirectory()) walk(relative);
      else {
        assert(entry.isFile());
        assert(
          relative === 'CNAME' ||
            relative === '.nojekyll' ||
            /\.(html|css|js|json|xml|txt|png|jpe?g|webp|svg|woff2?)$/.test(
              relative,
            ),
          `Unexpected artifact type: ${relative}`,
        );
        const bytes = fs.readFileSync(full);
        files.push({
          path: relative,
          bytes: bytes.length,
          sha256: sha256(bytes),
        });
      }
    }
  }
  walk();
  return files.sort((a, b) => a.path.localeCompare(b.path));
}
export function assertRootReadiness(root) {
  const files = inventoryFiles(root);
  const pages = files.filter((f) => f.path.endsWith('.html'));
  assert.equal(
    pages.length,
    59,
    'Expected updated baseline: 58 public pages plus 404',
  );
  assert(
    pages.some(
      (f) => f.path === 'services/urogynecology-consultation/index.html',
    ),
    'Approved Urogynecology destination missing',
  );
  for (const file of pages) {
    const html = fs.readFileSync(path.join(root, file.path), 'utf8');
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(
      html,
      /rel="canonical" href="https:\/\/www\.drvasundaragynec\.com\//,
    );
    assert.doesNotMatch(html, /(?:href|src)="\/drvasundara\//);
    assert.doesNotMatch(html, /(?:href|src)="http:\/\//);
  }
  assert.match(
    fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'),
    /Disallow: \//,
  );
  assert.doesNotMatch(
    fs.readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8'),
    /github\.io|\/drvasundara\//,
  );
  assert.equal(
    fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim(),
    'www.drvasundaragynec.com',
  );
  return { files, pageCount: pages.length };
}
export function verifyArtifact(root) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'),
  );
  assert.equal(manifest.mode, 'production-readiness');
  assert.equal(manifest.deploymentAuthorized, false);
  assert.equal(manifest.productionIndexing, false);
  const actual = inventoryFiles(path.join(root, 'site'));
  assert.deepEqual(
    actual,
    manifest.files,
    'Artifact checksums or file inventory changed',
  );
  const sums = fs.readFileSync(path.join(root, 'SHA256SUMS'), 'utf8');
  const expected =
    manifest.files.map((f) => `${f.sha256}  site/${f.path}`).join('\n') +
    '\n' +
    sha256(fs.readFileSync(path.join(root, 'manifest.json'))) +
    '  manifest.json\n';
  assert.equal(sums, expected, 'Checksum list changed');
  assertRootReadiness(path.join(root, 'site'));
  return manifest;
}
