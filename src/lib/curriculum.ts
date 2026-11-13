import { type Article, type ArticleSectionId } from './articles';
import { getConceptArticles } from './spring';
import { getSystemDesignConceptArticles } from './system-design';
import { getTermsConceptArticles } from './terms';
import { getK8sConceptArticles } from './k8s';

/** Published concept articles of a section, in its learning order. */
export async function getCurriculum(section: ArticleSectionId): Promise<Article[]> {
  if (section === 'spring') return getConceptArticles();
  if (section === 'terms') return getTermsConceptArticles();
  if (section === 'k8s') return getK8sConceptArticles();
  return getSystemDesignConceptArticles();
}

export type CurriculumPosition = {
  /** 1-based position in the learning order. */
  index: number;
  total: number;
  previous?: Article;
  next?: Article;
};

/**
 * Where a concept article sits in its section's learning order, with its
 * neighbours. Weekly reviews are not part of the learning order and get
 * `undefined`.
 */
export async function getCurriculumPosition(
  article: Article,
  section: ArticleSectionId,
): Promise<CurriculumPosition | undefined> {
  if (article.data.kind === 'weekly') return undefined;
  const articles = await getCurriculum(section);
  const at = articles.findIndex((entry) => entry.id === article.id);
  if (at === -1) return undefined;
  return {
    index: at + 1,
    total: articles.length,
    previous: articles[at - 1],
    next: articles[at + 1],
  };
}
