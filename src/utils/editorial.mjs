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
    (!data.updatedAt || validPastDate(data.updatedAt, now))
  );
}
export function safeFormUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      (url.hostname === 'forms.gle' ||
        (url.hostname === 'docs.google.com' &&
          url.pathname.startsWith('/forms/')))
      ? url.href
      : null;
  } catch {
    return null;
  }
}
