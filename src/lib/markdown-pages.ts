import { SITE_TITLE } from './site';

/** Calendar date in Europe/Berlin, for machine-readable Markdown headers. */
export function berlinDay(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });
}

export function yamlQuote(value: string) {
  return JSON.stringify(value);
}

export function formatMarkdownDocument(options: {
  title: string;
  canonical: string;
  date: Date;
  updated?: Date;
  body: string;
  author?: string;
}) {
  const author = options.author ?? SITE_TITLE;
  const lines = [
    '---',
    `title: ${yamlQuote(options.title)}`,
    `canonical: ${yamlQuote(options.canonical)}`,
    `author: ${yamlQuote(author)}`,
    `date: ${berlinDay(options.date)}`,
  ];
  if (options.updated) {
    lines.push(`updated: ${berlinDay(options.updated)}`);
  }
  lines.push('---', '');

  const body = options.body.replace(/^\uFEFF/, '').trim();
  const heading = `# ${options.title}`;
  const withTitle = body.startsWith(heading) ? body : `${heading}\n\n${body}`;
  return `${lines.join('\n')}${withTitle}\n`;
}

/** Public path of the clean Markdown copy, without a trailing slash. */
export function markdownPath(sectionPath: string, id: string) {
  return `${sectionPath}/${id}.md`;
}
