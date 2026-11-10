export const SITE_TITLE = 'Afshin Amini';
export const SITE_DESCRIPTION =
  'Java and Spring developer. Articles from the SpringUniverse and Termsplained channels.';

export const LINKS = {
  github: 'https://github.com/mnafshin',
  linkedin: 'https://www.linkedin.com/in/mnafshin',
  springuniverse: 'https://www.youtube.com/@springuniverse',
  termsplained: 'https://www.youtube.com/@Termsplained',
} as const;

export const SECTIONS = [
  {
    id: 'spring',
    name: 'SpringUniverse',
    tagline: 'Java and Spring tutorials, weekly reviews, and notes.',
    path: 'spring',
    youtube: LINKS.springuniverse,
    inNav: true,
  },
  {
    id: 'terms',
    name: 'Termsplained',
    tagline: 'Clear explanations of technical terms.',
    path: 'terms',
    youtube: LINKS.termsplained,
    inNav: true,
  },
  {
    id: 'ai',
    name: 'AI',
    tagline: 'A new section, not yet started.',
    path: 'ai',
    youtube: null,
    inNav: false,
  },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export function getSection(id: SectionId) {
  const section = SECTIONS.find((item) => item.id === id);
  if (!section) {
    throw new Error(`Unknown section: ${id}`);
  }
  return section;
}

/** Prefix an internal path with the configured base (needed on github.io). */
export function withBase(path = '') {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const cleaned = path.replace(/^\/+/, '');
  return cleaned ? `${prefix}${cleaned}` : prefix;
}

export function isPreviewHost(site: URL | undefined) {
  return Boolean(site?.hostname.endsWith('github.io'));
}
