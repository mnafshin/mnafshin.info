import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';

export type SystemDesignArticle = CollectionEntry<'system-design'>;

/** One planned curriculum topic. Folders and articles are added later. */
export type SystemDesignTopic = {
  id: string;
  title: string;
  part: 'A' | 'B' | 'C';
  partTitle: string;
};

/**
 * Learning order of the System Design section, taken from the channel
 * curriculum (docs/CURRICULUM.md in mnafshin/system-design-channel).
 * Part A is communication and events, part B is data integration and
 * reliability, part C is platform governance. No articles are published yet.
 */
export const SYSTEM_DESIGN_CURRICULUM: readonly SystemDesignTopic[] = [
  { id: 'SD01', part: 'A', partTitle: 'Communication and events', title: 'Sync vs async; when events beat calls' },
  { id: 'SD02', part: 'A', partTitle: 'Communication and events', title: 'Protocol selection: REST vs gRPC for internal calls, protobuf conventions, gRPC-JSON transcoding at the edge, event bridge' },
  { id: 'SD03', part: 'A', partTitle: 'Communication and events', title: 'Queues vs logs: SNS/SQS vs Kafka' },
  { id: 'SD04', part: 'A', partTitle: 'Communication and events', title: 'Publishing after commit and the dual-write problem' },
  { id: 'SD05', part: 'A', partTitle: 'Communication and events', title: 'Transactional outbox and relay' },
  { id: 'SD06', part: 'A', partTitle: 'Communication and events', title: 'Delivery guarantees: at-least-once, ordering, partitions' },
  { id: 'SD07', part: 'A', partTitle: 'Communication and events', title: 'Idempotency end to end: Idempotency-Key APIs and idempotent consumers' },
  { id: 'SD08', part: 'A', partTitle: 'Communication and events', title: 'Retries, DLQ and replay' },
  { id: 'SD09', part: 'A', partTitle: 'Communication and events', title: 'Event schemas: Avro, schema registry, compatibility modes (BACKWARD default), safe evolution, contract tests' },
  { id: 'SD10', part: 'A', partTitle: 'Communication and events', title: 'Sagas and long-running workflows' },
  { id: 'SD11', part: 'B', partTitle: 'Data integration and reliability', title: 'Change data capture (Debezium/Kafka Connect), bulk migration and backfill, acquisitions/ETL as architecture; eventual consistency trade-offs' },
  { id: 'SD12', part: 'B', partTitle: 'Data integration and reliability', title: 'Concurrency control across services: optimistic vs distributed locks' },
  { id: 'SD13', part: 'B', partTitle: 'Data integration and reliability', title: 'Resilience: timeouts, retries, circuit breakers, bulkheads, rate limits' },
  { id: 'SD14', part: 'B', partTitle: 'Data integration and reliability', title: 'Read models and CQRS (e.g. search index as the read side)' },
  { id: 'SD15', part: 'B', partTitle: 'Data integration and reliability', title: 'The four IDs (tenant, trace, correlation, request) and distributed tracing as a design concern' },
  { id: 'SD16', part: 'B', partTitle: 'Data integration and reliability', title: 'Observability migration with a collector and dual-write cutover' },
  { id: 'SD17', part: 'C', partTitle: 'Platform governance', title: 'NFRs, SLOs and error budgets' },
  { id: 'SD18', part: 'C', partTitle: 'Platform governance', title: 'ADRs and RFCs across teams' },
  { id: 'SD19', part: 'C', partTitle: 'Platform governance', title: 'Platform vs product boundaries; what to centralize; avoiding the blocking platform team' },
  { id: 'SD20', part: 'C', partTitle: 'Platform governance', title: 'Paved road vs escape hatch' },
  { id: 'SD21', part: 'C', partTitle: 'Platform governance', title: 'Developer portal and service catalog: Backstage, scaffolding templates, catalog-first, unique service names' },
  { id: 'SD22', part: 'C', partTitle: 'Platform governance', title: 'Shared libraries and BOMs: versioning, backward-compatibility support windows, version lifecycle, deprecation, upgrade paths, fleet-wide migration' },
  { id: 'SD23', part: 'C', partTitle: 'Platform governance', title: 'Rollout strategy for 40+ teams: waves, opt-in, success metrics' },
  { id: 'SD24', part: 'C', partTitle: 'Platform governance', title: 'Polyglot platforms: one convention across JVM, Node and Python' },
  { id: 'SD25', part: 'C', partTitle: 'Platform governance', title: 'Risk registers and choosing what NOT to build' },
  { id: 'SD26', part: 'C', partTitle: 'Platform governance', title: 'Connecting platform strategy to business outcomes' },
] as const;

/**
 * Learning order of published concept articles on /system-design/.
 * Entries are added when the matching article is written. Empty for now.
 */
export const SYSTEM_DESIGN_CONCEPT_ORDER = [] as const;

/** Published System Design concept articles, in learning order. */
export async function getSystemDesignConceptArticles(): Promise<SystemDesignArticle[]> {
  return (await getSectionConceptArticles(
    'system-design',
    SYSTEM_DESIGN_CONCEPT_ORDER,
  )) as SystemDesignArticle[];
}

/** Published System Design weekly reviews, newest first. */
export async function getSystemDesignWeeklies(): Promise<SystemDesignArticle[]> {
  return (await getWeeklyArticles('system-design')) as SystemDesignArticle[];
}
