// TRACE PAPER MDX component map (§6) — the fixed, globally-registered set
// applied to every post via <Content components={components} /> (official
// Astro MDX pattern). Articles stay plain Markdown + two opt-in components.
//
//   pre      → CodeBlock (renders every fenced code block as the dark
//              --code-bg panel with a mono-caps header strip)
//   Callout  → note | warn | metric, reuses the callout classes in
//              components.css (§3.4)
//   Mermaid  → lazy client-side render of the code prop; only ever
//              instantiated for posts with extensions.mermaid (gated in
//              /blog/[slug].astro)
import CodeBlock from './CodeBlock.astro';
import Callout from './Callout.astro';
import Mermaid from './Mermaid.astro';

export const components = {
  pre: CodeBlock,
  Callout,
  Mermaid,
};