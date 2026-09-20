import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ 
    base: './src/content/blog', 
    pattern: '**/*.{md,mdx}',
    // Use the path relative to the collection as the id/slug, dropping the
    // extension and a trailing "/index" so `writings/foo/index.md` -> `writings/foo`.
    generateId: ({ entry }) =>
      entry.replace(/\.(md|mdx)$/, '').replace(/\/index$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      category: z.enum(['library', 'writings', 'tutorials']).optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
    }),
});

export const collections = { blog };