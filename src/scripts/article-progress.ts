import { getProgress, pageUrl, upsertProgress, type ArticleProgress } from './progress';

const NEAR_TOP = 10;
const READ_PERCENT = 90;
const SAVE_MS = 400;

export function initArticleProgress(root: HTMLElement) {
  const title = root.dataset.title ?? document.title;
  const section = root.dataset.section ?? '';
  const url = pageUrl();
  const prompt = document.querySelector<HTMLElement>('[data-continue-prompt]');
  const readButton = root.querySelector<HTMLButtonElement>('[data-read-toggle]');
  const readLabel = root.querySelector<HTMLElement>('[data-read-label]');

  let manualUnread = false;
  let saved: ArticleProgress | undefined;
  try {
    saved = getProgress(url);
  } catch {
    if (readButton) readButton.hidden = true;
    return;
  }

  const syncRead = (on: boolean) => {
    if (!readButton) return;
    readButton.setAttribute('aria-pressed', String(on));
    readButton.setAttribute('aria-label', on ? 'Mark as unread' : 'Mark as read');
    if (readLabel) readLabel.textContent = on ? 'Read' : 'Mark as read';
    readButton.classList.toggle('is-on', on);
  };

  syncRead(Boolean(saved?.read));
  maybeShowPrompt(prompt, saved);

  if (readButton) {
    readButton.addEventListener('click', () => {
      try {
        const nextRead = !isOn(readButton);
        manualUnread = !nextRead;
        saved = upsertProgress({ url, title, section, read: nextRead });
        syncRead(nextRead);
      } catch {
        /* localStorage can be unavailable */
      }
    });
  }

  prompt?.querySelector('[data-continue-go]')?.addEventListener('click', () => {
    if (saved) restore(saved);
    hidePrompt(prompt);
  });

  prompt?.querySelector('[data-continue-dismiss]')?.addEventListener('click', () => {
    hidePrompt(prompt);
    if (!saved) return;
    try {
      saved = upsertProgress({
        url,
        title,
        section,
        dismissedPercent: saved.percent,
      });
    } catch {
      /* localStorage can be unavailable */
    }
  });

  let moved = false;
  let timer = 0;
  const queueSave = () => {
    moved = true;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => persist(), SAVE_MS);
  };

  window.addEventListener('scroll', queueSave, { passive: true });
  window.addEventListener('pagehide', () => persist());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persist();
  });

  function persist() {
    try {
      // A visit that never scrolled should not overwrite a saved place
      // (for example after showing the continue prompt and leaving).
      if (!moved && saved) {
        saved = upsertProgress({ url, title, section, visitedAt: new Date().toISOString() });
        return;
      }
      const percent = readingPercent();
      const reached = !manualUnread && (percent >= READ_PERCENT || reachedRecap());
      saved = upsertProgress({
        url,
        title,
        section,
        percent,
        anchor: currentAnchor(),
        read: reached || Boolean(saved?.read),
        visitedAt: new Date().toISOString(),
      });
      syncRead(saved.read);
    } catch {
      /* localStorage can be unavailable */
    }
  }
}

function isOn(button: HTMLButtonElement) {
  return button.getAttribute('aria-pressed') === 'true';
}

function maybeShowPrompt(prompt: HTMLElement | null, saved: ArticleProgress | undefined) {
  if (!prompt || !saved) return;
  if (location.hash) return;
  if (saved.read || saved.percent < NEAR_TOP) return;
  if (
    saved.dismissedPercent !== undefined &&
    Math.abs(saved.percent - saved.dismissedPercent) < 5
  ) {
    return;
  }
  prompt.hidden = false;
}

function hidePrompt(prompt: HTMLElement | null) {
  if (prompt) prompt.hidden = true;
}

function restore(saved: ArticleProgress) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
  if (saved.anchor) {
    const heading = document.getElementById(saved.anchor);
    if (heading) {
      heading.scrollIntoView({ behavior, block: 'start' });
      return;
    }
  }
  window.scrollTo({ top: percentToY(saved.percent), behavior });
}

function contentBounds() {
  const article = document.querySelector<HTMLElement>('article.article');
  const endEl =
    document.getElementById('recap') ||
    document.querySelector<HTMLElement>('.comments') ||
    document.querySelector<HTMLElement>('.curriculum-nav');
  const top = article
    ? article.getBoundingClientRect().top + window.scrollY
    : 0;
  const end = endEl
    ? endEl.getBoundingClientRect().top + window.scrollY
    : article
      ? article.getBoundingClientRect().bottom + window.scrollY
      : document.documentElement.scrollHeight;
  return { top, end };
}

function readingPercent(): number {
  const { top, end } = contentBounds();
  const span = end - top - window.innerHeight * 0.25;
  if (span <= 0) return window.scrollY > 0 ? 100 : 0;
  const value = ((window.scrollY - top) / span) * 100;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function percentToY(percent: number): number {
  const { top, end } = contentBounds();
  const span = end - top - window.innerHeight * 0.25;
  if (span <= 0) return 0;
  return Math.max(0, top + (Math.min(100, percent) / 100) * span);
}

function reachedRecap(): boolean {
  const recap = document.getElementById('recap');
  if (!recap) return false;
  return recap.getBoundingClientRect().top < window.innerHeight * 0.55;
}

function currentAnchor(): string | null {
  if (window.scrollY < 80) return null;
  const headings = document.querySelectorAll<HTMLElement>('article.article :is(h2, h3)[id]');
  let current: string | null = null;
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top <= 96) current = heading.id;
  }
  return current;
}
