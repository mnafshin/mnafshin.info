import { type Article, type ArticleSectionId } from './articles';
import { withBase, getSection } from './site';
import { getDbConceptArticles } from './db';
import { getK8sConceptArticles } from './k8s';
import { getSecurityConceptArticles } from './security';
import { getConceptArticles } from './spring';
import { getSystemDesignConceptArticles } from './system-design';
import { getTermsConceptArticles } from './terms';

/** Published concept articles of a section, in its learning order. */
export async function getCurriculum(section: ArticleSectionId): Promise<Article[]> {
  switch (section) {
    case 'spring':
      return getConceptArticles();
    case 'terms':
      return getTermsConceptArticles();
    case 'k8s':
      return getK8sConceptArticles();
    case 'system-design':
      return getSystemDesignConceptArticles();
    case 'security':
      return getSecurityConceptArticles();
    case 'db':
      return getDbConceptArticles();
  }
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

export type CurriculumGraphEntry = {
  title: string;
  section: string;
  next?: { url: string; title: string };
};

/** Published concept articles and the next item in each section's learning path. */
export async function getCurriculumGraph(): Promise<Record<string, CurriculumGraphEntry>> {
  const sections: ArticleSectionId[] = ['spring', 'terms', 'k8s', 'system-design', 'security', 'db'];
  const graph: Record<string, CurriculumGraphEntry> = {};
  for (const id of sections) {
    const articles = await getCurriculum(id);
    const section = getSection(id);
    articles.forEach((article, index) => {
      const url = withBase(`${section.path}/${article.id}/`);
      const following = articles[index + 1];
      graph[url] = {
        title: article.data.title,
        section: section.name,
        next: following
          ? { url: withBase(`${section.path}/${following.id}/`), title: following.data.title }
          : undefined,
      };
    });
  }
  return graph;
}
