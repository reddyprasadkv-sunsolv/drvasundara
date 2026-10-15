import { site } from '../config/site';
import { publicProfile } from '../data/professional';
import { canonicalUrl } from './urls';
export const doctorId = site.url + '/#doctor';
export const publisherId = site.url + '/#publisher';
export const doctorEntity = () => ({
  '@type': 'Person',
  '@id': doctorId,
  name: site.doctor.name,
  url: site.url + '/about/',
  sameAs: site.socials.map(({ url }) => url),
  workLocation: { '@type': 'Place', name: site.contact.address },
  ...(publicProfile.title ? { jobTitle: publicProfile.title } : {}),
  ...(publicProfile.affiliations.length
    ? {
        affiliation: publicProfile.affiliations.map((name) => ({
          '@type': 'Organization',
          name,
        })),
      }
    : {}),
});
export const publisherEntity = () => ({
  '@type': 'Organization',
  '@id': publisherId,
  name: site.name + ' website',
  url: site.url,
});
export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': site.url + '/#website',
  name: site.name,
  url: site.url,
  inLanguage: 'en-IN',
  publisher: publisherEntity(),
  about: doctorEntity(),
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
export function webPageSchema(page: {
  title: string;
  description: string;
  path: string;
}) {
  const url = canonicalUrl(page.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url + '#webpage',
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': site.url + '/#website' },
    about: { '@id': doctorId },
  };
}
export function personProfileSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': site.url + '/about/#profile',
    url: site.url + '/about/',
    mainEntity: doctorEntity(),
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
    '@id': site.url + '/#clinic',
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
    '@id': site.url + '/#physician-practice',
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
    '@id': canonicalUrl(page.path) + '#webpage',
    isPartOf: { '@id': site.url + '/#website' },
    inLanguage: 'en-IN',
    name: page.title,
    description: page.description,
    url: canonicalUrl(page.path),
    lastReviewed: new Date(page.reviewedAt).toISOString().slice(0, 10),
    reviewedBy:
      page.reviewer === site.doctor.name
        ? doctorEntity()
        : { '@type': 'Person', name: page.reviewer },
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
    lastUpdated?: Date;
    medicalReviewedAt: Date;
    sources: { title: string; url: string }[];
  },
  path: string,
  author: string,
  reviewer: string,
  image?: string,
  authorType: 'Person' | 'Organization' = 'Person',
  identityUrls: { author?: string; reviewer?: string; section?: string } = {},
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
        dateModified: (
          data.updatedAt ||
          data.lastUpdated ||
          data.publishedAt
        ).toISOString(),
        author: {
          '@type': authorType,
          name: author,
          ...(authorType === 'Organization'
            ? { '@id': publisherId }
            : author === site.doctor.name
              ? { '@id': doctorId }
              : {}),
          ...(identityUrls.author ? { url: identityUrls.author } : {}),
        },
        ...(identityUrls.section
          ? { articleSection: identityUrls.section }
          : {}),
        publisher: publisherEntity(),
        inLanguage: 'en-IN',
        isPartOf: { '@id': site.url + '/#website' },
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
        reviewedBy: {
          '@type': 'Person',
          name: reviewer,
          ...(reviewer === site.doctor.name ? { '@id': doctorId } : {}),
          ...(identityUrls.reviewer ? { url: identityUrls.reviewer } : {}),
        },
        mainEntity: { '@id': url + '#article' },
      },
    ],
  };
}
export const jsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\u003c');
