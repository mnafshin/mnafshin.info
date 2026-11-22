/**
 * Notify IndexNow of published pages after a GitHub Pages deploy.
 *
 * Usage:
 *   node scripts/indexnow.mjs           # URLs whose source changed in this push
 *   node scripts/indexnow.mjs --all     # every URL in the live sitemap
 *
 * Never exits non-zero: a failed notify must not fail the deploy.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const HOST = 'mnafshin.info';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP_INDEX = `https://${HOST}/sitemap-index.xml`;
const MAX_URLS = 10_000;
const SECTIONS = ['spring', 'terms', 'k8s', 'system-design', 'security', 'db', 'ai'];
const SITE = `https://${HOST}`;

const submitAll = process.argv.includes('--all') || process.env.INDEXNOW_ALL === 'true';
const dryRun = process.argv.includes('--dry-run');

function log(...args) {
  console.log('[indexnow]', ...args);
}

function warn(...args) {
  console.warn('[indexnow]', ...args);
}

function loadKey() {
  const dir = 'public';
  const files = existsSync(dir)
    ? readdirSync(dir).filter((name) => /^[0-9a-f]{32}\.txt$/i.test(name))
    : [];
  if (files.length !== 1) {
    throw new Error(`expected exactly one public/<32-hex>.txt key file, found ${files.length}`);
  }
  const file = join(dir, files[0]);
  const key = readFileSync(file, 'utf8').trim();
  if (!/^[0-9a-f]{32}$/i.test(key) || key !== files[0].slice(0, 32)) {
    throw new Error(`key file ${file} does not contain its own 32-character key`);
  }
  return key;
}

function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1].trim());
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': `mnafshin.info indexnow` } });
  if (!response.ok) {
    throw new Error(`${url} -> HTTP ${response.status}`);
  }
  return response.text();
}

async function loadSitemapUrls() {
  const fromDisk = [];
  if (existsSync('dist/sitemap-index.xml') || existsSync('dist/sitemap-0.xml')) {
    const files = existsSync('dist/sitemap-index.xml')
      ? locs(readFileSync('dist/sitemap-index.xml', 'utf8')).map((url) => {
          const name = url.split('/').pop();
          const local = join('dist', name ?? '');
          return existsSync(local) ? local : null;
        })
      : [];
    const xmlFiles = (files.filter(Boolean).length > 0 ? files.filter(Boolean) : ['dist/sitemap-0.xml']).filter(
      (file) => existsSync(file),
    );
    for (const file of xmlFiles) {
      fromDisk.push(...locs(readFileSync(file, 'utf8')));
    }
    if (fromDisk.length > 0) {
      log(`read ${fromDisk.length} URLs from dist/ sitemap`);
      return uniqueHttpUrls(fromDisk);
    }
  }

  const indexXml = await fetchText(SITEMAP_INDEX);
  const childLocs = locs(indexXml);
  const targets = childLocs.length > 0 ? childLocs : [SITEMAP_INDEX];
  const urls = [];
  for (const loc of targets) {
    const xml = loc === SITEMAP_INDEX ? indexXml : await fetchText(loc);
    urls.push(...locs(xml));
  }
  log(`read ${urls.length} URLs from ${SITEMAP_INDEX}`);
  return uniqueHttpUrls(urls);
}

function uniqueHttpUrls(urls) {
  return [...new Set(urls.filter((url) => url.startsWith(`${SITE}/`) || url === `${SITE}/` || url === SITE))];
}

function gitChangedFiles() {
  const sha = process.env.GITHUB_SHA || 'HEAD';
  const before = process.env.INDEXNOW_BEFORE || process.env.GITHUB_EVENT_BEFORE || '';
  const empty = /^0+$/.test(before);
  const range = !before || empty ? `${sha}~1` : before;
  try {
    const out = execFileSync('git', ['diff', '--name-only', range, sha], { encoding: 'utf8' });
    const files = out.split('\n').map((line) => line.trim()).filter(Boolean);
    log(`git diff ${range}..${sha}: ${files.length} changed file(s)`);
    return files;
  } catch (error) {
    warn(`git diff failed (${error instanceof Error ? error.message : error}); will fall back to all sitemap URLs`);
    return null;
  }
}

const SITEWIDE = [
  /^astro\.config\./,
  /^src\/layouts\//,
  /^src\/styles\//,
  /^src\/components\//,
  /^src\/lib\//,
  /^src\/content\.config\.ts$/,
];

function isSitewide(file) {
  // Shared chrome, config or libraries can affect every page.
  // Glossary data is handled more narrowly below.
  if (file === 'src/lib/glossary.ts' || file === 'src/data/glossaries.ts') return false;
  return SITEWIDE.some((pattern) => pattern.test(file));
}

function urlsForFile(file) {
  const urls = [];
  const add = (path) => urls.push(path === '/' ? `${SITE}/` : `${SITE}${path.endsWith('/') ? path : `${path}/`}`);

  if (file === 'src/pages/index.astro') add('/');
  if (file === 'src/pages/about.astro') add('/about/');
  if (file === 'src/pages/glossary.astro' || file === 'src/lib/glossary.ts' || file === 'src/data/glossaries.ts') {
    add('/glossary/');
    for (const section of SECTIONS) add(`/${section}/glossary/`);
  }

  const sectionIndex = file.match(/^src\/pages\/(spring|terms|k8s|system-design|security|db|ai)\/index\.astro$/);
  if (sectionIndex) add(`/${sectionIndex[1]}/`);

  const sectionGlossary = file.match(/^src\/pages\/(spring|terms|k8s|system-design|security|db|ai)\/glossary\.astro$/);
  if (sectionGlossary) add(`/${sectionGlossary[1]}/glossary/`);

  const article = file.match(/^src\/content\/(spring|terms|k8s|system-design|security|db|ai)\/([^/]+)\.md$/);
  if (article) {
    add(`/${article[1]}/${article[2]}/`);
    add(`/${article[1]}/`);
  }

  const video = file.match(/^src\/content\/videos\/([^/]+)\.md$/);
  if (video) {
    add(`/spring/${video[1]}/`);
    add('/spring/');
  }

  return urls;
}

function selectUrls(sitemap, changed) {
  if (changed === null) {
    log('falling back to every sitemap URL');
    return sitemap;
  }
  if (changed.some(isSitewide)) {
    log('shared source changed; submitting every sitemap URL');
    return sitemap;
  }

  const mapped = new Set();
  const unmapped = [];
  for (const file of changed) {
    const urls = urlsForFile(file);
    if (urls.length === 0) unmapped.push(file);
    for (const url of urls) mapped.add(url);
  }

  const submitted = [...mapped].filter((url) => sitemap.includes(url));
  const missing = [...mapped].filter((url) => !sitemap.includes(url));
  if (missing.length > 0) log(`skipping ${missing.length} mapped URL(s) not in the sitemap (drafts or non-HTML)`);

  if (submitted.length > 0) {
    if (unmapped.length > 0) log(`ignored ${unmapped.length} non-page file(s)`);
    return submitted;
  }

  const pageLike = unmapped.filter((file) => file.startsWith('src/'));
  if (pageLike.length > 0) {
    log(`could not map changed source to URLs (${pageLike.join(', ')}); falling back to every sitemap URL`);
    return sitemap;
  }

  log('no published page URLs changed in this push');
  return [];
}

async function submit(key, urlList) {
  const payload = {
    host: HOST,
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList: urlList.slice(0, MAX_URLS),
  };
  log(`POST ${ENDPOINT} with ${payload.urlList.length} URL(s)`);
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  const snippet = body.replace(/\s+/g, ' ').trim().slice(0, 500);
  log(`HTTP ${response.status}${snippet ? ` ${snippet}` : ''}`);
  return response.status;
}

async function main() {
  const key = loadKey();
  log(`keyLocation ${SITE}/${key}.txt`);

  const sitemap = await loadSitemapUrls();
  if (sitemap.length === 0) {
    warn('sitemap was empty; nothing to submit');
    return;
  }

  const urlList = submitAll ? sitemap : selectUrls(sitemap, gitChangedFiles());
  if (urlList.length === 0) {
    log('nothing to submit');
    return;
  }

  if (dryRun) {
    log(`dry run; not posting ${urlList.length} URL(s):`);
    for (const url of urlList) log(`  ${url}`);
    return;
  }

  await submit(key, urlList);
}

main().catch((error) => {
  warn('failed, leaving the deploy as a success:', error instanceof Error ? error.stack || error.message : error);
});
