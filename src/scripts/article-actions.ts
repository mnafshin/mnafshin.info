import { isBookmarked, toggleBookmark } from './bookmarks';
import { initArticleProgress } from './article-progress';

const GISCUS_ORIGIN = 'https://giscus.app';

const root = document.querySelector<HTMLElement>('[data-article-actions]');
if (root) {
  initViews(root);
  initLike();
  initBookmark(root);
  initArticleProgress(root);
}

function initViews(root: HTMLElement) {
  const el = root.querySelector<HTMLElement>('[data-view-count]');
  const code = root.dataset.goatcounterCode;
  if (!el || !code) return;

  const path = encodeURIComponent(location.pathname);
  fetch(`https://${code}.goatcounter.com/counter/${path}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(String(res.status));
      return res.json() as Promise<{ count?: string }>;
    })
    .then((data) => {
      const count = data.count;
      if (count == null || count === '') return;
      const numeric = Number(String(count).replace(/,/g, ''));
      if (!Number.isFinite(numeric)) return;
      el.textContent = numeric === 1 ? '1 view' : `${count} views`;
      el.hidden = false;
    })
    .catch(() => {
      el.hidden = true;
    });
}

function initLike() {
  const link = document.querySelector<HTMLElement>('[data-like-link]');
  const countEl = document.querySelector<HTMLElement>('[data-like-count]');
  if (!link) return;

  window.addEventListener('message', (event) => {
    if (event.origin !== GISCUS_ORIGIN) return;
    if (!event.data || typeof event.data !== 'object' || !('giscus' in event.data)) return;
    const payload = event.data as {
      giscus?: { discussion?: { reactions?: { THUMBS_UP?: number } } };
    };
    const n = payload.giscus?.discussion?.reactions?.THUMBS_UP;
    if (typeof n !== 'number') return;
    if (countEl && n > 0) {
      countEl.textContent = String(n);
      countEl.hidden = false;
    }
    link.setAttribute(
      'aria-label',
      n === 1 ? '1 like, jump to reactions in comments' : `${n} likes, jump to reactions in comments`,
    );
  });
}

function initBookmark(root: HTMLElement) {
  const button = root.querySelector<HTMLButtonElement>('[data-bookmark-toggle]');
  const label = root.querySelector<HTMLElement>('[data-bookmark-label]');
  if (!button) return;

  const title = root.dataset.title ?? document.title;
  const section = root.dataset.section ?? '';
  const url = `${location.pathname}${location.search}`;

  const sync = (on: boolean) => {
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', on ? 'Remove bookmark' : 'Bookmark this article');
    if (label) label.textContent = on ? 'Saved' : 'Bookmark';
    button.classList.toggle('is-on', on);
  };

  try {
    sync(isBookmarked(url));
  } catch {
    button.hidden = true;
    return;
  }

  button.addEventListener('click', () => {
    try {
      const items = toggleBookmark({ title, url, section });
      sync(items.some((item) => item.url === url));
    } catch {
      /* localStorage can be unavailable */
    }
  });
}
