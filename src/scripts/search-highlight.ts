// When a reader arrives from a search result (`?highlight=…`), mark the
// searched words in the article with Pagefind's highlighter.

const PARAM = 'highlight';

if (new URLSearchParams(window.location.search).has(PARAM)) {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  import(/* @vite-ignore */ `${base}pagefind/pagefind-highlight.js`)
    .then(() => {
      const Highlight = (window as unknown as { PagefindHighlight?: new (options: object) => unknown })
        .PagefindHighlight;
      if (Highlight) {
        new Highlight({ highlightParam: PARAM, markContext: '[data-pagefind-body]', addStyles: false });
      }
    })
    .catch(() => {
      /* No search index in `astro dev`; nothing to highlight. */
    });
}
