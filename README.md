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

## SpringUniverse videos

Long tutorials and weekly reviews live under `/spring/`. The index is a table of contents in series order. Each video page embeds the YouTube video (privacy-friendly `youtube-nocookie`, lazy-loaded) and the narration script.

Video entries are a content collection in `src/content/videos/`. Front matter:

```md
---
title: The public YouTube title
description: A short summary for listings, RSS, and search.
youtubeId: ...........
pubDate: 2026-11-10T12:00:16Z
series: tutorials   # or weekly
seriesLabel: T6.2
order: 180
draft: false
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-06-products
shorts:
  - title: A related Short that is already public
    youtubeId: ...........
---
```

Use `codeUrls` instead of `codeUrl` when there is more than one already-public companion folder. Omit code and Shorts fields when they are not public. Keep `draft: true` for videos that are still private or scheduled; they will appear automatically once `draft` is set to `false` after the video is public.

The filename without the extension is the slug: `/spring/t6-2-api-errors-problemdetail/`. Published video pages are included in the sitemap and in both the site RSS feed and `/spring/rss.xml`.

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
