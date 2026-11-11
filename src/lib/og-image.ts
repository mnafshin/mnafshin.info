import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { OG_HEIGHT, OG_WIDTH } from './og';

// Build-time social preview images, drawn in the site's own colours and
// type: the warm paper background, the teal accent and a serif title.

export type OgCard = {
  /** Small uppercase line above the title, e.g. "SpringUniverse · Article 4 of 10". */
  eyebrow: string;
  title: string;
  description?: string;
  /** Path shown at the bottom, e.g. "mnafshin.info/spring". */
  footer: string;
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

function card({ eyebrow, title, description, footer }: OgCard): Node {
  const logo = h(
    'div',
    {
      width: 64,
      height: 64,
      borderRadius: 16,
      background: COLORS.accent,
      color: COLORS.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Source Serif 4',
      fontSize: 38,
      fontWeight: 600,
    },
    'A',
  );

  const header = h('div', { display: 'flex', alignItems: 'center', gap: 22 }, [
    logo,
    h('div', { fontFamily: 'Source Serif 4', fontSize: 34, fontWeight: 600, color: COLORS.text, letterSpacing: -0.5 }, 'Afshin Amini'),
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
        color: COLORS.accent,
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

  const foot = h(
    'div',
    {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `2px solid ${COLORS.border}`,
      paddingTop: 22,
      fontFamily: 'Inter',
      fontSize: 24,
      color: COLORS.faint,
    },
    [
      h('div', { fontWeight: 600, color: COLORS.muted }, footer),
      h('div', {}, 'Java · Spring · AI terms, explained'),
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
      h('div', { width: 18, height: OG_HEIGHT, background: COLORS.accent }),
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
