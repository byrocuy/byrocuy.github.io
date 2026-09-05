// TRACE PAPER — social share image generator (M6).
// Renders scripts/og-trace-paper.svg (1200×630, paper-0 bg, ink-900 serif
// name, accent-500 trace-line motif, dot-grid plotter paper) to
// public/og-default.png via sharp. Pure build-time tool, never shipped.
//
// Usage: node scripts/og.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ——— §3.1 tokens, hardcoded here for the static raster (no CSS cascade in SVG) ———
const PAPER0 = '#FBFAF6';
const INK900 = '#16140F';
const INK700 = '#474139';
const INK500 = '#7C7567';
const HAIRLINE = '#DFD8C7';
const ACCENT = '#E6492B';

// TraceLine motif (from TraceLine.astro): oscilloscope S-curve ending in a
// 7×7 "measurement marker" square, scaled ~0.8125 → 520px wide.
const TRACE =
  'M 4 21 C 96 21, 128 5, 212 5 C 308 5, 352 21, 444 21 C 486 21, 514 17, 536 13 L 552 13 v 7 h 7 v -7';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="${INK900}" opacity="0.055"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${PAPER0}"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- top-left mark: hairline square + trace spike glyph + wordmark -->
  <rect x="80" y="60" width="20" height="20" fill="none" stroke="${HAIRLINE}" stroke-width="1.5"/>
  <path d="M 85 73 L 90 62 L 93 68 L 98 70" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="116" y="77" font-family="'DejaVu Sans Mono', monospace" font-size="21" letter-spacing="6" fill="${INK700}">TRACE PAPER</text>

  <!-- name: high-contrast serif, ink-900, tight tracking (Fraunces stand-in) -->
  <text x="80" y="330" font-family="Georgia, 'Times New Roman', 'DejaVu Serif', serif" font-size="132" font-weight="600" letter-spacing="-3" fill="${INK900}">Roby Attoillah</text>

  <!-- TraceLine beneath the name -->
  <g transform="translate(84 396) scale(0.8125)" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="${TRACE}"/>
  </g>

  <!-- sub-line -->
  <text x="82" y="470" font-family="Georgia, 'Times New Roman', 'DejaVu Serif', serif" font-style="italic" font-size="37" fill="${INK700}">Engineering AI systems that answer in seconds.</text>

  <!-- hairline rule -->
  <line x1="82" y1="528" x2="1118" y2="528" stroke="${HAIRLINE}" stroke-width="1.5"/>

  <!-- footer: mono caps micro-labels -->
  <text x="82" y="566" font-family="'DejaVu Sans Mono', monospace" font-size="19" letter-spacing="4.5" fill="${INK500}">THE MEASUREMENT LOGBOOK OF AN AI ENGINEER</text>
  <text x="1118" y="566" text-anchor="end" font-family="'DejaVu Sans Mono', monospace" font-size="19" letter-spacing="4.5" fill="${ACCENT}">P50 · 10 S → 2 S</text>
</svg>
`;

writeFileSync(join(root, 'scripts', 'og-trace-paper.svg'), svg.trim());
await sharp(Buffer.from(svg)).png().toFile(join(root, 'public', 'og-default.png'));
console.log('wrote public/og-default.png —', (await import('node:fs')).statSync(join(root, 'public', 'og-default.png')).size, 'bytes');