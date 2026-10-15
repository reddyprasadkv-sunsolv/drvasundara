import type { APIRoute } from 'astro';
import { robotsText } from '../utils/indexing-policy.mjs';
import { site } from '../config/site';
export const GET: APIRoute = () => {
  const production = import.meta.env.BASE_URL === '/';
  return new Response(
    robotsText({
      preview: !production,
      indexing: site.productionIndexing,
      origin: site.url,
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
