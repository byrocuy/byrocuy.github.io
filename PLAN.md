# PLAN — Personal Blog + Portfolio for Roby Attoillah

Working dir: `/mnt/d/labs/blog/personal-blog` · Drafted 2026 · All versions verified via curl (see Verification Log, §10).

---

## 1. Vision & Aesthetic Direction

**R1–R2 rework (owner-directed, 2026): dark-first personal site, modern sans, sparse.** The owner's rework request: **dark + modern-sans + sparse** — a near-black canvas, Space Grotesk display type over an IBM Plex Sans body and Plex Mono data voice, one signal-vermilion accent, and a one-screen home. This replaced the original light "TRACE PAPER / measurement logbook" instrument-paper concept (its record survives in §8's M1–M6 history). The inspirations (Stencil, Earendil) are near-black, cold-cyan/blue, grotesque-sans-led canvases; we keep the same discipline — type as the main event, hairline construction instead of shadows, tiny letter-spaced mono micro-labels, one accent color used only where it means something. Article pages follow Stencil's chapter-page layout from the owner's rework screenshot (`notes/screen2-notes.md`): dark canvas, chrome-free "BLOG / title / TraceLine / meta" header, and an "ON THIS PAGE" sidebar whose active item carries the accent + a left marker. The **TraceLine** — an oscilloscope-style SVG stroke that draws itself across the hero and under each article H1 — is the one signature interaction: the latency trace, the literal thing Roby reduced from 10 s to 2 s at work. One aesthetic, committed end to end: "a near-black, sans-led personal site with one accent used only where it means something."

---

## 2. Stack Decision

| Concern | Choice | One-line rationale | Verified source |
|---|---|---|---|
| Framework | **Astro 7.x (latest stable 7.3.1)** | Ships pure static HTML with content collections + optional islands — the exact "static-first, no server" contract GitHub Pages demands. | npm registry `astro@latest` → 7.3.1; engines `node >=22.12.0`, `npm >=9.6.5`. https://registry.npmjs.org/astro/latest |
| Content format | **MDX** (`@astrojs/mdx` 8.0.0) | Markdown ergonomics + JSX components = the only format that gives us callouts, mermaid, and math inside articles without a plugin heap. | https://registry.npmjs.org/@astrojs/mdx/latest · https://docs.astro.build/en/guides/integrations-guide/mdx/ |
| Styling | **Plain CSS + custom properties** (one global stylesheet, scoped per component) | Lazier than Tailwind for ~30 components, zero config drift, tokens live in `:root` and are the design system. | n/a (framework-agnostic) |
| Syntax highlighting | **Shiki — built into Astro, zero extra dependencies** | Astro's markdown/MDX pipeline is preconfigured with Shiki; pick themes, no plugin to install. | https://docs.astro.build/en/guides/syntax-highlighting/ |
| Fonts | **Self-hosted** via `@fontsource` npm packages | GitHub Pages serves static files fine (self-hosting keeps all assets first-party, offline-safe, no Google CDN dependency; the only GH Pages limits are "static output + 1 GB soft cap", which both allow). | https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages |
| RSS | `@astrojs/rss` 4.0.19 | Official feed endpoint, builds `rss.xml` at build time. | https://registry.npmjs.org/@astrojs/rss/latest |
| Math / diagrams (optional) | `remark-math` + `rehype-katex`; `<Mermaid>` MDX component (lazy client render) | Both opt-in per post via frontmatter; keep the default bundle lean. | katex via remark/rehype pipeline, docs.astro.build/en/guides/markdown-content/ |

**Content collections**: Astro content layer (`src/content/config.ts`, zod schemas) — TypeScript-validated frontmatter, `.mdx` posts, `.yaml` structured data for resume/projects. Docs: https://docs.astro.build/en/guides/content-collections/ (200).

---

## 3. Design System Spec

### 3.1 Palette (hex tokens, `src/styles/tokens.css`)

