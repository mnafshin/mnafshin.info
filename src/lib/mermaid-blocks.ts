import type { HastPluginEntry } from 'satteri';

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
};

/**
 * Lift ```mermaid fences out of Shiki so the browser can render them
 * with a theme-aware Mermaid diagram and the image zoom dialog.
 */
export function mermaidBlocksPlugin(): HastPluginEntry {
  const plugin = {
    name: 'mermaid-blocks',
    element: {
      filter: ['pre'],
      visit(node: HastNode, ctx: { textContent: (node: HastNode) => string; replaceNode: (node: HastNode, next: HastNode) => void }) {
        if (!isMermaid(node)) return;
        const source = ctx.textContent(node).trim();
        if (!source) return;
        ctx.replaceNode(node, {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['diagram'], 'data-diagram': '' },
          children: [
            {
              type: 'element',
              tagName: 'pre',
              properties: { className: ['diagram-src'], hidden: true },
              children: [{ type: 'text', value: source }],
            },
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['diagram-view'] },
              children: [],
            },
          ],
        });
      },
    },
  };
  return plugin as HastPluginEntry;
}

function isMermaid(node: HastNode) {
  const props = node.properties ?? {};
  const lang = String(props.dataLanguage ?? props['data-language'] ?? '').toLowerCase();
  if (lang === 'mermaid') return true;
  const className = props.className;
  const classes = Array.isArray(className) ? className : typeof className === 'string' ? className.split(/\s+/) : [];
  return classes.some((name) => String(name).toLowerCase() === 'mermaid' || String(name).toLowerCase() === 'language-mermaid');
}
