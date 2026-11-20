import { getCollection } from 'astro:content';
import { getSection, withBase, type SectionId } from './site';

export type RelatedLink = {
  href: string;
  title: string;
  description: string;
  sectionId: SectionId;
  sectionName: string;
};

const SECTIONS: SectionId[] = [
  'spring',
  'terms',
  'k8s',
  'system-design',
  'db',
  'security',
  'ai',
];

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'from',
  'that', 'this', 'is', 'are', 'as', 'it', 'be', 'by', 'at', 'its', 'your',
  'you', 'how', 'what', 'why', 'when', 'vs', 'into', 'than', 'not', 'one',
  'can', 'use', 'used', 'using', 'does', 'do', 'if', 'we', 'our', 'their',
  'about', 'also', 'more', 'each', 'own', 'just', 'than', 'but',
]);

function tokens(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#]+/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP.has(word)),
  );
}

type Candidate = {
  sectionId: SectionId;
  id: string;
  title: string;
  description: string;
  tags: string[];
  topic?: string;
  words: Set<string>;
};

function link(entry: Candidate): RelatedLink {
  const section = getSection(entry.sectionId);
  return {
    href: withBase(`${section.path}/${entry.id}/`),
    title: entry.title,
    description: entry.description,
    sectionId: entry.sectionId,
    sectionName: section.name,
  };
}

/** 2–4 related articles, or an empty list when nothing is relevant enough to show. */
export async function relatedArticles(current: {
  sectionId: SectionId | string;
  id: string;
  data: {
    title: string;
    description: string;
    tags?: string[];
    topic?: string;
    related?: string[];
  };
}): Promise<RelatedLink[]> {
  const all: Candidate[] = [];
  for (const sectionId of SECTIONS) {
    const entries = await getCollection(sectionId, ({ data }) => !data.draft);
    for (const entry of entries) {
      if (sectionId === current.sectionId && entry.id === current.id) continue;
      const tags = 'tags' in entry.data ? (entry.data.tags ?? []) : [];
      const topic = 'topic' in entry.data ? entry.data.topic : undefined;
      all.push({
        sectionId,
        id: entry.id,
        title: entry.data.title,
        description: entry.data.description,
        tags,
        topic,
        words: tokens(`${entry.data.title} ${entry.data.description} ${tags.join(' ')} ${topic ?? ''}`),
      });
    }
  }

  const byKey = new Map(all.map((entry) => [`${entry.sectionId}/${entry.id}`, entry]));

  function resolve(ref: string) {
    if (byKey.has(ref)) return byKey.get(ref);
    return byKey.get(`${current.sectionId}/${ref}`);
  }

  const manual = (current.data.related ?? [])
    .map(resolve)
    .filter((entry): entry is Candidate => Boolean(entry));
  if (manual.length > 0) return manual.slice(0, 4).map(link);

  const mine = tokens(
    `${current.data.title} ${current.data.description} ${(current.data.tags ?? []).join(' ')} ${current.data.topic ?? ''}`,
  );
  const myTags = new Set((current.data.tags ?? []).map((tag) => tag.toLowerCase()));

  const scored = all
    .map((entry) => {
      let score = 0;
      for (const tag of entry.tags) {
        if (myTags.has(tag.toLowerCase())) score += 5;
      }
      if (current.data.topic && entry.topic && current.data.topic === entry.topic) score += 8;
      let overlap = 0;
      for (const word of entry.words) {
        if (mine.has(word)) overlap += 1;
      }
      score += overlap * 2;
      if (entry.sectionId === current.sectionId) score += 1;
      else if (overlap >= 2) score += 2;
      return { entry, score };
    })
    .filter((row) => row.score >= 4)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));

  const picked: Candidate[] = [];
  const used = new Set<string>();
  const take = (rows: typeof scored, limit = 4) => {
    for (const row of rows) {
      if (picked.length >= limit) break;
      const key = `${row.entry.sectionId}/${row.entry.id}`;
      if (used.has(key)) continue;
      used.add(key);
      picked.push(row.entry);
    }
  };
  const others = scored.filter((row) => row.entry.sectionId !== current.sectionId);
  const same = scored.filter((row) => row.entry.sectionId === current.sectionId);
  take(others, 2);
  take(same, picked.length + 2);
  take(scored, 4);
  return picked.slice(0, 4).map(link);
}
