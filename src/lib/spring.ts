import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles } from './articles';

export {
  articleCodeLinks,
  isPublicVideo,
  publicRelatedShorts,
  publicRelatedVideos,
  type RelatedVideo,
} from './articles';

export type SpringArticle = CollectionEntry<'spring'>;

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

/** Published concept articles, in learning order. */
export async function getConceptArticles(): Promise<SpringArticle[]> {
  return (await getSectionConceptArticles('spring', CONCEPT_ORDER)) as SpringArticle[];
}
