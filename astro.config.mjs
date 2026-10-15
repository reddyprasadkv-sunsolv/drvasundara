import { isIndexingExcluded } from './src/utils/indexing-policy.mjs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
const preview = process.env.PAGES_PREVIEW === 'true';
export default defineConfig({
  base: preview ? '/drvasundara/' : '/',
  devToolbar: { enabled: false },
  site: preview
    ? 'https://reddyprasadkv-sunsolv.github.io'
    : 'https://www.drvasundaragynec.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (url) =>
        !isIndexingExcluded(
          new URL(url).pathname.replace(/^\/drvasundara(?=\/)/, ''),
        ),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
