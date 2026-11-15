import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const articles = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/articles' }), schema: z.object({ title:z.string(), description:z.string(), category:z.string(), tags:z.array(z.string()), publishedAt:z.coerce.date(), author:z.string(), status:z.enum(['draft','published']).default('draft') }) });
export const collections = { articles };
