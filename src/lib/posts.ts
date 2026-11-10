import { getCollection, type CollectionEntry } from 'astro:content';
import { SECTIONS, type SectionId } from './site';

export type PublishedPost = {
  section: (typeof SECTIONS)[number];
  entry: CollectionEntry<SectionId>;
};

export async function getPublishedEntries(section: SectionId) {
  const entries = await getCollection(section, ({ data }) => data.draft !== true);
  return entries.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export async function getAllPublishedPosts(): Promise<PublishedPost[]> {
  const groups = await Promise.all(
    SECTIONS.map(async (section) => {
      const entries = await getPublishedEntries(section.id);
      return entries.map((entry) => ({ section, entry }));
    }),
  );

  return groups
    .flat()
    .sort(
      (a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf(),
    );
}

export function postPath(section: SectionId, id: string) {
  return `${section}/${id}/`;
}
