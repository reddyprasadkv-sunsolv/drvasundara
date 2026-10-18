import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const htmlAt = (route) =>
  fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
const graphs = (html) =>
  [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap(([, raw]) => {
    const value = JSON.parse(raw);
    return value['@graph'] || [value];
  });
const services = JSON.parse(
  fs.readFileSync('src/data/services.json', 'utf8'),
).filter((s) => s.approved && !s.aliasOf);

test('every service connects local consultation intent to the existing contact and doctor pages', () => {
  assert.equal(services.length, 28);
  for (const service of services) {
    const html = htmlAt(`services/${service.slug}`);
    assert.match(html.match(/<title>([^<]+)<\/title>/)[1], /in Secunderabad/);
    assert.match(
      html.match(/name="description" content="([^"]+)"/)[1],
      /KIMS Hospital, Secunderabad/,
    );
    const section = html
      .split('class="service-appointment"')[1]
      .split('</section>')[0];
    assert.match(section, /KIMS Hospital, Secunderabad/);
    assert.match(section, /href="(?:\/drvasundara)?\/about\/"/);
    assert.match(section, /href="(?:\/drvasundara)?\/contact\/"/);
    assert.match(section, /https:\/\/wa\.me\//);
    assert.match(section, /href="(?:\/drvasundara)?\/appointment\/"/);
  }
});

test('local discovery preserves one Person identity without manufacturing a clinic or review markup', () => {
  for (const file of fs
    .readdirSync('dist', { recursive: true })
    .filter((f) => String(f).endsWith('.html'))) {
    const nodes = graphs(fs.readFileSync(path.join('dist', file), 'utf8'));
    const person = nodes.find((n) => n['@type'] === 'WebSite').about;
    assert.equal(person['@type'], 'Person');
    assert.equal(person['@id'], 'https://www.drvasundaragynec.com/#doctor');
    assert.deepEqual(person.workLocation, {
      '@type': 'Place',
      name: 'KIMS Hospital, Secunderabad',
    });
    const expectedSameAs = [
      'https://www.youtube.com/@DrVasundaraCheepurupalli',
      'https://www.facebook.com/DrVasundaraCheepurupalli',
      'https://www.instagram.com/dr_vasundara_cheepurupalli',
      'https://www.linkedin.com/in/dr-vasundara-cheepurupalli',
      'https://www.kimshospitals.com/doctor-profile/dr-vasundara-cheepurupalli/',
    ];
    assert.equal(person.sameAs.length, expectedSameAs.length);
    assert.deepEqual([...person.sameAs].sort(), [...expectedSameAs].sort());
    assert.equal(new Set(person.sameAs).size, expectedSameAs.length);
    const raw = JSON.stringify(nodes);
    assert.doesNotMatch(
      raw,
      /"@type":"(?:MedicalClinic|LocalBusiness|Physician|AggregateRating|Review|GeoCoordinates)"/,
    );
    assert.doesNotMatch(
      raw,
      /"(?:openingHours|openingHoursSpecification|medicalSpecialty)":/,
    );
  }
});

test('administrative FAQs answer location and confirmation questions without adding a schedule', () => {
  for (const route of ['', 'faqs']) {
    const html = htmlAt(route);
    assert.match(html, /id="faq-consultation-location"/);
    assert.match(html, /id="faq-consultation-hours"/);
    assert.match(
      html,
      /Ask the clinic on WhatsApp to confirm current availability before travelling/,
    );
  }
});

// Check rendered metadata and clinical identity together, in both build modes.
test('priority consultation snippets retain clinical headings and local context', () => {
  const priority = [
    'general-gynecology',
    'pcos',
    'high-risk-pregnancy',
    'urogynecology-consultation',
    'menopause-care',
    'laparoscopic-gynecological-surgery',
    'robotic-gynecological-surgery',
  ];
  for (const slug of priority) {
    const service = services.find((s) => s.slug === slug);
    const html = htmlAt(`services/${slug}`);
    const description = html.match(/name="description" content="([^"]+)"/)[1];
    assert.equal(description, service.seo.description);
    assert.match(description, /KIMS Hospital, Secunderabad, Hyderabad/);
    assert(description.length <= 160);
    assert(html.includes(`<h1>${service.name}</h1>`));
    assert.match(html, /Sources and medical review/);
    assert.match(html, /id="service-faqs"/);
  }
});

