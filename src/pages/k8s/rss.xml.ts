import type { APIRoute } from 'astro';
import { sectionRss } from '../../lib/rss';

export const GET: APIRoute = (context) => sectionRss(context, 'k8s');
