import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';
import type { CurriculumTopic } from './curriculum-topics';

export type SecurityArticle = CollectionEntry<'security'>;

/**
 * Learning order of the SecurityPlained section, taken from the first wave
 * of the channel curriculum (docs/CURRICULUM.md in mnafshin/security-channel,
 * Chapters 1–6). Later chapters have no individual lesson IDs yet and are
 * not listed. No articles are published yet.
 */
export const SECURITY_CURRICULUM: readonly CurriculumTopic[] = [
  { id: 'S1.1', group: 'Chapter 1 · Foundations', title: 'What "secure software" means' },
  { id: 'S1.2', group: 'Chapter 1 · Foundations', title: 'Secure by design and the development lifecycle' },
  { id: 'S1.3', group: 'Chapter 1 · Foundations', title: 'Threat modeling in 30 minutes' },
  { id: 'S1.4', group: 'Chapter 1 · Foundations', title: 'Trust boundaries: validate on the way in, encode on the way out' },
  { id: 'S2.1', group: 'Chapter 2 · Server-side classes of bugs', title: 'SQL injection and parameterized queries' },
  { id: 'S2.2', group: 'Chapter 2 · Server-side classes of bugs', title: 'Command and other injection' },
  { id: 'S2.3', group: 'Chapter 2 · Server-side classes of bugs', title: 'Authentication: passwords, hashing, MFA and passkeys' },
  { id: 'S2.4', group: 'Chapter 2 · Server-side classes of bugs', title: 'Sessions, cookies and tokens' },
  { id: 'S2.5', group: 'Chapter 2 · Server-side classes of bugs', title: 'Authorization: deny by default' },
  { id: 'S2.6', group: 'Chapter 2 · Server-side classes of bugs', title: 'Object-level access (IDOR / BOLA) and mass assignment' },
  { id: 'S2.7', group: 'Chapter 2 · Server-side classes of bugs', title: 'File uploads and path traversal' },
  { id: 'S3.1', group: 'Chapter 3 · OAuth and OpenID Connect', title: 'What OAuth 2 and OpenID Connect are' },
  { id: 'S3.2', group: 'Chapter 3 · OAuth and OpenID Connect', title: 'OAuth security pitfalls' },
  { id: 'S4.1', group: 'Chapter 4 · The browser security model', title: 'Same-origin policy, CORS and CSRF' },
  { id: 'S4.2', group: 'Chapter 4 · The browser security model', title: 'Cross-site scripting and output encoding' },
  { id: 'S4.3', group: 'Chapter 4 · The browser security model', title: 'CSP, security headers and SRI' },
  { id: 'S5.1', group: 'Chapter 5 · Secrets, errors and observability', title: 'SSRF: when your server fetches URLs' },
  { id: 'S5.2', group: 'Chapter 5 · Secrets, errors and observability', title: 'Secrets and cryptography basics' },
  { id: 'S5.3', group: 'Chapter 5 · Secrets, errors and observability', title: 'Errors and secure defaults' },
  { id: 'S5.4', group: 'Chapter 5 · Secrets, errors and observability', title: 'Logging, alerting and rate limits' },
  { id: 'S5.5', group: 'Chapter 5 · Secrets, errors and observability', title: 'Re-threat-model the app and check it against ASVS (optional capstone)' },
  { id: 'S6.1', group: 'Chapter 6 · Containers, images and pods', title: "What's in an image" },
  { id: 'S6.2', group: 'Chapter 6 · Containers, images and pods', title: 'Running a container safely' },
  { id: 'S6.3', group: 'Chapter 6 · Containers, images and pods', title: 'Pod security basics' },
];

/**
 * Learning order of published concept articles on /security/.
 * Entries are added when the matching article is written.
 */
export const SECURITY_CONCEPT_ORDER = [] as const;

/** Published SecurityPlained concept articles, in learning order. */
export async function getSecurityConceptArticles(): Promise<SecurityArticle[]> {
  return (await getSectionConceptArticles(
    'security',
    SECURITY_CONCEPT_ORDER,
  )) as SecurityArticle[];
}

/** Published SecurityPlained weekly reviews, newest first. */
export async function getSecurityWeeklies(): Promise<SecurityArticle[]> {
  return (await getWeeklyArticles('security')) as SecurityArticle[];
}
