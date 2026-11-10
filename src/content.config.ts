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

const shortSchema = z.object({
  title: z.string(),
  youtubeId: z.string(),
});

const videoSchema = z.object({
  title: z.string(),
  description: z.string(),
  youtubeId: z.string(),
  pubDate: z.coerce.date(),
  series: z.enum(['tutorials', 'weekly']),
  seriesLabel: z.string(),
  order: z.number(),
  draft: z.boolean().default(false),
  codeUrl: z.string().url().optional(),
  codeUrls: z.array(z.string().url()).default([]),
  shorts: z.array(shortSchema).default([]),
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
  videos: defineCollection({
    loader: glob({
      base: './src/content/videos',
      pattern: '**/*.{md,mdx}',
    }),
    schema: videoSchema,
  }),
};
