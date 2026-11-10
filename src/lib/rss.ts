import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPublishedPosts, getPublishedEntries, postPath } from './posts';
import { getSection, SITE_DESCRIPTION, SITE_TITLE, type SectionId, withBase } from './site';

function siteWithBase(context: APIContext) {
  return new URL(import.meta.env.BASE_URL, context.site);
}

export async function sectionRss(context: APIContext, sectionId: SectionId) {
  const section = getSection(sectionId);
  const entries = await getPublishedEntries(sectionId);
  return rss({
    title: `${section.name} — ${SITE_TITLE}`,
    description: section.tagline,
    site: new URL(`${section.path}/`, siteWithBase(context)),
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: withBase(postPath(sectionId, entry.id)),
    })),
  });
}

export async function combinedRss(context: APIContext) {
  const posts = await getAllPublishedPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: siteWithBase(context),
    items: posts.map(({ section, entry }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      categories: [section.name],
      link: withBase(postPath(section.id, entry.id)),
    })),
  });
}
