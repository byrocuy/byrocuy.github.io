// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { transformerMetaHighlight } from '@shikijs/transformers';

// https://astro.build/config
// site/base are env-driven (PLAN §7) so GitHub Pages and Cloudflare agree.
// @astrojs/rss is NOT an Astro integration — it is consumed in src/pages/rss.xml.ts.
//
// §6 math: Astro 7's default Markdown engine (Sätteri) does not run unified
// remark/rehype plugins, so math is wired via `markdown.processor: unified({…})`
// from @astrojs/markdown-remark — the sanctioned replacement for the deprecated
// top-level `markdown.remarkPlugins` / `markdown.rehypePlugins`. The katex CSS
// is gated per post in PostLayout (extensions.math), so non-math posts never
// pay for it.
//
// Shiki transformers (§6):
//   - transformerMetaHighlight → `{1,3-5}` fence meta becomes `.line.highlighted`
//   - trace-paper:code-title  → `title="…"` fence meta becomes `data-title` on
//     the pre, read by CodeBlock.astro for the header strip.
// Neither needs runtime JS — pure build-time.
/** @returns {import('@shikijs/types').ShikiTransformer} */
const codeTitle = () => ({
  name: 'trace-paper:code-title',
  pre(node) {
    // Shiki calls pre transformers with `this` = transformer context; the fence
    // meta string (e.g. `{1,3-5} title="Streaming handler"`) is
    // options.meta.__raw as passed by Astro's internal shiki helper.
    const raw = this.options.meta?.__raw ?? '';
    const m = /title="([^"]*)"/.exec(raw);
    if (m) node.properties.dataTitle = m[1];
  },
});

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://byrocuy.github.io',
  base: process.env.BASE_PATH ?? '', // '' on the user page byrocuy.github.io, '/repo' on a project page
  output: 'static',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      theme: 'github-dark-dimmed', // §6: dark theme on the --code-bg panel
      transformers: [transformerMetaHighlight(), codeTitle()],
    },
  },
  integrations: [mdx(), sitemap()],
});