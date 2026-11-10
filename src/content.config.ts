import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

function posts(directory: string) {
  return defineCollection({
    loader: glob({
      base: `./src/content/${directory}`,
      pattern: '**/*.{md,mdx}',
    }),
    schema: postSchema,
  });
}

export const collections = {
  spring: posts('spring'),
  terms: posts('terms'),
  ai: posts('ai'),
};