test('discovery metadata and profile links describe the real practice without ranking claims', () => {
  const home = htmlAt('');
  const about = htmlAt('about');
  const servicesPage = htmlAt('services');
  for (const html of [home, about, servicesPage]) {
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = html.match(/name="description" content="([^"]+)"/)[1];
    assert.match(description, /Secunderabad, Hyderabad, Telangana/);
    assert.doesNotMatch(
      title + ' ' + description,
      /\b(?:best|top|No\.?\s*1)\b/i,
    );
  }
  assert.match(
    home.match(/<title>([^<]+)<\/title>/)[1],
    /Gynecologist in Hyderabad/,
  );
  const profile = JSON.parse(
    fs.readFileSync('src/data/doctor-profile.json', 'utf8'),
  );
  const interests = profile.claims.find(
    (c) => c.id === 'specializations',
  ).value;
  const person = graphs(about).find((n) => n['@type'] === 'WebSite').about;
  assert.deepEqual(person.knowsAbout, interests);
  const hospitalLink = about.match(
    new RegExp(
      '<a[^>]+href="https://www[.]kimshospitals[.]com/doctor-profile/dr-vasundara-cheepurupalli/"[^>]*>',
    ),
  )?.[0];
  assert(hospitalLink);
  assert(hospitalLink.includes('target="_blank"'));
  assert(hospitalLink.includes('rel="noopener noreferrer"'));
  const linked = about.split('class="profile-interests"')[1].split('</ul>')[0];
  for (const slug of [
    'general-gynecology',
    'pregnancy-antenatal-care',
    'urogynecology-consultation',
    'laparoscopic-gynecological-surgery',
    'robotic-gynecological-surgery',
    'reproductive-health-evaluation',
    'cosmetic-gynecology-consultation',
  ]) {
    assert(linked.includes(`/services/${slug}/`));
  }
});

test('llms overview links only to published pages and retains the sitemap inventory', () => {
  const content = fs.readFileSync('dist/llms.txt', 'utf8');
  assert.match(content, /^# Dr\. Vasundara Cheepurupalli\n\n> /);
  assert.match(content, /KIMS Hospital, Secunderabad/);
  assert.match(content, /Qualifications: DNB, DGO, FMAS, CIMP, GCP\./);
  const urls = [...content.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(
    (m) => m[1],
  );
  assert.equal(new Set(urls).size, urls.length);
  const origin = 'https://www.drvasundaragynec.com';
  for (const url of urls) {
    if (
      url ===
      'https://www.kimshospitals.com/doctor-profile/dr-vasundara-cheepurupalli/'
    )
      continue;
    assert.equal(new URL(url).origin, origin);
    assert(
      fs.existsSync(path.join('dist', new URL(url).pathname, 'index.html')),
      url,
    );
  }
  for (const service of services)
    assert(urls.includes(`${origin}/services/${service.slug}/`));
  const articles = JSON.parse(
    fs.readFileSync('dist/blog/search-index.json', 'utf8'),
  );
  assert.equal(articles.length, 13);
  for (const article of articles)
    assert(urls.includes(`${origin}/blog/${article.slug}/`));
  for (const route of [
    'about',
    'services',
    'blog',
    'faqs',
    'appointment',
    'privacy',
  ])
    assert(urls.includes(`${origin}/${route}/`));
  assert.doesNotMatch(
    content,
    /github\.com|approvalRecord|patient-video|github\.io/,
  );
  const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 56);
  assert(!sitemap.includes('llms.txt'));
});
