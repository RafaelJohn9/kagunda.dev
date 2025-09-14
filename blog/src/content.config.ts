import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(), // ✅ Already defined — keep this
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),

			// ✅ NEW: Define 'category' as one of the allowed values (recommended)
			category: z.enum(['library', 'writings', 'tutorials']).optional(),

			// ✅ NEW: Define 'tags' as an array of strings
			tags: z.array(z.string()).optional(),

			// ✅ NEW: Define 'draft' if you're filtering by it
			draft: z.boolean().optional(),

			// ✅ NEW: Define 'featured' if you're filtering by it
			featured: z.boolean().optional(),
		}),
});

export const collections = { blog };
