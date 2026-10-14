export function categoryId(data: {
  category: string;
  journalCategory?: string;
}): string;
export function uniqueBySlug<T>(entries: T[]): T[];
export function curatedArticles<
  T extends { data: { slug: string; relatedArticles: string[] } },
>(entry: T, articles: T[]): T[];
export function relevantReading<
  T extends { data: { slug: string; relatedServices: string[] } },
>(service: { slug: string; relatedArticles: string[] }, articles: T[]): T[];
export interface SearchArticle {
  slug: string;
  title: string;
  summary: string;
  categoryId: string;
  categoryName: string;
  url: string;
}
export function matchesArticle(
  article: SearchArticle,
  query?: string,
  category?: string,
): boolean;
export function filterSearchIndex(
  index: SearchArticle[],
  query: string,
  category: string,
): SearchArticle[];
