// Reading progress lives in the reader's browser only (no account, no sync).

export const PROGRESS_KEY = 'mnafshin.info:progress';

export type ArticleProgress = {
  url: string;
  title: string;
  section: string;
  percent: number;
  anchor: string | null;
  read: boolean;
  visitedAt: string;
  dismissedPercent?: number;
  quizComplete?: boolean;
};

export function pageUrl(href?: string): string {
  const url = href ? new URL(href, location.origin) : location;
  return `${url.pathname}${url.search}`;
}

export function loadProgress(): Record<string, ArticleProgress> {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const out: Record<string, ArticleProgress> = {};
  for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
    if (isProgress(value)) out[key] = value;
  }
  return out;
}

export function saveProgress(items: Record<string, ArticleProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(items));
}

export function getProgress(url: string): ArticleProgress | undefined {
  return loadProgress()[url];
}

export function upsertProgress(
  input: Pick<ArticleProgress, 'url' | 'title' | 'section'> &
    Partial<Omit<ArticleProgress, 'url' | 'title' | 'section'>>,
): ArticleProgress {
  const items = loadProgress();
  const current = items[input.url];
  const next: ArticleProgress = {
    url: input.url,
    title: input.title,
    section: input.section,
    percent: input.percent ?? current?.percent ?? 0,
    anchor: input.anchor !== undefined ? input.anchor : (current?.anchor ?? null),
    read: input.read ?? current?.read ?? false,
    visitedAt: input.visitedAt ?? new Date().toISOString(),
    dismissedPercent:
      input.dismissedPercent !== undefined
        ? input.dismissedPercent
        : current?.dismissedPercent,
    quizComplete: input.quizComplete ?? current?.quizComplete,
  };
  items[input.url] = next;
  saveProgress(items);
  return next;
}

export function listInProgress(minPercent = 10): ArticleProgress[] {
  return Object.values(loadProgress())
    .filter((item) => !item.read && item.percent >= minPercent)
    .sort((a, b) => b.visitedAt.localeCompare(a.visitedAt));
}

function isProgress(value: unknown): value is ArticleProgress {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.url === 'string' &&
    typeof item.title === 'string' &&
    typeof item.section === 'string' &&
    typeof item.percent === 'number' &&
    Number.isFinite(item.percent) &&
    (item.anchor === null || typeof item.anchor === 'string') &&
    typeof item.read === 'boolean' &&
    typeof item.visitedAt === 'string'
  );
}
