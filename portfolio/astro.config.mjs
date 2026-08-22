import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://warquahf.netlify.app',
  integrations: [svelte()],
  output: 'static',
  compressHTML: true,
});
