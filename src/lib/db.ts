import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';
import type { CurriculumTopic } from './curriculum-topics';

export type DbArticle = CollectionEntry<'db'>;

/**
 * Learning order of the Database section. No channel curriculum file was
 * found on the box or in a GitHub repo, so this list is empty until one
 * exists. Do not invent topics here.
 */
export const DB_CURRICULUM: readonly CurriculumTopic[] = [];

/**
 * Learning order of published concept articles on /db/.
 * Entries are added when the matching article is written.
 */
export const DB_CONCEPT_ORDER = [] as const;

/** Published Database concept articles, in learning order. */
export async function getDbConceptArticles(): Promise<DbArticle[]> {
  return (await getSectionConceptArticles('db', DB_CONCEPT_ORDER)) as DbArticle[];
}

/** Published Database weekly reviews, newest first. */
export async function getDbWeeklies(): Promise<DbArticle[]> {
  return (await getWeeklyArticles('db')) as DbArticle[];
}
