import fs from 'node:fs';
import path from 'node:path';
import { CURATED_GLOSSARIES } from '../data/glossaries';
import { SECTIONS, type SectionId } from './site';

export type GlossaryEntry = {
  slug: string;
  title: string;
  description: string;
  href: string;
  phrases: string[];
};

// Distinctive phrases only. Bare words like "token", "agent" or "parameters"
// would misfire on Spring, Kubernetes and database articles.
const PHRASES: Record<string, string[]> = {
  'what-is-an-llm': ['large language models', 'large language model', 'LLMs', 'LLM'],
  'what-is-rag': ['retrieval-augmented generation', 'retrieval augmented generation', 'RAG'],
  'what-is-mcp': ['Model Context Protocol', 'MCP'],
  'mixture-of-experts': ['mixture of experts', 'MoE'],
  'what-is-a-context-window': ['context window'],
  'what-is-a-system-prompt': ['system prompt'],
  'what-is-an-ai-hallucination': ['AI hallucinations', 'AI hallucination', 'hallucinations', 'hallucination'],
  'what-is-ai-slop': ['AI slop'],
  'what-is-ai-governance': ['AI governance'],
  'what-is-an-ai-copilot': ['GitHub Copilot', 'Microsoft 365 Copilot', 'AI copilots', 'AI copilot'],
  'grounding-and-citations': ['grounding'],
  'fine-tuning-vs-rag-vs-prompting': ['fine-tuning', 'fine tuning'],
  'how-ai-learns-from-data': ['reinforcement learning', 'supervised learning', 'unsupervised learning'],
  'ai-vs-ml-vs-dl-vs-genai': ['generative AI', 'GenAI', 'deep learning', 'machine learning'],
  'agent-vs-agentic-vs-chatbot': ['agentic AI', 'AI agents', 'AI agent'],
  'what-parameters-mean': ['model parameters', '405B', '70B', '8B'],
  'what-is-a-token': ['token counter', 'tokenizers', 'tokenisers', 'tokenizer', 'tokeniser'],
  'what-is-temperature': ['model temperature'],
};

function frontmatter(text: string) {
  if (!text.startsWith('---')) return {};
  const end = text.indexOf('\n---', 3);
  if (end === -1) return {};
  const block = text.slice(3, end);
  const meta: Record<string, string> = {};
  for (const line of block.split('\n')) {
    const at = line.indexOf(':');
    if (at <= 0 || line.startsWith(' ') || line.trim().startsWith('-')) continue;
    const key = line.slice(0, at).trim();
    const value = line.slice(at + 1).trim().replace(/^['"]|['"]$/g, '');
    meta[key] = value;
  }
  return meta;
}

/** Published Termsplained concept articles, with phrases to annotate elsewhere. */
export function loadGlossary(base = '/'): GlossaryEntry[] {
  const dir = path.resolve(process.cwd(), 'src/content/terms');
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const entries: GlossaryEntry[] = [];
  if (!fs.existsSync(dir)) return entries;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.slice(0, -3);
    const phrases = PHRASES[slug];
    if (!phrases) continue;
    const meta = frontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (meta.draft === 'true' || meta.kind === 'weekly') continue;
    if (!meta.title || !meta.description) continue;
    entries.push({
      slug,
      title: meta.title,
      description: meta.description,
      href: `${prefix}terms/${slug}/`,
      phrases,
    });
  }

  return entries.sort((a, b) => b.phrases[0].length - a.phrases[0].length);
}

const TITLE_PREFIX = /^(what is(?: an?)?|what are)\s+/i;

/** Sort and letter-jump key: the term itself, not a leading "What is". */
export function termSortKey(title: string) {
  return title.replace(TITLE_PREFIX, '').replace(/^["“'@]+/, '').trim() || title;
}

/** Every published Termsplained concept article, A–Z, for the public glossary. */
export function loadPublishedTerms(base = '/'): GlossaryEntry[] {
  const dir = path.resolve(process.cwd(), 'src/content/terms');
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const entries: GlossaryEntry[] = [];
  if (!fs.existsSync(dir)) return entries;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.slice(0, -3);
    const meta = frontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (meta.draft === 'true' || meta.kind === 'weekly') continue;
    if (!meta.title || !meta.description) continue;
    entries.push({
      slug,
      title: meta.title,
      description: meta.description,
      href: `${prefix}terms/${slug}/`,
      phrases: PHRASES[slug] ?? [meta.title],
    });
  }

  return entries.sort((a, b) =>
    termSortKey(a.title).localeCompare(termSortKey(b.title), 'en', { sensitivity: 'base' }),
  );
}

/** One term on a section glossary page, always linked to a published article. */
export type SectionGlossaryTerm = {
  term: string;
  definition: string;
  href: string;
  articleId: string;
};

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const SECTIONS_WITH_GLOSSARY: SectionId[] = SECTIONS.map((section) => section.id);

function publishedConceptIds(sectionId: string) {
  const dir = path.resolve(process.cwd(), 'src/content', sectionId);
  const ids = new Set<string>();
  if (!fs.existsSync(dir)) return ids;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const meta = frontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (meta.draft === 'true' || meta.kind === 'weekly') continue;
    ids.add(file.slice(0, -3));
  }
  return ids;
}

/** Terms for one section. Missing, draft or weekly article ids are dropped. */
export function loadSectionGlossary(sectionId: SectionId, base = '/'): SectionGlossaryTerm[] {
  if (sectionId === 'terms') {
    return loadPublishedTerms(base).map((entry) => ({
      term: entry.title,
      definition: entry.description,
      href: entry.href,
      articleId: entry.slug,
    }));
  }

  const prefix = base.endsWith('/') ? base : `${base}/`;
  const published = publishedConceptIds(sectionId);
  const entries: SectionGlossaryTerm[] = [];
  for (const item of CURATED_GLOSSARIES[sectionId] ?? []) {
    if (!published.has(item.articleId)) continue;
    entries.push({
      term: item.term,
      definition: item.definition,
      href: `${prefix}${sectionId}/${item.articleId}/`,
      articleId: item.articleId,
    });
  }
  return entries.sort((a, b) =>
    termSortKey(a.term).localeCompare(termSortKey(b.term), 'en', { sensitivity: 'base' }),
  );
}

export function groupGlossaryByLetter(terms: SectionGlossaryTerm[]) {
  const byLetter = new Map<string, SectionGlossaryTerm[]>();
  for (const entry of terms) {
    const letter = termSortKey(entry.term).charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : '#';
    const list = byLetter.get(key) ?? [];
    list.push(entry);
    byLetter.set(key, list);
  }
  return {
    byLetter,
    present: new Set(byLetter.keys()),
  };
}

export type GlossaryHubItem = {
  sectionId: SectionId;
  name: string;
  href: string;
  count: number;
};

/** One card per section for the /glossary/ hub. */
export function loadGlossaryHub(base = '/'): GlossaryHubItem[] {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return SECTIONS_WITH_GLOSSARY.map((sectionId) => {
    const section = SECTIONS.find((item) => item.id === sectionId);
    return {
      sectionId,
      name: section?.name ?? sectionId,
      href: `${prefix}${section?.path ?? sectionId}/glossary/`,
      count: loadSectionGlossary(sectionId, base).length,
    };
  });
}
