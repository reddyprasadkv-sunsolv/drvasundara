import { getCollection, getEntry } from 'astro:content';
import { isPublicArticle } from './editorial.mjs';
export async function publicArticles() {
  const all = await getCollection('blog');
  const entries = await Promise.all(
    all.map(async (entry) => {
      const author = await getEntry(entry.data.author);
      const reviewer = entry.data.reviewer
        ? await getEntry(entry.data.reviewer)
        : undefined;
      return isPublicArticle({
        ...entry.data,
        reviewer: entry.data.reviewer?.id,
      }) &&
        author?.data.verified &&
        reviewer?.data.verified
        ? entry
        : null;
    }),
  );
  const visible = entries.filter((e): e is NonNullable<typeof e> => !!e);
  if (new Set(visible.map((e) => e.data.slug)).size !== visible.length)
    throw new Error('Duplicate public article slug');
  return visible.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}
export const readingTime = (body: string = '') =>
  Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
