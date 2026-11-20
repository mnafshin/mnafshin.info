import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const BLOB = 'https://github.com/mnafshin/mnafshin.info/blob/main/';

/** Path to the markdown file in this repo, if it is present in the checkout. */
export function contentFile(collection: string, id: string) {
  const relative = `src/content/${collection}/${id}.md`;
  return fs.existsSync(relative) ? relative : undefined;
}

/** Last commit date for a repo file, when git history is available. */
export function gitLastUpdated(relativePath: string): Date | undefined {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
      encoding: 'utf8',
    }).trim();
    if (!out) return undefined;
    const date = new Date(out);
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

function berlinDay(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });
}

/** True when the update falls on a later calendar day (Europe/Berlin) than the pub date. */
export function isMeaningfulUpdate(pubDate: Date, updated?: Date) {
  if (!updated) return false;
  return berlinDay(updated) !== berlinDay(pubDate) && updated.getTime() > pubDate.getTime();
}

/**
 * Prefer frontmatter `updatedDate`, otherwise the last git commit of the source
 * file. Returns undefined when that date is not meaningfully later than pubDate.
 */
export function displayUpdatedDate(pubDate: Date, frontmatterUpdated: Date | undefined, file?: string) {
  const updated = frontmatterUpdated ?? (file ? gitLastUpdated(file) : undefined);
  return isMeaningfulUpdate(pubDate, updated) ? updated : undefined;
}

/**
 * "Suggest an edit" URL for a file that actually lives in this public repo.
 * If content later comes from a channel repo, only link that source when the
 * repo is public and the path is verifiable; otherwise return undefined.
 */
export function suggestEditUrl(file?: string) {
  if (!file) return undefined;
  return `${BLOB}${file}`;
}
