import type { SearchArticle } from './journal.mjs';
export function canPublishArticleRecord(
  data: any,
  body: string | undefined,
  author: any,
  reviewer: any,
  now?: Date,
): boolean;
export function publishedSearchRecords(
  candidates: any[],
  categories: { id: string; name: string }[],
  base?: string,
  now?: Date,
): SearchArticle[];
