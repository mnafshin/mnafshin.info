import type { Crumb } from './nav';
import { LINKS, SITE_DESCRIPTION, SITE_TITLE, type SectionId } from './site';
import type { SectionGlossaryTerm } from './glossary';

/** schema.org Person for the site's author. */
export function author(site: URL | undefined) {
  return {
    '@type': 'Person',
    name: SITE_TITLE,
    url: new URL('about/', site).toString(),
    sameAs: [LINKS.github, LINKS.linkedin, LINKS.springuniverse, LINKS.termsplained],
  };
}

/** schema.org BreadcrumbList; crumbs without an href use the page URL. */
export function breadcrumbList(items: Crumb[], pageUrl: URL, site: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? new URL(item.href, site).toString() : pageUrl.toString(),
    })),
  };
}

export function blogPosting(options: {
  site: URL | undefined;
  url: URL;
  title: string;
  description: string;
  image: string;
  published: Date;
  modified?: Date;
  sectionName: string;
  sectionUrl: string;
  keywords?: string[];
  wordCount?: number;
}) {
  const person = author(options.site);
  return {
    '@context': 'https://schema.org',
    '@type': ['BlogPosting', 'TechArticle'],
    headline: options.title,
    description: options.description,
    image: options.image,
    url: options.url.toString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': options.url.toString() },
    datePublished: options.published.toISOString(),
    dateModified: (options.modified ?? options.published).toISOString(),
    inLanguage: 'en',
    author: person,
    publisher: person,
    isPartOf: { '@type': 'Blog', name: options.sectionName, url: options.sectionUrl },
    ...(options.keywords && options.keywords.length > 0 ? { keywords: options.keywords.join(', ') } : {}),
    ...(options.wordCount ? { wordCount: options.wordCount } : {}),
  };
}

/** A YouTube video that is actually embedded on the page. Omits uploadDate when it is unknown. */
export function videoObject(options: {
  name: string;
  youtubeId: string;
  description?: string;
  uploadDate?: Date;
}) {
  const watch = `https://www.youtube.com/watch?v=${options.youtubeId}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: options.name,
    thumbnailUrl: `https://i.ytimg.com/vi/${options.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${options.youtubeId}`,
    url: watch,
    contentUrl: watch,
    ...(options.description ? { description: options.description } : {}),
    ...(options.uploadDate ? { uploadDate: options.uploadDate.toISOString() } : {}),
  };
}

export function learningCourse(options: {
  site: URL | undefined;
  url: URL;
  name: string;
  description: string;
  parts: { name: string; url: string }[];
}) {
  const person = author(options.site);
  return {
    '@context': 'https://schema.org',
    '@type': ['Course', 'LearningResource'],
    name: options.name,
    description: options.description,
    url: options.url.toString(),
    inLanguage: 'en',
    provider: person,
    isAccessibleForFree: true,
    ...(options.parts.length > 0
      ? {
          hasPart: options.parts.map((part, index) => ({
            '@type': 'LearningResource',
            position: index + 1,
            name: part.name,
            url: part.url,
            isPartOf: options.url.toString(),
          })),
        }
      : {}),
  };
}

export function definedTermSet(options: {
  name: string;
  url: URL;
  description?: string;
  terms: SectionGlossaryTerm[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: options.name,
    url: options.url.toString(),
    ...(options.description ? { description: options.description } : {}),
    ...(options.terms.length > 0
      ? {
          hasDefinedTerm: options.terms.map((term) => ({
            '@type': 'DefinedTerm',
            name: term.term,
            description: term.definition,
            url: new URL(term.href, options.url).toString(),
            inDefinedTermSet: options.url.toString(),
          })),
        }
      : {}),
  };
}

export function webSite(site: URL | undefined) {
  const person = author(site);
  const url = new URL('/', site).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_TITLE,
    url,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    author: person,
    publisher: person,
  };
}

export function personPage(site: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    ...author(site),
    description: SITE_DESCRIPTION,
  };
}

/** Prefer a short summary when a page description is empty. */
export function pageDescription(data: { description?: string; summary?: string }) {
  const description = data.description?.trim();
  if (description) return description;
  return data.summary?.trim() || '';
}

/** One-line blurb for llms.txt: summary first, then the meta description. */
export function llmBlurb(data: { description?: string; summary?: string }) {
  return (data.summary?.trim() || data.description?.trim() || '').replace(/\s+/g, ' ');
}

export function wordCount(markdown: string | undefined) {
  return (markdown ?? '').split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 220));
}

export type { SectionId };
