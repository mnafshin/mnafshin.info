import type { APIRoute, GetStaticPaths } from 'astro';
import { allMarkdownPages } from '../lib/llms-txt';

export const getStaticPaths = (async () => {
  const pages = await allMarkdownPages(undefined);
  return pages.map((page) => ({
    params: { key: page.key.replace(/\.md$/, '') },
    props: { body: page.body },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  return new Response((props as { body: string }).body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
