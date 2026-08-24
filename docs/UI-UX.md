# UI / UX Specification

> Design system, information architecture, page anatomy and accessibility for the
> IPR Central website.
>
> Companion: [ARCHITECTURE.md](ARCHITECTURE.md) · [FEATURES.md](FEATURES.md)

---

## 1. Design intent

A law-adjacent professional services site has to do two contradictory things:
signal institutional seriousness, and not feel like it was built in 2009. The
design resolves that with a **navy-and-gold, serif-and-sans** system — traditional
enough to read as credible, contemporary in its spacing and restraint.

| Principle | How it shows up |
|---|---|
| **Credibility over flourish** | No parallax, no scroll-jacking, no animated counters. Transitions are limited to hover shadow and a 300 ms image scale. |
| **Answer before ask** | Fees are a top-level nav item with real numbers on it. A prospective client can price the work without talking to anyone. |
| **One obvious next action** | Every page ends in a single WhatsApp CTA. Sections offer at most one primary and one secondary action. |
| **Content is legible** | Long-form copy is capped at `max-w-4xl`. Practice-area prose is broken into short paragraphs, never walls. |
| **Never show a spinner for content that exists** | Direct consequence of the static architecture — see §7. |

---

## 2. Design tokens

Defined as HSL CSS custom properties in `src/index.css`, consumed through Tailwind
in `tailwind.config.ts`. Semantic names, not literal colours — so `--accent` can
change once and propagate everywhere.

### Colour

| Token | Light value | Role |
|---|---|---|
| `--background` | `40 20% 98%` | Warm off-white page ground. Not pure white — reduces glare on long reading. |
| `--foreground` | `222 47% 11%` | Body text |
| `--primary` | `222 47% 11%` | Deep navy. Header CTAs, footer, hero, admin sidebar. |
| `--primary-foreground` | `40 20% 98%` | Text on navy |
| `--accent` | `40 60% 55%` | Refined gold. **The only saturated colour.** Reserved for actions, active states and emphasis. |
| `--accent-foreground` | `222 47% 11%` | Navy text on gold — this pairing is what keeps CTAs readable |
| `--muted` | `215 20% 94%` | Alternating section bands |
| `--muted-foreground` | `215 16% 47%` | Secondary text, captions |
| `--card` | `0 0% 100%` | Pure white, so cards lift off the warm ground |
| `--border` | `215 25% 88%` | Hairlines |
| `--destructive` | `0 84% 60%` | Errors, delete confirmations |
| `--ring` | `40 60% 55%` | Focus ring — gold, matching the accent |

**Gold is a scarce resource in this system.** It appears on primary buttons,
active nav states, icon backgrounds at 10 % alpha, category pills, prices, and
timeline markers. Nothing else. That scarcity is what makes a gold button read
unambiguously as *the* action on a page.

A complete `.dark` palette exists and is currently unused — see §9.

### Typography

| | Family | Used for |
|---|---|---|
| Display | **Playfair Display** (500/600/700) | All headings via a global `h1–h6` rule, plus card titles and pull quotes |
| Body | **Inter** (400/500/600/700) | Everything else |

Loaded from Google Fonts with `display=swap` and `preconnect` to both
`fonts.googleapis.com` and `fonts.gstatic.com`, so text paints in the fallback
face immediately rather than blocking on the webfont.

Scale, mobile → desktop:

| Element | Classes |
|---|---|
| Hero `h1` | `text-4xl md:text-5xl lg:text-6xl font-bold leading-tight` |
| Page `h1` | `text-4xl md:text-5xl font-bold` |
| Section `h2` | `text-3xl md:text-4xl font-bold` |
| Card title | `text-lg font-serif font-semibold` |
| Lead paragraph | `text-lg text-muted-foreground` |
| Body | `text-sm` / `text-base` |

### Spacing, radius, layout

- **Vertical rhythm:** every section is `py-16 md:py-24`. The consistency is what
  makes an eight-page site feel like one system.
