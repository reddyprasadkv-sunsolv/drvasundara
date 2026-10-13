import { site } from '../config/site';
export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
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
    item: new URL(item.path, site.url).href,
  })),
});
// Clinic and physician markup deliberately require verified structured fields.
export function clinicSchema(verified: {
  name: string;
  address: string;
  phone: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: verified.name,
    address: verified.address,
    telephone: verified.phone,
    url: site.url,
  };
}
export function physicianSchema(verified: {
  name: string;
  qualifications: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: verified.name,
    description: verified.qualifications.join(', '),
  };
}
export function organizationSchema(verified: { name: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...verified,
  };
}
export const jsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\u003c');
