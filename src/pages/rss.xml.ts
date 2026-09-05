import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// Personal site RSS — /rss.xml. Built from the posts collection at
// build time: draft:false, sorted by pubDate desc. item.link is
// relative to `site` from astro.config.mjs (env-driven), so
// /blog/<slug>/ resolves to the real absolute URL.
export async function GET(context: { site: URL }) {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Roby Attoillah',
    description: 'Roby Attoillah — personal site. Blog and about.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}