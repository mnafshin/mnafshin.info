/**
 * Append a source line when a long passage is copied from an article.
 * Short selections, code blocks, and the code Copy button stay untouched.
 */
const MIN_CHARS = 200;

const SKIP_CLOSEST =
  'pre, .code-block, .copy-code, .def-popover, [data-def-select], .article-actions, .article-toc, .comments, dialog';

function nodeElement(node: Node | null): Element | null {
  if (!node) return null;
  return node instanceof Element ? node : node.parentElement;
}

function inArticle(sel: Selection): boolean {
  return Boolean(nodeElement(sel.anchorNode)?.closest('article.article'));
}

function shouldSkip(sel: Selection): boolean {
  const anchor = nodeElement(sel.anchorNode);
  const focus = nodeElement(sel.focusNode);
  if (!anchor || !focus) return true;
  if (anchor.closest(SKIP_CLOSEST) && focus.closest(SKIP_CLOSEST)) return true;
  // A selection wholly inside a <pre> or code Copy control must paste clean.
  if (anchor.closest('pre, .code-block, .copy-code') && focus.closest('pre, .code-block, .copy-code')) {
    return true;
  }
  return false;
}

function selectionHtml(sel: Selection): string {
  const holder = document.createElement('div');
  for (let i = 0; i < sel.rangeCount; i += 1) {
    holder.append(sel.getRangeAt(i).cloneContents());
  }
  return holder.innerHTML;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sourceUrl(): string {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  if (canonical) return canonical;
  const url = new URL(location.href);
  url.hash = '';
  url.search = '';
  return url.toString();
}

function sourceTitle(): string {
  const heading = document.querySelector('article.article h1');
  const fromHeading = heading?.textContent?.trim();
  if (fromHeading) return fromHeading;
  return document.title.replace(/\s+[·|].*$/, '').trim() || document.title;
}

document.addEventListener('copy', (event) => {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed) return;
  if (!inArticle(selection) || shouldSkip(selection)) return;

  const text = selection.toString();
  if (text.trim().length <= MIN_CHARS) return;

  const data = event.clipboardData;
  if (!data) return;

  const url = sourceUrl();
  const title = sourceTitle();
  const plainSuffix = `\n\nSource: ${title} — ${url}`;
  const htmlSuffix = `<br><br>Source: ${escapeHtml(title)} — <a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`;

  event.preventDefault();
  data.setData('text/plain', text + plainSuffix);
  const html = selectionHtml(selection);
  data.setData('text/html', `${html || escapeHtml(text)}${htmlSuffix}`);
});
