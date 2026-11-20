# YouTube video watermark

Square marks for YouTube Studio → Customization → Branding → Video watermark.

- `mnafshin-info-watermark-300.png` — 300×300, transparent background
- `mnafshin-info-watermark-150.png` — 150×150, transparent background

Both are under 1 MB. YouTube shows the mark small and semi-transparent in the
corner of the video, so this is a simple bold “m” on a dark rounded tile with
a light border, which stays legible on light and dark frames.

Regenerate with `node scripts/youtube-watermark.mjs`. This folder is only
the asset; nothing here uploads to YouTube.
