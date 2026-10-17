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
    assert.equal(new Set(person.sameAs).size, 4);
    assert(
      person.sameAs.every((url) =>
        /^https:\/\/(www\.)?(youtube|facebook|instagram|linkedin)\.com\//.test(
          url,
        ),
      ),
    );
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
