import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';
import type { CurriculumTopic } from './curriculum-topics';

export type DbArticle = CollectionEntry<'db'>;

/**
 * Learning order of the Database section, taken from the channel
 * curriculum on the box (/home/box/channels/database/docs/CURRICULUM.md):
 * 22 topics in four seasons. There is no GitHub repo yet. No articles
 * are published yet.
 */
export const DB_CURRICULUM: readonly CurriculumTopic[] = [
  { id: '1', group: 'Season 1: Foundations', title: 'The relational model and the SQL a backend developer actually writes (joins, aggregates, subqueries)', label: '1' },
  { id: '2', group: 'Season 1: Foundations', title: 'Keys, constraints and normalization', label: '2' },
  { id: '3', group: 'Season 1: Foundations', title: "Indexes: B-tree, composite, covering, and why an index isn't used", label: '3' },
  { id: '4', group: 'Season 1: Foundations', title: 'Reading query plans with EXPLAIN', label: '4' },
  { id: '5', group: 'Season 2: Correctness under concurrency', title: 'Transactions and ACID', label: '5' },
  { id: '6', group: 'Season 2: Correctness under concurrency', title: 'Isolation levels and anomalies', label: '6' },
  { id: '7', group: 'Season 2: Correctness under concurrency', title: 'Locking: optimistic (version column, 412 on mismatch) vs pessimistic, deadlocks, preventing oversell', label: '7' },
  { id: '8', group: 'Season 2: Correctness under concurrency', title: 'Choosing a concurrency strategy per use case (optimistic, pessimistic, distributed lock)', label: '8' },
  { id: '9', group: 'Season 3: The application beside the database', title: 'ORM concepts: persistence context, dirty checking, lazy vs eager, N+1, batching (concept level; Hibernate/JPA lives on SpringUniverse)', label: '9' },
  { id: '10', group: 'Season 3: The application beside the database', title: 'Connection pools', label: '10' },
  { id: '11', group: 'Season 3: The application beside the database', title: 'Versioned schema migrations (Flyway) and zero-downtime changes', label: '11' },
  { id: '12', group: 'Season 3: The application beside the database', title: 'Pagination: offset vs cursor/keyset, whitelisted sorting, sparse fields', label: '12' },
  { id: '13', group: 'Season 3: The application beside the database', title: 'Soft delete', label: '13' },
  { id: '14', group: 'Season 3: The application beside the database', title: 'Multi-tenant data: tenant_id on every query, no unscoped reads, why cross-tenant reads return 404', label: '14' },
  { id: '15', group: 'Season 3: The application beside the database', title: 'PostgreSQL row-level security as defence-in-depth', label: '15' },
  { id: '16', group: 'Season 3: The application beside the database', title: 'Tenant backfill: adding tenant_id to existing data safely', label: '16' },
  { id: '17', group: 'Season 3: The application beside the database', title: 'Outbox table mechanics (the pattern lives on System Design)', label: '17' },
  { id: '18', group: 'Season 3: The application beside the database', title: 'Integration testing against a real database (Testcontainers)', label: '18' },
  { id: '19', group: 'Season 4: Scale', title: 'Logical replication as the basis for change data capture (CDC as a pattern lives on System Design)', label: '19' },
  { id: '20', group: 'Season 4: Scale', title: 'Redis as cache and coordination store; caching and consistency', label: '20' },
  { id: '21', group: 'Season 4: Scale', title: 'Replication, read replicas, partitioning and sharding basics', label: '21' },
  { id: '22', group: 'Season 4: Scale', title: 'NoSQL families and when to choose them', label: '22' },
];

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
