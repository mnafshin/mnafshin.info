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
  // Hide a Short (no link) until it is public.
  draft: z.boolean().default(false),
  published: z.boolean().default(true),
});

const relatedVideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  youtubeId: z.string(),
  pubDate: z.coerce.date().optional(),
  // Hide an entry (no embed, no link) until the video is public.
  draft: z.boolean().default(false),
  published: z.boolean().default(true),
});

// Concept articles (SpringUniverse, Termsplained): the shared post fields,
// plus the related videos, Shorts and companion code shown below the
// article. `kind: weekly` marks a written weekly review that uses the same
// chrome but is listed separately on the section index.
const articleSchema = postSchema.extend({
  kind: z.enum(['concept', 'weekly']).default('concept'),
  section: z.string().optional(),
  topic: z.string().optional(),
  relatedVideos: z.array(relatedVideoSchema).default([]),
  relatedShorts: z.array(shortSchema).default([]),
  codeUrl: z.string().url().optional(),
  codeUrls: z.array(z.string().url()).default([]),
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

function loader(directory: string) {
  return glob({
    base: `./src/content/${directory}`,
    pattern: '**/*.{md,mdx}',
  });
}

function posts(directory: string) {
  return defineCollection({ loader: loader(directory), schema: postSchema });
}

export const collections = {
  spring: defineCollection({ loader: loader('spring'), schema: articleSchema }),
  terms: defineCollection({ loader: loader('terms'), schema: articleSchema }),
  k8s: defineCollection({ loader: loader('k8s'), schema: articleSchema }),
  ai: posts('ai'),
  videos: defineCollection({
    loader: glob({
      base: './src/content/videos',
      pattern: '**/*.{md,mdx}',
    }),
    schema: videoSchema,
  }),
};
