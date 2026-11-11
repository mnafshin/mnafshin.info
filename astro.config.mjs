// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Flip this to true when cutting over to the custom domain.
// Then add public/CNAME (mnafshin.info) and follow the README
// for the GitHub Pages and IONOS DNS steps. Do not flip it
// until those steps are ready.
const CUSTOM_DOMAIN = true;

// The old one-page-per-tutorial URLs now point at the concept article that
// covers that video. Weekly review URLs (/spring/w44-…/) do not change.
const TUTORIAL_REDIRECTS = [
  ['t0-1-how-a-java-web-app-works', 'how-a-java-web-app-works'],
  ['t1-1-spring-boot-4-from-zero', 'spring-boot-4-from-zero'],
  ['t1-2-starters-and-the-boot-bom', 'starters-and-the-bom'],
  ['t2-1-dependency-injection-and-ioc', 'dependency-injection-and-the-container'],
  ['t2-2-configuration-bean-and-the-context', 'dependency-injection-and-the-container'],
  ['t3-1-configuration-properties', 'configuration-properties-profiles-and-spel'],
  ['t3-2-profiles-and-spel', 'configuration-properties-profiles-and-spel'],
  ['t4-1-bean-lifecycle', 'bean-lifecycle'],
  ['t4-2a-proxies-and-the-self-call-trap', 'how-spring-proxies-work'],
  ['t4-2b-cglib-vs-jdk-proxies', 'how-spring-proxies-work'],
  ['t4-3-circular-dependencies', 'circular-dependencies'],
  ['t5-1-how-auto-config-decides', 'auto-configuration'],
  ['t5-2-change-the-web-server', 'auto-configuration'],
  ['t5-3-write-your-own-auto-config', 'auto-configuration'],
  ['t5-4-turn-off-an-auto-config', 'auto-configuration'],
  ['t5-5-test-your-auto-config', 'auto-configuration'],
  ['t6-1-build-a-crud-rest-api', 'rest-apis-crud-errors-and-versioning'],
  ['t6-2-api-errors-problemdetail', 'rest-apis-crud-errors-and-versioning'],
  ['t6-3-api-versioning', 'rest-apis-crud-errors-and-versioning'],
];

const redirects = Object.fromEntries(
  TUTORIAL_REDIRECTS.map(([from, to]) => [
    `/spring/${from}/`,
    { status: /** @type {301} */ (301), destination: `/spring/${to}/` },
  ]),
);

// https://astro.build/config
export default defineConfig({
  site: CUSTOM_DOMAIN ? 'https://mnafshin.info' : 'https://mnafshin.github.io',
  base: CUSTOM_DOMAIN ? '/' : '/mnafshin.info',
  trailingSlash: 'always',
  redirects,
  integrations: [
    // The search results page is for readers, not for search engines.
    sitemap({ filter: (page) => !new URL(page).pathname.endsWith('/search/') }),
  ],
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
