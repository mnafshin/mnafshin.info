type PublishedPage = { url: string; title: string; slug: string; section: string };

const box = document.querySelector<HTMLElement>('[data-not-found-suggest]');
const link = document.querySelector<HTMLAnchorElement>('[data-not-found-link]');
const source = document.querySelector<HTMLScriptElement>('[data-published-pages]');

if (box && link && source) {
  try {
    const pages = JSON.parse(source.textContent || '[]') as PublishedPage[];
    const match = closestPage(window.location.pathname, pages);
    if (match) {
      link.href = match.url;
      link.textContent = match.title;
      box.hidden = false;
    }
  } catch {
    box.hidden = true;
  }
}

function normalize(path: string) {
  return path.replace(/\/index\.html$/i, '/').replace(/\/+$/, '').replace(/^\/+/, '').toLowerCase();
}

function lastSegment(path: string) {
  return normalize(path).split('/').pop() ?? '';
}

function closestPage(pathname: string, pages: PublishedPage[]) {
  const path = normalize(pathname);
  const slug = lastSegment(path);
  if (!slug || slug.length < 2) return undefined;

  let best: PublishedPage | undefined;
  let bestScore = Infinity;

  for (const page of pages) {
    const pagePath = normalize(page.url);
    if (pagePath === path) return undefined;
    const pageSlug = page.slug.toLowerCase();
    let score = levenshtein(slug, pageSlug);
    if (slug === pageSlug) score = 0.25;
    else if (pageSlug.includes(slug) || slug.includes(pageSlug)) {
      score = Math.min(score, 0.6);
    }
    const full = levenshtein(path, pagePath);
    if (full < score) score = full;
    if (score < bestScore) {
      bestScore = score;
      best = page;
    }
  }

  if (!best) return undefined;
  if (best.slug.toLowerCase() === slug) return best;
  const threshold = Math.max(2, Math.floor(slug.length * 0.34));
  return bestScore <= threshold ? best : undefined;
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const next = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = next;
    }
  }
  return row[b.length];
}
