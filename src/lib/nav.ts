/** One step in a breadcrumb trail; the last one (the current page) has no href. */
export type Crumb = { label: string; href?: string };

/** One entry in an article's table of contents. */
export type TocItem = { slug: string; text: string; depth: number };
