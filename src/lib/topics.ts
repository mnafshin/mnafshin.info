import type { Article } from './articles';

/**
 * Key terms for the topic map, taken from the articles themselves: the
 * Spring annotations they use in inline code (`@Transactional`) and the
 * terms they mark in bold (**context window**). Nothing is invented and no
 * outside data (search volume, rankings) is used: each term is shown with how
 * often each published concept article mentions it. Only the article body is
 * read, never related-video front matter, so a hidden video can not leak
 * into the map.
 */
export type KeyTerm = {
  term: string;
  /** What to search for when the term is selected. */
  query: string;
  /** Mentions per article, in the order of the articles passed in. */
  mentions: number[];
  /** Number of articles that mention the term at least once. */
  articleCount: number;
};

const ANNOTATION = /`(@[A-Z][A-Za-z]+)`/g;
const BOLD = /\*\*([^*\n]{3,40})\*\*/g;

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripCodeFences(body: string) {
  return body.replace(/```[\s\S]*?```/g, ' ');
}

type Candidate = { term: string; key: string; kind: 'annotation' | 'bold' };

function candidates(body: string): Candidate[] {
  const found: Candidate[] = [];
  for (const match of body.matchAll(ANNOTATION)) {
    found.push({ term: match[1], key: match[1], kind: 'annotation' });
  }
  for (const match of stripCodeFences(body).matchAll(BOLD)) {
    const term = match[1].trim();
    // Bold run-in labels such as "**Add.**" or "**Rules** come first" are
    // not terms: skip punctuation-ended labels and single capitalised words.
    if (/[.:!?,;]$/.test(term) || term.length < 4 || /^[A-Z][a-z]+$/.test(term)) continue;
    // "Workflow" at the start of a sentence is the term "workflow"; keep
    // acronyms and names such as "MCP" or "GPT-6.1 Terra" as written.
    const display = /^[A-Z][a-z-]*( [a-z-]+)*$/.test(term) ? term.toLowerCase() : term;
    found.push({ term: display, key: display.toLowerCase().replace(/s$/, ''), kind: 'bold' });
  }
  return found;
}

function countMentions(body: string, candidate: Candidate) {
  const pattern =
    candidate.kind === 'annotation'
      ? new RegExp(`${escapeRegExp(candidate.term)}\\b`, 'g')
      : new RegExp(`\\b${escapeRegExp(candidate.key)}(s|es)?\\b`, 'gi');
  const text = candidate.kind === 'annotation' ? body : stripCodeFences(body);
  return text.match(pattern)?.length ?? 0;
}

/** The most widely used key terms across the given articles. */
export function getKeyTerms(articles: Article[], limit = 16): KeyTerm[] {
  const seen = new Map<string, Candidate>();
  for (const article of articles) {
    for (const candidate of candidates(article.body ?? '')) {
      if (!seen.has(candidate.key)) seen.set(candidate.key, candidate);
    }
  }

  const ranked = [...seen.values()]
    .map((candidate, order) => {
      const mentions = articles.map((article) => countMentions(article.body ?? '', candidate));
      return {
        term: candidate.term,
        query: candidate.term.replace(/^@/, ''),
        mentions,
        articleCount: mentions.filter((count) => count > 0).length,
        total: mentions.reduce((sum, count) => sum + count, 0),
        order,
      };
    })
    .filter((item) => item.articleCount > 0)
    .sort((a, b) => b.articleCount - a.articleCount || b.total - a.total || a.order - b.order);

  // The most widely used terms first; then make sure every article has at
  // least one row, by adding its most-mentioned term if none is shown yet.
  const picked = ranked.slice(0, limit);
  articles.forEach((_, column) => {
    if (picked.some((item) => item.mentions[column] > 0)) return;
    const best = ranked
      .filter((item) => !picked.includes(item) && item.mentions[column] > 0)
      .sort((a, b) => b.mentions[column] - a.mentions[column])[0];
    if (best) picked.push(best);
  });

  return ranked
    .filter((item) => picked.includes(item))
    .map(({ term, query, mentions, articleCount }) => ({ term, query, mentions, articleCount }));
}

/** Shade of one heatmap cell: 0 (not mentioned) to 3 (mentioned often). */
export function heatLevel(count: number): 0 | 1 | 2 | 3 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
}
