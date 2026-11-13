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
    tagline: 'Short Spring and Spring Boot articles with related videos, plus weekly reviews.',
    path: 'spring',
    youtube: LINKS.springuniverse,
    inNav: true,
  },
  {
    id: 'terms',
    name: 'Termsplained',
    tagline: 'Short articles that explain one AI term each, with related videos, plus weekly AI news reviews.',
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
  {
    id: 'k8s',
    name: 'KubePlained',
    tagline: 'Short Kubernetes articles for backend developers, in learning order, with related videos.',
    path: 'k8s',
    youtube: null,
    inNav: false,
  },
  {
    id: 'system-design',
    name: 'System Design',
    tagline: 'Short architecture articles for senior and staff backend engineers, in learning order, with related videos once the channel is public.',
    path: 'system-design',
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