```
Light paper (default, light-only in v1):
--paper-0:    #FBFAF6   page background
--paper-1:    #F4F0E6   surface (cards, code-adjacent panels)
--paper-2:    #ECE6D6   pressed/hover surface
--ink-900:    #16140F   body & headings (near-ink, warm black)
--ink-700:    #474139   secondary text
--ink-500:    #7C7567   muted metadata
--ink-300:    #B6AE9C   faint / disabled
--hairline:   #DFD8C7   1px borders
--hairline-2: #C8C0AA   stronger hairline (tables, TOC)
--accent-500: #E6492B   signal vermilion (trace line, badges, focus ring)
--accent-600: #C83B20   links on paper (contrast ≈ 4.6:1 — text-safe)
--accent-700: #A83016   link hover / pressed
--accent-100: #FBE6DD   callout wash
--code-bg:    #1C1913   ink panel behind code blocks (single deliberate inversion)
--code-ink:   #F2EEDF   text on code panel
Semantic trio: --ok #2E7D46 · --warn #8A6300 · --info #23569E   (used only in callouts)
Selection:    accent-600 background, --paper-0 text.
```
**Contrast rule written into the tokens**: accent-500 is decorative-only (large marks, trace, badges ≥18 pt); **all text links use accent-600/700**. This is enforced via `.prose a { color: var(--accent-600) }`.

### 3.2 Type system

| Role | Family | Weight / style | Notes |
|---|---|---|---|
| Display / H1 | **Space Grotesk** (variable) | 600, `-0.02em` | Modern grotesque display — R2 dropped the original Fraunces serif; same sans-led discipline as the inspirations |
| H2–H3 | Space Grotesk | 600, tight | Post / résumé section heads |
| Body | **IBM Plex Sans** | 400, 1.75 lh | Neutral document sans |
| Labels / dates / metadata | **IBM Plex Mono** | 400–500, 10–12 px, `+0.12em`, uppercase | The constant micro-label voice |
| Code + inline code | IBM Plex Mono | 400 | Inline code: accent-100 wash + ink, mono 0.9em |
| Emphasis | IBM Plex Sans italic | 400 | Pull-quotes & lead paragraphs — no serif anywhere in the system (R2) |

Fluid scale (`clamp`, matches `src/styles/tokens.css`):
```
--step-0: 1.0625rem/1.75    body
--step-1: 1.25rem
--step-2: 1.5rem
--step-3: 2rem
--step-4: clamp(1.75rem, 4vw, 2.75rem)     h2 / post title
--display: clamp(3.5rem, 10vw, 8rem)       h1 / home hero
--step--1: 0.8125rem                        small / caption
--label: 0.6875rem                          mono caps labels
```

### 3.3 Space / radius / surfaces

```
Scale: --s1 .25 · --s2 .5 · --s3 .75 · --s4 1 · --s5 1.5 · --s6 2 · --s7 3 · --s8 4.5rem (rem-based)
Column: prose measure 42rem · page 66rem (max 1080px) · nav gutter inherits page
Radii:  --r-sm 4px (badges, chips) · --r-md 8px (cards, code panel) · --r-lg 12px (callouts) — tables stay square
Shadows: none. Depth = hairline borders + paper-1 surfaces + dot-grid mask.
Grain reinterpretation: a data-URI `radial-gradient` dot grid at ~4% opacity over --paper-0
  on hero + section dividers (plotter paper) — explicitly NOT film grain.
Focus: 2px accent-600 outline + 2px paper offset ring.
```

### 3.4 Component inventory

- **Nav** — sticky, hairline bottom rule. Left: glyph mark (small inline SVG "trace spike" in a bordered square) + wordmark `Roby Attoillah` in mono caps. Right: mono-caps links `Journal` · `Résumé`, `aria-current="page"`, plus GitHub + LinkedIn icon links. Mobile: same row, horizontal scroll, no hamburger (≤4 items).
- **PostCard** — ledger row: mono date (left), Fraunces title, one-line description, tag badges; hover = hairline-to-accent border and TraceLine underline. On `/blog` the rows sit under a hairline table header `POST / DATE / TAG` in mono caps.
- **CodeBlock** — dark ink panel (`--code-bg`), header strip with language tag (mono caps, paper-ink), Shiki-highlighted body, horizontal scroll, `aria-label`; optional "copy" button deferred to milestone 5 (not in v1 core).
- **Callout** — `<Callout type="note|warn|metric">`: dashed accent-100 wash, 3px left accent bar, glyph square; `metric` renders big Fraunces number + mono caps label (e.g., "75% · resolved sessions").
- **Table** — square corners, hairline borders both axes, mono-caps header row, row hover `--paper-1`, right-align numeric cells.
- **ResumeSection** — anchored block with mono index `01 — WORK`, Fraunces H2, hairline rule; entries = org + role + mono date range + badges.
- **Badge** — mono caps 11px, hairline border, `--r-sm`, plain text (no shadows, no fills except accent-100 in callouts).
- **Footer** — mono caps strip: `© 2026 ROBBY ATTOILLAH · TRACE PAPER · SUKABUMI, ID` + top-link.
- **TraceLine** (inline SVG) — see §3.5.

