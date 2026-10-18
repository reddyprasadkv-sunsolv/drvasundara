import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { publicProfile } from '../data/professional';
import { approvedServices } from '../data/services';
import { publicArticles } from '../utils/articles';
import { officialHospitalProfileUrl } from '../utils/schema';

const text = (value: string) => value.replace(/\s+/g, ' ').trim();
const label = (value: string) => text(value).replace(/[\\\[\]]/g, '\\$&');
const link = (name: string, route: string, description: string) =>
  `- [${label(name)}](${new URL(route, site.url).href}): ${text(description)}`;

export const GET: APIRoute = async () => {
  const articles = await publicArticles();
  const content = [
    '# Dr. Vasundara Cheepurupalli',
    '',
    `> ${text(publicProfile.title)} at ${site.contact.address}, serving patients in Secunderabad, Hyderabad, Telangana.`,
    '',
    `Qualifications: ${publicProfile.qualifications.join(', ')}.`,
    '',
    'This website provides patient education. For individual advice, consult a qualified healthcare professional. Confirm appointment availability with the clinic through its official WhatsApp channel.',
    '',
    '## Main pages',
    '',
    link(
      'Doctor profile',
      '/about/',
      'Professional background, qualifications and clinical interests.',
    ),
    link(
      'Services',
      '/services/',
      'Approved gynecology and pregnancy care services.',
    ),
    link(
      'Medical articles',
      '/blog/',
      'Patient-friendly information with author, medical review and source details.',
    ),
    link(
      'Frequently asked questions',
      '/faqs/',
      'Answers to common patient and consultation questions.',
    ),
    link(
      'Appointments',
      '/appointment/',
      'How to request an appointment through the clinic.',
    ),
    '',
    '## Approved services',
    '',
    ...approvedServices.map((service) =>
      link(service.name, `/services/${service.slug}/`, service.description),
    ),
    '',
    '## Medical articles',
    '',
    ...articles.map((article) =>
      link(
        article.data.title,
        `/blog/${article.data.slug}/`,
        article.data.excerpt,
      ),
    ),
    '',
    '## Optional',
    '',
    link(
      'Privacy information',
      '/privacy/',
      'How the clinic handles enquiries and privacy requests.',
    ),
    `- [Official KIMS Hospitals profile](${officialHospitalProfileUrl}): Hospital reference for Dr. Vasundara Cheepurupalli.`,
    '',
  ].join('\n');
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
