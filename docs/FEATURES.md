# Functional Features

> What the IPR Central website does, page by page and capability by capability.
>
> Companion: [ARCHITECTURE.md](ARCHITECTURE.md) · [UI-UX.md](UI-UX.md) ·
> [C4-DIAGRAMS.md](C4-DIAGRAMS.md)

Legend — **Status:** ✅ working · ⚠️ working with a caveat · 🔒 needs the API ·
🚧 not implemented

---

## 1. Feature map

```
Public site (no backend required)
├── Home                    positioning · value props · latest articles
├── Services                4 service categories with capability lists
├── Practice Areas          5 IP domains · jump links · anchor deep-links
├── Fees                    audience-segmented fee schedule
├── About                   mission · values · timeline
├── Blog                    index with live search + category filter
│   └── Article             sanitised Markdown · structured data · contextual CTA
├── Contact                 WhatsApp routing (6 topics) · email · phone · hours
├── Privacy / Terms         legal pages
└── 404                     in-layout, with suggestions

Cross-cutting
├── WhatsApp enquiry routing        per-page prefilled messages
├── Per-route SEO                   title · description · canonical · OG · JSON-LD
├── Sitemap generation              build-time, from content
├── Scroll restoration              anchor-aware
└── Markdown sanitisation           allowlist tags, attributes, URI schemes

Admin panel (requires API + database)  🔒
├── Login                   email + password → JWT
├── Dashboard               content counts, quick actions
├── Posts Manager           list · search · filter · delete
├── Post Editor             Markdown editor with live sanitised preview
├── Fees Manager            CRUD over fee items
└── Settings                firm details, contact info, socials
```

---

## 2. Public site

### 2.1 Home — `/` ✅

| Feature | Detail |
|---|---|
| Hero | Authored headline and subhead from `content/home.ts`, gold-on-navy gradient with blurred accent orbs |
| Primary CTA | "Request a Consultation" → WhatsApp, prefilled *"…request a consultation about protecting my IP"* |
| Secondary CTA | "View Our Fees" → `/fees` |
| Value propositions | Four cards — Comprehensive Protection, Expert Guidance, Strategic Enforcement, Transparent Pricing |
| Latest Insights | Three newest published posts, each with category pill, formatted date (`en-IN`), title and excerpt. Section is **omitted entirely** when there are no posts. |
| Closing CTA | WhatsApp + link to all contact options |
| Structured data | `schema.org/LegalService` — name, description, address, telephone, email, `areaServed`, `knowsAbout`, `sameAs` |

**Changed:** the hero subhead previously rendered `settings.bio.substring(0, 200) + '...'`,
truncating a database paragraph mid-sentence. It is now authored copy.

### 2.2 Services — `/services` ✅

Four categories, each with a description and a 4-item capability list:

| Category | Capabilities |
|---|---|
| IP Search & Analysis | Trademark availability · patent prior art · freedom-to-operate · competitive landscape |
| Registration & Filing | Trademark · patent · copyright · design |
| Protection & Enforcement | Infringement monitoring · cease & desist · opposition · litigation support |
| Strategic Advisory | Portfolio audits · IP valuation · due diligence · licensing strategy |

Content moved out of the component into `content/services.ts`.

### 2.3 Practice Areas — `/practice-areas` ✅

| Feature | Detail |
|---|---|
| Areas | Trademarks · Patents · Copyrights · Industrial Designs · Enforcement & Disputes |
| Per area | Title, one-line summary, 3 prose paragraphs, 5-item service list, area-specific WhatsApp CTA |
| Anchor targets | `#trademarks` `#patents` `#copyrights` `#designs` `#enforcement` — the footer deep-links to these |
| Jump links | **New** — pill row in the hero linking to all five sections |
| Contextual CTA | Prefills WhatsApp with *"…I'd like to discuss trademarks"* etc. |

`scroll-mt-24` on each section clears the sticky header when an anchor resolves.

### 2.4 Fees — `/fees` ✅

| Feature | Detail |
|---|---|
| Audience toggle | Individuals / Businesses segmented control. Instant — filters an in-memory array, no refetch. |
| Grouping | Curated category order: Trademarks → Patents → Copyrights → Designs → Consulting. Unlisted categories sort after, alphabetically. |
| Price formatting | `Intl.NumberFormat('en-IN', { currency: 'INR' })` → `₹15,000`; ranges as `₹18,000 – ₹45,000` |
| Type badge | "Fixed" or **"From"** |
| Per-item notes | What is included, and whether government fees are separate |
| Pricing caveats | Four-point panel: GST exclusive, statutory fees at actuals, fixed quote before work, custom quotes available |
| Empty state | Offers a WhatsApp quote request rather than a dead end |
| Custom quote CTA | Prefilled WhatsApp message |

