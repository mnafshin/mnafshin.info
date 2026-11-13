import type { Article } from './articles';

/** One planned or published curriculum topic, in learning order. */
export type CurriculumTopic = {
  /** Stable id from the channel curriculum (K01, S1.1, SD01, T7.1, …). */
  id: string;
  title: string;
  /** Chapter or part heading; consecutive topics with the same group are grouped. */
  group?: string;
  /** Badge text on the index. Defaults to `id`. */
  label?: string;
  /** Published article slug, when the mapping is already known. */
  articleId?: string;
};

/** Find the published article that belongs to a curriculum topic, if any. */
export function matchCurriculumArticle(
  topic: CurriculumTopic,
  articles: readonly Article[],
): Article | undefined {
  if (topic.articleId) {
    return articles.find((article) => article.id === topic.articleId);
  }
  const needle = topic.id.toLowerCase();
  return articles.find(
    (article) =>
      article.id === needle ||
      article.id.startsWith(`${needle}-`) ||
      article.data.title === topic.title,
  );
}
