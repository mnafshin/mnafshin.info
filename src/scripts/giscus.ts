// Loads the giscus comments widget and keeps its theme in sync with the
// site's light/dark mode (the `dark` class on <html>, set by BaseLayout and
// ThemeToggle).

const GISCUS_ORIGIN = 'https://giscus.app';

const container = document.querySelector<HTMLElement>('[data-giscus-container]');

function siteTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function giscusTheme(el: HTMLElement): string {
  const theme = siteTheme();
  return (theme === 'dark' ? el.dataset.themeDark : el.dataset.themeLight) ?? `noborder_${theme}`;
}

function sendTheme(el: HTMLElement) {
  const frame = el.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: giscusTheme(el) } } }, GISCUS_ORIGIN);
}

if (container && !container.querySelector('script, iframe')) {
  const el = container;
  const script = document.createElement('script');
  script.src = `${GISCUS_ORIGIN}/client.js`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  const attrs = [
    'repo',
    'repo-id',
    'category',
    'category-id',
    'mapping',
    'strict',
    'reactions-enabled',
    'emit-metadata',
    'input-position',
    'lang',
    'loading',
  ];
  for (const name of attrs) {
    const value = el.getAttribute(`data-${name}`);
    if (value !== null) script.setAttribute(`data-${name}`, value);
  }
  script.setAttribute('data-theme', giscusTheme(el));
  el.append(script);

  // Follow the site theme when the user toggles it.
  new MutationObserver(() => sendTheme(el)).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // If the theme changed while the iframe was still loading, re-send once
  // giscus reports in.
  let synced = false;
  window.addEventListener('message', (event) => {
    if (synced || event.origin !== GISCUS_ORIGIN) return;
    if (!event.data || typeof event.data !== 'object' || !('giscus' in event.data)) return;
    synced = true;
    sendTheme(el);
  });
}
