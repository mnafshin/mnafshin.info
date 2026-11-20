import type { APIRoute } from 'astro';
import { isPreviewHost } from '../lib/site';

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const body = isPreviewHost(site)
    ? 'User-agent: *\nDisallow: /\n'
    : [
        '# Preferred machine-readable copy of the site: /llms.txt',
        '# Full article text: /llms-full.txt',
        'User-agent: *',
        'Allow: /',
        '',
        ...AI_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
        `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
