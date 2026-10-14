export const legacyCategories = {
  Pregnancy: 'pregnancy-obstetrics',
  'Menstrual Health': 'menstrual-health',
  PCOS: 'pcos-hormonal-health',
  Fertility: 'fertility-reproductive-health',
  'Women’s Wellness': 'gynecological-surgery',
  Menopause: 'menopause-midlife-health',
  'Preventive Care': 'preventive-healthcare',
};
export const categoryId = (data) =>
  data.journalCategory || legacyCategories[data.category] || '';
export const uniqueBySlug = (entries) => [
  ...new Map(entries.map((e) => [e.data?.slug || e.slug, e])).values(),
];
export function curatedArticles(entry, articles) {
  return uniqueBySlug(
    articles.filter(
      (a) =>
        a.data.slug !== entry.data.slug &&
        entry.data.relatedArticles.includes(a.data.slug),
    ),
  );
}
export function relevantReading(service, articles) {
  return uniqueBySlug(
    articles.filter(
      (a) =>
        a.data.relatedServices.includes(service.slug) ||
        service.relatedArticles.includes(a.data.slug),
    ),
  );
}
export function matchesArticle(article, query = '', category = '') {
  if (category && article.categoryId !== category) return false;
  const normalize = (value) =>
    String(value).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
  const text = normalize(article.title + ' ' + article.summary);
  return normalize(query)
    .trim()
    .split(/\s+/)
    .every((token) => text.includes(token));
}
export const filterSearchIndex = (index, query, category) =>
  index.filter((a) => matchesArticle(a, query, category));
