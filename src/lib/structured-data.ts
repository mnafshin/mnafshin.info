import type { Crumb } from './nav';
import { LINKS, SITE_TITLE } from './site';

/** schema.org Person for the site's author. */
export function author(site: URL | undefined) {
  return {
    '@type': 'Person',
    name: SITE_TITLE,
    url: new URL('/', site).toString(),
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
    '@type': 'BlogPosting',
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

export function wordCount(markdown: string | undefined) {
  return (markdown ?? '').split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 220));
}
