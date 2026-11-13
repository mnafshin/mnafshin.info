import type { CollectionEntry } from 'astro:content';
import { getSectionConceptArticles, getWeeklyArticles } from './articles';
import type { CurriculumTopic } from './curriculum-topics';

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

/**
 * Full Termsplained curriculum (docs/CURRICULUM.md in mnafshin/termsplained),
 * in learning order, grouped by chapter. Weekly reviews are not in this list.
 * `articleId` is set only for lessons that already have a published article.
 */
export const TERMS_CURRICULUM: readonly CurriculumTopic[] = [
  { id: 'what-is-an-llm', group: 'Chapter 1 · AI Basics', title: 'What is an LLM?', label: '1', articleId: 'what-is-an-llm' },
  { id: 'ai-vs-ml-vs-dl-vs-genai', group: 'Chapter 1 · AI Basics', title: 'AI vs machine learning vs deep learning vs generative AI', label: '2', articleId: 'ai-vs-ml-vs-dl-vs-genai' },
  { id: 'terms-c1-3', group: 'Chapter 1 · AI Basics', title: 'How AI learns from data: supervised, unsupervised, reinforcement', label: '3' },
  { id: 'terms-c1-4', group: 'Chapter 1 · AI Basics', title: 'Neural network', label: '4' },
  { id: 'terms-c1-5', group: 'Chapter 1 · AI Basics', title: 'Training vs inference', label: '5' },
  { id: 'what-parameters-mean', group: 'Chapter 1 · AI Basics', title: 'Parameters: what 7B and 70B mean', label: '6', articleId: 'what-parameters-mean' },
  { id: 'terms-c1-7', group: 'Chapter 1 · AI Basics', title: 'How a chatbot is made: pretraining, instruction tuning, RLHF', label: '7' },
  { id: 'terms-c1-8', group: 'Chapter 1 · AI Basics', title: 'Transformer and attention (simple)', label: '8' },
  { id: 'terms-c1-9', group: 'Chapter 1 · AI Basics', title: 'Foundation model', label: '9' },
  { id: 'terms-c1-10', group: 'Chapter 1 · AI Basics', title: 'Generative vs predictive AI', label: '10' },
  { id: 'terms-c1-11', group: 'Chapter 1 · AI Basics', title: 'Multimodal AI', label: '11' },
  { id: 'terms-c1-12', group: 'Chapter 1 · AI Basics', title: 'Diffusion models (how image generators work)', label: '12' },
  { id: 'terms-c1-13', group: 'Chapter 1 · AI Basics', title: "AGI vs today's AI", label: '13' },
  { id: 'terms-c1-14', group: 'Chapter 1 · AI Basics', title: 'AI vs "Super Intelligence" (US naming)', label: '14' },
  { id: 'what-is-a-token', group: 'Chapter 2 · Inside LLMs', title: 'What is a token?', label: '1', articleId: 'what-is-a-token' },
  { id: 'what-is-a-context-window', group: 'Chapter 2 · Inside LLMs', title: 'Context window', label: '2', articleId: 'what-is-a-context-window' },
  { id: 'what-is-an-ai-hallucination', group: 'Chapter 2 · Inside LLMs', title: 'AI hallucination', label: '3', articleId: 'what-is-an-ai-hallucination' },
  { id: 'what-is-temperature', group: 'Chapter 2 · Inside LLMs', title: 'Temperature', label: '4', articleId: 'what-is-temperature' },
  { id: 'terms-c2-5', group: 'Chapter 2 · Inside LLMs', title: 'Prompting basics: zero-shot, few-shot, chain of thought', label: '5' },
  { id: 'what-is-a-system-prompt', group: 'Chapter 2 · Inside LLMs', title: 'Prompt vs system prompt', label: '6', articleId: 'what-is-a-system-prompt' },
  { id: 'fine-tuning-vs-rag-vs-prompting', group: 'Chapter 2 · Inside LLMs', title: 'Fine-tuning vs prompting vs RAG', label: '7', articleId: 'fine-tuning-vs-rag-vs-prompting' },
  { id: 'mixture-of-experts', group: 'Chapter 2 · Inside LLMs', title: 'Mixture of Experts', label: '8', articleId: 'mixture-of-experts' },
  { id: 'terms-c2-9', group: 'Chapter 2 · Inside LLMs', title: 'Reasoning models (LLM vs LRM)', label: '9' },
  { id: 'terms-c2-10', group: 'Chapter 2 · Inside LLMs', title: 'Knowledge cutoff', label: '10' },
  { id: 'terms-c2-11', group: 'Chapter 2 · Inside LLMs', title: 'SLM vs LLM', label: '11' },
  { id: 'terms-c2-12', group: 'Chapter 2 · Inside LLMs', title: 'Open weights vs open source', label: '12' },
  { id: 'terms-c2-13', group: 'Chapter 2 · Inside LLMs', title: 'Quantization', label: '13' },
  { id: 'terms-c2-14', group: 'Chapter 2 · Inside LLMs', title: 'Distillation', label: '14' },
  { id: 'terms-c2-15', group: 'Chapter 2 · Inside LLMs', title: 'Prompt caching', label: '15' },
  { id: 'terms-c2-16', group: 'Chapter 2 · Inside LLMs', title: 'Which AI model should you use? (size, price, open vs closed, benchmarks)', label: '16' },
  { id: 'what-is-rag', group: 'Chapter 3 · RAG & AI Search', title: 'What is RAG?', label: '1', articleId: 'what-is-rag' },
  { id: 'grounding-and-citations', group: 'Chapter 3 · RAG & AI Search', title: 'Grounding and citations', label: '2', articleId: 'grounding-and-citations' },
  { id: 'terms-c3-3', group: 'Chapter 3 · RAG & AI Search', title: 'Embeddings', label: '3' },
  { id: 'terms-c3-4', group: 'Chapter 3 · RAG & AI Search', title: 'Vector database', label: '4' },
  { id: 'terms-c3-5', group: 'Chapter 3 · RAG & AI Search', title: 'Chunking', label: '5' },
  { id: 'terms-c3-6', group: 'Chapter 3 · RAG & AI Search', title: 'Keyword vs semantic vs hybrid search', label: '6' },
  { id: 'terms-c3-7', group: 'Chapter 3 · RAG & AI Search', title: 'Reranker', label: '7' },
  { id: 'terms-c3-8', group: 'Chapter 3 · RAG & AI Search', title: 'Knowledge graph / GraphRAG', label: '8' },
  { id: 'terms-c3-9', group: 'Chapter 3 · RAG & AI Search', title: 'Agentic RAG', label: '9' },
  { id: 'terms-c3-10', group: 'Chapter 3 · RAG & AI Search', title: 'Multimodal RAG', label: '10' },
  { id: 'terms-c3-11', group: 'Chapter 3 · RAG & AI Search', title: 'llms.txt', label: '11' },
  { id: 'terms-c3-12', group: 'Chapter 3 · RAG & AI Search', title: 'Enterprise search vs chatbot', label: '12' },
  { id: 'agent-vs-agentic-vs-chatbot', group: 'Chapter 4 · AI Agents & Tools', title: 'AI agent vs agentic AI vs chatbot', label: '1', articleId: 'agent-vs-agentic-vs-chatbot' },
  { id: 'what-is-an-ai-copilot', group: 'Chapter 4 · AI Agents & Tools', title: 'AI copilot: the product vs the idea', label: '2', articleId: 'what-is-an-ai-copilot' },
  { id: 'terms-c4-3', group: 'Chapter 4 · AI Agents & Tools', title: 'Tool calling (function calling)', label: '3' },
  { id: 'what-is-mcp', group: 'Chapter 4 · AI Agents & Tools', title: 'What is MCP?', label: '4', articleId: 'what-is-mcp' },
  { id: 'terms-c4-5', group: 'Chapter 4 · AI Agents & Tools', title: 'Workflow vs agent', label: '5' },
  { id: 'terms-c4-6', group: 'Chapter 4 · AI Agents & Tools', title: 'Agent planning: the think-act-check loop', label: '6' },
  { id: 'terms-c4-7', group: 'Chapter 4 · AI Agents & Tools', title: 'Agent memory', label: '7' },
  { id: 'terms-c4-8', group: 'Chapter 4 · AI Agents & Tools', title: 'Context engineering vs prompt engineering', label: '8' },
  { id: 'terms-c4-9', group: 'Chapter 4 · AI Agents & Tools', title: 'Human-in-the-loop', label: '9' },
  { id: 'terms-c4-10', group: 'Chapter 4 · AI Agents & Tools', title: 'Multi-agent systems', label: '10' },
  { id: 'terms-c4-11', group: 'Chapter 4 · AI Agents & Tools', title: 'A2A (agent-to-agent protocols)', label: '11' },
  { id: 'terms-c4-12', group: 'Chapter 4 · AI Agents & Tools', title: 'Computer use / agentic browser', label: '12' },
  { id: 'terms-c4-13', group: 'Chapter 4 · AI Agents & Tools', title: 'Vibe coding', label: '13' },
  { id: 'terms-c4-14', group: 'Chapter 4 · AI Agents & Tools', title: 'AI automation (n8n/Zapier style)', label: '14' },
  { id: 'terms-c4-15', group: 'Chapter 4 · AI Agents & Tools', title: 'Agentic commerce', label: '15' },
  { id: 'what-is-ai-slop', group: 'Chapter 5 · AI Risk & Rules', title: 'What is AI slop?', label: '1', articleId: 'what-is-ai-slop' },
  { id: 'terms-c5-2', group: 'Chapter 5 · AI Risk & Rules', title: 'AI bias', label: '2' },
  { id: 'terms-c5-3', group: 'Chapter 5 · AI Risk & Rules', title: 'Prompt injection', label: '3' },
  { id: 'terms-c5-4', group: 'Chapter 5 · AI Risk & Rules', title: 'Guardrails', label: '4' },
  { id: 'terms-c5-5', group: 'Chapter 5 · AI Risk & Rules', title: 'Data leakage and PII', label: '5' },
  { id: 'terms-c5-6', group: 'Chapter 5 · AI Risk & Rules', title: 'Shadow AI', label: '6' },
  { id: 'what-is-ai-governance', group: 'Chapter 5 · AI Risk & Rules', title: 'What is AI governance?', label: '7', articleId: 'what-is-ai-governance' },
  { id: 'terms-c5-8', group: 'Chapter 5 · AI Risk & Rules', title: 'EU AI Act', label: '8' },
  { id: 'terms-c5-9', group: 'Chapter 5 · AI Risk & Rules', title: 'Deepfakes', label: '9' },
  { id: 'terms-c5-10', group: 'Chapter 5 · AI Risk & Rules', title: 'Red teaming', label: '10' },
  { id: 'terms-c5-11', group: 'Chapter 5 · AI Risk & Rules', title: 'AI alignment', label: '11' },
  { id: 'terms-c5-12', group: 'Chapter 5 · AI Risk & Rules', title: 'Responsible AI and AI literacy', label: '12' },
  { id: 'terms-c5-13', group: 'Chapter 5 · AI Risk & Rules', title: 'AI and jobs: tasks, not jobs', label: '13' },
  { id: 'terms-c6-1', group: 'Chapter 6 · Measuring AI', title: 'Precision vs recall', label: '1' },
  { id: 'terms-c6-2', group: 'Chapter 6 · Measuring AI', title: 'F1 and accuracy', label: '2' },
  { id: 'terms-c6-3', group: 'Chapter 6 · Measuring AI', title: 'Ranking metrics (nDCG, hit rate)', label: '3' },
  { id: 'terms-c6-4', group: 'Chapter 6 · Measuring AI', title: 'Ground truth / golden set', label: '4' },
  { id: 'terms-c6-5', group: 'Chapter 6 · Measuring AI', title: 'Evals', label: '5' },
  { id: 'terms-c6-6', group: 'Chapter 6 · Measuring AI', title: 'LLM-as-a-judge', label: '6' },
  { id: 'terms-c6-7', group: 'Chapter 6 · Measuring AI', title: 'Benchmarks ("why every model wins")', label: '7' },
  { id: 'terms-c6-8', group: 'Chapter 6 · Measuring AI', title: 'A/B tests', label: '8' },
  { id: 'terms-c6-9', group: 'Chapter 6 · Measuring AI', title: 'Latency and time-to-first-token', label: '9' },
  { id: 'terms-c6-10', group: 'Chapter 6 · Measuring AI', title: 'Overfitting', label: '10' },
  { id: 'terms-c7-1', group: 'Chapter 7 · Data & AI Ops', title: 'Inference cost and serving', label: '1' },
  { id: 'terms-c7-2', group: 'Chapter 7 · Data & AI Ops', title: 'GPU (why AI needs it)', label: '2' },
  { id: 'terms-c7-3', group: 'Chapter 7 · Data & AI Ops', title: 'On-prem vs cloud vs API', label: '3' },
  { id: 'terms-c7-4', group: 'Chapter 7 · Data & AI Ops', title: 'LLM observability / tracing', label: '4' },
  { id: 'terms-c7-5', group: 'Chapter 7 · Data & AI Ops', title: 'Labelled data', label: '5' },
  { id: 'terms-c7-6', group: 'Chapter 7 · Data & AI Ops', title: 'Synthetic data', label: '6' },
  { id: 'terms-c7-7', group: 'Chapter 7 · Data & AI Ops', title: 'Data pipeline / ETL', label: '7' },
  { id: 'terms-c7-8', group: 'Chapter 7 · Data & AI Ops', title: 'Data lake vs warehouse vs lakehouse', label: '8' },
  { id: 'terms-c7-9', group: 'Chapter 7 · Data & AI Ops', title: 'MLOps vs LLMOps', label: '9' },
  { id: 'terms-c7-10', group: 'Chapter 7 · Data & AI Ops', title: 'Model drift', label: '10' },
];

/** Published Termsplained concept articles, in learning order. */
export async function getTermsConceptArticles(): Promise<TermsArticle[]> {
  return (await getSectionConceptArticles('terms', TERMS_CONCEPT_ORDER)) as TermsArticle[];
}

/** Published Termsplained weekly reviews, newest first. */
export async function getTermsWeeklies(): Promise<TermsArticle[]> {
  return (await getWeeklyArticles('terms')) as TermsArticle[];
}
