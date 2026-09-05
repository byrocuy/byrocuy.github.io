import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Personal site content collections — on the Astro 7 content layer.
// The v7 API moved the config to src/content.config.ts and requires a loader
// per collection; entry type (content vs data) is derived from the matched
// file extensions (.mdx → content, .yaml → data).
// Each schema is the single source of truth: `astro check` validates every
// .mdx (posts) and .yaml (resume, projects) entry, so content drift fails
// the build.

const posts = defineCollection({
  // type 'content' — .mdx articles
  loader: glob({ pattern: '**/*.{md,mdx,mdoc}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    // §6: math + mermaid are per-post opt-ins (progressive enhancement —
    // absent from the default bundle, rendered only when a post opts in).
    extensions: z
      .object({
        math: z.boolean().default(false),
        mermaid: z.boolean().default(false),
      })
      .default({ math: false, mermaid: false }),
    hero: z.string().optional(), // path in src/assets or public
  }),
});

const resume = defineCollection({
  // type 'data' — src/content/resume/profile.yaml
  loader: glob({ pattern: '**/*.{yaml,yml,json,toml}', base: './src/content/resume' }),
  schema: z.object({
    contact: z.object({
      name: z.string(),
      location: z.string(),
      phone: z.string(), // formatted '+62 812-2510-2516' (PLAN §5.1)
      email: z.string(),
      linkedin: z.string(),
      website: z.string(),
    }),
    // M6c: two-paragraph intro summary merged from the legacy about.md.
    summary: z.string(),
    work: z.array(
      z.object({
        role: z.string(),
        org: z.string(),
        location: z.string(),
        start: z.string(),
        end: z.string(),
        bullets: z.array(z.string()),
      }),
    ),
    skills: z.object({
      groups: z.array(
        z.object({
          name: z.string(),
          items: z.array(z.string()),
        }),
      ),
    }),
    awards: z.array(
      z.object({
        title: z.string(),
        org: z.string(),
        // M6c: Coursera cert has no date/note in about.md — both optional.
        date: z.string().optional(),
        note: z.string().optional(),
      }),
    ),
    education: z.object({
      school: z.string(),
      city: z.string(),
      degree: z.string(),
      dates: z.string(),
    }),
    // M6c: open-to-work footer line (about.md closing).
    note: z.string(),
  }),
});

const projects = defineCollection({
  // type 'data' — src/content/projects/*.yaml
  loader: glob({ pattern: '**/*.{yaml,yml,json,toml}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    year: z.union([z.string(), z.number()]),
    role: z.string(),
    stack: z.array(z.string()),
    summary: z.string(),
    links: z.record(z.string(), z.string()), // links{} — e.g. { github, demo, paper }
    highlights: z.array(z.string()),
    award: z.string().optional(),
  }),
});

export const collections = { posts, resume, projects };