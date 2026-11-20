// Definition popover: glossary hover/tap, Alt+I / i shortcut, Wikipedia fallback.

type GlossaryItem = {
  id: string;
  term: string;
  definition: string;
  href: string;
  sectionId: string;
  sectionName: string;
  phrases: string[];
  lookupPhrases: string[];
  linkLabel: string;
};

type WikiCache = {
  title: string;
  extract: string;
  url: string;
  kind: 'ok' | 'missing' | 'disambiguation' | 'error';
  message?: string;
};

const WIKI_PREFIX = 'mnafshin.info:wiki:';
const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const NARROW = '(max-width: 640px)';
const FINE_HOVER = '(hover: hover) and (pointer: fine)';
const COARSE = '(pointer: coarse)';
const BAR = 8;
const GAP = 8;
const SELECT_MAX = 80;

const popover = document.querySelector<HTMLElement>('[data-def-popover]');
const backdrop = document.querySelector<HTMLElement>('[data-def-backdrop]');
const closeBtn = popover?.querySelector<HTMLButtonElement>('[data-def-close]');
const termEl = popover?.querySelector<HTMLElement>('#def-popover-term');
const badgeEl = popover?.querySelector<HTMLElement>('[data-def-badge]');
const bodyEl = popover?.querySelector<HTMLElement>('[data-def-body]');
const sourceEl = popover?.querySelector<HTMLElement>('[data-def-source]');
const linkEl = popover?.querySelector<HTMLAnchorElement>('[data-def-link]');
const attrEl = popover?.querySelector<HTMLElement>('[data-def-attr]');
const selectBtn = document.querySelector<HTMLButtonElement>('[data-def-select]');

const terms = loadIndex();
const tips = document.querySelectorAll<HTMLButtonElement>('.term-tip');

let pinned = false;
let trigger: HTMLElement | null = null;
let hoverTimer = 0;
let lastHoverTip: HTMLButtonElement | null = null;
let lastRangeRect: DOMRect | null = null;
let ignoreToggleUntil = 0;
let suppressFocusOpen = false;

if (popover && closeBtn) {
  closeBtn.addEventListener('click', () => closePopover(true));
  backdrop?.addEventListener('click', () => {
    if (Date.now() < ignoreToggleUntil) return;
    closePopover(true);
  });
  popover.addEventListener('mouseenter', () => window.clearTimeout(hoverTimer));
  popover.addEventListener('mouseleave', () => {
    if (!pinned && canHover()) scheduleClose();
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const tip = target.closest<HTMLButtonElement>('.term-tip');
    if (tip) {
      event.preventDefault();
      event.stopPropagation();
      // A tap often fires click twice (touch + synthetic mouse). Swallow the duplicate
      // so the sheet does not open and immediately close.
      if (Date.now() < ignoreToggleUntil && trigger === tip) return;
      if (pinned && trigger === tip && !popover.hidden) {
        closePopover(true);
        return;
      }
      openGlossary(tip, { pin: true, focus: isNarrow() });
      ignoreToggleUntil = Date.now() + 800;
      return;
    }
    if (Date.now() < ignoreToggleUntil) return;
    if (popover.hidden) return;
    if (popover.contains(target) || selectBtn?.contains(target) || backdrop?.contains(target)) return;
    closePopover(true);
  });

  document.addEventListener('keydown', onKeydown);
  document.addEventListener('mnafshin:overlay-open', ((event: Event) => {
    const custom = event as CustomEvent<string>;
    if (custom.detail !== 'definition') closePopover(false);
  }) as EventListener);

  if (canHover()) {
    tips.forEach((tip) => {
      tip.addEventListener('mouseenter', () => {
        lastHoverTip = tip;
        window.clearTimeout(hoverTimer);
        if (pinned) return;
        openGlossary(tip, { pin: false, focus: false });
      });
      tip.addEventListener('mouseleave', () => {
        if (pinned) return;
        scheduleClose();
      });
    });
  }

  tips.forEach((tip) => {
    tip.addEventListener('focus', () => {
      lastHoverTip = tip;
      if (pinned) return;
      // On touch, opening on focus then closing on blur fights the tap
      // that follows. Keyboard users on a fine pointer still get focus-open.
      if (suppressFocusOpen || isCoarse() || !canHover()) return;
      openGlossary(tip, { pin: false, focus: false });
    });
    tip.addEventListener('blur', () => {
      window.setTimeout(() => {
        if (pinned) return;
        if (popover.contains(document.activeElement) || tip === document.activeElement) return;
        closePopover(false);
      }, 0);
    });
  });

  document.addEventListener('selectionchange', () => {
    if (!isCoarse()) {
      hideSelectBtn();
      return;
    }
    window.setTimeout(syncSelectButton, 80);
  });
  // Wait until the native selection callout has appeared, then sit below it.
  document.addEventListener('pointerup', () => {
    if (isCoarse()) window.setTimeout(syncSelectButton, 300);
  });
  let scrollHideTimer = 0;
  window.addEventListener(
    'scroll',
    () => {
      hideSelectBtn();
      if (!isCoarse()) return;
      window.clearTimeout(scrollHideTimer);
      scrollHideTimer = window.setTimeout(syncSelectButton, 250);
    },
    { passive: true },
  );
  selectBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    const text = selectedText();
    hideSelectBtn();
    if (text) void defineQuery(text, { anchorRect: lastRangeRect, focus: true });
  });

  window.addEventListener('resize', () => {
    if (popover.hidden) return;
    if (isNarrow()) applySheetLayout();
    else if (trigger) positionPopover(trigger.getBoundingClientRect());
  });
}

