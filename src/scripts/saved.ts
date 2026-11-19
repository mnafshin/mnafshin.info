import { loadBookmarks, removeBookmark, type Bookmark } from './bookmarks';
import { listInProgress, type ArticleProgress } from './progress';

const list = document.querySelector<HTMLElement>('[data-saved-list]');
if (list) {
  render(list);
}
renderContinue();

function render(list: HTMLElement) {
  let items: Bookmark[] = [];
  try {
    items = loadBookmarks();
  } catch {
    list.innerHTML =
      '<p class="muted">Bookmarks could not be read from this browser.</p>';
    return;
  }

  if (items.length === 0) {
    list.innerHTML =
      '<p class="muted">No saved articles yet. Open an article and use the bookmark button to save it here.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'post-list saved-list';

  for (const item of items) {
    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = item.url;
    link.textContent = item.title;
    li.append(link);

    const meta = document.createElement('p');
    meta.className = 'meta';
    const when = formatSavedAt(item.savedAt);
    meta.textContent = when
      ? `${item.section} · Saved ${when}`
      : item.section;
    li.append(meta);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'saved-remove';
    remove.setAttribute('aria-label', `Remove bookmark: ${item.title}`);
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      try {
        removeBookmark(item.url);
      } catch {
        /* localStorage can be unavailable */
      }
      render(list);
    });
    li.append(remove);

    ul.append(li);
  }

  list.replaceChildren(ul);
}

function renderContinue() {
  const section = document.querySelector<HTMLElement>('[data-continue-list]');
  const target = document.querySelector<HTMLElement>('[data-continue-items]');
  if (!section || !target) return;

  let items: ArticleProgress[] = [];
  try {
    items = listInProgress().slice(0, 8);
  } catch {
    return;
  }
  if (items.length === 0) {
    section.hidden = true;
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'post-list saved-list';
  for (const item of items) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.url;
    link.textContent = item.title;
    li.append(link);

    const meta = document.createElement('p');
    meta.className = 'meta';
    const when = formatSavedAt(item.visitedAt);
    const parts = [item.section, `${Math.round(item.percent)}% through`];
    if (when) parts.push(`Last read ${when}`);
    meta.textContent = parts.join(' · ');
    li.append(meta);
    ul.append(li);
  }
  target.replaceChildren(ul);
  section.hidden = false;
}

function formatSavedAt(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return null;
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Berlin',
  });
}
