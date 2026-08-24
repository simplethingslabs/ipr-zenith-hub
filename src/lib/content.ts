/**
 * Static-first content access layer.
 *
 * ─── Why this exists ────────────────────────────────────────────────────────
 * Every public page used to block on a network round-trip to the API before it
 * could render anything. On a cold-started free-tier host that meant ~30 seconds
 * of spinner, and if the API was unhealthy the page rendered an error instead of
 * content. The site was only as available as its least available dependency.
 *
 * Now the bundled content in `src/content/` IS the site. Pages read it
 * synchronously and paint on the first frame — no loading state, no failure
 * state, no request.
 *
 * ─── Live content (optional) ─────────────────────────────────────────────────
 * Set `VITE_ENABLE_LIVE_CONTENT=true` at build time to additionally revalidate
 * against the API after mount. Fresh data swaps in when it arrives; if the
 * request is slow, fails, or the API is down, the visitor never notices because
 * they are already looking at a complete page. This is stale-while-revalidate,
 * with the static bundle as the permanent floor.
 *
 * The flag is OFF by default, which makes the deployed site fully static.
 * Turn it on once the database behind the admin panel is provisioned and
 * healthy, so that admin edits appear without a redeploy.
 *
 * Note: the admin panel does NOT go through this module. It always talks
 * directly to the API via `@/lib/api`, so it is unaffected by this flag.
 */

import { useEffect, useRef, useState } from 'react';
import type { FeeItem, Post, Settings, Audience } from '@/types';
import { site } from '@/content/site';
import { fees as staticFees, feeCategoryOrder } from '@/content/fees';
import { posts as staticPosts } from '@/content/posts';
import { feesApi, postsApi, settingsApi } from '@/lib/api';

/** Whether to revalidate bundled content against the live API after mount. */
export const LIVE_CONTENT_ENABLED = import.meta.env.VITE_ENABLE_LIVE_CONTENT === 'true';

/**
 * Returns `initial` immediately, then replaces it with fresh data if live
 * content is enabled and the fetch succeeds. Never surfaces a loading or error
 * state to the caller — that is the entire point.
 */
function useRevalidated<T>(initial: T, fetcher: () => Promise<T>): T {
  const [value, setValue] = useState<T>(initial);

  // `fetcher` is typically an inline arrow, so pin it in a ref to keep the
  // effect from re-running on every render.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!LIVE_CONTENT_ENABLED) return;

    let cancelled = false;
    fetcherRef
      .current()
      .then((fresh) => {
        if (!cancelled && fresh) setValue(fresh);
      })
      .catch(() => {
        // Intentionally silent: the static content already on screen is a
        // perfectly good answer, and a console error per page load is noise.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings — firm name, contact details, socials
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Site settings. Always returns a fully populated object, so consumers never
 * need null checks or optional chaining on `address` / `socialLinks`.
 */
export function useSiteSettings(): Settings {
  return useRevalidated<Settings>(site, () => settingsApi.get());
}

// ─────────────────────────────────────────────────────────────────────────────
// Posts
// ─────────────────────────────────────────────────────────────────────────────

const byNewest = (a: Post, b: Post) => {
  const at = new Date(a.publishedAt ?? a.createdAt).getTime();
  const bt = new Date(b.publishedAt ?? b.createdAt).getTime();
  return bt - at;
};

/** Published posts, newest first. */
export function usePublishedPosts(): Post[] {
  return useRevalidated<Post[]>(
    staticPosts.filter((p) => p.status === 'published').sort(byNewest),
    () =>
      postsApi
        .getAll({ status: 'published' })
        .then((live) => live.filter((p) => p.status === 'published').sort(byNewest)),
  );
}

/**
 * A single published post by slug, or `null` if there is no such post.
 *
 * Resolves synchronously from the bundle, so there is no loading flash and no
 * redirect-on-mount race. When live content is on, a slug that is missing from
 * the bundle is still looked up over the network — which is how a post created
 * in the admin panel becomes reachable before the next redeploy.
 */
export function usePostBySlug(slug: string | undefined): Post | null {
  const local = slug ? staticPosts.find((p) => p.slug === slug && p.status === 'published') : undefined;

  const [remote, setRemote] = useState<Post | null>(null);

  useEffect(() => {
    if (!LIVE_CONTENT_ENABLED || !slug) return;

    let cancelled = false;
    postsApi
      .getBySlug(slug)
      .then((post) => {
        if (!cancelled && post?.status === 'published') setRemote(post);
      })
      .catch(() => {
        /* fall through to the bundled copy, if any */
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return remote ?? local ?? null;
}

/**
 * True when a slug is definitively unknown — not in the bundle, and either live
 * content is off or the network lookup has not produced anything. Used to decide
 * whether to show a 404 rather than redirecting away optimistically.
 */
export function useIsUnknownPost(slug: string | undefined, resolved: Post | null): boolean {
  const [settled, setSettled] = useState(!LIVE_CONTENT_ENABLED);

  useEffect(() => {
    if (!LIVE_CONTENT_ENABLED) {
      setSettled(true);
      return;
    }
    // Give the network lookup a moment before declaring a slug dead.
    const timer = setTimeout(() => setSettled(true), 4000);
    return () => clearTimeout(timer);
  }, [slug]);

  return settled && resolved === null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fees
// ─────────────────────────────────────────────────────────────────────────────

/** All fee items across both audiences. */
export function useFees(): FeeItem[] {
  return useRevalidated<FeeItem[]>(staticFees, () => feesApi.getAll());
}

/** Fee items for one audience, grouped into ordered category sections. */
export function groupFeesByCategory(
  items: FeeItem[],
  audience: Audience,
): Array<{ category: string; items: FeeItem[] }> {
  const forAudience = items.filter((f) => f.audience === audience);

  const categories = [...new Set(forAudience.map((f) => f.category))].sort((a, b) => {
    const ai = feeCategoryOrder.indexOf(a);
    const bi = feeCategoryOrder.indexOf(b);
    // Unlisted categories sort after listed ones, then alphabetically.
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return categories.map((category) => ({
    category,
    items: forAudience.filter((f) => f.category === category),
  }));
}
