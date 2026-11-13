import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';

export type K8sArticle = CollectionEntry<'k8s'>;

/**
 * Learning order of the KubePlained concept articles on /k8s/, taken from
 * the channel curriculum (Basics K01–K17, then Platform K18–K25). Articles
 * that are not listed here follow, newest first. Entries are added when
 * the matching article is written.
 */
export const K8S_CONCEPT_ORDER = [] as const;

/** Published KubePlained concept articles, in learning order. */
export async function getK8sConceptArticles(): Promise<K8sArticle[]> {
  return (await getSectionConceptArticles('k8s', K8S_CONCEPT_ORDER)) as K8sArticle[];
}

/** Published KubePlained weekly reviews, newest first. */
export async function getK8sWeeklies(): Promise<K8sArticle[]> {
  return (await getWeeklyArticles('k8s')) as K8sArticle[];
}