**Changed:** previously refetched from `/api/fees?audience=…` on every toggle,
with a spinner each time. Also grouped by `[...new Set(fees.map(f => f.category))]`,
so section order followed database insertion order.

### 2.5 About — `/about` ✅

Firm bio · 3-paragraph mission · pull quote · four values (Client-Focused,
Excellence, Accessibility, Responsiveness) · alternating milestone timeline.

> ⚠️ The milestone years (2018–2024) came from the original scaffold and are
> **illustrative, not real history**. Replace or delete before launch — flagged
> `TODO(owner)` in `content/about.ts`.

### 2.6 Blog index — `/blog` ✅

| Feature | Detail |
|---|---|
| Listing | Published posts only, newest first by `publishedAt` (falling back to `createdAt`) |
| Search | Live, across title, excerpt and tags. No debounce needed — filters an in-memory array. |
| Category filter | All / Judgment / Commentary, with `aria-pressed` |
| Cards | Optional cover image, category pill, date, title, 3-line excerpt, up to 3 tags |
| Empty states | Distinguishes "no matches" (offers **Clear filters**) from "nothing published yet" |

### 2.7 Article — `/blog/:slug` ✅

| Feature | Detail |
|---|---|
| Resolution | Synchronous from the bundle — no loading flash, no redirect race |
| Markdown | `marked` (GFM) → **DOMPurify** with an explicit tag/attribute allowlist |
| Link safety | All rendered links forced to `target="_blank" rel="noopener noreferrer"` |
| URI safety | Only `https:` `http:` `mailto:` `tel:` `#` and `/` permitted — blocks `javascript:` and `data:` |
| Cover image | Optional, with a gradient-to-background scrim |
| Metadata | Category pill, `<time>` element with `dateTime` |
| Tags | Full tag list as pills |
| Structured data | `schema.org/BlogPosting` — headline, description, `datePublished`, `dateModified`, keywords, section, author, publisher |
| Contextual CTA | WhatsApp message **names the article**: *"I read your article \"…\" and have a question"* |
| Unknown slug | In-place "Article not found" with a link back to the index |

**Changed:** a failed lookup previously did `<Navigate to="/blog" replace />`,
silently discarding the URL. A transient API error was indistinguishable from a
deleted post, and a shared or bookmarked link just bounced.

**Content note:** three Commentary articles ship with the site. The `Judgment`
category is wired up but empty — the original seed contained a post titled
*"Landmark Judgment: Delhi High Court on Patent Infringement"* whose body was a
stub with no real case name, citation or holding. Publishing invented case law on
a practising firm's site is a professional risk, so it was not carried over.

### 2.8 Contact — `/contact` ✅ *(redesigned)*

| Feature | Detail |
|---|---|
| Primary | Prominent WhatsApp panel — "usually answered the same working day" |
| Topic routing | **Six tiles**, each opening WhatsApp with a distinct prefilled message: trademark · patent · copyright/design · infringement · portfolio review · other |
| Email | `mailto:` button showing the address |
| Phone | `tel:` button, whitespace stripped from the number |
| Office | Address in a semantic `<address>` element |
| Hours | Three rows from `content/site.ts` |
| Guidance | "Before you write" panel — what to include for a useful first reply |

