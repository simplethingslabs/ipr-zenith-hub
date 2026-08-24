/**
 * The single source of truth for "what public routes exist," shared by the
 * sitemap generator and the prerender step.
 *
 * Previously this list was duplicated inline in `generate-sitemap.ts`. Now both
 * consumers import from here, so adding a blog post — or a new static page —
 * extends the sitemap and the prerendered route list in one place, not two that
 * can silently drift apart.
 *
 * `/admin/*` is deliberately excluded from both lists: it requires
 * authentication and a live API to be useful, is `Disallow`ed in
 * `public/robots.txt`, and there is nothing to gain from prerendering a page a
 * crawler cannot act on anyway.
 */

import { posts } from '../src/content/posts';

export const staticRoutes: string[] = [
  '/',
  '/services',
  '/practice-areas',
  '/fees',
  '/about',
  '/blog',
  '/contact',
  '/privacy',
  '/terms',
];

export const postRoutes: string[] = posts
  .filter((post) => post.status === 'published')
  .map((post) => `/blog/${post.slug}`);

/** Every public route, static pages first, then blog posts. */
export const allRoutes: string[] = [...staticRoutes, ...postRoutes];
