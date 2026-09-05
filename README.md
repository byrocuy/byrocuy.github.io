# TRACE PAPER

**TRACE PAPER — the measurement logbook (and résumé) of Roby Attoillah, an AI
engineer.** A light, warm *instrument-paper* editorial site: matte porcelain
paper, ink-black Fraunces serif type, a single signal-vermilion accent, and a
fine plotter dot-grid texture. The signature **TraceLine** — an oscilloscope
SVG stroke that draws itself under every H1 — renders Roby's P50-latency cut
(10 s → 2 s) as a motif. Static-first: blog + résumé, zero runtime JS.

## Tech stack

Astro 7 · MDX · Shiki (syntax highlighting) · KaTeX (math) · Mermaid
(diagrams) · plain CSS design tokens (no framework).

## Local development

```sh
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # static site → dist/
npx astro check    # content schema + type validation
```

## Deployment

**GitHub Pages (primary)** — push to `main`. `.github/workflows/deploy.yml`
builds and publishes automatically (site: `byrocuy.github.io`, base `''`).
Repo settings → Pages → Source: **GitHub Actions**.

**Cloudflare Pages (migration path, PLAN §7.2)** — connect this repo in
Cloudflare Pages → Create project: build command `npm run build`, output
directory `dist/`, root `/`; set env vars `SITE_URL` / `BASE_PATH` (empty for
Cloudflare). Same config object, zero code changes, no adapter, no lock-in.
Docs: https://docs.astro.build/en/guides/deploy/cloudflare/ ·
https://developers.cloudflare.com/pages/

## Notes

- Social share image: `public/og-default.png`, regenerated with
  `node scripts/og.mjs` (`sharp` is a devDependency; the script is build-time only).