import { getCollection, type CollectionEntry } from 'astro:content';

export type SpringArticle = CollectionEntry<'spring'>;
export type RelatedVideo = SpringArticle['data']['relatedVideos'][number];

/**
 * Learning order of the concept articles on /spring/. Articles that are not
 * listed here follow, newest first.
 */
export const CONCEPT_ORDER = [
  'how-a-java-web-app-works',
  'spring-boot-4-from-zero',
  'starters-and-the-bom',
  'dependency-injection-and-the-container',
  'configuration-properties-profiles-and-spel',
  'bean-lifecycle',
  'how-spring-proxies-work',
  'circular-dependencies',
  'auto-configuration',
  'rest-apis-crud-errors-and-versioning',
] as const;

function rank(id: string) {
  const index = (CONCEPT_ORDER as readonly string[]).indexOf(id);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

/** Published concept articles, in learning order. */
export async function getConceptArticles(): Promise<SpringArticle[]> {
  const entries = await getCollection('spring', ({ data }) => data.draft !== true);
  return entries.sort((a, b) => {
    const byRank = rank(a.id) - rank(b.id);
    if (byRank !== 0) return byRank;
    return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  });
}

/** A related video is shown only when it is neither a draft nor unpublished. */
export function isPublicVideo(video: RelatedVideo) {
  return video.draft !== true && video.published !== false;
}

export function publicRelatedVideos(article: SpringArticle) {
  return article.data.relatedVideos.filter(isPublicVideo);
}

export function articleCodeLinks(article: SpringArticle): string[] {
  const urls = [...article.data.codeUrls];
  if (article.data.codeUrl && !urls.includes(article.data.codeUrl)) {
    urls.unshift(article.data.codeUrl);
  }
  return urls;
}
