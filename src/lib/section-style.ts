import type { SectionId } from './site';
export type { SectionId };

/** Light-theme section accents, kept in step with `src/styles/global.css`. */
export const DEFAULT_ACCENT = '#0f766e';

export const SECTION_ACCENT: Record<SectionId, string> = {
  spring: '#0f6b63',
  terms: '#5b21b6',
  security: '#9a3412',
  db: '#1d4ed8',
  k8s: '#0e7490',
  'system-design': '#9f1239',
  ai: '#a21caf',
};

export const SECTION_ACCENT_SOFT: Record<SectionId, string> = {
  spring: '#d1faf4',
  terms: '#ede9fe',
  security: '#ffedd5',
  db: '#dbeafe',
  k8s: '#cffafe',
  'system-design': '#ffe4e6',
  ai: '#fae8ff',
};

/** Inner SVG markup for the 24×24 stroke icons in `SectionIcon.astro`. */
export const SECTION_ICON_INNER: Record<SectionId, string> = {
  spring: `<path d="M12 21V11" /><path d="M12 11c0-5 3.5-8 7-8-1 5-4 7-7 8" /><path d="M12 11c0-5-3.5-8-7-8 1 5 4 7 7 8" /><path d="M8 17c2-1 4-1 8 0" />`,
  terms: `<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-7Z" /><path d="M8 9h8" /><path d="M8 13h5" />`,
  security: `<path d="M12 3 5 6.5v5c0 4.2 2.8 7.5 7 8.5 4.2-1 7-4.3 7-8.5v-5L12 3Z" /><path d="M9.2 12.2 11 14l3.8-4" />`,
  db: `<ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />`,
  k8s: `<rect x="4" y="4" width="7" height="7" rx="1.4" /><rect x="13" y="4" width="7" height="7" rx="1.4" /><rect x="4" y="13" width="7" height="7" rx="1.4" /><rect x="13" y="13" width="7" height="7" rx="1.4" />`,
  'system-design': `<rect x="3.5" y="4" width="7" height="6" rx="1.2" /><rect x="13.5" y="4" width="7" height="6" rx="1.2" /><rect x="8.5" y="14" width="7" height="6" rx="1.2" /><path d="M7 10v2.5c0 .8.7 1.5 1.5 1.5h7c.8 0 1.5-.7 1.5-1.5V10" />`,
  ai: `<path d="M9 3h6l1.2 3.6L20 9l-3.8 2.4L17 15H7l.8-3.6L4 9l3.8-2.4L9 3Z" /><circle cx="12" cy="9.5" r="1.8" />`,
};

export function sectionAccent(sectionId?: SectionId | null): string {
  return sectionId ? SECTION_ACCENT[sectionId] : DEFAULT_ACCENT;
}