### 3.5 The ONE signature interaction

**TraceLine.** An inline SVG path (an S-curve ending in a small square "measurement marker") drawn under the hero H1 and each article H1 when it enters the viewport: `stroke-dashoffset` interpolates full→0 over ~700 ms with a cubic ease, stroke `--accent-500`, 2px. It literally renders Roby's P50-latency reduction as a motif; no scroll-jacking, no parallax, no cursor effects, no hover motion beyond hairline→accent color transitions. **`prefers-reduced-motion: reduce` → the line renders complete instantly and no transition runs.** Implemented as one tiny `TraceLine.astro` component (IntersectionObserver + CSS `@keyframes` + dasharray set from JS path length; Motion-safe media query wraps the animation).

A11y baseline: skip-link, `header/main/footer` landmarks, one H1 per page, real focus styles, contrast-safe link tokens (§3.1), tabular-nums on dates, `aria-expanded` if any disclosure is ever added.

---

## 4. Site Architecture

### 4.1 Routes (pages)

```
/               Home (R1) — ONE SCREEN: mono micro-label, huge "Roby Attoillah",
                TraceLine, BLOG · ABOUT links. No hero paragraph, no scroll.
/blog           Journal index — ledger table (PostCard rows) under a mono
                POST / DATE header, paginated via [...page].astro
                (paginate() with pageSize 10; page 1 serves /blog/).
                Per-tag static pages removed (R1).
/blog/[slug]    Post template (R2) — two-column: prose left, sticky "ON THIS
                PAGE" TOC sidebar right (h2/h3 anchor links + IO active
                highlight); <details class="toc-mobile"> below 1024px.
                TraceLine, reading time, prev/next, math/mermaid per
                frontmatter. Tags removed (R1).
/about          About — résumé sections seeded from data (Work, Projects,
                Skills, Awards, Education, contact). /about replaces
                /resume (R1); the page label is "About".
/rss.xml        Generated RSS (posts collection)
/404            Styled 404 — "Page not found" + link home
```

### 4.2 Content collection schemas (`src/content/config.ts`, zod)

```ts
posts  → defineCollection({ type: 'content', schema: z.object({
    title: z.string(), description: z.string(),
    pubDate: z.coerce.date(), updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    extensions: z.object({ math: z.boolean().default(false), mermaid: z.boolean().default(false) }).default({}),
    hero: z.string().optional()          // path in src/assets or public
}) })
resume → type 'data' YAML, schema validates the full profile shape (contact, work[], projects[], skills{groups[]}, awards[], education{...})
projects → type 'data' YAML entries { title, year, role, stack[], summary, links{}, highlights[] }
```
`?tag=` filter + `getReadingTime()` (word-count → minutes) computed in the post template, not stored.

### 4.3 Directory tree

```
personal-blog/
├─ astro.config.mjs            # site/base from env (§7), integrations: mdx(), sitemap?, fonts
├─ package.json · tsconfig.json · .gitignore
├─ .github/workflows/
│  ├─ deploy.yml               # GitHub Pages (§7.1)
│  └─ deploy-cloudflare.yml    # later, optional (§7.2)
├─ public/  favicon.svg · robots.txt · og-default.png
└─ src/
   ├─ styles/  tokens.css · base.css · prose.css · components.css
   ├─ layouts/ BaseLayout.astro
   ├─ components/
   │  ├─ Nav.astro · Footer.astro · PostCard.astro
   │  ├─ TraceLine.astro · Badge.astro · ResumeSection.astro · MetricBadge.astro
   │  └─ mdx/  index.ts (component map) · Callout.astro · Mermaid.astro · CodeBlock.astro
   ├─ pages/  index.astro · blog/index.astro · blog/[slug].astro · resume.astro · rss.xml.ts · 404.astro
   ├─ content/
   │  ├─ config.ts
   │  ├─ posts/  *.mdx (seeds §5.2)
   │  ├─ resume/ profile.yaml
   │  └─ projects/  *.yaml
   ├─ data/ · icons/ (inline SVGs: trace mark, GitHub, LinkedIn, external)
   └─ assets/ (hero/og images)
(notes/ stays out of the build — add to .gitignore exclusions or keep untracked)
```

