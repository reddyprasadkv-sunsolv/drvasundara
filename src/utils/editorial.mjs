export function isPublicArticle(data, now = new Date()) {
  return (
    data.status === 'published' &&
    !!data.approvedAt &&
    !!data.medicalReviewedAt &&
    !!data.reviewer &&
    data.publishedAt <= now &&
    data.approvedAt <= now &&
    data.medicalReviewedAt <= now
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
