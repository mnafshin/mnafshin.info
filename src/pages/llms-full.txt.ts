import type { APIRoute } from 'astro';
import { buildLlmsFullTxt } from '../lib/llms-txt';

export const GET: APIRoute = async ({ site }) => {
  const body = await buildLlmsFullTxt(site);
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