---

## 5. Content Model + Migration Plan

### 5.1 resume.md → structured data

`/mnt/d/labs/blog/byrocuy.github.io/local/resume/resume.md` migrates to `src/content/resume/profile.yaml` + `src/content/projects/*.yaml`, preserving every fact and metric:

| resume.md section | → profile.yaml shape | Notes |
|---|---|---|
| Header (name, location, phone, email, linkedin, site) | `contact: { name, location, phone, email, linkedin, website }` | Phone formatted as `+62 812-2510-2516`; website links to the live site |
| WORK EXPERIENCE (2 roles) | `work: [{ role, org, location, start, end, bullets[] }]` | Bullets kept verbatim (metrics: 10→2 s, 75%, 26.4B+ IDR, 41 units) |
| PROJECTS (1 project) | `projects/regional-sentiment.yaml` + reference in `work`? No — separate collection | Title, year, award, stack[], bullet summaries |
| SKILLS (4 groups) | `skills: { groups: [{ name, items[] }] }` | Groups preserved exactly (Languages & Data, AI & LLM, Backend & Infrastructure, Observability, ML & CV) |
| AWARDS AND CERTIFICATES | `awards: [{ title, org, date, note }]` | Ruangguru "Mastering AI Bootcamp" |
| EDUCATION | `education: { school, city, degree, dates }` | UGM, Bachelor of Information Engineering |

Migration is **mechanical** (section headers → YAML keys); done by one agent in milestone 3 with a diff check: every line of resume.md appears somewhere in the rendered page.

### 5.2 Seed posts (2–3, AI-engineering tone)

1. **"TTFT, not price: slicing first-token latency from 10 s to 2 s on a FastAPI agent"** — the P50 story: streaming WebSocket responses, init-on-startup, parallelization, removing redundant work; `metric` callouts for before/after; small mermaid sequence diagram (exercises the diagram path early).
2. **"Handoff without hang-ups: live-agent escalation over WhatsApp"** — bidirectional media, session/history transfer, reconnect + fallback, SHA-256 verification; failure-mode table (exercises tables); ends with the 75 % resolution stat.
3. *(optional)* **"Agent flow, not prompt soup"** — LangGraph multi-agent design notes: tool-calling, routing, observability with Arize Phoenix. Tag-heavy post to exercise tag filtering.

Tone: measured, metric-forward, "how I built it and what I'd do differently" — matches the résumé voice.

---

## 6. Rich Formatting Spec (MDX component set)

Format: **MDX** — plain Markdown plus a fixed, globally-registered component map applied in `/blog/[slug].astro` via the official pattern (exported custom components passed to `<Content components={…} />`, per the MDX integration guide). Map lives in one module `src/components/mdx/index.ts` so articles stay clean Markdown.

| Feature | Provided by | Exact integration |
|---|---|---|
| Headings + anchor IDs | Astro markdown core (GFM) | Automatic; prose CSS sizes via type scale |
| Fenced code blocks + **syntax highlighting** | **Shiki**, built into Astro's markdown/MDX (no plugin) | Theme `github-dark-dimmed` on `--code-bg` panel; `{1,3-5}` line highlights, `// [!code]` marks supported by Shiki core |
| **CodeBlock** wrapper (lang label, optional copy) | Custom component | `<CodeBlock lang="python">` around fenced code, or global styling only — decide in M5 |
| Tables | GFM (Astro markdown core) | Global `.prose table` styles (§3.4) |
| Blockquotes | GFM | Global styles; lead-paragraph italic via `> _…_` |
| **Callout** | Custom component | `<Callout type="note\|warn\|metric">…</Callout>`; also mapped for `:::note`-style syntax if desired |
| Images | Astro asset pipeline (`astro:assets`) | `import` or `/public` paths; global `figure/figcaption` styles, `loading="lazy"` |
| Inline code | GFM | Global style (accent-100 wash, Plex Mono) |
| Links | GFM | Global style, `target` handling in prose CSS |
| **Math (optional)** | `remark-math` + `rehype-katex` | Add to `markdown.remarkPlugins/rehypePlugins`; Katex CSS imported once; gated by `extensions.math` |
| **Mermaid (optional)** | Custom component | `<Mermaid code={`…`} />` lazy-imports `mermaid` client-side; gated by `extensions.mermaid` |