**Removed: the contact form.** It POSTed to `/api/contact`; with the API down it
failed with a generic toast and **the enquiry was lost with no record and no way
to follow up** — the worst failure mode available on the site's primary
conversion path. See [ARCHITECTURE.md D2](ARCHITECTURE.md#d2--whatsapp-link-over-a-contact-form).

> **Trade-off:** there is no longer a database of enquiries, and the flow presumes
> WhatsApp. `mailto:` and `tel:` are kept at equal prominence for anyone who
> doesn't use it.

### 2.9 Privacy & Terms — `/privacy`, `/terms` ✅ *(new)*

Both were linked in the footer and **neither route existed** — every visitor who
clicked "Privacy Policy" got a 404, on a legal practice's website.

| Page | Covers |
|---|---|
| Privacy | No collection (no forms, analytics or tracking cookies) · hosting-provider request data · Google Fonts · what happens when you contact us · confidentiality · retention · your choices |
| Terms | No legal advice · no solicitation / no client relationship from an enquiry · how fee information should be read · accuracy · external links · IP in the site · limitation of liability · governing law |

The privacy text is drafted to be **factually accurate to how this build
behaves** — it genuinely collects nothing, which is only true because the form
was removed.

> ⚠️ Needs the firm's sign-off before launch, particularly the
> professional-conduct wording against applicable Bar Council rules. Flagged
> `TODO(owner)` in `content/legal.ts`.

### 2.10 404 ✅ *(redesigned)*

Wrapped in `PublicLayout` so header, nav and footer are present; shows the
attempted path; offers five suggested destinations. Previously a bare centred div
with no navigation plus a `console.error` on every hit.

---

## 3. Cross-cutting features

### 3.1 WhatsApp enquiry routing ✅

One helper, `whatsappUrl(message)`, builds `https://wa.me/<number>?text=<encoded>`.

Every CTA passes a message specific to its context, so enquiries arrive
pre-labelled:

| Origin | Prefilled message |
|---|---|
| Header / generic | "…I'd like to discuss protecting my intellectual property." |
| Home hero | "…request a consultation about protecting my IP." |
| Practice area | "…I'd like to discuss patents." |
| Fees | "…I'd like a custom quote for IP work." |
| Article | "…I read your article \"{title}\" and have a question." |
| Contact tiles | Six topic-specific variants |

Configured by a single constant, `WHATSAPP_NUMBER` in `content/site.ts`.

> ⚠️ **Currently a placeholder** (`919876543210`). This is the primary CTA on
> every page of the site — it must be set before launch.

### 3.2 Per-route SEO ✅ *(new)*

`<Seo>` writes on mount: `document.title`, meta description, canonical link,
`og:title` / `og:description` / `og:url` / `og:type` / `og:image`, Twitter card
tags, and a JSON-LD script.

Previously all routes shipped the single generic `<title>` from `index.html`, so
search results and browser history showed one indistinguishable entry for the
whole site. `Seo` fixes this for real browsers and JS-executing crawlers
(Google, Bing), but link-preview scrapers — most social and chat platforms — do
not run JavaScript, so on its own this component couldn't fix what they saw.

**Closed by prerendering** ✅ *(new)* — a headless-browser build step captures
each route's fully-rendered `<head>` (everything `Seo` writes, including the
JSON-LD block) to a static `.html` file per route. A plain `curl` of any of the
12 public routes now returns that route's own title and description, verified
directly rather than assumed. See [PRERENDERING.md](PRERENDERING.md) for the
full implementation record, including three real snags found in testing.

### 3.3 Sitemap generation ✅ *(new)*

`npm run build` runs `postbuild` → `scripts/generate-sitemap.ts`, which imports
the content modules directly and emits `dist/sitemap.xml` with `changefreq`,
`priority` and per-post `lastmod`. `/admin` is excluded.

Generated rather than checked in, so adding a post cannot leave the sitemap
stale. The script also warns while `SITE_URL` is still the placeholder domain.

Current output: 12 URLs (9 static + 3 posts).

### 3.4 Scroll restoration ✅ *(new)*

`ScrollToTop` resets scroll on route change, but defers to the browser when a
hash is present, smooth-scrolling to the target element. Without it, navigating
from halfway down Practice Areas landed you halfway down Contact.

### 3.5 Markdown sanitisation ✅ *(new)*

`renderMarkdown()` in `lib/markdown.ts` is the only path from Markdown to HTML,
used by both the public article page and the admin editor preview — so the
preview matches what readers see, and injected markup cannot execute inside an
authenticated admin session.

### 3.6 Static-first content ✅

