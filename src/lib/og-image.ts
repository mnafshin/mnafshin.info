import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { OG_HEIGHT, OG_WIDTH } from './og';
import { sectionAccent, SECTION_ICON_INNER, type SectionId } from './section-style';

// Build-time social preview images, drawn in the site's own colours and
// type: the warm paper background, the section accent, its icon, and a
// clear mnafshin.info mark.

export type OgCard = {
  /** Small uppercase line above the title, e.g. "SpringUniverse · Article 4 of 10". */
  eyebrow: string;
  title: string;
  description?: string;
  /** Path shown under the wordmark, e.g. "mnafshin.info/spring". */
  footer: string;
  /** When set, the card uses this section's colour and icon. */
  sectionId?: SectionId;
};

const COLORS = {
  bg: '#f6f2ea',
  card: '#fffcf7',
  text: '#1c1917',
  muted: '#57534e',
  faint: '#78716c',
  border: '#e7e0d4',
  accent: '#0f766e',
  accentSoft: '#ccfbf1',
};

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };

function h(type: string, style: Record<string, unknown>, children?: unknown): Node {
  return { type, props: { style, children } };
}

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 600 | 700; style: 'normal' }[]> | undefined;

function loadFonts() {
  const file = (pkg: string, name: string) =>
    readFile(join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', name));
  fonts ??= Promise.all([
    file('source-serif-4', 'source-serif-4-latin-600-normal.woff'),
    file('inter', 'inter-latin-400-normal.woff'),
    file('inter', 'inter-latin-600-normal.woff'),
  ]).then(([serif, sans, sansBold]) => [
    { name: 'Source Serif 4', data: serif, weight: 600, style: 'normal' },
    { name: 'Inter', data: sans, weight: 400, style: 'normal' },
    { name: 'Inter', data: sansBold, weight: 600, style: 'normal' },
  ]);
  return fonts;
}

const iconCache = new Map<string, string>();

function sectionIconSrc(sectionId: SectionId, stroke = '#f6f2ea'): string {
  const key = `${sectionId}:${stroke}`;
  const cached = iconCache.get(key);
  if (cached) return cached;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${SECTION_ICON_INNER[sectionId]}</svg>`;
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 80 } }).render().asPng();
  const src = `data:image/png;base64,${Buffer.from(png).toString('base64')}`;
  iconCache.set(key, src);
  return src;
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
}

function titleSize(title: string) {
  if (title.length <= 34) return 78;
  if (title.length <= 56) return 66;
  if (title.length <= 80) return 56;
  return 48;
}

function logoMark(accent: string, sectionId?: SectionId): Node {
  const content = sectionId
    ? {
        type: 'img',
        props: { src: sectionIconSrc(sectionId), width: 40, height: 40 },
      }
    : 'A';

  return h(
    'div',
    {
      width: 64,
      height: 64,
      borderRadius: 16,
      background: accent,
      color: COLORS.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Source Serif 4',
      fontSize: 38,
      fontWeight: 600,
    },
    content,
  );
}

function card({ eyebrow, title, description, footer, sectionId }: OgCard): Node {
  const accent = sectionAccent(sectionId);

  const header = h('div', { display: 'flex', alignItems: 'center', gap: 22 }, [
    logoMark(accent, sectionId),
    h(
      'div',
      { fontFamily: 'Source Serif 4', fontSize: 34, fontWeight: 600, color: COLORS.text, letterSpacing: -0.5 },
      'Afshin Amini',
    ),
  ]);

  const body = h('div', { display: 'flex', flexDirection: 'column', gap: 22 }, [
    h(
      'div',
      {
        fontFamily: 'Inter',
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: 2.4,
        textTransform: 'uppercase',
        color: accent,
      },
      eyebrow,
    ),
    h(
      'div',
      {
        fontFamily: 'Source Serif 4',
        fontSize: titleSize(title),
        fontWeight: 600,
        lineHeight: 1.12,
        letterSpacing: -1.5,
        color: COLORS.text,
      },
      clip(title, 110),
    ),
    ...(description
      ? [
          h(
            'div',
            { fontFamily: 'Inter', fontSize: 27, lineHeight: 1.4, color: COLORS.muted },
            clip(description, title.length > 80 ? 100 : 140),
          ),
        ]
      : []),
  ]);

  const path = footer.replace(/^mnafshin\.info\/?/, '');
  const foot = h(
    'div',
    {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      borderTop: `2px solid ${COLORS.border}`,
      paddingTop: 22,
    },
    [
      h('div', { display: 'flex', flexDirection: 'column', gap: 4 }, [
        h(
          'div',
          {
            fontFamily: 'Source Serif 4',
            fontSize: 32,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: -0.4,
          },
          'mnafshin.info',
        ),
        ...(path
          ? [h('div', { fontFamily: 'Inter', fontSize: 20, fontWeight: 400, color: COLORS.faint }, `/${path}`)]
          : []),
      ]),
      h('div', { fontFamily: 'Inter', fontSize: 22, color: COLORS.faint }, 'Java · Spring · AI terms, explained'),
    ],
  );

  return h(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      background: COLORS.bg,
    },
    [
      h('div', { width: 18, height: OG_HEIGHT, background: accent }),
      h(
        'div',
        {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px 48px 66px',
        },
        [header, body, foot],
      ),
    ],
  );
}

export async function renderOgImage(input: OgCard): Promise<Uint8Array> {
  const svg = await satori(card(input) as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await loadFonts(),
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
  return new Uint8Array(png);
}
