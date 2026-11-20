/**
 * Build the square YouTube Studio video-watermark PNGs
 * (Customization → Branding → Video watermark).
 *
 * Outputs 300×300 and 150×150 transparent PNGs, plus optional preview
 * composites. This script does not upload anything to YouTube.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fontSerif = '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf';
const fontSans = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

function badgeSvg(size) {
  // Draw in a 300-unit viewBox and scale so both sizes stay sharp.
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 300 300">
  <rect x="10" y="10" width="280" height="280" rx="76" fill="#0a0f0e"/>
  <rect x="20" y="20" width="260" height="260" rx="68" fill="#142422" stroke="#f6f2ea" stroke-width="12"/>
  <text
    x="150"
    y="198"
    text-anchor="middle"
    font-family="Liberation Serif"
    font-size="176"
    font-weight="700"
    fill="#f6f2ea"
  >m</text>
</svg>`;
}

function renderPng(svg, width) {
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: {
      fontFiles: [fontSerif, fontSans],
      defaultFontFamily: 'Liberation Serif',
      loadSystemFonts: false,
    },
    background: 'rgba(0,0,0,0)',
  })
    .render()
    .asPng();
}

function previewSvg(kind, watermarkDataUri) {
  const dark = kind === 'dark';
  const bg0 = dark ? '#0b1220' : '#e8eef4';
  const bg1 = dark ? '#1c2a3a' : '#f7f4ee';
  const bar = dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.7)';
  const label = dark ? '#d6d3d1' : '#44403c';
  const title = dark ? '#fafaf9' : '#1c1917';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg0}"/>
      <stop offset="1" stop-color="${bg1}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <text x="64" y="96" font-family="DejaVu Sans" font-size="28" font-weight="700" fill="${label}">Sample ${kind} frame · not a real video</text>
  <text x="64" y="360" font-family="Liberation Serif" font-size="54" font-weight="700" fill="${title}">mnafshin.info</text>
  <rect x="0" y="640" width="1280" height="80" fill="${bar}"/>
  <image href="${watermarkDataUri}" x="1148" y="528" width="96" height="96" opacity="0.85"/>
</svg>`;
}

const sizes = [300, 150];
const brandingDir = join(root, 'branding', 'youtube-watermark');
const previewDir = '/workspace/blog-ui/watermark';
await mkdir(brandingDir, { recursive: true });
await mkdir(previewDir, { recursive: true });

const paths = {};
for (const size of sizes) {
  const png = renderPng(badgeSvg(size), size);
  const name = `mnafshin-info-watermark-${size}.png`;
  const brandingPath = join(brandingDir, name);
  const previewPath = join(previewDir, name);
  await writeFile(brandingPath, png);
  await writeFile(previewPath, png);
  paths[size] = { brandingPath, previewPath, bytes: png.length };
  console.log(`${name}: ${png.length} bytes`);
}

const watermark150 = await import('node:fs/promises').then((fs) => fs.readFile(paths[150].previewPath));
const dataUri = `data:image/png;base64,${watermark150.toString('base64')}`;

for (const kind of ['dark', 'light']) {
  const png = new Resvg(previewSvg(kind, dataUri), {
    fitTo: { mode: 'width', value: 1280 },
    font: {
      fontFiles: [fontSerif, fontSans],
      defaultFontFamily: 'DejaVu Sans',
      loadSystemFonts: false,
    },
  })
    .render()
    .asPng();
  const out = join(previewDir, `preview-${kind}.png`);
  await writeFile(out, png);
  console.log(`preview-${kind}.png: ${png.length} bytes`);
}

await writeFile(
  join(brandingDir, 'README.md'),
  `# YouTube video watermark

Square marks for YouTube Studio → Customization → Branding → Video watermark.

- \`mnafshin-info-watermark-300.png\` — 300×300, transparent background
- \`mnafshin-info-watermark-150.png\` — 150×150, transparent background

Both are under 1 MB. YouTube shows the mark small and semi-transparent in the
corner of the video, so this is a simple bold “m” on a dark rounded tile with
a light border, which stays legible on light and dark frames.

Regenerate with \`node scripts/youtube-watermark.mjs\`. This folder is only
the asset; nothing here uploads to YouTube.
`,
);
console.log('done');
