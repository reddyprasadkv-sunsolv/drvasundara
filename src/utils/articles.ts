import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { isPublicArticle } from './editorial.mjs';
export type PublicArticle = CollectionEntry<'blog'> & {
  data: CollectionEntry<'blog'>['data'] & {
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
      if (
        !isPublicArticle({ ...entry.data, reviewer: entry.data.reviewer?.id })
      )
        return null;
      const author = await getEntry(entry.data.author);
      const reviewer = entry.data.reviewer
        ? await getEntry(entry.data.reviewer)
        : undefined;
      return author?.data.verified &&
        reviewer?.data.verified &&
        reviewer.data.canReviewMedicalContent &&
        reviewer.data.entityType === 'Person' &&
        (entry.data.authorship !== 'doctor-authored' ||
          author.data.canReviewMedicalContent)
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
