# mnafshin.info

Personal hub and blogs for [Afshin Amini](https://github.com/mnafshin): SpringUniverse, Termsplained, and a later AI section. Built with [Astro](https://astro.build) and deployed to GitHub Pages.

The site is live at **https://mnafshin.info**.

## Local development

```sh
npm install
npm run dev
```

`npm run build` type-checks and writes the static site to `dist/`. `npm run preview` serves that build.

## How to add a post

For now, posts live in this repo:

- SpringUniverse: `src/content/spring/`
- Termsplained: `src/content/terms/`
- AI (hidden from the nav until a post is published): `src/content/ai/`

Create a Markdown file, for example `src/content/spring/my-post.md`:

```md
---
title: My post
description: One or two sentences for listings, RSS, and search.
pubDate: 2026-11-20
draft: true
---

Write the article here.
```

The filename without the extension becomes the URL slug: `/spring/my-post/`. Optional fields are `updatedDate` and `tags`.

While `draft` is `true`, the post is omitted from listings, RSS, the sitemap, and page routes. After review and approval, set `draft` to `false` and push to `main`. The site rebuilds automatically.

Each section already has a `welcome.md` placeholder marked as a draft. Do not publish those placeholders. Blog posts will appear in each section once a real article is published.

## SpringUniverse: concept articles and weekly reviews

`/spring/` lists two things:

1. **Concept articles** (`src/content/spring/`), in learning order. Each article teaches one concept on its own. The related long videos from the SpringUniverse channel sit below the text (privacy-friendly `youtube-nocookie` embeds, lazy-loaded), followed by the companion code and related Shorts. The learning order is the `CONCEPT_ORDER` list in `src/lib/spring.ts`; an article that is not in that list appears after the others, newest first.
2. **Weekly reviews** (`src/content/videos/`, `series: weekly`), newest first. Each has its own page with the embed and the script, for example `/spring/w45-this-week-in-java-and-spring/`.

Long tutorials no longer have a page of their own. Their old URLs (`/spring/t0-1-…/` to `/spring/t6-3-…/`) redirect to the article that covers them; the table is `TUTORIAL_REDIRECTS` in `astro.config.mjs`. GitHub Pages is static hosting, so Astro writes each redirect as a small HTML page with an instant meta refresh and a canonical link to the new URL.

Concept article front matter:

```md
---
title: 'REST APIs with Spring Boot 4: CRUD, Useful Errors and API Versioning'
description: One or two sentences for listings, RSS, and search.
pubDate: '2026-11-06T12:00:01Z'   # earliest public related video
section: spring
topic: rest-apis
relatedVideos:
  - id: T6.1
    title: The public YouTube title
    youtubeId: ...........
    pubDate: '2026-11-06T12:00:01Z'
  - id: T6.3
    title: A video that is not public yet
    youtubeId: ...........
    draft: true        # hidden until both flags are removed
    published: false
relatedShorts:
  - title: A related Short that is already public
    youtubeId: ...........
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-06-products
draft: false
---
```

Use `codeUrls` instead of `codeUrl` when there is more than one companion folder. A related video with `draft: true` or `published: false` is not shown anywhere (no embed, no link, not in the home page's latest videos); remove those flags once the video is public on YouTube. Empty sections (no videos, no code, no Shorts) are omitted.

Weekly review front matter:

```md
---
title: The public YouTube title
description: A short summary for listings, RSS, and search.
youtubeId: ...........
pubDate: 2026-11-09T07:27:21Z
series: weekly
seriesLabel: W45
order: 1010
shorts:
  - title: A related Short that is already public
    youtubeId: ...........
---
```

Keep `draft: true` for a weekly that is still private or scheduled. The filename without the extension is the slug for both kinds of page. The concept articles and the weekly review pages are included in the sitemap and in both the site RSS feed and `/spring/rss.xml`; the old tutorial URLs are not.

## Content from channel repos (later)


The long-term plan is for the canonical markdown to live in the channel repos and to be pulled in at build time. The deploy workflow in `.github/workflows/deploy.yml` has a commented checkout example for that. Until those checkouts are enabled, this repo’s `src/content/` folders are the source.

## Custom domain (already cut over)

The site URL is controlled by one flag in `astro.config.mjs`:

```js
const CUSTOM_DOMAIN = false;
```

This flag is already `true`: `site` is `https://mnafshin.info` and `base` is `/`. The notes below are the cutover record, kept for reference:


1. **Hashnode.** In the Hashnode dashboard, remove `mnafshin.info` as the custom domain *around the same time* as the DNS change. Today `https://springuniverse.hashnode.dev` redirects to `https://mnafshin.info`. After the domain is detached, the 14 existing posts should be reachable again on the Hashnode host (this was not logged-in-verified). Those posts are not being migrated to this site; they can be rewritten later with companion videos. Do not delete the Hashnode publication until you have decided what should happen to those URLs. Removing the custom domain may be hard to undo if custom domains are now a Pro feature.
2. **Add `public/CNAME`** in this repo, with a single line: `mnafshin.info`. Do not add this file before the cutover; it would move the GitHub Pages site off the github.io preview.
3. **GitHub Pages custom domain.** In the repository Settings → Pages, set the custom domain to `mnafshin.info`. Optionally verify the domain on the GitHub account first, which GitHub recommends to prevent takeover. Then enable **Enforce HTTPS** after GitHub has issued the certificate (this can take a little while once DNS checks pass). GitHub will redirect `www` to the apex if the apex is the configured domain.
4. **IONOS DNS.** Change only the apex and `www`. Leave nameservers, MX, SPF, the Google site-verification TXT, and `files.mnafshin.info` (Nextcloud, A record `82.165.40.230`) untouched.

   | Name | Type | Current (Hashnode / Vercel) | Change to |
   | --- | --- | --- | --- |
   | `@` (`mnafshin.info`) | A | `76.76.21.21` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
   | `@` | AAAA | none | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
   | `www` | A | `76.76.21.21` | remove |
   | `www` | CNAME | none | `mnafshin.github.io` |
   | `files` | A | `82.165.40.230` | do not change |

5. After cutover, submit `https://mnafshin.info/sitemap-index.xml` in Google Search Console (the domain is already verified with a TXT record). While the site is on github.io, `robots.txt` disallows crawlers and pages send `noindex`.

Do not change DNS or the Hashnode custom domain until the Astro site has been reviewed on github.io.
