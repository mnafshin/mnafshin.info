#!/usr/bin/env node
// Fail the build when a published article or weekly review has no (or fewer
// than 2) check-yourself questions. Errors name the source file.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const QUESTIONS_FILE = path.join(ROOT, 'src/data/check-questions.ts');
const CONTENT = path.join(ROOT, 'src/content');

/** Collection directory → quiz key prefix (public section path). */
const COLLECTIONS = [
  ['spring', 'spring'],
  ['terms', 'terms'],
  ['k8s', 'k8s'],
  ['system-design', 'system-design'],
  ['db', 'db'],
  ['security', 'security'],
  ['ai', 'ai'],
  ['videos', 'spring'],
];

const source = fs.readFileSync(QUESTIONS_FILE, 'utf8');
const keyCounts = new Map();
for (const match of source.matchAll(/'([^']+)':\s*\[/g)) {
  const key = match[1];
  if (!key.includes('/')) continue;
  const start = match.index + match[0].length;
  const next = source.slice(start).search(/\n  '[^']+':\s*\[|\n\};\n/);
  const block = next === -1 ? source.slice(start) : source.slice(start, start + next);
  const count = (block.match(/\bprompt:/g) || []).length;
  keyCounts.set(key, count);
}

function frontmatter(text) {
  if (!text.startsWith('---')) return '';
  const end = text.indexOf('\n---', 3);
  return end === -1 ? '' : text.slice(3, end);
}

const errors = [];
const seen = [];

for (const [directory, section] of COLLECTIONS) {
  const dir = path.join(CONTENT, directory);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    const rel = path.join('src/content', directory, file);
    const fm = frontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (/^draft:\s*true\b/m.test(fm)) continue;
    const id = file.replace(/\.mdx?$/, '');
    const key = `${section}/${id}`;
    const count = keyCounts.get(key) ?? 0;
    seen.push({ rel, key, count });
    if (count < 2) {
      errors.push(
        `Missing check-yourself questions for ${rel} (key "${key}", need 2 or 3 questions, found ${count}).`,
      );
    }
  }
}

if (errors.length) {
  console.error('Check-yourself coverage failed:\n');
  for (const line of errors) console.error(`  ${line}`);
  console.error(`\nAdd entries to src/data/check-questions.ts. ${errors.length} page(s) to fix.`);
  process.exit(1);
}

console.log(`Check-yourself coverage: ${seen.length} published pages, each with at least 2 questions.`);
