import { withBase } from './site';

/** Size of the generated social preview images. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * Key of a page's social preview image, from its site path (without base):
 * `spring/bean-lifecycle/` becomes `spring/bean-lifecycle`, the home page
 * becomes `home`. The image is generated at `/og/<key>.png`.
 */
export function ogKey(path: string) {
  const cleaned = path.replace(/^\/+|\/+$/g, '');
  return cleaned === '' ? 'home' : cleaned;
}

/** Absolute URL of a page's social preview image. */
export function ogImageUrl(key: string, site: URL | undefined) {
  return new URL(withBase(`og/${key}.png`), site).toString();
}

/** Strip the configured base from a pathname so it can be used as an OG key. */
export function stripBase(pathname: string) {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
}