function loadIndex(): GlossaryItem[] {
  const node = document.getElementById('glossary-index');
  if (!node?.textContent) return [];
  try {
    const parsed = JSON.parse(node.textContent) as GlossaryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && popover && !popover.hidden) {
    event.preventDefault();
    closePopover(true);
    return;
  }

  if (event.key === 'Tab' && popover && !popover.hidden && (isNarrow() || pinned)) {
    trapFocus(event);
  }

  const defineCombo = event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'i';
  const defineKey = !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.key === 'i';
  if (!defineCombo && !defineKey) return;
  if (isTyping(event.target)) return;
  if (searchOpen() || helpOpen()) return;
  event.preventDefault();
  void runShortcut();
}

async function runShortcut() {
  const text = selectedText();
  if (text) {
    const rect = selectionRect();
    await defineQuery(text, { anchorRect: rect, focus: true });
    return;
  }
  const tip = hoveredOrFocusedTip();
  if (tip) {
    openGlossary(tip, { pin: true, focus: true });
    return;
  }
  flashMessage('Select a word, or hover a dotted term, then press I to define it.');
}

async function defineQuery(text: string, options: { anchorRect: DOMRect | null; focus: boolean }) {
  const local = findTerm(text);
  if (local) {
    renderGlossary(local);
    openPopover({ ...options, pin: true });
    return;
  }
  renderLoading(text);
  openPopover({ ...options, pin: true });
  const wiki = await fetchWikipedia(text);
  renderWikipedia(text, wiki);
  if (isNarrow()) applySheetLayout();
  else if (options.anchorRect) positionPopover(options.anchorRect);
}

function openGlossary(tip: HTMLButtonElement, options: { pin: boolean; focus: boolean }) {
  const item = terms.find((term) => term.id === tip.dataset.termId);
  if (!item) return;
  renderGlossary(item);
  trigger = tip;
  tip.setAttribute('aria-expanded', 'true');
  tips.forEach((other) => {
    if (other !== tip) other.setAttribute('aria-expanded', 'false');
  });
  openPopover({ ...options, anchorRect: tip.getBoundingClientRect() });
}

function openPopover(options: { pin: boolean; focus: boolean; anchorRect?: DOMRect | null }) {
  if (!popover) return;
  pinned = options.pin;
  document.dispatchEvent(new CustomEvent('mnafshin:overlay-open', { detail: 'definition' }));
  popover.hidden = false;
  const narrow = isNarrow();
  popover.setAttribute('aria-modal', narrow ? 'true' : 'false');
  if (backdrop) backdrop.hidden = !narrow;
  if (narrow) applySheetLayout();
  else if (options.anchorRect) positionPopover(options.anchorRect);
  hideSelectBtn();
  if (options.focus) {
    (closeBtn ?? popover).focus();
  }
}

function closePopover(restoreFocus: boolean) {
  if (!popover || popover.hidden) return;
  popover.hidden = true;
  if (backdrop) backdrop.hidden = true;
  popover.setAttribute('aria-modal', 'false');
  pinned = false;
  const from = trigger;
  trigger = null;
  tips.forEach((tip) => tip.setAttribute('aria-expanded', 'false'));
  if (restoreFocus && from) {
    suppressFocusOpen = true;
    from.focus();
    queueMicrotask(() => {
      suppressFocusOpen = false;
    });
  }
}

function scheduleClose() {
  window.clearTimeout(hoverTimer);
  hoverTimer = window.setTimeout(() => {
    if (pinned) return;
    if (popover?.matches(':hover') || lastHoverTip?.matches(':hover')) return;
    closePopover(false);
  }, 280);
}

function renderGlossary(item: GlossaryItem) {
  if (!popover || !termEl || !bodyEl || !badgeEl || !linkEl || !sourceEl || !attrEl) return;
  popover.dataset.section = item.sectionId;
  termEl.textContent = item.term;
  bodyEl.textContent = trimSentences(item.definition, 2);
  badgeEl.hidden = false;
  badgeEl.textContent = item.sectionName;
  sourceEl.hidden = true;
  attrEl.hidden = true;
  linkEl.hidden = false;
  linkEl.href = item.href;
  linkEl.textContent = item.linkLabel || 'Read the article';
  linkEl.rel = '';
  linkEl.target = '';
}

