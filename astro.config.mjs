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
  integrations: [mdx(), sitemap({ filter: (url) => !url.endsWith('/404/') })],
  vite: { plugins: [tailwindcss()] },
});
