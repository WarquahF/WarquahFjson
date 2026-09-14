import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical host. Defaults to GitHub Pages (warquahf.github.io) so the
  // sitemap + OG URLs are stable. Vercel can override via the SITE_URL
  // environment variable without a code change.
  site: process.env.SITE_URL ?? 'https://warquahf.github.io',
  integrations: [svelte(), sitemap()],
  output: 'static',
  compressHTML: true,
});
