import { listInProgress, pageUrl } from './progress';

type NextArticle = { url: string; title: string };
type PathEntry = { title: string; section: string; next?: NextArticle };

const root = document.querySelector<HTMLElement>('[data-continue-learning]');
const target = document.querySelector<HTMLElement>('[data-continue-learning-items]');
const source = document.querySelector<HTMLScriptElement>('[data-curriculum-paths]');
if (root && target && source) {
  try {
    render(root, target, source);
  } catch {
    root.hidden = true;
  }
}

function render(root: HTMLElement, target: HTMLElement, source: HTMLScriptElement) {
  const graph = JSON.parse(source.textContent || '{}') as Record<string, PathEntry>;
  const unfinished = listInProgress()[0];
  if (!unfinished) {
    root.hidden = true;
    return;
  }

  const path = graph[pageUrl(unfinished.url)];
  const items = document.createElement('ul');
  items.className = 'continue-learning-list';

  items.append(
    card(
      'Continue',
      unfinished.title,
      unfinished.url,
      path
        ? `${path.section} · ${Math.round(unfinished.percent)}% through`
        : `${unfinished.section} · ${Math.round(unfinished.percent)}% through`,
    ),
  );

  const next = path?.next;
  if (next) {
    items.append(card('Next in the path', next.title, next.url, path.section));
  }

  target.replaceChildren(items);
  root.hidden = false;
}

function card(eyebrow: string, title: string, href: string, meta: string) {
  const li = document.createElement('li');
  const label = document.createElement('p');
  label.className = 'eyebrow';
  label.textContent = eyebrow;
  const link = document.createElement('a');
  link.href = href;
  link.textContent = title;
  const info = document.createElement('p');
  info.className = 'meta';
  info.textContent = meta;
  li.append(label, link, info);
  return li;
}
