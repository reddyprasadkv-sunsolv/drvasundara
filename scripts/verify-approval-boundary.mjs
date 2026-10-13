import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { isPublicService } from '../src/utils/medical-gates.mjs';
const services = JSON.parse(readFileSync('src/data/services.json', 'utf8'));
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
for (const s of services.filter((s) => !isPublicService(s))) {
  assert.equal(
    existsSync(join('dist', 'services', s.slug, 'index.html')),
    false,
    `Unapproved service route: ${s.slug}`,
  );
  assert.ok(!sitemap.includes(`/services/${s.slug}/`));
}
for (const file of readdirSync('src/content/blog').filter((f) =>
  f.endsWith('.mdx'),
)) {
  const text = readFileSync(join('src/content/blog', file), 'utf8');
  if (
    !/status:\s*['"]?(draft|doctor-review|medical-review|approved)/.test(text)
  )
    continue;
  const slug = text.match(/^slug:\s*['"]?([a-z0-9-]+)/m)?.[1];
  assert.ok(slug);
  assert.equal(
    existsSync(join('dist', 'blog', slug, 'index.html')),
    false,
    `Unapproved article route: ${slug}`,
  );
  assert.ok(!sitemap.includes(`/blog/${slug}/`));
}
const pages = readdirSync('dist', { recursive: true }).filter((f) =>
  String(f).endsWith('.html'),
);
for (const file of pages) {
  assert.ok(
    !String(file).includes('__review') &&
      !String(file).includes('review-template') &&
      !String(file).includes('review-article'),
    'A review fixture escaped into the build',
  );
  const html = readFileSync(join('dist', String(file)), 'utf8');
  assert.doesNotMatch(
    html,
    /\bDNB\b|13\+ years|9346825723|Senior Consultant Gynaecologist/,
    'Unapproved profile/contact data leaked',
  );
}
console.log(
  'Verified draft route/sitemap exclusion, profile and contact approval boundaries, and absence of review fixtures.',
);
