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

/**
 * Sections linked from the main nav and the home-page cards: those marked
 * `inNav`, plus any other section that already has a published post.
 * Hidden sections (inNav: false) stay off those lists until the first
 * article exists.
 */
export async function getVisibleSections() {
  const rows = await Promise.all(
    SECTIONS.map(async (section) => ({
      section,
      count: (await getPublishedEntries(section.id)).length,
    })),
  );
  return rows
    .filter(({ section, count }) => section.inNav || count > 0)
    .map(({ section }) => section);
}