Math + mermaid are progressive enhancements: **absent from the default bundle**, rendered only on posts that opt in.

---

## 7. Deployment Plan

### 7.1 GitHub Pages (primary)

Prereq: repo strategy per §9 decision 1 (replace-in-place on `byrocuy.github.io`, so base path = `''` and URL is unchanged). Steps:

1. **Repo**: keep the name `byrocuy.github.io` (user page) or use any repo + `base: '/repo'` (project page). Account used: `byrocuy`.
2. **Astro config** — no hardcoded paths; read from env so GH and CF agree:
   ```js
   // astro.config.mjs
   export default defineConfig({
     site: process.env.SITE_URL ?? 'https://byrocuy.github.io',
     base: process.env.BASE_PATH ?? undefined,   // '' on user page, '/repo' on project page
     output: 'static',
     integrations: [mdx(), sitemap()],
   });
   ```
3. **Workflow** — the exact pattern from the official Astro guide (verified: `withastro/action@v6`, `actions/deploy-pages@v5`, `actions/checkout@v7`, permissions `contents: read, pages: write, id-token: write`); the action runs `npm ci`-style install, `npm run build`, and uploads the artifact; the deploy step publishes to Pages. https://docs.astro.build/en/guides/deploy/github/
4. **Repo Settings → Pages → Source: GitHub Actions** (not branch-based), then run the workflow once.
5. **Custom domain** — *deferred (owner decision 2, §9: `byrocuy.github.io` only)*: Settings → Pages → custom domain + DNS record; Astro `site` env is updated accordingly (no CNAME file needed with the Actions source; add one in `public/` if we ever switch sources — note in CI checklist).
6. **Sanity**: `/blog`, `/resume`, `/rss.xml`, assets all 200; base-path check with a local `BASE_PATH=/personal-blog npm run build` build.

### 7.2 Cloudflare Pages (later, migration must be trivial)

1. **Git integration**: Cloudflare Pages → Create project → connect repo → build command `npm run build`, output directory `dist/`, root `/`.
2. **Env**: set `SITE_URL` / `BASE_PATH` (Cloudflare serves from root, so `BASE_PATH` empty) — same config object, no code change. Pure static output means no adapter, no runtime, no lock-in.
3. **Alternative (no Git integration)**: `npx wrangler pages deploy dist` — direct upload. Official guidance: https://docs.astro.build/en/guides/deploy/cloudflare/ · https://developers.cloudflare.com/pages/
4. DNS/name servers moved to Cloudflare if a custom domain is chosen (optional — domain decision open, §9).

### 7.3 CI checklist (both providers)

- Node pinned `22.12+` (Astro 7 engine requirement), `npm ci` from lockfile
- `astro check` (schema + type validation of every post/yaml) fails the build on content drift
- `npm run build` (dev-mode `drafts` excluded; `astro build` asserts collection validity)
- Local test build with `BASE_PATH=/aspirational-repo` to prove asset URLs are rooted correctly (base-path correctness on both providers)
- Pinned action versions (`@v6` / `@v5` / `@v7`), no stored secrets anywhere
- Post-deploy smoke: `curl -sf` on `/`, `/blog`, `/resume`, `/rss.xml`, one article asset.

---

## 8. Implementation Roadmap (each milestone = one delegate-able task)

