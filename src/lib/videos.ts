import { getCollection, type CollectionEntry } from 'astro:content';

export type VideoEntry = CollectionEntry<'videos'>;

export function videoPath(id: string) {
  return `spring/${id}/`;
}

export function watchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function shortUrl(youtubeId: string) {
  return `https://www.youtube.com/shorts/${youtubeId}`;
}

export function embedUrl(youtubeId: string) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}

export function codeLinks(video: VideoEntry): string[] {
  const urls = [...video.data.codeUrls];
  if (video.data.codeUrl && !urls.includes(video.data.codeUrl)) {
    urls.unshift(video.data.codeUrl);
  }
  return urls;
}

export async function getPublishedVideos() {
  const entries = await getCollection('videos', ({ data }) => data.draft !== true);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublishedVideosByDate() {
  const entries = await getPublishedVideos();
  return entries.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export const SERIES_LABELS = {
  tutorials: 'Tutorials',
  weekly: 'Weekly reviews',
} as const;
