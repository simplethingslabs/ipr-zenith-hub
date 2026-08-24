/**
 * Generates `dist/sitemap.xml` from the content bundle after each build.
 *
 * Written as a build step rather than a checked-in static file so that adding a
 * post to `src/content/posts.ts` cannot leave the sitemap silently stale — the
 * single most common way sitemaps stop being useful.
 *
 * The route list itself comes from `./routes.ts`, shared with the prerender step
 * configured in `vite.config.ts` — see `docs/PRERENDERING.md`.
 *
 * Run via the `postbuild` npm script, after prerendering has already written its
 * HTML files into `dist/` (prerendering runs inside the Vite/Rollup build; this
 * script runs after `vite build` exits).
 */

import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '../src/content/site';
import { posts } from '../src/content/posts';
import { staticRoutes, postRoutes } from './routes';

interface UrlEntry {
  path: string;
  /** Relative importance within this site, 0.0–1.0. */
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
}

/** Priority/changefreq per static route, keyed by path. Order follows `staticRoutes`. */
const staticMeta: Record<string, { priority: number; changefreq: UrlEntry['changefreq'] }> = {
  '/': { priority: 1.0, changefreq: 'monthly' },
  '/services': { priority: 0.9, changefreq: 'monthly' },
  '/practice-areas': { priority: 0.9, changefreq: 'monthly' },
  '/fees': { priority: 0.9, changefreq: 'monthly' },
  '/about': { priority: 0.7, changefreq: 'yearly' },
  '/blog': { priority: 0.8, changefreq: 'weekly' },
  '/contact': { priority: 0.8, changefreq: 'yearly' },
  '/privacy': { priority: 0.3, changefreq: 'yearly' },
  '/terms': { priority: 0.3, changefreq: 'yearly' },
};

const postBySlugPath = new Map(
  posts.filter((p) => p.status === 'published').map((p) => [`/blog/${p.slug}`, p]),
);

const staticEntries: UrlEntry[] = staticRoutes.map((path) => ({
  path,
  ...(staticMeta[path] ?? { priority: 0.5, changefreq: 'monthly' as const }),
}));

const postEntries: UrlEntry[] = postRoutes.map((path) => {
  const post = postBySlugPath.get(path)!;
  return {
    path,
    priority: 0.6,
    changefreq: 'yearly',
    lastmod: (post.updatedAt ?? post.publishedAt ?? post.createdAt).slice(0, 10),
  };
});

const entries = [...staticEntries, ...postEntries];

const base = SITE_URL.replace(/\/$/, '');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => {
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${base}${entry.path}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

const distDir = join(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  console.error('✖ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

writeFileSync(join(distDir, 'sitemap.xml'), xml, 'utf8');
console.log(`✓ dist/sitemap.xml — ${entries.length} URLs (${postEntries.length} posts)`);

if (base.includes('iprcentral.in')) {
  console.warn(
    '  ! SITE_URL is still the placeholder domain. Update src/content/site.ts before launch.',
  );
}
