import fs from 'node:fs';
import { gitLastUpdated } from './content-meta';

/**
 * Best git lastmod for a public pathname. Prefers the content file for
 * articles, otherwise the page source. Returns undefined when history is
 * missing, so the sitemap integration can omit lastmod rather than invent a date.
 */
export function sitemapLastmod(pathname: string): Date | undefined {
  const files = filesForPath(pathname);
  const dates = files
    .map((file) => gitLastUpdated(file))
    .filter((date): date is Date => Boolean(date));
  if (dates.length === 0) return undefined;
  return dates.reduce((latest, date) => (date > latest ? date : latest));
}

function filesForPath(pathname: string): string[] {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return existing(['src/pages/index.astro']);
  if (path === '/about') return existing(['src/pages/about.astro']);
  if (path === '/glossary') return existing(['src/pages/glossary.astro', 'src/lib/glossary.ts', 'src/data/glossaries.ts']);

  const sectionIndex = path.match(/^\/(spring|terms|k8s|system-design|security|db|ai)$/);
  if (sectionIndex) {
    return existing([
      `src/pages/${sectionIndex[1]}/index.astro`,
      // The listing changes when articles in this section do.
    ]);
  }

  const sectionGlossary = path.match(/^\/(spring|terms|k8s|system-design|security|db|ai)\/glossary$/);
  if (sectionGlossary) {
    return existing([
      `src/pages/${sectionGlossary[1]}/glossary.astro`,
      'src/components/SectionGlossaryPage.astro',
      'src/data/glossaries.ts',
      'src/lib/glossary.ts',
    ]);
  }

  const article = path.match(/^\/(spring|terms|k8s|system-design|security|db|ai)\/([^/]+)$/);
  if (article) {
    const [, section, slug] = article;
    const files = [`src/content/${section}/${slug}.md`];
    if (section === 'spring') files.push(`src/content/videos/${slug}.md`);
    return existing(files);
  }

  return [];
}

function existing(files: string[]) {
  return files.filter((file) => fs.existsSync(file));
}
