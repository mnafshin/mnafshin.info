/** Everyday words we must not auto-mark in article prose. */
export const SKIP_MARKING = [
  'image',
  'images',
  'profile',
  'profiles',
  'event',
  'events',
  'log',
  'logs',
  'queue',
  'queues',
  'join',
  'joins',
  'constraint',
  'constraints',
  'container',
  'containers',
  'starter',
  'starters',
];

/**
 * Safer phrases that still mark a skipped everyday term.
 * Keys are `{sectionId}:{term}` as in `src/data/glossaries.ts`.
 */
export const GLOSSARY_ALIASES: Record<string, string[]> = {
  'spring:Profile': ['Spring profile', 'Spring profiles', '@Profile'],
  'spring:Starter': ['Spring Boot starter', 'Boot starter'],
  'db:Join': ['SQL join', 'inner join', 'left join', 'INNER JOIN', 'LEFT JOIN'],
  'db:Constraint': ['database constraint', 'foreign key constraint'],
  'k8s:Container': ['Linux container', 'application container'],
  'k8s:Image': ['container image', 'container images'],
  'system-design:Event': ['domain event', 'domain events'],
  'system-design:Queue': ['message queue', 'work queue'],
  'system-design:Log': ['append-only log', 'event log'],
};

export function isSkippedPhrase(phrase: string) {
  return SKIP_MARKING.includes(phrase.trim().toLowerCase());
}

/** Acronyms and camelCase / @annotations must keep their written form. */
export function isCaseSensitivePhrase(phrase: string) {
  if (/^[@A-Z0-9][A-Z0-9_+-]*$/.test(phrase) && phrase.length <= 6) return true;
  if (/[a-z][A-Z]|@[A-Za-z]/.test(phrase)) return true;
  return false;
}

export function phrasesMatch(phrase: string, text: string) {
  if (isCaseSensitivePhrase(phrase)) return phrase === text;
  return phrase.toLowerCase() === text.toLowerCase();
}
