import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { SITE_TITLE } from '../../consts';

const posts = await getCollection('blog', ({ data }) => !data.draft);

// One card per post, keyed by post id, plus "default" for the rest of the site.
const pages = {
  default: {
    title: SITE_TITLE,
    description: 'Notes on software, systems, and how things actually work.',
  },
  ...Object.fromEntries(
    posts.map((post) => [post.id, { title: post.data.title, description: post.data.description }]),
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[30, 27, 24], [42, 37, 33]],
    border: { color: [212, 167, 106], width: 20, side: 'inline-start' },
    padding: 60,
    logo: { path: './public/logo.png', size: [72] },
    font: {
      title: {
        size: 56,
        weight: 'Bold',
        color: [212, 167, 106],
        families: ['Playfair Display'],
        lineHeight: 1.2,
      },
      description: {
        size: 26,
        color: [227, 215, 197],
        families: ['Lora'],
        lineHeight: 1.4,
      },
    },
    fonts: [
      './node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff',
      './node_modules/@fontsource/lora/files/lora-latin-400-normal.woff',
    ],
  }),
});
