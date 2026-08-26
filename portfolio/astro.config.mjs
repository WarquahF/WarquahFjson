import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://warquahf35.vercel.app',
  integrations: [svelte(), sitemap()],
  output: 'static',
  compressHTML: true,
});
