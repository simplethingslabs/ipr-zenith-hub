/**
 * Per-route document metadata.
 *
 * This is a single-page app with no server-side rendering, so every route used
 * to ship the same `<title>` and description from `index.html`. That is a real
 * problem for a professional services site: search results, link previews and
 * browser history all showed one generic entry for eight distinct pages.
 *
 * This component writes head tags imperatively on mount. Crawlers that execute
 * JavaScript (Google, Bing) pick these up. Crawlers that do not — notably most
 * social link-preview scrapers — will still only see the static tags in
 * `index.html`, which is why those remain sensible defaults. Fixing that
 * properly requires prerendering; see `docs/ARCHITECTURE.md`.
 *
 * Deliberately hand-rolled rather than pulling in react-helmet-async: ~60 lines
 * against a dependency, a provider, and a maintenance story.
 */

import { useEffect } from 'react';
import { SITE_URL, defaultDescription, site } from '@/content/site';

interface SeoProps {
  /** Page title, rendered as "{title} | {firmName}". Omit on the home page. */
  title?: string;
  description?: string;
  /** Path only, e.g. "/fees". Used for the canonical URL. */
  path: string;
  /** Absolute URL of a preview image. */
  image?: string;
  type?: 'website' | 'article';
  /** Arbitrary structured data, serialised into a JSON-LD script tag. */
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'route-json-ld';

export function Seo({ title, description, path, image, type = 'website', jsonLd }: SeoProps) {
  const fullTitle = title ? `${title} | ${site.firmName}` : `${site.firmName} — ${site.tagline}`;
  const desc = description ?? defaultDescription;
  const canonical = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('meta[name="description"]', 'name', 'description', desc);
    upsertLink('canonical', canonical);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);

    if (image) {
      upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
      upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    }
  }, [fullTitle, desc, canonical, type, image]);

  // Callers build `jsonLd` as a fresh object literal on every render, so compare
  // by serialised value rather than by reference — otherwise the effect would
  // tear down and rebuild the script tag on each render.
  const serialisedJsonLd = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    document.getElementById(JSON_LD_ID)?.remove();
    if (!serialisedJsonLd) return;

    const script = document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = serialisedJsonLd;
    document.head.appendChild(script);

    return () => script.remove();
  }, [serialisedJsonLd]);

  return null;
}
