// Shared by page metadata, robots, sitemap and generated-site validation.
// The three category routes currently contain only one article each.
export const excludedIndexingPaths = [
  '/404/',
  '/blog/category/pcos-hormonal-health/',
  '/blog/category/fertility-reproductive-health/',
  '/blog/category/menopause-midlife-health/',
];
export function isIndexingExcluded(pathname) {
  return excludedIndexingPaths.includes(pathname);
}
export function robotsDirective({
  preview = false,
  indexing = false,
  excluded = false,
} = {}) {
  return preview || !indexing || excluded
    ? 'noindex, nofollow'
    : 'index, follow';
}
export function robotsText({
  preview = false,
  indexing = false,
  origin = 'https://www.drvasundaragynec.com',
} = {}) {
  return (
    `User-agent: *\n${!preview && indexing ? 'Allow' : 'Disallow'}: /\n` +
    (preview ? '' : `Sitemap: ${origin}/sitemap-index.xml\n`)
  );
}
