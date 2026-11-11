import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPublishedPosts, getPublishedEntries, postPath } from './posts';
import { getSection, SITE_DESCRIPTION, SITE_TITLE, type SectionId, withBase } from './site';
import { getPublishedVideosByDate, videoPath } from './videos';

function siteWithBase(context: APIContext) {
  return new URL(import.meta.env.BASE_URL, context.site);
}

type FeedItem = {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
  categories?: string[];
};

export async function sectionRss(context: APIContext, sectionId: SectionId) {
  const section = getSection(sectionId);
  const entries = await getPublishedEntries(sectionId);
  const items: FeedItem[] = entries.map((entry) => ({
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    link: withBase(postPath(sectionId, entry.id)),
  }));

  // SpringUniverse: concept articles (above) plus the weekly review pages.
  // Long tutorials have no page of their own; they sit on the articles.
  if (sectionId === 'spring') {
    const videos = await getPublishedVideosByDate();
    items.push(
      ...videos.map((video) => ({
        title: video.data.title,
        description: video.data.description,
        pubDate: video.data.pubDate,
        link: withBase(videoPath(video.id)),
        categories: ['Weekly review', 'Video'],
      })),
    );
    items.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  }

  return rss({
    title: `${section.name} — ${SITE_TITLE}`,
    description: section.tagline,
    site: new URL(`${section.path}/`, siteWithBase(context)),
    items,
  });
}

export async function combinedRss(context: APIContext) {
  const posts = await getAllPublishedPosts();
  const videos = await getPublishedVideosByDate();
  const items: FeedItem[] = [
    ...posts.map(({ section, entry }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      categories: [section.name],
      link: withBase(postPath(section.id, entry.id)),
    })),
    ...videos.map((video) => ({
      title: video.data.title,
      description: video.data.description,
      pubDate: video.data.pubDate,
      categories: ['SpringUniverse', 'Weekly review', 'Video'],
      link: withBase(videoPath(video.id)),
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: siteWithBase(context),
    items,
  });
}
