import type { APIRoute } from 'astro';
import { combinedRss } from '../lib/rss';

export const GET: APIRoute = (context) => combinedRss(context);
