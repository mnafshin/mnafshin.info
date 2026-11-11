import { getCollection, type CollectionEntry } from 'astro:content';

/** Sections whose posts are concept articles with videos beside the text. */
export type ArticleSectionId = 'spring' | 'terms';
export type Article = CollectionEntry<ArticleSectionId>;
export type RelatedVideo = Article['data']['relatedVideos'][number];
export type RelatedShort = Article['data']['relatedShorts'][number];

function rank(order: readonly string[], id: string) {
  const index = order.indexOf(id);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/**
 * Published concept articles of a section, in the given learning order.
 * Articles that are not listed follow, newest first. Weekly reviews are
 * excluded; see getWeeklyArticles.
 */
export async function getSectionConceptArticles(
  section: ArticleSectionId,
  order: readonly string[],
): Promise<Article[]> {
  const entries = (await getCollection(
    section,
    ({ data }) => data.draft !== true && data.kind !== 'weekly',
  )) as Article[];
  return entries.sort((a, b) => {
    const byRank = rank(order, a.id) - rank(order, b.id);
    if (byRank !== 0) return byRank;
    return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  });
}

/** Published written weekly reviews of a section, newest first. */
export async function getWeeklyArticles(section: ArticleSectionId): Promise<Article[]> {
  const entries = (await getCollection(
    section,
    ({ data }) => data.draft !== true && data.kind === 'weekly',
  )) as Article[];
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** A related video or Short is shown only when it is neither a draft nor unpublished. */
export function isPublicVideo(video: RelatedVideo | RelatedShort) {
  return video.draft !== true && video.published !== false;
}

export function publicRelatedVideos(article: Article) {
  return article.data.relatedVideos.filter(isPublicVideo);
}

export function publicRelatedShorts(article: Article) {
  return article.data.relatedShorts.filter(isPublicVideo);
}

export function articleCodeLinks(article: Article): string[] {
  const urls = [...article.data.codeUrls];
  if (article.data.codeUrl && !urls.includes(article.data.codeUrl)) {
    urls.unshift(article.data.codeUrl);
  }
  return urls;
}
