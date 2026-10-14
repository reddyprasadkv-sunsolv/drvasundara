import { getEntry } from 'astro:content';
import { publicArticles } from '../../utils/articles';
import { publishedSearchRecords } from '../../utils/publication.mjs';
import { journalCategories } from '../../utils/journal-data';
export async function GET() {
  const candidates = await Promise.all(
    (await publicArticles()).map(async (entry) => ({
      data: entry.data,
      body: entry.body,
      author: (await getEntry(entry.data.author))!.data,
      reviewer: (await getEntry(entry.data.reviewer))!.data,
    })),
  );
  return new Response(
    JSON.stringify(
      publishedSearchRecords(
        candidates,
        journalCategories,
        import.meta.env.BASE_URL,
      ),
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
}
