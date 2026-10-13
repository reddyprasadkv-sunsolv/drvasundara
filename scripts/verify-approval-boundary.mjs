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
}
console.log(
  'Verified draft route/sitemap exclusion, approved content and remaining draft boundaries, and absence of review fixtures.',
);

const home = readFileSync('dist/index.html', 'utf8');
const about = readFileSync('dist/about/index.html', 'utf8');
assert.match(home, /Expertise in women’s health/);
assert.match(about, /Senior Consultant Gynaecologist/);
assert.ok(
  existsSync('dist/services/cosmetic-gynecology-consultation/index.html'),
);
assert.equal(services.filter((s) => isPublicService(s)).length, 27);
for (const service of services.filter((s) => isPublicService(s))) {
  assert.ok(existsSync(join('dist', 'services', service.slug, 'index.html')));
  assert.ok(sitemap.includes('/services/' + service.slug + '/'));
}
console.log(
  'Verified 27 approved canonical services, approved profile display and withdrawn-content exclusion.',
);