- **Radius:** `--radius: 0.5rem`, with `md`/`sm` derived from it.
- **Containers** (`src/components/layout/Container.tsx`):

| Size | Max width | Used for |
|---|---|---|
| `narrow` | `max-w-4xl` | Blog posts, legal pages, timeline, 404 — reading measures |
| `default` | `max-w-7xl` | Every standard page |
| `wide` | `max-w-screen-2xl` | Available, currently unused |

All apply `px-4 sm:px-6 lg:px-8`.

### Elevation

One shadow, one state: `hover:shadow-lg transition-shadow` on cards. There is no
resting shadow — cards are separated by border and background contrast, and
elevation is reserved to signal interactivity.

---

## 3. Information architecture

```
/                        Home — positioning, value props, latest articles
├── /services            Four service categories with feature lists
├── /practice-areas      Five IP domains, deep detail, anchor-linked
│   ├── #trademarks
│   ├── #patents
│   ├── #copyrights
│   ├── #designs
│   └── #enforcement
├── /fees                Fee schedule, segmented Individuals / Businesses
├── /about               Mission, values, timeline
├── /blog                Article index with search + category filter
│   └── /blog/:slug      Article
├── /contact             WhatsApp routing, email, phone, hours
├── /privacy             Privacy policy
├── /terms               Terms of service
└── /admin/*             Admin panel (unlinked from public nav)
```

### Navigation model

| Surface | Contains |
|---|---|
| **Header** (sticky, `h-16`, backdrop-blur) | Wordmark · 7 nav links · gold WhatsApp CTA |
| **Header, mobile** | Wordmark · hamburger → full-width drawer · full-width CTA |
| **Footer** | Wordmark + tagline + socials · Quick Links · Practice Areas (deep anchors) · Contact block with WhatsApp · legal links |

Two deliberate changes from the original:

- **The "Admin" link was removed from the public header and mobile menu.** A
  brochure site should not advertise its own back door. `/admin` still works
  directly and is `Disallow`ed in `robots.txt`.
- **"Get Started" now opens WhatsApp** rather than routing to a form page,
  removing one click from the primary conversion path.

### The three-way CTA hierarchy

| Tier | Treatment | Where |
|---|---|---|
| Primary | Gold `WhatsAppCta` | Header, every hero, every section close |
| Secondary | Outlined, transparent on navy | "View Our Fees", "All Contact Options" |
| Tertiary | Ghost / text link | "View All" on the blog teaser |

---

## 4. Page anatomy

### Home
```
┌─ Hero ─────────────────────────────────── navy gradient + gold blur orbs ─┐
│  h1: "Protect Your Ideas. / Secure Your Future."                          │
│  Subhead · [Request a Consultation ▸WA]  [View Our Fees]                  │
├─ Value props ────────────────────────────────────── background, 4-up grid ┤
│  Shield · FileText · Scale · Award — icon tile, title, one line each      │
├─ Latest Insights ───────────────────────────────────── muted/30, 3-up ────┤
│  3 newest published posts · category pill · date · title · excerpt        │
├─ Closing CTA ─────────────────────────────────────────────── navy ────────┤
│  [Message Us on WhatsApp]  [All Contact Options]                          │
└───────────────────────────────────────────────────────────────────────────┘
```
The hero subhead is authored copy in `content/home.ts`. It previously did
`settings.bio.substring(0, 200) + '...'` — a truncated database paragraph, which
cut mid-sentence and read as broken.

The Latest Insights section is conditional on there being posts, so an empty blog
collapses the band rather than rendering a "no posts" apology on the homepage.

