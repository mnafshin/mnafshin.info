import { loadProgress, pageUrl } from './progress';

const SELECTOR = '.section-page .article-index li a[href], .section-page .weekly-index li a[href], .section-page .post-list li a[href]';

const page = document.querySelector('.section-page');
if (page && !page.classList.contains('saved-page') && !page.classList.contains('search-page')) {
  try {
    apply(page);
  } catch {
    /* localStorage can be unavailable */
  }
}

function apply(page: Element) {
  const items = loadProgress();
  const links = uniqueLinks(page);
  if (links.length === 0) return;

  let read = 0;
  let started = 0;

  for (const link of links) {
    const progress = items[pageUrl(link.href)];
    const li = link.closest('li');
    if (!progress || !li) continue;

    if (progress.read) {
      read += 1;
      li.classList.add('is-read');
      const mark = document.createElement('span');
      mark.className = 'visually-hidden';
      mark.textContent = ' (read)';
      link.after(mark);
    } else if (progress.percent >= 10) {
      started += 1;
      li.classList.add('is-started');
      const bar = document.createElement('span');
      bar.className = 'index-progress';
      bar.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('span');
      fill.style.width = `${Math.min(100, Math.max(8, progress.percent))}%`;
      bar.append(fill);
      li.append(bar);
    }
  }

  if (read === 0 && started === 0) return;

  const line = document.createElement('p');
  line.className = 'section-read-progress muted';
  const parts = [`${read} of ${links.length} read`];
  if (started > 0) parts.push(`${started} in progress`);
  line.textContent = parts.join(' · ');

  const after = page.querySelector('.lede') ?? page.querySelector('h1');
  if (after) after.after(line);
  else page.prepend(line);
}

function uniqueLinks(page: Element): HTMLAnchorElement[] {
  const seen = new Set<string>();
  const out: HTMLAnchorElement[] = [];
  page.querySelectorAll<HTMLAnchorElement>(SELECTOR).forEach((link) => {
    if (link.origin !== location.origin) return;
    const key = pageUrl(link.href);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(link);
  });
  return out;
}
