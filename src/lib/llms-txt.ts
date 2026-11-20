import { getCurriculum } from './curriculum';
import type { ArticleSectionId } from './articles';
import { contentFile, displayUpdatedDate } from './content-meta';
import { loadGlossaryHub } from './glossary';
import { formatMarkdownDocument, markdownPath } from './markdown-pages';
import { llmBlurb } from './structured-data';
import { getWeeklyArticles } from './articles';
import { getPublishedEntries } from './posts';
import { getSection, SITE_DESCRIPTION, SITE_TITLE, withBase } from './site';
import { getPublishedVideos } from './videos';

const CURRICULUM_SECTIONS: ArticleSectionId[] = [
  'spring',
  'terms',
  'k8s',
  'system-design',
  'security',
  'db',
];

export type MarkdownPage = {
  key: string;
  body: string;
};

function resolveSite(site: URL | undefined) {
  if (site) return site;
  const fromEnv = import.meta.env.SITE;
  return new URL(typeof fromEnv === 'string' && fromEnv ? fromEnv : 'https://mnafshin.info');
}

function siteUrl(site: URL | undefined, path: string) {
  return new URL(path.replace(/^\//, ''), resolveSite(site)).toString();
}

function articleMarkdown(options: {
  site: URL | undefined;
  sectionPath: string;
  id: string;
  collection: string;
  title: string;
  pubDate: Date;
  updatedDate?: Date;
  body: string;
}): MarkdownPage {
  const sourceFile = contentFile(options.collection, options.id);
  const updated = displayUpdatedDate(options.pubDate, options.updatedDate, sourceFile);
  const canonical = siteUrl(options.site, withBase(`${options.sectionPath}/${options.id}/`));
  return {
    key: markdownPath(options.sectionPath, options.id),
    body: formatMarkdownDocument({
      title: options.title,
      canonical,
      date: options.pubDate,
      updated,
      body: options.body,
    }),
  };
}

/** Every published article and weekly review as a clean Markdown document. */
export async function allMarkdownPages(site: URL | undefined): Promise<MarkdownPage[]> {
  const pages: MarkdownPage[] = [];

  for (const id of CURRICULUM_SECTIONS) {
    const section = getSection(id);
    const concepts = await getCurriculum(id);
    const weeklies = await getWeeklyArticles(id);
    for (const article of [...concepts, ...weeklies]) {
      pages.push(
        articleMarkdown({
          site,
          sectionPath: section.path,
          id: article.id,
          collection: id,
          title: article.data.title,
          pubDate: article.data.pubDate,
          updatedDate: article.data.updatedDate,
          body: article.body ?? '',
        }),
      );
    }
  }

  for (const post of await getPublishedEntries('ai')) {
    pages.push(
      articleMarkdown({
        site,
        sectionPath: 'ai',
        id: post.id,
        collection: 'ai',
        title: post.data.title,
        pubDate: post.data.pubDate,
        updatedDate: post.data.updatedDate,
        body: post.body ?? '',
      }),
    );
  }

  for (const video of await getPublishedVideos()) {
    pages.push(
      articleMarkdown({
        site,
        sectionPath: 'spring',
        id: video.id,
        collection: 'videos',
        title: video.data.title,
        pubDate: video.data.pubDate,
        body: video.body ?? '',
      }),
    );
  }

  return pages;
}

function bullet(title: string, href: string, blurb: string) {
  const rest = blurb ? `: ${blurb}` : '';
  return `- [${title}](${href})${rest}`;
}

export async function buildLlmsTxt(site: URL | undefined): Promise<string> {
  const lines: string[] = [
    `# ${SITE_TITLE}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `Written learning paths on ${siteUrl(site, withBase())}, with a clean Markdown copy of every published article. A single file with the full text is at ${siteUrl(site, withBase('llms-full.txt'))}.`,
    '',
  ];

  for (const id of CURRICULUM_SECTIONS) {
    const section = getSection(id);
    const concepts = await getCurriculum(id);
    const weeklies = await getWeeklyArticles(id);
    const videos = id === 'spring' ? await getPublishedVideos() : [];
    if (concepts.length === 0 && weeklies.length === 0 && videos.length === 0) continue;

    lines.push(`## ${section.name}`, '');
    if (section.youtube) {
      lines.push(`YouTube: ${section.youtube}`, '');
    }
    if (concepts.length > 0) {
      lines.push('Articles, in learning order:', '');
      for (const article of concepts) {
        const href = siteUrl(site, withBase(markdownPath(section.path, article.id)));
        lines.push(bullet(article.data.title, href, llmBlurb(article.data)));
      }
      lines.push('');
    }
    const weeklyItems = [
      ...weeklies.map((article) => ({
        title: article.data.title,
        id: article.id,
        blurb: llmBlurb(article.data),
        date: article.data.pubDate,
      })),
      ...videos.map((video) => ({
        title: video.data.title,
        id: video.id,
        blurb: llmBlurb(video.data),
        date: video.data.pubDate,
      })),
    ].sort((a, b) => b.date.valueOf() - a.date.valueOf());
    if (weeklyItems.length > 0) {
      lines.push('Weekly reviews:', '');
      for (const item of weeklyItems) {
        const href = siteUrl(site, withBase(markdownPath(section.path, item.id)));
        lines.push(bullet(item.title, href, item.blurb));
      }
      lines.push('');
    }
    lines.push(
      `Glossary: [${section.name} glossary](${siteUrl(site, withBase(`${section.path}/glossary/`))})`,
      '',
    );
  }

  const aiPosts = await getPublishedEntries('ai');
  if (aiPosts.length > 0) {
    const section = getSection('ai');
    lines.push(`## ${section.name}`, '', 'Articles:', '');
    for (const post of aiPosts) {
      const href = siteUrl(site, withBase(markdownPath(section.path, post.id)));
      lines.push(bullet(post.data.title, href, llmBlurb(post.data)));
    }
    lines.push(
      '',
      `Glossary: [${section.name} glossary](${siteUrl(site, withBase(`${section.path}/glossary/`))})`,
      '',
    );
  }

  const hub = loadGlossaryHub(withBase());
  lines.push('## Glossaries', '');
  lines.push(`- [All glossaries](${siteUrl(site, withBase('glossary/'))})`);
  for (const item of hub) {
    const label = item.count === 1 ? '1 term' : `${item.count} terms`;
    lines.push(`- [${item.name} glossary](${siteUrl(site, item.href)}): ${label}`);
  }
  lines.push('');
  return `${lines.join('\n').replace(/[ \t]+\n/g, '\n')}\n`;
}

export async function buildLlmsFullTxt(site: URL | undefined): Promise<string> {
  const parts: string[] = [
    `# ${SITE_TITLE} — full article text`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `Each article below is the published Markdown, without the site chrome. Canonical URLs point at the HTML pages. A shorter index is at ${siteUrl(site, withBase('llms.txt'))}.`,
    '',
  ];

  const groups: { heading: string; pages: MarkdownPage[] }[] = [];

  for (const id of CURRICULUM_SECTIONS) {
    const section = getSection(id);
    const concepts = await getCurriculum(id);
    const weeklies = await getWeeklyArticles(id);
    const videos = id === 'spring' ? await getPublishedVideos() : [];
    const pages: MarkdownPage[] = [];
    for (const article of [...concepts, ...weeklies]) {
      pages.push(
        articleMarkdown({
          site,
          sectionPath: section.path,
          id: article.id,
          collection: id,
          title: article.data.title,
          pubDate: article.data.pubDate,
          updatedDate: article.data.updatedDate,
          body: article.body ?? '',
        }),
      );
    }
    for (const video of videos) {
      pages.push(
        articleMarkdown({
          site,
          sectionPath: section.path,
          id: video.id,
          collection: 'videos',
          title: video.data.title,
          pubDate: video.data.pubDate,
          body: video.body ?? '',
        }),
      );
    }
    if (pages.length > 0) groups.push({ heading: section.name, pages });
  }

  const aiPosts = await getPublishedEntries('ai');
  if (aiPosts.length > 0) {
    const section = getSection('ai');
    groups.push({
      heading: section.name,
      pages: aiPosts.map((post) =>
        articleMarkdown({
          site,
          sectionPath: section.path,
          id: post.id,
          collection: 'ai',
          title: post.data.title,
          pubDate: post.data.pubDate,
          updatedDate: post.data.updatedDate,
          body: post.body ?? '',
        }),
      ),
    });
  }

  for (const group of groups) {
    parts.push(`## ${group.heading}`, '');
    for (const page of group.pages) {
      parts.push(page.body.trim(), '', '---', '');
    }
  }

  return `${parts.join('\n').replace(/\n---\n\n$/, '\n')}\n`;
}