See [ARCHITECTURE.md §3](ARCHITECTURE.md#3-content-architecture). Public pages
render from the bundle with no request, no loading state and no failure state.
`VITE_ENABLE_LIVE_CONTENT=true` adds background revalidation against the API.

---

## 4. Admin panel 🔒

> **All admin features require the API and a PostgreSQL database.** The deployed
> API currently returns 500 on every database-backed route, including login — the
> Postgres instance behind it is gone. See
> [DEPLOYMENT.md](DEPLOYMENT.md#restoring-the-api).
>
> The code is intact and unchanged in behaviour; it is code-split into its own
> chunk so public visitors never download it.

### 4.1 Login — `/admin/login` 🔒
Email + password with Zod validation, password visibility toggle, `POST /api/auth/login`,
JWT + user persisted to `localStorage` via Zustand.

**Changed:** the line *"For demo: use any valid email and password (6+ chars)"*
was removed — it sat under a real authentication form and was false.

### 4.2 Dashboard — `/admin` 🔒
Content counts and quick actions.

### 4.3 Posts Manager — `/admin/posts` 🔒
Table of all posts (drafts included), search, status/category filter, edit and
delete with confirmation.

### 4.4 Post Editor — `/admin/posts/new`, `/admin/posts/:id/edit` 🔒
Title, auto-generated editable slug, excerpt, cover image URL, category, tags,
draft/published status, and a Markdown editor with a **live sanitised preview**.

**Changed:** the preview called `marked()` directly and injected the result
unsanitised. It now uses `renderMarkdown()`.

### 4.5 Fees Manager — `/admin/fees` 🔒
Table of fee items with a modal create/edit dialog and delete confirmation.

### 4.6 Settings — `/admin/settings` 🔒
Firm name, tagline, bio, email, phone, WhatsApp, address, social links, hero
image. Persists to the singleton `Settings` row.

### 4.7 API surface

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | — | bcrypt compare → 24 h JWT |
| GET | `/api/posts` | — | Unauthenticated callers get published only |
| GET | `/api/posts/:slug` | — | 404 for unpublished without a token |
| POST · PUT · DELETE | `/api/posts`, `/api/posts/:id` | ✔ | |
| GET | `/api/fees` | — | Optional `?audience=` |
| POST · PUT · DELETE | `/api/fees`, `/api/fees/:id` | ✔ | |
| GET | `/api/settings` | — | |
| PUT | `/api/settings` | ✔ | |
| POST | `/api/contact` | — | ⚠️ retained but no longer called by the site |
| GET | `/health` | — | Liveness only — does **not** touch the database, which is why it returned 200 while everything else returned 500 |

**Fixed:** `lib/api.ts` called `response.json()` on every successful response,
including `204 No Content`. Both delete endpoints return 204, so a successful
delete threw `SyntaxError: Unexpected end of JSON input` and surfaced as an error
toast. 204 is now handled explicitly.

---

## 5. Not implemented 🚧

| Feature | Note |
|---|---|
| Full SSR | Ruled out — would reintroduce a live server on every request, against the static-first goal. See [ARCHITECTURE.md D3](ARCHITECTURE.md#d3--runtime-seo-component-then-build-time-prerendering-to-close-its-one-gap) and [PRERENDERING.md](PRERENDERING.md). |
| Dark mode toggle | A complete `.dark` palette exists in `index.css` with nothing to activate it |
| Contact submission storage | Removed with the form; WhatsApp is the channel of record |
| Analytics | None. Deliberate — and it is what makes the privacy page accurate |
| Blog pagination | Fine at 3 posts; needed past ~30 |
| Related posts | Tag data supports it |
| RSS feed | Would suit a commentary-led practice |
| Email notifications | `api/src/routes/contact.ts` has a `TODO` where this would go |
| Login rate limiting | `express-rate-limit` on `/api/auth/login` |
| Server-validated admin guard | Route guard is client-side only; writes are still server-verified |
| Automated tests | No test runner configured |
| Image optimisation | Cover images are remote URLs, unoptimised, `loading="lazy"` only |
| Judgment-category posts | Category and filter are wired up, awaiting posts with real citations |

---

## 6. Verification performed

| Check | Result |
|---|---|
| `npm run build` | ✅ 1,733 modules, ~9–23 s (up from ~6 s — the prerender pass, see [PRERENDERING.md](PRERENDERING.md)) |
| `npx tsc -b` | ✅ Clean (fixed one pre-existing error in `PostEditor.tsx`) |
| `npm run lint` | ✅ 0 errors, 2 warnings (both untouched shadcn boilerplate) — from 23 errors |
| `postbuild` sitemap | ✅ 12 URLs, 3 posts |
| Route resolution via `vite preview` | ✅ `/` `/services` `/practice-areas` `/about` `/blog` `/blog/:slug` `/contact` `/privacy` `/terms` `/admin/login` all 200 |
| `sitemap.xml`, `robots.txt` | ✅ 200 |
| **Per-route `<title>` via non-JS `curl`** | ✅ All 12 public routes return their own distinct title/description/canonical/JSON-LD — the specific problem prerendering exists to fix, verified the way a scraper actually sees it, not just checked in a browser |
| Content baked into bundle | ✅ Post titles, fee names and the `wa.me` URL all present in `dist/assets/index-*.js` |
| Markdown chunk not preloaded | ✅ `index.html` preloads only `react-vendor` and the CSS |
| Public first load | ✅ ~101 kB gzipped (unchanged — prerendering adds build-time output, not runtime JS) |
| Repeated builds (×5) | ✅ Consistent output, confirms the concurrency fix in PRERENDERING.md §5a holds |

**Not verified:** visual rendering in a real browser (hydration was confirmed
correct via the JS bundle reference in prerendered HTML, but not eyeballed),
admin panel behaviour end-to-end (blocked — no database), and external
tools (Facebook Sharing Debugger, Google Rich Results Test) that require a live
deployed URL.
