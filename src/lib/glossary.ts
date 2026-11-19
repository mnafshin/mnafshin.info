import fs from 'node:fs';
import path from 'node:path';

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
