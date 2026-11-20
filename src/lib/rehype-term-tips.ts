import { fileURLToPath } from 'node:url';
import type { HastPluginEntry } from 'satteri';
import { isCaseSensitivePhrase, phrasesMatch } from '../data/glossary-marking';
import { loadMarkableTerms, type MarkableTerm } from './glossary';

const SKIP = new Set(['pre', 'code', 'kbd', 'script', 'style', 'svg', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button']);

type HastText = { type: 'text'; value: string };
type HastElement = {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children?: unknown[];
};
type HastParent = { type: string; tagName?: string };

type Pattern = { phrase: string; entry: MarkableTerm };

/**
 * Annotate the first occurrence of glossary terms in article prose.
 * Uses every section glossary, prefers the article's own section, and
 * skips code, headings, links, the defining article, and glossary pages.
 * This is a Sätteri hast plugin.
 */
export function termTipsPlugin(base = '/') {
  const glossary = loadMarkableTerms(base);
  const patterns: Pattern[] = glossary.flatMap((entry) =>
    entry.phrases.map((phrase) => ({ phrase, entry })),
  );
  patterns.sort((a, b) => b.phrase.length - a.phrase.length);
  const source = patterns
    .map(({ phrase }) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const insensitive = source ? new RegExp(`(^|[^A-Za-z0-9_+-])(${source})(?![A-Za-z0-9_+-])`, 'gi') : null;

  const plugin = (ctx: { fileURL?: URL }) => {
    if (!insensitive || patterns.length === 0) return false;
    const filePath = ctx.fileURL ? fileURLToPath(ctx.fileURL) : '';
    if (isGlossaryPage(filePath)) return false;
    const current = fileContext(filePath);

    const used = new Set<string>();
    return {
      name: 'term-tips',
      text(node: HastText, visitor: {
        parent: (node: unknown) => HastParent | undefined;
        replaceNode: (node: unknown, next: unknown[]) => void;
      }) {
        if (isSkipped(node, visitor)) return;
        const next = splitText(node.value, insensitive, patterns, used, current);
        if (next) visitor.replaceNode(node, next);
      },
    };
  };
  return plugin as HastPluginEntry;
}

function isGlossaryPage(filePath: string) {
  return /[/\\](?:pages[/\\].*glossary|content[/\\].*glossary)/i.test(filePath.replace(/\\/g, '/'));
}

function fileContext(filePath: string) {
  const posix = filePath.replace(/\\/g, '/');
  const match = posix.match(/\/content\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return null;
  const folder = match[1];
  return {
    section: folder === 'videos' ? 'spring' : folder,
    id: match[2],
  };
}

function isSkipped(
  node: HastText,
  visitor: { parent: (node: unknown) => HastParent | undefined },
) {
  let current: unknown = node;
  for (;;) {
    const parent = visitor.parent(current);
    if (!parent) return false;
    if (parent.type === 'element' && parent.tagName && SKIP.has(parent.tagName)) return true;
    current = parent;
  }
}

function splitText(
  value: string,
  regex: RegExp,
  patterns: Pattern[],
  used: Set<string>,
  current: { section: string; id: string } | null,
): unknown[] | null {
  regex.lastIndex = 0;
  const parts: unknown[] = [];
  let last = 0;
  let found = false;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value))) {
    const lead = match[1] ?? '';
    const text = match[2] ?? '';
    const start = match.index + lead.length;
    const entry = matchEntry(text, patterns, used, current);
    if (!entry) {
      // Avoid stalling when a case-insensitive hit is rejected.
      regex.lastIndex = start + Math.max(text.length, 1);
      continue;
    }
    used.add(entry.id);
    if (start > last) parts.push({ type: 'text', value: value.slice(last, start) });
    parts.push(termNode(text, entry));
    last = start + text.length;
    found = true;
    regex.lastIndex = last;
  }

  if (!found) return null;
  if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
  return parts;
}

function matchEntry(
  text: string,
  patterns: Pattern[],
  used: Set<string>,
  current: { section: string; id: string } | null,
) {
  const candidates: MarkableTerm[] = [];
  const seen = new Set<string>();
  for (const { phrase, entry } of patterns) {
    if (used.has(entry.id) || seen.has(entry.id)) continue;
    if (current && entry.sectionId === current.section && entry.articleId === current.id) continue;
    if (!phrasesMatch(phrase, text)) continue;
    // Reject a case-insensitive regex hit that only matched a sensitive phrase loosely.
    if (isCaseSensitivePhrase(phrase) && phrase !== text) continue;
    seen.add(entry.id);
    candidates.push(entry);
  }
  if (candidates.length === 0) return undefined;
  if (current) {
    const own = candidates.find((entry) => entry.sectionId === current.section);
    if (own) return own;
  }
  return candidates[0];
}

function termNode(text: string, entry: MarkableTerm): HastElement {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      className: ['term-tip'],
      'data-term-id': entry.id,
      'aria-expanded': 'false',
      'aria-haspopup': 'dialog',
      'aria-controls': 'def-popover',
    },
    children: [{ type: 'text', value: text }],
  };
}

