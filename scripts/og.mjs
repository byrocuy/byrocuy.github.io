// Personal site — social share image generator (R1).
// Renders scripts/og-trace-paper.svg (1200×630, near-black bg, light ink,
// Space Grotesk display name with DejaVu Sans fallback for the raster,
// vermilion TraceLine motif) to public/og-default.png via sharp.
// Pure build-time tool, never shipped.
//
// Usage: node scripts/og.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ——— tokens, hardcoded here for the static raster (no CSS cascade in SVG) ———
const BG0 = '#0A0A0B';
const INK900 = '#EDEDE9';
const INK700 = '#B6B6B0';
const INK500 = '#82828A';
const HAIRLINE = '#222226';
const ACCENT = '#E6492B';

// Space Grotesk is self-hosted in the browser; for the raster the SVG
// declares it first and falls back to DejaVu Sans (grotesque-like, the
// only font guaranteed on the CI runner / this machine).
const DISPLAY = "'Space Grotesk', 'DejaVu Sans', sans-serif";
const MONO = "'DejaVu Sans Mono', monospace";

// TraceLine motif (from TraceLine.astro): oscilloscope S-curve ending in a
// 7×7 "measurement marker" square, scaled ~0.8125 → 520px wide.
const TRACE =
  'M 4 21 C 96 21, 128 5, 212 5 C 308 5, 352 21, 444 21 C 486 21, 514 17, 536 13 L 552 13 v 7 h 7 v -7';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG0}"/>

  <!-- top-left: mono-caps wordmark -->
  <text x="82" y="78" font-family="${MONO}" font-size="20" letter-spacing="7" fill="${INK500}">ROBY ATTOILLAH</text>

  <!-- micro-label above the name -->
  <text x="82" y="252" font-family="${MONO}" font-size="22" letter-spacing="7" fill="${INK500}">AI ENGINEER</text>

  <!-- name: Space Grotesk (DejaVu Sans fallback), light ink, tight tracking -->
  <text x="80" y="348" font-family="${DISPLAY}" font-size="132" font-weight="600" letter-spacing="-3" fill="${INK900}">Roby Attoillah</text>

  <!-- TraceLine beneath the name -->
  <g transform="translate(84 404) scale(0.8125)" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="${TRACE}"/>
  </g>

  <!-- hairline rule -->
  <line x1="82" y1="540" x2="1118" y2="540" stroke="${HAIRLINE}" stroke-width="1.5"/>

  <!-- footer: mono caps micro-labels -->
  <text x="82" y="578" font-family="${MONO}" font-size="19" letter-spacing="4.5" fill="${INK700}">BLOG · ABOUT</text>
  <text x="1118" y="578" text-anchor="end" font-family="${MONO}" font-size="19" letter-spacing="4.5" fill="${INK500}">PERSONAL SITE</text>
</svg>
`;

writeFileSync(join(root, 'scripts', 'og-trace-paper.svg'), svg.trim());
await sharp(Buffer.from(svg)).png().toFile(join(root, 'public', 'og-default.png'));
console.log('wrote public/og-default.png —', (await import('node:fs')).statSync(join(root, 'public', 'og-default.png')).size, 'bytes');