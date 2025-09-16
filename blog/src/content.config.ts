import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ 
    base: './src/content/blog', 
    pattern: '**/*.{md,mdx}',
    // Add this to help with slug generation
    generateId: ({ entry, base }) => {
      // This will use the relative path from base as the ID/slug
      return entry.replace(base, '').replace(/^\//, '').replace(/\.(md|mdx)$/, '');
    }
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