// Bookmarks live in the reader's browser only (no account, no sync).

export const BOOKMARKS_KEY = 'mnafshin.info:bookmarks';

export type Bookmark = {
  title: string;
  url: string;
  section: string;
  savedAt: string;
};

export function loadBookmarks(): Bookmark[] {
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isBookmark);
}

export function saveBookmarks(items: Bookmark[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(items));
}

export function isBookmarked(url: string): boolean {
  return loadBookmarks().some((item) => item.url === url);
}

export function toggleBookmark(input: {
  title: string;
  url: string;
  section: string;
}): Bookmark[] {
  const items = loadBookmarks();
  const existing = items.findIndex((item) => item.url === input.url);
  if (existing >= 0) {
    items.splice(existing, 1);
  } else {
    items.unshift({
      title: input.title,
      url: input.url,
      section: input.section,
      savedAt: new Date().toISOString(),
    });
  }
  saveBookmarks(items);
  return items;
}

export function removeBookmark(url: string): Bookmark[] {
  const items = loadBookmarks().filter((item) => item.url !== url);
  saveBookmarks(items);
  return items;
}

function isBookmark(value: unknown): value is Bookmark {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.title === 'string' &&
    typeof item.url === 'string' &&
    typeof item.section === 'string' &&
    typeof item.savedAt === 'string'
  );
}
