import { validPastDate } from './medical-gates.mjs';
export function isPublicArticle(data, now = new Date()) {
  return (
    data.status === 'published' &&
    data.contentType === 'article' &&
    data.authorshipConfirmed === true &&
    !!data.approvedAt &&
    !!data.medicalReviewedAt &&
    !!data.reviewer &&
    validPastDate(data.publishedAt, now) &&
    validPastDate(data.approvedAt, now) &&
    validPastDate(data.medicalReviewedAt, now) &&
    (!data.updatedAt || validPastDate(data.updatedAt, now)) &&
    (!data.lastUpdated || validPastDate(data.lastUpdated, now)) &&
    new Date(data.medicalReviewedAt) <= new Date(data.approvedAt) &&
    new Date(data.approvedAt) <=
      new Date(data.updatedAt || data.lastUpdated || data.publishedAt)
  );
}
export function safeFormUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      (url.hostname === 'forms.gle' ||
        (url.hostname === 'docs.google.com' &&
          url.pathname.startsWith('/forms/')))
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function safeWhatsAppUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname === 'wa.me' &&
      !url.username &&
      !url.password &&
      !url.port &&
      /^\/[1-9][0-9]{7,14}$/.test(url.pathname) &&
      !url.search &&
      !url.hash
      ? url.href
      : null;
  } catch {
    return null;
  }
}
