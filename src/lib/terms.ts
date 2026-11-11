import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';

export type TermsArticle = CollectionEntry<'terms'>;

/**
 * Learning order of the Termsplained concept articles on /terms/, taken from
 * the channel curriculum (AI basics first, then models, prompting, retrieval,
 * agents and tools, and working with AI). Articles that are not listed here
 * follow, newest first.
 */
export const TERMS_CONCEPT_ORDER = [
  'what-is-an-llm',
  'ai-vs-ml-vs-dl-vs-genai',
  'what-parameters-mean',
  'what-is-a-token',
  'what-is-a-context-window',
  'what-is-an-ai-hallucination',
  'what-is-temperature',
  'what-is-a-system-prompt',
  'fine-tuning-vs-rag-vs-prompting',
  'mixture-of-experts',
  'what-is-rag',
  'grounding-and-citations',
  'agent-vs-agentic-vs-chatbot',
  'what-is-an-ai-copilot',
  'what-is-mcp',
  'what-is-ai-slop',
  'what-is-ai-governance',
] as const;

/** Published Termsplained concept articles, in learning order. */
export async function getTermsConceptArticles(): Promise<TermsArticle[]> {
  return (await getSectionConceptArticles('terms', TERMS_CONCEPT_ORDER)) as TermsArticle[];
}

/** Published Termsplained weekly reviews, newest first. */
export async function getTermsWeeklies(): Promise<TermsArticle[]> {
  return (await getWeeklyArticles('terms')) as TermsArticle[];
}
