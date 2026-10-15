import type { APIRoute } from 'astro';
import { site } from '../config/site';
export const GET: APIRoute = () => {
  const production = import.meta.env.BASE_URL === '/';
  return new Response(
    `User-agent: *\n${production && site.productionIndexing ? 'Allow' : 'Disallow'}: /\n` +
      (production ? `Sitemap: ${site.url}/sitemap-index.xml\n` : ''),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