function renderLoading(query: string) {
  if (!popover || !termEl || !bodyEl || !badgeEl || !linkEl || !sourceEl || !attrEl) return;
  delete popover.dataset.section;
  termEl.textContent = query;
  bodyEl.textContent = `Looking up “${query}”…`;
  badgeEl.hidden = true;
  sourceEl.hidden = true;
  attrEl.hidden = true;
  linkEl.hidden = true;
}

function renderWikipedia(query: string, wiki: WikiCache) {
  if (!popover || !termEl || !bodyEl || !badgeEl || !linkEl || !sourceEl || !attrEl) return;
  delete popover.dataset.section;
  termEl.textContent = wiki.title || query;
  badgeEl.hidden = true;
  if (wiki.kind === 'ok') {
    bodyEl.textContent = wiki.extract;
    sourceEl.hidden = false;
    sourceEl.textContent = 'From Wikipedia';
    attrEl.hidden = false;
    linkEl.hidden = false;
    linkEl.href = wiki.url;
    linkEl.textContent = 'Open on Wikipedia';
    linkEl.rel = 'noopener noreferrer';
    linkEl.target = '_blank';
    return;
  }
  if (wiki.kind === 'disambiguation') {
    bodyEl.textContent =
      wiki.message ||
      `“${wiki.title || query}” is a disambiguation page on Wikipedia. Open it to pick the intended article.`;
    sourceEl.hidden = false;
    sourceEl.textContent = 'From Wikipedia';
    attrEl.hidden = false;
    linkEl.hidden = false;
    linkEl.href = wiki.url;
    linkEl.textContent = 'Open on Wikipedia';
    linkEl.rel = 'noopener noreferrer';
    linkEl.target = '_blank';
    return;
  }
  bodyEl.textContent =
    wiki.message || `No Wikipedia article was found for “${query}”.`;
  sourceEl.hidden = true;
  attrEl.hidden = true;
  if (wiki.url) {
    linkEl.hidden = false;
    linkEl.href = wiki.url;
    linkEl.textContent = 'Search Wikipedia';
    linkEl.rel = 'noopener noreferrer';
    linkEl.target = '_blank';
  } else {
    linkEl.hidden = true;
  }
}

function flashMessage(message: string) {
  if (!popover || !termEl || !bodyEl || !badgeEl || !linkEl || !sourceEl || !attrEl) return;
  delete popover.dataset.section;
  termEl.textContent = 'Quick definition';
  bodyEl.textContent = message;
  badgeEl.hidden = true;
  sourceEl.hidden = true;
  attrEl.hidden = true;
  linkEl.hidden = true;
  const rect = lastHoverTip?.getBoundingClientRect() ?? new DOMRect(16, 48, 0, 0);
  openPopover({ pin: true, focus: true, anchorRect: rect });
}

function findTerm(query: string) {
  const text = query.replace(/\s+/g, ' ').trim();
  if (!text) return undefined;
  const section = currentSection();
  const candidates = terms.filter((item) =>
    item.lookupPhrases.some((phrase) => phrasesMatch(phrase, text)) || phrasesMatch(item.term, text),
  );
  if (candidates.length === 0) return undefined;
  if (section) {
    const own = candidates.find((item) => item.sectionId === section);
    if (own) return own;
  }
  return candidates[0];
}

function phrasesMatch(phrase: string, text: string) {
  if (isCaseSensitivePhrase(phrase)) return phrase === text;
  return phrase.toLowerCase() === text.toLowerCase();
}

function isCaseSensitivePhrase(phrase: string) {
  if (/^[@A-Z0-9][A-Z0-9_+-]*$/.test(phrase) && phrase.length <= 6) return true;
  if (/[a-z][A-Z]|@[A-Za-z]/.test(phrase)) return true;
  return false;
}

function hoveredOrFocusedTip() {
  if (lastHoverTip && lastHoverTip.matches(':hover, :focus-visible, :focus')) return lastHoverTip;
  const active = document.activeElement;
  if (active instanceof HTMLButtonElement && active.classList.contains('term-tip')) return active;
  return lastHoverTip;
}

function currentSection() {
  return document.querySelector('[data-section]')?.getAttribute('data-section') ?? null;
}

function selectedText() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return '';
  const text = selection.toString().replace(/\s+/g, ' ').trim();
  if (!text || text.length > SELECT_MAX) return '';
  return text;
}

function selectionRect() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  return rect;
}

