# Contributing

## Check-yourself questions

Every published article and weekly review on the site must ship with **two or three** multiple-choice questions. Channel bots and authors should add them in the same pull request as the article.

Put the entry in `src/data/check-questions.ts`, keyed by the public path `{section}/{id}`:

- `src/content/terms/what-is-rag.md` → `terms/what-is-rag`
- `src/content/spring/auto-configuration.md` → `spring/auto-configuration`
- Spring weekly videos in `src/content/videos/` use the public Spring path, for example `src/content/videos/w45-this-week-in-java-and-spring.md` → `spring/w45-this-week-in-java-and-spring`

```ts
'terms/what-is-rag': [
  {
    prompt: 'What does RAG stand for?',
    choices: ['A first, weaker answer', 'The correct answer', 'Another miss'],
    answer: 1, // 0-based index into choices
    explain: 'One or two sentences, shown as soon as the reader picks an answer.',
  },
  // a second question, and optionally a third
],
```

Write questions that can be answered from that page, in plain language, with one clearly correct choice. `npm run build` fails if a published markdown file has no entry, or fewer than two questions, and the error names the file.

Do not skip weekly or monthly reviews, and do not skip `/ai` posts once they are published.


## Glossary terms

Every section has an A–Z glossary at `/<section>/glossary/`, built at site build time. Glossary pages are not articles, so they do not need check-yourself questions.

**Termsplained.** A published concept article is added to `/terms/glossary/` automatically from its title and description. Skip weekly reviews and drafts. When you add a terms article, write a one-line `description` that can stand as the glossary definition.

**Other sections** (Spring, Database, Kubernetes, System Design, and later Security and AI). Add a row to the section's list in `src/data/glossaries.ts` in the same pull request as the article:

```ts
{
  term: 'Auto-configuration',
  articleId: 'auto-configuration', // the markdown file's id in this section
  definition: 'A short, plain-English definition in your own words, accurate to the article.',
}
```

Use a short term name, not the full article title, and link only to a published concept article in that same section. The build drops any row whose article is missing, still a draft, or a weekly review. Do not invent articles to fill the list. If a section has no published articles yet, its glossary shows a coming-soon message.


## Glossary term marking

The build marks the first occurrence of glossary terms in article prose so readers can open a short definition. Terms come from every section glossary (`src/data/glossaries.ts` and published Termsplained articles). The article's own section is preferred when more than one term could match. Code, headings, links, glossary pages, and the article that defines a term are skipped.

Matching is whole-word and case-aware: acronyms such as `REST` or `SQL`, camelCase names, and `@annotations` must appear in that form. Everyday words are not auto-marked. The skip list and safer aliases live in `src/data/glossary-marking.ts`. If you add a short, common term such as `image` or `profile`, put the bare word in `SKIP_MARKING` and add a distinctive alias (for example `container image` or `Spring profile`) in `GLOSSARY_ALIASES`. Readers can still look up the bare word with the Define shortcut (`Alt+I` or `I`) or the mobile Define button.

## Article summaries (In short)

New articles should include an optional `summary` field in the frontmatter: one or two accurate sentences, written from the article itself, that can stand as a TL;DR.

```md
summary: 'Spring Boot creates the usual beans from what is on the classpath. Once you know how it decides, you can change, write, disable and test an auto-configuration.'
```

The site shows this as an “In short” box at the top of the article, uses it in `/llms.txt`, and falls back to it for the meta description if `description` is missing. `description` is still required. The build does not fail when `summary` is absent, but adding one is recommended for every new published article and weekly review.

## IndexNow

After a successful deploy of `main`, the workflow submits changed page URLs to [IndexNow](https://www.indexnow.org/) so search engines can pick them up quickly. The public key file is `public/<32-hex>.txt` (served at `https://mnafshin.info/<key>.txt`). A failed notify is logged and does not fail the deploy.

To resubmit every URL in the sitemap, run the **Deploy to GitHub Pages** workflow with “Submit every sitemap URL to IndexNow” enabled, or locally:

```sh
node scripts/indexnow.mjs --all
```

