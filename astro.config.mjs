// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Flip this to true when cutting over to the custom domain.
// Then add public/CNAME (mnafshin.info) and follow the README
// for the GitHub Pages and IONOS DNS steps. Do not flip it
// until those steps are ready.
const CUSTOM_DOMAIN = true;

// https://astro.build/config
export default defineConfig({
  site: CUSTOM_DOMAIN ? 'https://mnafshin.info' : 'https://mnafshin.github.io',
  base: CUSTOM_DOMAIN ? '/' : '/mnafshin.info',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
