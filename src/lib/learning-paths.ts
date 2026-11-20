import { type ArticleSectionId } from './articles';
import { getCurriculum } from './curriculum';
import { getAllPublishedPosts } from './posts';
import { getSection, withBase } from './site';
import { getPublishedVideos, videoPath } from './videos';

/** Learning paths called out in the footer and on the 404 page, in this order. */
export const LEARNING_PATH_IDS: ArticleSectionId[] = [
  'spring',
  'terms',
  'security',
  'db',
  'k8s',
  'system-design',
];

export type LearningPathSummary = {
  id: ArticleSectionId;
  name: string;
  path: string;
  href: string;
  rssHref: string;
  count: number;
  comingSoon: boolean;
};

export async function getLearningPathSummaries(): Promise<LearningPathSummary[]> {
  return Promise.all(
    LEARNING_PATH_IDS.map(async (id) => {
      const section = getSection(id);
      const count = (await getCurriculum(id)).length;
      return {
        id,
        name: section.name,
        path: section.path,
        href: withBase(`${section.path}/`),
        rssHref: withBase(`${section.path}/rss.xml`),
        count,
        comingSoon: count === 0,
      };
    }),
  );
}

export type PublishedPage = {
  url: string;
  title: string;
  slug: string;
  section: string;
};

/** All published article and weekly-review URLs, for typo suggestions on the 404 page. */
export async function getPublishedPageIndex(): Promise<PublishedPage[]> {
  const [posts, videos] = await Promise.all([getAllPublishedPosts(), getPublishedVideos()]);
  const pages = new Map<string, PublishedPage>();

  for (const post of posts) {
    const url = withBase(`${post.section.path}/${post.entry.id}/`);
    pages.set(url, {
      url,
      title: post.entry.data.title,
      slug: post.entry.id,
      section: post.section.name,
    });
  }

  for (const video of videos) {
    const url = withBase(videoPath(video.id));
    if (pages.has(url)) continue;
    pages.set(url, {
      url,
      title: video.data.title,
      slug: video.id,
      section: 'SpringUniverse',
    });
  }

  return [...pages.values()];
}
