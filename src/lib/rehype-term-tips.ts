import { fileURLToPath } from 'node:url';
import type { HastPluginEntry } from 'satteri';
import { loadGlossary, type GlossaryEntry } from './glossary';

const SKIP = new Set(['pre', 'code', 'kbd', 'script', 'style', 'svg', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button']);

type HastText = { type: 'text'; value: string };
type HastElement = {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children?: unknown[];
};
type HastParent = { type: string; tagName?: string };

/**
 * Annotate the first occurrence of published Termsplained terms in markdown
 * from other sections. Skips code, headings and links, and does nothing on
 * /terms articles themselves. This is a Sätteri hast plugin.
 */
export function termTipsPlugin(base = '/') {
  const glossary = loadGlossary(base);
  const patterns = glossary.flatMap((entry) =>
    entry.phrases.map((phrase) => ({ phrase, entry })),
  );
  patterns.sort((a, b) => b.phrase.length - a.phrase.length);
  const source = patterns
    .map(({ phrase }) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const regex = source ? new RegExp(`(^|[^A-Za-z0-9_+-])(${source})(?![A-Za-z0-9_+-])`, 'gi') : null;

  const plugin = (ctx: { fileURL?: URL }) => {
    if (!regex || patterns.length === 0) return false;
    const filePath = ctx.fileURL ? fileURLToPath(ctx.fileURL) : '';
    if (/[/\\]content[/\\]terms[/\\]/.test(filePath)) return false;

    const used = new Set<string>();
    return {
      name: 'term-tips',
      text(node: HastText, visitor: {
        parent: (node: unknown) => HastParent | undefined;
        replaceNode: (node: unknown, next: unknown[]) => void;
      }) {
        if (isSkipped(node, visitor)) return;
        const next = splitText(node.value, regex, patterns, used);
        if (next) visitor.replaceNode(node, next);
      },
    };
  };
  return plugin as HastPluginEntry;
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
  patterns: { phrase: string; entry: GlossaryEntry }[],
  used: Set<string>,
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
    const entry = matchEntry(text, patterns, used);
    if (!entry) continue;
    used.add(entry.slug);
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
  patterns: { phrase: string; entry: GlossaryEntry }[],
  used: Set<string>,
) {
  const lower = text.toLowerCase();
  for (const { phrase, entry } of patterns) {
    if (used.has(entry.slug)) continue;
    if (phrase.toLowerCase() === lower) return entry;
  }
  return undefined;
}

function termNode(text: string, entry: GlossaryEntry): HastElement {
  const tipId = `term-tip-${entry.slug}`;
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['term-wrap'] },
    children: [
      {
        type: 'element',
        tagName: 'button',
        properties: {
          type: 'button',
          className: ['term-tip'],
          'aria-expanded': 'false',
          'aria-controls': tipId,
        },
        children: [{ type: 'text', value: text }],
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          id: tipId,
          className: ['term-popover'],
          role: 'tooltip',
          hidden: true,
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['term-def'] },
            children: [{ type: 'text', value: entry.description }],
          },
          {
            type: 'element',
            tagName: 'a',
            properties: { href: entry.href, className: ['term-more'] },
            children: [{ type: 'text', value: `Read: ${entry.title}` }],
          },
        ],
      },
    ],
  };
}
