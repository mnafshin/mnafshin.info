import { isPublicVideo, type Article } from './articles';
import { ogKey } from './og';
import { withBase } from './site';

export type CoverImage = {
  src: string;
  width: number;
  height: number;
};

/** YouTube stills: mqdefault is 16:9, hqdefault is always present but has letterboxing. */
export function youtubeThumb(youtubeId: string, kind: 'card' | 'player' = 'card'): CoverImage {
  if (kind === 'player') {
    return { src: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`, width: 480, height: 360 };
  }
  return { src: `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`, width: 320, height: 180 };
}

export function ogCover(sectionPath: string, id: string): CoverImage {
  return { src: withBase(`og/${ogKey(`${sectionPath}/${id}`)}.png`), width: 1200, height: 630 };
}

export function firstYoutubeId(article: Article) {
  return article.data.relatedVideos.find((video) => isPublicVideo(video))?.youtubeId;
}

/** Prefer a related-video still; otherwise the generated OG image. */
export function articleCover(article: Article, sectionPath: string): CoverImage {
  const youtubeId = firstYoutubeId(article);
  return youtubeId ? youtubeThumb(youtubeId) : ogCover(sectionPath, article.id);
}
