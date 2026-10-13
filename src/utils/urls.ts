import { site } from '../config/site';
export function canonicalPath(path: string) {
  const base = import.meta.env.BASE_URL;
  return base !== '/' && path.startsWith(base)
    ? '/' + path.slice(base.length)
    : path;
}
export const canonicalUrl = (path: string) =>
  new URL(canonicalPath(path), site.url).href;
export function publicAssetUrl(path: string, origin: URL | string = site.url) {
  if (path.startsWith('https://')) return path;
  const base = import.meta.env.BASE_URL;
  return new URL(
    path.startsWith(base) ? path : base + path.replace(/^\//, ''),
    origin,
  ).href;
}