function syncSelectButton() {
  if (!selectBtn || !isCoarse()) {
    hideSelectBtn();
    return;
  }
  if (popover && !popover.hidden) {
    hideSelectBtn();
    return;
  }
  const text = selectedText();
  const rect = selectionRect();
  if (!text || !rect) {
    hideSelectBtn();
    return;
  }
  lastRangeRect = rect;
  selectBtn.hidden = false;
  const width = selectBtn.offsetWidth || 88;
  const height = Math.max(selectBtn.offsetHeight, 44);
  let left = rect.left + rect.width / 2 - width / 2;
  let top = rect.bottom + 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  left = Math.min(Math.max(8, left), vw - width - 8);
  if (top + height > vh - 8) top = Math.max(BAR + 8, rect.top - height - 10);
  selectBtn.style.left = `${Math.round(left)}px`;
  selectBtn.style.top = `${Math.round(top)}px`;
}

function hideSelectBtn() {
  if (selectBtn) selectBtn.hidden = true;
}

function positionPopover(anchor: DOMRect) {
  if (!popover) return;
  popover.classList.remove('is-sheet');
  popover.style.bottom = '';
  popover.style.right = '';
  popover.style.width = '';
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = anchor.bottom + GAP;
  if (top + height > vh - GAP) top = anchor.top - GAP - height;
  if (top < BAR) top = BAR;
  if (top + height > vh - GAP) top = Math.max(BAR, vh - GAP - height);
  let left = anchor.left;
  if (left + width > vw - GAP) left = vw - GAP - width;
  if (left < GAP) left = GAP;
  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(top)}px`;
}

function applySheetLayout() {
  if (!popover) return;
  popover.classList.add('is-sheet');
  popover.style.left = '0';
  popover.style.top = 'auto';
  popover.style.right = '0';
  popover.style.bottom = '0';
  popover.style.width = '100%';
}

async function fetchWikipedia(title: string): Promise<WikiCache> {
  const key = `${WIKI_PREFIX}${title.trim().toLowerCase()}`;
  const cached = readCache(key);
  if (cached) return cached;
  try {
    const url = `${WIKI_API}${encodeURIComponent(title.trim())}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (response.status === 404) {
      const result: WikiCache = {
        title,
        extract: '',
        url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title)}`,
        kind: 'missing',
        message: `No Wikipedia article was found for “${title}”.`,
      };
      writeCache(key, result);
      return result;
    }
    if (!response.ok) {
      return {
        title,
        extract: '',
        url: '',
        kind: 'error',
        message: `Wikipedia could not be reached (${response.status}). Try again in a moment.`,
      };
    }
    const data = (await response.json()) as {
      title?: string;
      extract?: string;
      type?: string;
      content_urls?: { desktop?: { page?: string } };
    };
    const pageUrl = data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title ?? title)}`;
    if (data.type === 'disambiguation') {
      const result: WikiCache = {
        title: data.title ?? title,
        extract: '',
        url: pageUrl,
        kind: 'disambiguation',
        message: `“${data.title ?? title}” is a disambiguation page on Wikipedia. Open it to pick the intended article.`,
      };
      writeCache(key, result);
      return result;
    }
    const extract = trimSentences(data.extract ?? '', 3);
    if (!extract) {
      const result: WikiCache = {
        title: data.title ?? title,
        extract: '',
        url: pageUrl,
        kind: 'missing',
        message: `No Wikipedia summary was available for “${data.title ?? title}”.`,
      };
      writeCache(key, result);
      return result;
    }
    const result: WikiCache = { title: data.title ?? title, extract, url: pageUrl, kind: 'ok' };
    writeCache(key, result);
    return result;
  } catch {
    return {
      title,
      extract: '',
      url: '',
      kind: 'error',
      message: 'Wikipedia could not be reached. Check your connection and try again.',
    };
  }
}

function readCache(key: string): WikiCache | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as WikiCache;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: WikiCache) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or quota */
  }
}

function trimSentences(text: string, max: number) {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';
  const parts = trimmed.match(/[^.!?]+[.!?]+(?:["”'])?|[^.!?]+$/g) ?? [trimmed];
  return parts.slice(0, max).join(' ').trim();
}

function trapFocus(event: KeyboardEvent) {
  if (!popover) return;
  const focusable = popover.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !popover.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !popover.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function searchOpen() {
  return Boolean(document.querySelector<HTMLDialogElement>('[data-search-dialog][open]'));
}

function helpOpen() {
  return Boolean(document.querySelector<HTMLDialogElement>('[data-shortcut-help][open]'));
}

function canHover() {
  return window.matchMedia(FINE_HOVER).matches;
}

function isNarrow() {
  return window.matchMedia(NARROW).matches;
}

function isCoarse() {
  return window.matchMedia(COARSE).matches || 'ontouchstart' in window;
}

export {};
