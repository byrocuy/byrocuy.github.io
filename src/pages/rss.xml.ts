import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// TRACE PAPER RSS — /rss.xml (PLAN §4.1). Built from the posts
// collection at build time: draft:false, sorted by pubDate desc.
// item.link is relative to `site` from astro.config.mjs (env-driven,
// §7), so /blog/<slug>/ resolves to the real absolute URL.
export async function GET(context: { site: URL }) {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'TRACE PAPER',
    description: 'The measurement logbook of an AI engineer.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}