import { getConceptArticles, publicRelatedVideos } from './spring';
import { getPublishedVideosByDate, videoPath } from './videos';

export type LatestVideo = {
  label: string;
  title: string;
  pubDate: Date;
  /** Site path of the page that shows this video. */
  path: string;
};

/**
 * Public videos, newest first. A long tutorial links to the concept article
 * that embeds it; a weekly review links to its own page.
 */
export async function getLatestVideos(): Promise<LatestVideo[]> {
  const articles = await getConceptArticles();
  const tutorials = articles.flatMap((article) =>
    publicRelatedVideos(article)
      .filter((video) => video.pubDate !== undefined)
      .map((video) => ({
        label: video.id,
        title: video.title,
        pubDate: video.pubDate as Date,
        path: `spring/${article.id}/`,
      })),
  );
  const weeklies = (await getPublishedVideosByDate()).map((video) => ({
    label: video.data.seriesLabel,
    title: video.data.title,
    pubDate: video.data.pubDate,
    path: videoPath(video.id),
  }));
  return [...tutorials, ...weeklies].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
  );
}
