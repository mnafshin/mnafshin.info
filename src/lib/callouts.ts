import type { HastPluginEntry } from 'satteri';

const TYPES: Record<string, { className: string; label: string }> = {
  NOTE: { className: 'note', label: 'Note' },
  TIP: { className: 'tip', label: 'Tip' },
  IMPORTANT: { className: 'important', label: 'Important' },
  WARNING: { className: 'warning', label: 'Warning' },
  CAUTION: { className: 'warning', label: 'Warning' },
  MISTAKE: { className: 'mistake', label: 'Common mistake' },
  COMMONMISTAKE: { className: 'mistake', label: 'Common mistake' },
};

const MARKER = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|MISTAKE|COMMON\s*MISTAKE)\][ \t]*(.*)$/i;

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
};

/**
 * Turn GitHub-style alert blockquotes into labelled callout asides.
 * Syntax: `> [!NOTE]` (also TIP, IMPORTANT, WARNING, CAUTION, MISTAKE).
 */
export function calloutsPlugin(): HastPluginEntry {
  const plugin = () => {
    let count = 0;
    return {
      name: 'callouts',
      element: {
        filter: ['blockquote'],
        visit(node: HastNode, ctx: { replaceNode: (node: HastNode, next: HastNode) => void }) {
          const next = toCallout(node, ++count);
          if (next) ctx.replaceNode(node, next);
          else count -= 1;
        },
      },
    };
  };
  return plugin as HastPluginEntry;
}

function collectText(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(collectText).join('');
}

function toCallout(node: HastNode, idNum: number): HastNode | null {
  const children = node.children ?? [];
  const first = children.find((child) => child.type === 'element' && child.tagName === 'p');
  if (!first) return null;

  const raw = collectText(first);
  const firstLine = raw.split(/\n/)[0] ?? '';
  const match = firstLine.match(MARKER);
  if (!match) return null;

  const key = match[1].toUpperCase().replace(/\s+/g, '');
  const info = TYPES[key];
  if (!info) return null;

  const title = (match[2] ?? '').trim();
  const restText = raw.slice(match[0].length).replace(/^\s*\n?/, '');
  const body: HastNode[] = [];

  if (title) {
    body.push({
      type: 'element',
      tagName: 'p',
      properties: { className: ['callout-title'] },
      children: [{ type: 'text', value: title }],
    });
  }

  if (restText) {
    body.push({
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{ type: 'text', value: restText }],
    });
    body.push(...children.filter((child) => child !== first));
  } else {
    body.push(...children.filter((child) => child !== first));
  }

  if (body.length === 0) {
    body.push({
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{ type: 'text', value: '' }],
    });
  }

  const labelId = `callout-label-${idNum}`;
  return {
    type: 'element',
    tagName: 'aside',
    properties: {
      className: ['callout', `callout-${info.className}`],
      role: 'note',
      'aria-labelledby': labelId,
    },
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: { className: ['callout-label'], id: labelId },
        children: [{ type: 'text', value: info.label }],
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout-body'] },
        children: body,
      },
    ],
  };
}
