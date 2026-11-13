import type { APIRoute, GetStaticPaths } from 'astro';
import { type ArticleSectionId } from '../../lib/articles';
import { getCurriculum, getCurriculumPosition } from '../../lib/curriculum';
import { ogKey } from '../../lib/og';
import { renderOgImage, type OgCard } from '../../lib/og-image';
import { getSection, SECTIONS, SITE_DESCRIPTION } from '../../lib/site';
import { getPublishedEntries } from '../../lib/posts';
import { getTermsWeeklies } from '../../lib/terms';
import { getPublishedVideos, videoPath } from '../../lib/videos';

const ARTICLE_SECTIONS: ArticleSectionId[] = [
  'spring',
  'terms',
  'k8s',
  'system-design',
  'security',
  'db',
];

// One social preview image per public page: /og/<page path>.png
// (the home page is /og/home.png). Drafts have no page and get no image.

const DOMAIN = 'mnafshin.info';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Berlin',
  });
}

export const getStaticPaths = (async () => {
  const cards: { key: string; card: OgCard }[] = [
    {
      key: 'home',
      card: {
        eyebrow: 'Java and Spring developer',
        title: 'Articles from SpringUniverse and Termsplained',
        description: SITE_DESCRIPTION,
        footer: DOMAIN,
      },
    },
  ];

  for (const { id } of SECTIONS) {
    const section = getSection(id);
    cards.push({
      key: section.path,
      card: {
        eyebrow: 'Articles and weekly reviews',
        title: section.name,
        description: section.tagline,
        footer: `${DOMAIN}/${section.path}`,
      },
    });
  }

  const concepts = (
    await Promise.all(
      ARTICLE_SECTIONS.map(async (section) =>
        (await getCurriculum(section)).map((article) => ({ article, section })),
      ),
    )
  ).flat();
  for (const { article, section: sectionId } of concepts) {
    const section = getSection(sectionId);
    const position = await getCurriculumPosition(article, sectionId);
    cards.push({
      key: ogKey(`${section.path}/${article.id}`),
      card: {
        eyebrow: position
          ? `${section.name} · Article ${position.index} of ${position.total}`
          : section.name,
        title: article.data.title,
        description: article.data.description,
        footer: `${DOMAIN}/${section.path}`,
      },
    });
  }

  for (const weekly of await getTermsWeeklies()) {
    cards.push({
      key: ogKey(`terms/${weekly.id}`),
      card: {
        eyebrow: `Termsplained · Weekly review · ${formatDate(weekly.data.pubDate)}`,
        title: weekly.data.title,
        description: weekly.data.description,
        footer: `${DOMAIN}/terms`,
      },
    });
  }

  for (const video of await getPublishedVideos()) {
    cards.push({
      key: ogKey(videoPath(video.id)),
      card: {
        eyebrow: `SpringUniverse · Weekly review ${video.data.seriesLabel}`,
        title: video.data.title,
        description: video.data.description,
        footer: `${DOMAIN}/spring`,
      },
    });
  }

  // The AI section has no published posts yet; give any future post a card.
  for (const post of await getPublishedEntries('ai')) {
    cards.push({
      key: ogKey(`ai/${post.id}`),
      card: {
        eyebrow: 'AI',
        title: post.data.title,
        description: post.data.description,
        footer: `${DOMAIN}/ai`,
      },
    });
  }

  return cards.map(({ key, card }) => ({ params: { key }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage((props as { card: OgCard }).card);
  return new Response(png as BodyInit, {
    headers: { 'Content-Type': 'image/png' },
  });
};
