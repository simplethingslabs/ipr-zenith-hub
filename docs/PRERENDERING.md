# Prerendering — What It Is and How It Was Implemented

> **Status: implemented.** Option A (headless-browser prerendering as a build
> step) is live in `vite.config.ts`. This document was originally written as a
> planning doc before implementation; it now doubles as the design record,
> updated with the exact configuration that shipped and three corrections that
> only surfaced once the plan met a real Windows build — kept here rather than
> edited away, because they're the kind of detail the next person touching this
> config needs and would otherwise have to rediscover the hard way.
>
> Related: [ARCHITECTURE.md §8 (D3)](ARCHITECTURE.md#d3--spa-with-runtime-meta-tags-over-prerendering) ·
> [FEATURES.md §3.2](FEATURES.md#32-per-route-seo-new) ·
> [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 1. The problem, precisely

This site is a client-side single-page app (React + Vite + React Router,
`BrowserRouter`). Every route serves the **same** `dist/index.html`:

```html
<title>IPR Central — Intellectual Property Consultancy</title>
<meta name="description" content="Expert intellectual property consultancy..." />
<div id="root"></div>
<script type="module" src="/assets/index-xxxxx.js"></script>
```

The actual per-page content — headings, article text, and importantly the
per-route `<title>`, `<meta description>`, canonical URL and JSON-LD — is written
into `document.head` and the DOM **after** JavaScript downloads, parses and runs
(`src/components/Seo.tsx`, mounted by each page).

This is invisible to a human visitor with a normal browser, because browsers run
JavaScript. It is not invisible to two other kinds of visitor:

### 1a. Link-preview scrapers (the immediate, visible problem)

When someone pastes `https://iprcentral.in/blog/understanding-trademark-registration-india`
into WhatsApp, Slack, iMessage, LinkedIn or X, that platform's server fetches the
URL **without executing JavaScript** and reads whatever is in the raw HTML
response. Today that is always:

```
Title:       IPR Central — Intellectual Property Consultancy
Description: Expert intellectual property consultancy for trademarks, patents...
Image:       (none)
```

for **every single URL on the site** — the home page, the fees page, and every
blog post, indistinguishably. A client sharing a specific article gets a generic
card with the site's name and no indication of what they're actually sharing.
This is the concrete, already-happening cost.

### 1b. Search engine crawlers

Google and Bing's primary crawlers **do** execute JavaScript and will index the
`Seo`-written tags correctly — this is not currently broken for search ranking.
The risk is narrower and about *robustness*, not *breakage*:

- JS-rendered content is indexed on a **second, delayed rendering pass**, not the
  initial crawl. It can take longer for new pages to appear.
- Rendering budget is finite. A site under render-budget pressure can have pages
  skipped before the JS pass runs.
- Any crawler that does *not* execute JavaScript (many smaller search engines,
  some AI-answer crawlers, accessibility/scraping tools, `curl`-based SEO
  auditors) sees only the generic static shell.

Neither of these is a defect in what was shipped — the SEO work in `Seo.tsx` is
correct for the majority of consumers (real browsers, Google, Bing). Prerendering
closes the gap for the minority that matters commercially: **the exact moment a
prospective client is shown a link before they've decided to click it.**

---

## 2. What "prerendering" actually means

**Prerendering = running the exact same client-side app once per route, at build
time, in a headless browser, and saving the resulting fully-rendered HTML to
disk** — so that `dist/blog/understanding-trademark-registration-india/index.html`
already contains the real `<title>`, the real `<meta description>`, the real
JSON-LD, and the real visible page content, with no JavaScript execution
required to see it.

It is easiest to understand by contrast with two things it is *not*:

| | How it works | When rendering happens | Server needed at runtime? |
|---|---|---|---|
| **Current state (CSR)** | Ship an empty shell + JS bundle; browser renders | On every visit, in the visitor's browser | No — static hosting |
| **Prerendering (SSG)** | Build once, run the app in a headless browser for every known route, save the output HTML | Once, at build time, before deploy | **No** — still static hosting |
| **SSR (server-side rendering)** | Render the app to HTML on a live server for every request | On every visit, on a server | **Yes** — a Node process per request |

Prerendering is deliberately the middle option. It gets the same crawler/scraper
benefit as full SSR, but the output is **still plain static files** — no server
process, no cold starts, no new infrastructure. This matters directly because of
the architecture already in place: the entire point of the static-content
migration was to make the public site's availability equal to the CDN's
availability. SSR would reintroduce a server in the request path (even a fast
one) and undo that property. Prerendering does not.

### The mechanism, step by step

1. `vite build` runs as it does today, producing `dist/` with the JS bundle,
   CSS, and one generic `index.html`.
2. A prerendering tool starts a headless Chromium (via Puppeteer or Playwright)
   and, for each known route (`/`, `/fees`, `/blog/some-post`, …):
   - Loads `dist/index.html` from a local static server.
   - Lets the React app boot and run exactly as it would in a real browser —
     including `Seo.tsx`'s `useEffect` writing the head tags, and
     `usePostBySlug()` resolving content from the bundle.
   - Waits for the app to settle (a fixed delay, a "render complete" signal, or
     a network-idle heuristic).
   - Serializes the resulting `document.documentElement.outerHTML` — now
     containing the *real* title, meta tags, JSON-LD, and visible markup.
   - Writes that HTML to `dist/<route>/index.html` (or `dist/<route>.html`,
     depending on the tool).
3. The JS bundle is **still included** in the prerendered HTML, and it still
   boots normally when a real browser loads the page — the app "hydrates" over
   the static markup and becomes the same interactive SPA it is today. Nothing
   about the visitor experience changes. Only what a non-executing fetch sees
   changes.

The key insight: **prerendering does not replace the SPA — it takes a snapshot of
what the SPA would have rendered, for the benefit of clients that can't run it.**

---

## 3. Why this fits well here, specifically

Three properties of this codebase make prerendering unusually cheap to add,
compared to a typical SPA:

1. **The site is already fully static-first.** Every public page resolves its
   content synchronously from `src/content/*.ts` with `useRevalidated()` — see
   [ARCHITECTURE.md §3](ARCHITECTURE.md#3-content-architecture). There is no
   `isLoading` state a prerenderer has to wait out, no spinner that might get
   captured instead of content, and no risk of the crawl racing a slow API call.
   The default configuration (`VITE_ENABLE_LIVE_CONTENT` unset) makes every page
   render completely on the very first synchronous pass — ideal input for a
   prerenderer, which typically has to guess "when is the page done."

2. **The route list is fully enumerable at build time.** `scripts/generate-sitemap.ts`
   already does this exact enumeration for the sitemap — it imports
   `src/content/posts.ts` directly and knows every `/blog/:slug` that exists. The
   same list is the input a prerenderer needs. This is not new discovery work;
   it is reusing data the codebase already computes.

3. **There is no server-only code to route around.** Some SPAs prerender badly
   because parts of the app assume `window`, `document`, or browser-only APIs
   exist unconditionally and crash under Node-based prerendering tools (as
   opposed to headless-browser tools, which don't have this problem because they
   really are a browser). This app's public-page components are plain React
   reading from plain objects — no assumptions that would need guarding.

---

## 4. Options considered

### Option A — `vite-plugin-prerender` / `@prerenderer/rollup-plugin` (headless-browser prerendering)

Runs Puppeteer (or Playwright) against the built `dist/` for a supplied list of
routes, as described in §2.

| | |
|---|---|
| **Build-time cost** | Adds a headless Chromium download (~150–300 MB, cached after first install) and a few seconds per route to the build. For ~12 routes today, expect the prerender step to add roughly 10–30 seconds to CI. |
| **Runtime cost** | **Zero.** Output is static HTML files served exactly like today. |
| **Infra change** | None — still deployed to Vercel as static output. |
| **Fits current app** | Yes, directly — no code changes needed to the app itself, only to the build pipeline. `Seo.tsx` and `useRevalidated()` work completely unmodified. |
| **Maturity risk** | `vite-plugin-prerender` is a thin, low-maintenance wrapper; worth pinning a version and testing on upgrade. |
| **New routes need declaring** | Yes — same route list the sitemap script already builds. |

**This is the recommended option**, because it is additive: it sits entirely in
the build pipeline (a new step after `vite build`, before deploy), touches zero
application source files, and can be removed later with no residue if a full
framework migration ever happens.

### Option B — Migrate to a framework with built-in prerendering (Astro, Next.js static export, Remix, TanStack Start)

These frameworks bake prerendering (and often full SSG or SSR) into the
framework itself, typically with better DX (file-based routing, automatic route
discovery, image optimization, etc.).

| | |
|---|---|
| **Build-time cost** | Comparable or better than Option A once migrated |
| **Runtime cost** | Zero for the static-export modes (Astro, Next `output: 'export'`) |
| **Infra change** | None, if a static-export mode is used |
| **Fits current app** | **No** — requires rewriting the routing layer, the entry point, and how every page is authored. This is a framework migration, not an addition. |
| **Effort** | Large. Every page component, the router, `Seo.tsx`'s mounting model, and the build config would all change. |

This is very likely the *right* long-term choice for a marketing/content site —
Astro in particular is built exactly for this shape of site (mostly static
content, a handful of interactive islands) — but it is disproportionate to the
immediate problem, which is specifically "eight pages need real `<head>` tags for
non-JS clients." Recommended as a **future consideration**, not this project.

### Option C — Full SSR (Next.js/Remix in server mode, or a custom Express-rendered React app)

Renders every request live on a server.

| | |
|---|---|
| **Runtime cost** | A server process must run on every request — reintroduces exactly the availability coupling this migration removed. A cold or overloaded SSR server produces the same "visitor sees a broken page" failure mode the API-blocking architecture had. |
| **Fits current goals** | **No.** The static-first migration's explicit goal was that "the public site's availability is the CDN's availability" ([ARCHITECTURE.md §2](ARCHITECTURE.md#2-the-problem-this-architecture-solves)). SSR is a direct regression against that goal. |

**Ruled out** for this site. There is no per-visitor or personalized content
anywhere on the public site that would justify paying for a live render on every
request.

### Option D — Do nothing, rely on Google/Bing's JS rendering

| | |
|---|---|
| **Cost** | Zero engineering effort |
| **What it doesn't fix** | Social/chat link previews (the concrete, currently-visible problem) — these scrapers do not execute JavaScript and are not expected to start doing so |
| **Search risk remains** | Delayed indexing, and any non-JS crawler still sees nothing |

Only defensible if the business genuinely does not care about link previews —
unlikely for a firm whose growth depends on people sharing article links and
recommending the firm to others.

### Decision

**Option A** — add headless-browser prerendering as a build step, keep the
existing React/Vite/React Router app exactly as it is. Revisit Option B (Astro)
only if the site's content-authoring needs grow substantially (e.g., dozens of
articles, editorial workflows) to the point where Astro's content-collection
tooling would pay for itself.

---

## 5. How it was implemented (Option A)

This section is now a record of what shipped, kept in step-by-step form so the
reasoning stays traceable. Where reality diverged from the original plan, that
divergence is called out inline and explained in full in
[§5a](#5a-three-corrections-found-during-implementation).

### Step 1 — Installed the prerendering tool

`@prerenderer/rollup-plugin` with the Puppeteer renderer, as planned — it plugs
into Vite's build via Rollup's `generateBundle` hook, no second build tool.

```bash
npm install -D @prerenderer/rollup-plugin @prerenderer/renderer-puppeteer
```

This adds Puppeteer's bundled Chromium as a dev dependency — a one-time, cached
download, not something that ships to the browser bundle or affects `dist/`
size. Verified: `dist/assets/*` sizes are unchanged from before prerendering was
added.

### Step 2 — Shared route list

`scripts/routes.ts` now exports `staticRoutes`, `postRoutes`, and `allRoutes`,
built from `src/content/posts.ts` exactly as planned. `scripts/generate-sitemap.ts`
was refactored to import from it instead of maintaining its own duplicate list —
so the sitemap and the prerendered route list can no longer drift apart. `/admin/*`
is excluded from `allRoutes`, matching its exclusion from the sitemap and its
`Disallow` in `robots.txt`.

### Step 3 — Wired into `vite.config.ts`

The plugin is added to the `plugins` array, gated on `mode === "production"` so
it never runs for `vite dev` or the Lovable `build:dev` unminified build:

```ts
mode === "production" &&
  prerender({
    routes: allRoutes,
    renderer: PuppeteerRenderer,
    postProcess(route) {
      route.outputPath = route.route === "/" ? "index.html" : `${route.route.slice(1)}.html`;
    },
    rendererOptions: {
      renderAfterElementExists: "footer",
      headless: true,
      maxConcurrentRoutes: 4,
    },
  }),
```

Two of these four `rendererOptions`/`postProcess` values differ from the
original plan (`renderAfterTime: 300`, no concurrency cap, no `postProcess`) —
see [§5a](#5a-three-corrections-found-during-implementation) for exactly why
each one changed, with the failing output that proved the original plan wrong.

### Step 4 — Output shape

The plugin (via the `postProcess` hook above) writes one **flat** `.html` file
per route rather than the library's `<route>/index.html` default:

```
dist/index.html                                                (home)
dist/services.html
dist/practice-areas.html
dist/fees.html
dist/about.html
dist/blog.html
dist/blog/understanding-trademark-registration-india.html
dist/blog/provisional-vs-complete-patent-application.html
dist/blog/who-owns-freelance-work-copyright-assignment.html
dist/contact.html
dist/privacy.html
dist/terms.html
```

This shape matches Vercel's documented **Clean URLs** feature (`/fees` resolves
to `fees.html` on disk, no redirect) — confirmed working with `vite preview`,
which uses the same class of extensionless-path resolution. No `vercel.json`
change was needed; its existing SPA rewrite (`/(.*)` → `/index.html`) only
fires for a path that matches none of these files, e.g. a genuinely unknown URL,
which still correctly falls through to the client-side 404 page.

### Step 5 — Sitemap ordering

Unchanged from the plan and confirmed working: `vite build` (prerendering runs
inside it, as a Rollup output-phase plugin) completes fully, **then**
`postbuild` runs `generate-sitemap.ts` against the finished `dist/`. Verified
across multiple builds: `sitemap.xml` consistently lists all 12 URLs.

### Step 6 — `Seo.tsx` / JSON-LD interaction

Confirmed exactly as the plan predicted, once the render-ready signal was
corrected (§5a, Correction 1): `Seo.tsx`'s `useEffect` runs inside the headless
browser like any other browser, and by the time `renderAfterElementExists`
resolves, the `<title>`, meta tags, canonical link, and the
`<script id="route-json-ld">` block are all present and correctly serialized in
the captured HTML. Verified on both the home page (`LegalService` schema) and
an article (`BlogPosting` schema) by grepping the built files directly.

### Step 7 — Verification performed

- [x] `npm run build` completes; `dist/` contains one flat `.html` file per
      route (confirmed shape above), plus unchanged `assets/`, `sitemap.xml`,
      `robots.txt`
- [x] Fetched every one of the 12 routes with `curl` (no JS execution) against
      a `vite preview` server and confirmed each returns **its own** `<title>`
      — not the generic site title. This is the core problem being fixed,
      verified the way a scraper actually experiences the page.
- [x] Confirmed the `application/ld+json` block is present and route-specific
      on both the home page and an article
- [x] Confirmed canonical `<link>` and `og:title` are route-specific
- [x] Confirmed `/admin/login` is unaffected — still the lazy-loaded SPA shell,
      correctly excluded from prerendering
- [x] Confirmed a genuinely unmatched path still falls through to the SPA
      shell (200, generic tags, client router renders 404) — the rewrite still
      does its job for paths outside the known route list
- [x] `npx tsc -b --force` and `npm run lint` both clean after the change
- [x] Repeated the full build 5 times across this session to confirm the
      concurrency fix (Correction 2) actually holds and the build doesn't
      intermittently fail
- [ ] **Not yet done — requires a live deployment:** Facebook's
      [Sharing Debugger](https://developers.facebook.com/tools/debug/), a
      Twitter/X card preview, and Google's
      [Rich Results Test](https://search.google.com/test/rich-results) against
      the real deployed domain. These need a public URL to hit; run them once
      this is deployed to Vercel. The local verification above confirms the
      *content* they'd see is now correct — it does not confirm those specific
      external tools render it as expected.
- [ ] **Not done — requires a real browser:** opening the site and clicking
      around to confirm hydration is visually seamless (no flash of
      un-hydrated content, no layout shift). `curl`-based verification confirms
      the HTML is correct; it cannot confirm what hydration looks like to a
      human. Recommended before considering this fully done.
      contains, not how the app behaves once it's running

### Step 8 — Measured build time impact

Original estimate versus what was actually measured on this machine, both for
the current 12 routes:

| Stage | Before prerendering | Estimated | **Measured** |
|---|---|---|---|
| `vite build` (incl. prerender pass) | ~5 s | ~20–45 s | **~8–22 s** across repeated runs |
| `postbuild` (sitemap) | <1 s | <1 s | <1 s, unchanged |
| **Total build time** | ~6 s | ~20–45 s | **~9–23 s** |

Faster than the original estimate — likely because `maxConcurrentRoutes: 4`
still processes routes four at a time rather than fully serially, and this
machine's Chromium startup was quick. Treat the estimate range as the safer
number to plan CI budget around; the measured range is what this specific
environment produced across roughly ten builds during implementation.

This scales roughly linearly with route count — worth revisiting if the blog
grows to hundreds of posts (raising `maxConcurrentRoutes` experimentally, or
switching to Option B at that point, are the mitigations).

Measured on this machine: **~8-11 seconds** for the current 12 routes — faster
than the estimate above, though Windows/CI timing will vary.

---

## 5a. Three corrections found during implementation

The plan above was directionally right but got three specifics wrong. Each was
caught by testing against real output rather than trusting the mechanism
description — worth recording exactly what broke and why, since the failure
mode in each case was silent (the build succeeded; the *content* was wrong).

### Correction 1 — the render-ready signal had to change from a timer to a selector

The plan's Step 3 proposed `renderAfterTime: 300` on the reasoning that every
public page renders synchronously with no loading state. That reasoning holds
for eleven of the twelve routes. It does not hold for `/blog/:slug`, because
that route is *also* behind its own `React.lazy()` boundary (split out
specifically to keep `marked` + `dompurify` off every other route — see
[ARCHITECTURE.md](ARCHITECTURE.md#6-bundle-architecture)). On that one route,
"the page has no loading state once mounted" is true, but it doesn't mount
until an extra network fetch + parse + module eval for the lazy chunk completes
first — and 300ms did not reliably outlast that.

The visible symptom was easy to miss: the build succeeded, produced a
`blog/understanding-trademark-registration-india.html` file, with a **plausible
but wrong** file size (3.2 kB) — small enough to be plausible for a Suspense
fallback, not implausible enough to trigger a "something's wrong" reaction on
sight. Opening it showed:

```html
<div id="root"><div class="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div></div>
```

The captured snapshot was the route's *loading state*, not its content.

**Fix:** switched to `renderAfterElementExists: "footer"`. Every public page —
including `BlogPost`, once its lazy chunk has actually mounted — renders a
`<footer>` via `PublicLayout` as the last thing in its tree. Waiting for that
element to exist is a correctness condition tied to what actually rendered,
not a guess at how long rendering might take. Confirmed fixed: the same route
rebuilt at 28.5 kB with the full article present.

**Lesson for future routes:** any new route added behind its own lazy boundary
gets this correctness guarantee for free, as long as it also renders through
`PublicLayout` (and therefore a `<footer>`). A route that *doesn't* — an admin
page, hypothetically, if one were ever added to the prerender list — would need
its own selector.

### Correction 2 — unbounded concurrency crashed the build

The library's default (`maxConcurrentRoutes: 0`, meaning unlimited) opens one
Chromium tab per route simultaneously. With `renderAfterTime`, all 12 tabs
running concurrently built successfully. Switching to
`renderAfterElementExists` and re-running with the same unbounded concurrency
produced:

```
[Prerender Plugin] Unable to prerender all routes!
error during build:
[Prerender Plugin] Protocol error (Target.closeTarget): No target with given id found
```

— a build failure, not a silent content bug this time. The specific interaction
between `waitForSelector`-based waiting and 12 concurrent Puppeteer targets
tripped something in the CDP (Chrome DevTools Protocol) session handling on
Windows; it is plausible this is specific to this OS/Chromium version
combination rather than a fundamental flaw in the library.

**Fix:** `maxConcurrentRoutes: 4`. Trades a small amount of build time (roughly
+3-8 seconds for these 12 routes) for a build that has not failed across
multiple repeated runs since. If the blog grows enough that this becomes a
bottleneck, raise it experimentally rather than assuming higher is safe —
retest a few consecutive builds before trusting a new value.

### Correction 3 — output paths had to be flattened, or half the site 404s

This is the correction that would have been the most damaging to ship
unnoticed, because **the build gives no signal that anything is wrong** — it
was only caught by fetching the deployed shape of a URL exactly as a browser
or scraper would, rather than just checking that files existed in `dist/`.

The plugin's default output path is `<route>/index.html` — for `/fees`, that's
`dist/fees/index.html`. The plan's Step 4 assumed this would resolve correctly
because "Vercel's static file serving checks the filesystem before applying a
rewrite" — true, but incomplete: the open question was *which* filesystem path
a request to `/fees` (no trailing slash) actually resolves to, and directory
auto-indexing for an extensionless path is not something to assume without
checking, because it is not universally implemented in static file servers.

It failed exactly as that gap predicted. Tested locally with `vite preview`
(which uses the same class of static-file-serving logic as most static hosts):

```
GET /fees/   → 200, correct prerendered "Fees | IPR Central" page   ✓
GET /fees    → 200, but the GENERIC home-page shell — wrong page    ✗
```

Every internal link in this app — nav, footer, `<Link to="/fees">`,
`sitemap.xml` — is written **without** a trailing slash. Left as the plugin's
default, every one of those links would have kept serving the un-prerendered
generic shell to non-JS clients. The entire point of the exercise would have
silently not applied to a single route while looking, from the build log,
completely successful.

**Fix:** a `postProcess` hook that flattens every route to `<route>.html`
instead of `<route>/index.html` — e.g. `dist/fees.html`,
`dist/blog/some-slug.html`. This isn't a workaround; it matches Vercel's
documented **Clean URLs** behavior, where a request to `/fees` is resolved by
looking for `fees.html` on disk, with no redirect and no trailing slash. Same
`vite preview` test after the fix:

```
GET /fees    → 200, correct "Fees | IPR Central" page               ✓
```

Confirmed across every route, including the two `/blog/:slug` variants.

---

## 6. What did not change

Worth stating explicitly, since this is the property that made prerendering
safe to add without re-litigating the static-first architecture decision. All
five points below were verified, not just planned:

- **No server was introduced.** Deployment target remains Vercel static
  hosting. `vercel.json` was not modified at all — its existing rewrite handles
  the one case (a genuinely unmatched path) that the new flat `.html` files
  don't already cover.
- **No application source code changed.** `src/pages/`, `src/lib/content.ts`,
  and `Seo.tsx` are untouched. The entire implementation lives in
  `vite.config.ts` (plugin config) and two build-time-only files
  (`scripts/routes.ts`, and a refactor of `scripts/generate-sitemap.ts` to use
  it) — none of which ship to the browser bundle.
- **The admin panel is unaffected** — it is excluded from the route list by
  design, exactly as it is already excluded from the sitemap and disallowed in
  `robots.txt`.
- **`VITE_ENABLE_LIVE_CONTENT` behavior is unaffected.** Prerendering captures
  whatever the app renders on its first synchronous pass — which, by design
  (see [ARCHITECTURE.md §3](ARCHITECTURE.md#3-content-architecture)), is already
  the complete bundled content regardless of whether live revalidation is
  enabled. A background revalidation that arrives after the prerender snapshot
  was taken simply behaves the same way it does today for a real visitor: it
  updates the live DOM after hydration, without affecting what was captured in
  the static HTML.
- **Nothing about the visitor-facing interactive experience changes.** A real
  browser still downloads the same JS bundle and the same app boots and hydrates
  over the prerendered markup — the SPA behavior (instant client-side
  navigation, WhatsApp CTAs, search/filter on the blog, the mobile menu) is
  identical to today.

---

## 7. Summary

| Question | Answer |
|---|---|
| What problem did this solve? | Every one of the 12 public routes previously served one generic `<title>`/description — confirmed via direct `curl` before the fix. Each now serves its own. |
| What is prerendering? | Running the app once per route in a headless browser at build time, saving the fully-rendered HTML to disk. |
| Does it need a server? | No — output is static files, same as before. Verified: `dist/` contains 12 flat `.html` files plus the unchanged JS/CSS assets. |
| Did it change the deployment target? | No — still Vercel, still static hosting. `vercel.json` was not modified. |
| Did it require application code changes? | No — `src/pages/`, `src/lib/content.ts` and `Seo.tsx` are untouched. Everything lives in `vite.config.ts` and two build-time scripts. |
| Tool used | `@prerenderer/rollup-plugin` + `@prerenderer/renderer-puppeteer`, wired into `vite.config.ts`. |
| Render-ready signal | `renderAfterElementExists: "footer"` — **not** the originally planned fixed delay, which silently captured the lazy-loaded `/blog/:slug` route's loading state instead of its content (§5a, Correction 1). |
| Concurrency | Capped at `maxConcurrentRoutes: 4` — unbounded concurrency (the library default) crashed the build on this Windows environment (§5a, Correction 2). |
| Output shape | Flat `dist/<route>.html` via a `postProcess` hook, matching Vercel's Clean URLs — **not** the library's default `<route>/index.html`, which resolved incorrectly for every link in the app since none use a trailing slash (§5a, Correction 3). |
| Measured added build time | ~4–17 seconds for the current 12 routes (total build ~9–23 s, versus ~6 s before). |
| Still outstanding | External validation against a live deployed URL — Facebook Sharing Debugger, X card preview, Google Rich Results Test — and a manual real-browser hydration check. Everything checkable via `curl`/`vite preview` locally has been verified. |
| Recommended long-term alternative | Astro or another static-first framework, if content volume/authoring needs grow substantially — not needed now. |