### Fees
```
┌─ Hero ──────────────────────────────────────────────────── muted/30 ──────┐
├─ [ Individuals | Businesses ] ← segmented control ────────────────────────┤
│  Category section (Trademarks)                                            │
│    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                     │
│    │ Name  [Fixed]│ │ Name   [From]│ │ Name  [Fixed]│  3-up, flex-col     │
│    │ ₹15,000      │ │ ₹18k – ₹45k  │ │ ₹5,000       │  gold price         │
│    │ note…        │ │ note…        │ │ note…        │                     │
│    └──────────────┘ └──────────────┘ └──────────────┘                     │
│  Category section (Patents) …                                             │
├─ Note on Pricing ─────────────────────────────── muted panel, 4 caveats ──┤
├─ Custom quote CTA ────────────────────────────────────────── navy ────────┘
```
Categories render in a curated order (`feeCategoryOrder`) rather than whatever
order the data happens to arrive in. Cards use `flex flex-col` with a `flex-1`
body so cards in a row align regardless of note length.

The variable-price badge reads **"From"** rather than "Variable" — it describes
the price to a buyer instead of describing the data model to a developer.

### Contact — redesigned
```
┌─ Hero ────────────────────────────────────────────────────────────────────┐
├─ 2/3 column ──────────────────────────┬─ 1/3 sidebar ────────────────────┤
│ ┌ WhatsApp panel (accent tint) ─────┐ │ ┌ Office card ─────────────────┐ │
│ │ icon · "Message us on WhatsApp"   │ │ │ 📍 Address                   │ │
│ │ "Usually answered same day"       │ │ │ 🕐 Office hours (3 rows)     │ │
│ │ [Start a Conversation]            │ │ └──────────────────────────────┘ │
│ └───────────────────────────────────┘ │ ┌ "Before you write" ──────────┐ │
│ "Or start with your topic"            │ │ what to include              │ │
│ ┌──────────────┐ ┌──────────────┐     │ └──────────────────────────────┘ │
│ │ Trademark  💬│ │ Patent     💬│     │                                  │
│ │ Copyright  💬│ │ Infringing 💬│  ×6 │                                  │
│ │ Portfolio  💬│ │ Something  💬│     │                                  │
│ └──────────────┘ └──────────────┘     │                                  │
│ ── Prefer email or phone? ──          │                                  │
│ [✉ email]  [☎ phone]                  │                                  │
└───────────────────────────────────────┴──────────────────────────────────┘
```

The five-field form is gone. **Six topic tiles** each open WhatsApp with a
different prefilled message, so an enquiry arrives already categorised —
better for the firm than a free-text `subject` field, and one tap for the
visitor instead of five fields plus a submit.

### Blog index
Hero → filter bar (search input + All/Judgment/Commentary toggle group) → 3-up
card grid. Filtering is client-side over already-loaded data, so it is instant
and produces no requests. The empty state distinguishes "no articles match your
filters" (offers **Clear filters**) from "nothing published yet" (does not).

### Blog post
Optional cover image with a gradient-to-background scrim → back link → category
pill + date → `h1` → excerpt above a rule → sanitised Markdown in `.prose` →
tag pills → contextual CTA whose prefilled WhatsApp message **names the article
the reader came from**.

### Practice Areas
Hero now includes a **jump-link pill row** for the five areas. The page is long
and the footer already deep-links into it; navigating a 5-section page by
scrolling was needless friction.

Each area: two-column — prose left, service list + CTA in a muted panel right.

### 404 — redesigned
Previously a bare centred div with no header, footer or navigation, plus a
`console.error` on every hit. Now wrapped in `PublicLayout`, shows the attempted
path, and offers five suggested destinations. A visitor who mistypes a URL stays
inside the site.

---

## 5. Component inventory

### Application components

| Component | Purpose |
|---|---|
| `PublicLayout` | Header + `main` + Footer, `min-h-screen flex flex-col` |
| `Container` | Width constraint, three sizes |
| `Header` | Sticky nav, mobile drawer, WhatsApp CTA |
| `Footer` | 4-column, static content, WhatsApp row |
| `WhatsAppCta` | The CTA. Two variants, three sizes, per-instance prefilled message |
| `WhatsAppIcon` | Inline SVG (lucide has no WhatsApp glyph) |
| `Seo` | Per-route head tags + JSON-LD |
| `ScrollToTop` | Scroll restoration, anchor-aware |
| `NavLink` | Router `NavLink` with an `activeClassName` compatibility shim |
| `AdminLayout` | Admin sidebar, mobile bottom nav, auth guard |

