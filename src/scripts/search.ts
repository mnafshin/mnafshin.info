// Site search with Pagefind. The index is written to dist/pagefind by
// `npm run build`; in `astro dev` it does not exist and search says so.

type PagefindSubResult = { title: string; url: string; excerpt: string };
type PagefindData = {
  url: string;
  excerpt: string;
  meta: Record<string, string | undefined>;
  sub_results?: PagefindSubResult[];
};
type PagefindResult = { id: string; data: () => Promise<PagefindData> };
type Pagefind = {
  options: (options: Record<string, unknown>) => Promise<void>;
  init: () => Promise<void>;
  debouncedSearch: (
    term: string,
    options?: Record<string, unknown>,
    debounceMs?: number,
  ) => Promise<{ results: PagefindResult[] } | null>;
};

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');
const MAX_RESULTS = 12;
let pagefind: Promise<Pagefind> | undefined;

function loadPagefind() {
  pagefind ??= import(/* @vite-ignore */ `${BASE}pagefind/pagefind.js`).then(async (module: Pagefind) => {
    await module.options({ baseUrl: BASE, highlightParam: 'highlight', excerptLength: 26 });
    await module.init();
    return module;
  });
  return pagefind;
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function resultItem(data: PagefindData) {
  const title = escapeHtml(data.meta.title ?? data.url);
  const section = data.meta.section ? `<span class="search-result-section">${escapeHtml(data.meta.section)}</span>` : '';
  const kind = data.meta.kind ? `<span class="search-result-kind">${escapeHtml(data.meta.kind)}</span>` : '';
  // Pagefind's excerpts are already HTML-escaped, with matches in <mark>.
  const subs = (data.sub_results ?? [])
    .filter((sub) => sub.url.includes('#') && sub.title && sub.title !== data.meta.title)
    .slice(0, 3)
    .map(
      (sub) =>
        `<li><a class="search-sub" href="${escapeHtml(sub.url)}"><span class="search-sub-title">${escapeHtml(sub.title)}</span><span class="search-excerpt">${sub.excerpt}</span></a></li>`,
    )
    .join('');
  return `<li class="search-result">
    <a class="search-hit" href="${escapeHtml(data.url)}">
      <span class="search-result-meta">${section}${kind}</span>
      <span class="search-result-title">${title}</span>
      <span class="search-excerpt">${data.excerpt}</span>
    </a>
    ${subs ? `<ul class="search-subs">${subs}</ul>` : ''}
  </li>`;
}

export function mountSearch(root: HTMLElement, options: { syncUrl?: boolean } = {}) {
  const input = root.querySelector<HTMLInputElement>('[data-search-input]');
  const results = root.querySelector<HTMLElement>('[data-search-results]');
  const status = root.querySelector<HTMLElement>('[data-search-status]');
  const form = root.querySelector<HTMLFormElement>('[data-search-form]');
  if (!input || !results || !status) return;

  let latest = '';

  async function run(term: string) {
    latest = term;
    if (options.syncUrl) {
      const url = new URL(window.location.href);
      if (term) url.searchParams.set('q', term);
      else url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }
    if (!term.trim()) {
      results!.innerHTML = '';
      status!.textContent = 'Type to search the articles and weekly reviews.';
      return;
    }
    let module: Pagefind;
    try {
      module = await loadPagefind();
    } catch {
      status!.textContent = 'Search is not available here. It works on the built site (npm run build).';
      return;
    }
    const search = await module.debouncedSearch(term, {}, 180);
    if (search === null || term !== latest) return;
    const data = await Promise.all(search.results.slice(0, MAX_RESULTS).map((result) => result.data()));
    if (term !== latest) return;
    results!.innerHTML = data.map(resultItem).join('');
    const count = search.results.length;
    status!.textContent =
      count === 0
        ? `No results for “${term}”.`
        : `${count} ${count === 1 ? 'result' : 'results'} for “${term}”${count > MAX_RESULTS ? `, showing the first ${MAX_RESULTS}` : ''}.`;
  }

  input.addEventListener('input', () => run(input.value));
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    run(input.value);
    results.querySelector<HTMLAnchorElement>('a')?.focus();
  });

  // Arrow keys move between the input and the results.
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = [...results.querySelectorAll<HTMLAnchorElement>('a')];
    if (links.length === 0) return;
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    event.preventDefault();
    if (event.key === 'ArrowDown') {
      links[Math.min(at + 1, links.length - 1)].focus();
    } else if (at <= 0) {
      input.focus();
    } else {
      links[at - 1].focus();
    }
  });

  return {
    input,
    run,
    warm: () => {
      loadPagefind().catch(() => undefined);
    },
  };
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function setupDialog() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');
  const panel = dialog?.querySelector<HTMLElement>('[data-search-root]');
  if (!dialog || !panel || typeof dialog.showModal !== 'function') return;
  const search = mountSearch(panel);
  if (!search) return;

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll<HTMLElement>('[data-search-kbd]').forEach((kbd) => {
    kbd.textContent = isMac ? '⌘K' : 'Ctrl K';
    kbd.hidden = false;
  });

  function open() {
    if (dialog!.open) return;
    dialog!.showModal();
    search!.input.select();
    search!.run(search!.input.value);
  }

  document.querySelectorAll<HTMLAnchorElement>('[data-search-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      // On the search page itself, the link focuses the page's own box.
      const pageInput = document.querySelector<HTMLInputElement>('[data-search-page] [data-search-input]');
      if (pageInput) pageInput.focus();
      else open();
    });
    trigger.addEventListener('pointerenter', search.warm, { once: true });
    trigger.addEventListener('focus', search.warm, { once: true });
  });

  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
  // A click on the backdrop (outside the panel) closes the dialog.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener('keydown', (event) => {
    const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    const slash = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping(event.target);
    if (!shortcut && !slash) return;
    event.preventDefault();
    const pageInput = document.querySelector<HTMLInputElement>('[data-search-page] [data-search-input]');
    if (pageInput) {
      pageInput.focus();
      pageInput.select();
    } else {
      open();
    }
  });
}

function setupPage() {
  const root = document.querySelector<HTMLElement>('[data-search-page]');
  if (!root) return;
  const search = mountSearch(root, { syncUrl: true });
  if (!search) return;
  const query = new URLSearchParams(window.location.search).get('q') ?? '';
  search.input.value = query;
  search.run(query);
  if (!query) search.input.focus();
}

setupDialog();
setupPage();
