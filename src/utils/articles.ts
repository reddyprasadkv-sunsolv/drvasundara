import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { canPublishArticleRecord } from './publication.mjs';
export type PublicArticle = CollectionEntry<'blog'> & {
  data: CollectionEntry<'blog'>['data'] & {
    author: NonNullable<CollectionEntry<'blog'>['data']['author']>;
    publishedAt: Date;
    approvedAt: Date;
    medicalReviewedAt: Date;
    reviewer: NonNullable<CollectionEntry<'blog'>['data']['reviewer']>;
  };
};
export async function publicArticles(): Promise<PublicArticle[]> {
  const all = await getCollection('blog');
  const entries = await Promise.all(
    all.map(async (entry) => {
      const author = entry.data.author
        ? await getEntry(entry.data.author)
        : undefined;
      const reviewer = entry.data.reviewer
        ? await getEntry(entry.data.reviewer)
        : undefined;
      return canPublishArticleRecord(
        entry.data,
        entry.body,
        author?.data,
        reviewer?.data,
      )
        ? (entry as PublicArticle)
        : null;
    }),
  );
  const visible = entries.filter((e): e is PublicArticle => !!e);
  if (new Set(visible.map((e) => e.data.slug)).size !== visible.length)
    throw new Error('Duplicate public article slug');
  return visible.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}
export const readingTime = (body: string = '') =>
  Math.max(1, Math.ceil(body.split(/\s+/).length / 200));

export const articleReadingTime = (entry: PublicArticle) =>
  readingTime(
    [
      entry.body,
      entry.data.introduction,
      ...entry.data.keyTakeaways,
      ...entry.data.medicalFaqs.map((f) => f.question + ' ' + f.answer),
    ].join(' '),
  );