### shadcn/ui retained — 14 of 48

| Component | Consumers |
|---|---|
| `button` | 14 files — the workhorse |
| `card` | 12 |
| `input` | 6 |
| `label` | 4 |
| `select`, `textarea` | 3 each — admin forms |
| `tabs` | Fees segmented control, admin editor |
| `badge`, `table`, `alert-dialog` | Admin |
| `dialog` | Admin fee editor |
| `separator` | Admin settings |
| `toast`, `toaster` | Admin feedback |

**34 were deleted** — never imported by any page, and not imported by any
component that was. They were scaffold output. See
[ARCHITECTURE.md §6](ARCHITECTURE.md#dependency-removal).

Two mounted-but-unused providers also went: `TooltipProvider` (zero `<Tooltip>`
in the codebase) and the `sonner` toaster (nothing ever called its `toast()`).

---

## 6. Responsive behaviour

Tailwind defaults; the meaningful breakpoint is `md` (768 px), where navigation
switches from drawer to inline.

| Pattern | Mobile | `md` | `lg` |
|---|---|---|---|
| Value props | 1 col | 2 col | 4 col |
| Blog / fee cards | 1 col | 2 col | 3 col |
| Services | 1 col | 2 col | 2 col |
| Practice area | stacked | stacked | 2 col |
| Contact | stacked | stacked | 2/3 + 1/3 |
| Navigation | drawer | inline | inline |
| Admin | bottom tab bar + top bar | sidebar | sidebar |
| About timeline | left rail, all right | centre rail, alternating | alternating |

Mobile specifics: hero CTAs stack full-width (`flex-col sm:flex-row`); the
"View All" ghost link is hidden on mobile and replaced by an outlined button
below the grid; the footer email uses `break-all` so a long address cannot
overflow.

---

## 7. Interaction and loading states

### The loading model changed completely

**Before:** six pages each implemented
`isLoading → spinner`, `error → message + Retry`, `data → content`. The Footer's
loading branch was a **second, duplicated 130-line copy of the entire footer**.
With the API down, the homepage rendered *"Failed to load content. Please try
again later."* and a retry button that could not succeed.

**After:** public pages have no loading state and no error state, because content
is present before the first paint. The enforcement is structural — `useRevalidated`
returns `T`, not `{ data, isLoading, error }`, so there is nothing to branch on.

Loading UI now exists in exactly two places, both correct:

| Where | Why |
|---|---|
| `/admin/*` route transition | Genuine code-split fetch |
| `/blog/:slug` for a slug not in the bundle | Only reachable with live content on |

### Interaction inventory

| Element | Behaviour |
|---|---|
| Card hover | `shadow-lg`, image `scale-105` over 300 ms |
| Link hover | Colour to `accent` |
| Nav active | `bg-muted` + `text-foreground` |
| Focus | Gold ring via `--ring` on all interactive elements |
| Mobile drawer | Closes on navigation and on `Escape`, returning focus to the toggle |
| Blog search | Live filter, no debounce needed — filtering an in-memory array |
| Fee audience | Instant, no refetch |
| Jump links | Native anchor; `ScrollToTop` smooth-scrolls when a hash is present |
| Admin destructive actions | `alert-dialog` confirmation |

---

## 8. Accessibility

### Fixed in this pass

| Issue | Was | Now |
|---|---|---|
| **Hidden menu in tab order** | The mobile drawer used `opacity-0 invisible`, leaving it in the accessibility tree and tab order while invisible. Keyboard users tabbed through an unseen menu. | `hidden` attribute — removed from the tree entirely |
| No drawer state exposed | Toggle had only `aria-label="Toggle menu"` | `aria-expanded`, `aria-controls`, and a label that reflects state ("Open menu" / "Close menu") |
| No keyboard dismiss | Drawer trapped users | `Escape` closes and returns focus to the toggle |
| Decorative images announced | Card images had `alt={post.title}`, duplicating the adjacent heading for screen-reader users | `alt=""` — the linked heading carries the name |
| Decorative elements announced | Gradient orbs, timeline rails, bullet dots | `aria-hidden="true"` |
| Dates not machine-readable | `<span>` | `<time dateTime={iso}>` |
| Addresses not semantic | `<span>` | `<address>` with `not-italic` |
| Filters not announced | Plain buttons | `role="group"` + `aria-pressed` |
| Unlabelled search | Placeholder only | `aria-label="Search articles"` |
| Nav regions indistinguishable | Four unlabelled `<nav>` | `aria-label` on each: Main, Mobile, Quick links, Practice areas |
| Timeline not a list | `<div>` sequence | `<ol>` / `<li>` |
| Heading hierarchy | Footer/card headings used `h3` with no `h2` above | Footer column headings are `h2`; page hierarchy is `h1 → h2 → h3` |

Retained from the original: semantic landmarks (`header`/`main`/`footer`),
`scroll-mt-24` so anchor targets clear the sticky header, `line-clamp` instead of
JS truncation, and a `<noscript>` block with a direct contact route.

### Contrast

| Pair | Ratio | WCAG |
|---|---|---|
| `foreground` on `background` | ~16:1 | AAA |
| `primary-foreground` on `primary` | ~15:1 | AAA |
| `accent-foreground` on `accent` | ~7:1 | AAA |
| `muted-foreground` on `background` | ~5.5:1 | AA |

### Outstanding

- `prefers-reduced-motion` is not honoured. Current motion is minimal
  (shadow + a 300 ms image scale), so impact is low, but a media query wrapping
  the two transitions would close it.
- No skip-to-content link. Low cost, worth adding.
- The mobile drawer does not trap focus (it dismisses on `Escape` and on
  navigation, which covers the common cases).

---

## 9. Dark mode — present but dormant

`src/index.css` defines a complete `.dark` palette: inverted background, gold
promoted to `--primary`, adjusted borders and sidebar tokens. `darkMode: ["class"]`
is configured in Tailwind.

**Nothing toggles it.** No `<html class="dark">` is ever set, and `next-themes`
— installed solely to feed the removed `sonner` toaster — has been uninstalled.

Two honest options:
1. **Ship it.** Add a header toggle writing to `documentElement.classList` with a
   `localStorage` preference. The tokens are already complete, so this is small.
2. **Delete it.** Roughly 30 lines of unreachable CSS. A navy-and-gold identity
   in a conservative sector has a defensible reason to commit to one appearance.

Left as-is pending that decision — the tokens cost ~200 bytes gzipped and
document the intent.

---

## 10. Content authoring guidance

Content lives in `src/content/`. Guidance for whoever edits it:

| Field | Guidance |
|---|---|
| Post `excerpt` | 1–2 sentences. Appears in cards, the article header, meta descriptions and social previews — write it as a standalone hook, not a first line. |
| Post `tags` | 3–5, lowercase. Only the first 3 render on cards; all are searchable. |
| Post `coverImage` | Optional and genuinely optional — layouts collapse cleanly without it. 16:9. |
| Fee `notes` | State what is and is not included. This is where "government fees billed separately" belongs. |
| Fee `name` | Buyer's language, not internal terminology. |
| Practice area `body` | Array of short paragraphs. Three is the target; walls of text are the failure mode. |
| Practice area `id` | **Never change** — the footer deep-links to these anchors. |
| `hero.subhead` | Two to three lines. It sits under a 60 px headline; length competes with the CTA. |
