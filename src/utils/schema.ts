import { site } from '../config/site';
import { canonicalUrl } from './urls';
export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': site.url + '/#website',
  name: site.name,
  url: site.url,
});
export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: canonicalUrl(item.path),
  })),
});
export function personProfileSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': site.url + '/about/#profile',
    url: site.url + '/about/',
    mainEntity: {
      '@type': 'Person',
      name: site.doctor.name,
      '@id': site.url + '/about/#person',
    },
  };
}
// These builders must receive clinic-approved data; callers must not emit candidate records.
export function clinicSchema(verified: {
  name: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  mapUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: verified.name,
    url: site.url,
    telephone: verified.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: verified.streetAddress,
      addressLocality: verified.city,
      addressRegion: verified.region,
      postalCode: verified.postalCode,
      addressCountry: 'IN',
    },
    ...(verified.mapUrl ? { hasMap: verified.mapUrl } : {}),
  };
}
export function physicianSchema(verified: {
  name: string;
  title: string;
  affiliations: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: verified.name,
    url: site.url + '/about/',
    description: verified.title,
    hospitalAffiliation: verified.affiliations.map((name) => ({
      '@type': 'Hospital',
      name,
    })),
  };
}
export function organizationSchema(verified: { name: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...verified,
  };
}
export function medicalPageSchema(page: {
  title: string;
  description: string;
  path: string;
  reviewer: string;
  reviewedAt: Date | string;
  sources: { title: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: page.title,
    description: page.description,
    url: canonicalUrl(page.path),
    lastReviewed: new Date(page.reviewedAt).toISOString().slice(0, 10),
    reviewedBy: { '@type': 'Person', name: page.reviewer },
    citation: page.sources.map((source) => ({
      '@type': 'CreativeWork',
      name: source.title,
      url: source.url,
    })),
  };
}
export function articleSchema(
  data: {
    title: string;
    excerpt: string;
    publishedAt: Date;
    updatedAt?: Date;
    medicalReviewedAt: Date;
    sources: { title: string; url: string }[];
  },
  path: string,
  author: string,
  reviewer: string,
  image?: string,
  authorType: 'Person' | 'Organization' = 'Person',
) {
  const url = canonicalUrl(path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': url + '#article',
        headline: data.title,
        description: data.excerpt,
        datePublished: data.publishedAt.toISOString(),
        dateModified: (data.updatedAt || data.publishedAt).toISOString(),
        author: { '@type': authorType, name: author },
        mainEntityOfPage: { '@id': url + '#webpage' },
        ...(image ? { image } : {}),
      },
      {
        ...medicalPageSchema({
          title: data.title,
          description: data.excerpt,
          path,
          reviewer,
          reviewedAt: data.medicalReviewedAt,
          sources: data.sources,
        }),
        '@context': undefined,
        '@id': url + '#webpage',
        mainEntity: { '@id': url + '#article' },
      },
    ],
  };
}
export const jsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\u003c');