- **M1 — Scaffold.** `npm create astro@latest` (minimal, TypeScript), add `@astrojs/mdx`, `@astrojs/rss`, fonts; `astro.config.mjs` with env-driven site/base; stub pages for all §4.1 routes; `.github/workflows/deploy.yml` per §7.1. **Acceptance:** `npm run build` → `dist/` clean; `astro check` passes; `astro dev` renders every stub route; workflow file lints.
- **M2 — Design system.** `tokens.css` (full §3.1–3.3), `base.css`, `prose.css`, `components.css`; `BaseLayout.astro`, `Nav`, `Footer`, favicon trace-mark, dot-grid texture, focus styles; `TraceLine.astro` (§3.5) with reduced-motion path. **Acceptance:** a `/_styleguide` scratch page (removed in M6) shows every token + component; keyboard-tab order visible; `prefers-reduced-motion` disables all transitions.
- **M3 — Résumé page.** `content/resume/profile.yaml` + zod schema; migrate all of resume.md (§5.1) with a line-by-line diff check; `/resume` route with `ResumeSection`, `MetricBadge`, `Badge`, skills groups; `projects` collection. **Acceptance:** every fact + metric from resume.md is present; print stylesheet keeps the page printable; `astro check` validates the YAML.
- **M4 — Blog index.** `content/posts` collection + seeds §5.2 (2 posts); `/blog` with PostCard ledger, per-tag static pages, RSS endpoint. **Acceptance:** seed posts list with dates/tags/descriptions; empty-state renders; `/rss.xml` parses; per-tag static pages built for every distinct tag, each rendering only its tag's posts.
- **M5 — Post template.** `/blog/[slug]` with prose layout, TraceLine, reading time, prev/next, breadcrumb-ish meta; `mdx/index.ts` map + `Callout`, `CodeBlock`, `Mermaid`, `Math` (katex CSS); one seed post exercises **every** feature (§6 grid). **Acceptance:** demo post renders tables, callouts, Shiki code w/ line highlights, inline code, blockquote, image, math, mermaid; Lighthouse a11y pass ≥ 90; no layout shift on fonts.
- **M6 — Deployment + polish.** `deploy.yml` run on real repo (per §9 answers); 404 page; sitemap; og-image; `_styleguide` removed; Cloudflare path documented in README. **Acceptance:** live at `byrocuy.github.io`; smoke checks §7.3 green; `BASE_PATH` build verified; final Lighthouse perf ≥ 95 (static, zero runtime JS beyond optional mermaid).
- **R1–R2 rework (owner-directed):** dark theme, sparse home, TOC sidebar — see commits.

---

## 9. Decisions (confirmed by owner)

1. **Repo:** replace in place on `byrocuy.github.io` (matches recommendation; user page URL implies it) — build the Astro site in `personal-blog` first, swap at M6.
2. **Domain:** `byrocuy.github.io`, no custom domain — `SITE_URL = https://byrocuy.github.io`, `BASE_PATH` empty.
3. **Theme:** light-only in v1; dark mode toggle deferred to a later milestone.
4. **Comments:** none in v1 (RSS + social links only); giscus later if asked.
5. **Language:** English-only in v1 (matches the résumé).

---

## 10. Verification Log (curl, all fetched today)

| URL | Status | Evidence |
|---|---|---|
| https://registry.npmjs.org/astro/latest | 200 | **astro 7.3.1**, engines `node >=22.12.0`, `npm >=9.6.5` |
| https://registry.npmjs.org/@astrojs/mdx/latest | 200 | **@astrojs/mdx 8.0.0** |
| https://registry.npmjs.org/@astrojs/rss/latest | 200 | **@astrojs/rss 4.0.19** |
| https://docs.astro.build/en/guides/deploy/github/ | 200 | Workflow: `actions/checkout@v7` → `withastro/action@v6` → `actions/deploy-pages@v5`; perms `contents: read / pages: write / id-token: write`; config `site: 'https://astronaut.github.io'`, `base: '/my-repo'` |
| https://docs.astro.build/en/guides/integrations-guide/mdx/ | 200 | Install via `npx astro add mdx`; custom components passed to `<Content components={…} />` |
| https://docs.astro.build/en/guides/syntax-highlighting/ | 200 | "Shiki by default, preconfigured with the…" config ref; light/dark theme support |
| https://docs.astro.build/en/guides/markdown-content/ | 200 | Markdown config, processors, plugins (remark/rehype) |
| https://docs.astro.build/en/guides/deploy/cloudflare/ | 200 | `npx wrangler deploy` / `wrangler pages deploy` path |
| https://docs.astro.build/en/guides/content-collections/ | 200 | Collections + zod schemas (current content layer) |
| https://docs.github.com/en/pages | 200 | GitHub Pages docs (301 → `…/what-is-github-pages` = 200) |
| https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site | 200 | Publishing-source config |
| https://developers.cloudflare.com/pages/ | 200 | Cloudflare Pages docs |