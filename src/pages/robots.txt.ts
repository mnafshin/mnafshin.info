import type { APIRoute } from 'astro';
import { isPreviewHost } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const body = isPreviewHost(site)
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
