# IPR Central

Website for IPR Central, an intellectual property consultancy — a static-first
React site with an optional admin panel and API.

| | |
|---|---|
| **Public site** | Fully static. Renders from bundled content, makes no API calls. |
| **Admin panel** | `/admin` — optional, requires the API and a database. |
| **Frontend host** | Vercel (`vercel.json` committed) |
| **API host** | Render (`api/`, optional) |

## Documentation

| Document | Covers |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, data flow, tech stack, decisions and trade-offs |
| [docs/C4-DIAGRAMS.md](docs/C4-DIAGRAMS.md) | C4 model — context, container, component and code-level diagrams |
| [docs/UI-UX.md](docs/UI-UX.md) | Design system, information architecture, page anatomy, accessibility |
| [docs/FEATURES.md](docs/FEATURES.md) | Functional feature specification, per page and per capability |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment runbook, environment variables, restoring the API |
| [docs/PRERENDERING.md](docs/PRERENDERING.md) | What prerendering is and how it's implemented — every route ships as a fully-rendered static HTML file with correct per-route SEO tags |

## Quick start

```bash
npm install
npm run dev          # http://localhost:8080
```

No environment variables are needed for local development of the public site —
content comes from `src/content/`.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Dev server with HMR on port 8080 |
| `npm run build` | Production build to `dist/`, then generates `dist/sitemap.xml` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc -b` across app, node and script configs |
| `npm run lint` | ESLint over `src/` |

## Editing site content

All public content lives in `src/content/` as typed TypeScript. Edit a file,
commit, push — Vercel rebuilds. There is no CMS step and no database involved.

| File | Contains |
|---|---|
| `site.ts` | Firm name, contact details, address, socials, **WhatsApp number**, canonical URL |
| `home.ts` | Hero copy and value propositions |
| `services.ts` | Service offerings |
| `practice-areas.ts` | Practice area descriptions (ids are anchor targets — keep stable) |
| `about.ts` | Mission, values, milestone timeline |
| `fees.ts` | Fee schedule and pricing caveats |
| `posts.ts` | Blog posts (Markdown bodies) |
| `legal.ts` | Privacy policy and terms of service |

### Before going live

Values carried over from the original database seed are **placeholders**, marked
`PLACEHOLDER` or `TODO(owner)` in the source. The ones that matter most:

1. **`WHATSAPP_NUMBER`** in `src/content/site.ts` — this is the primary
   call-to-action on every page. The current value is a placeholder.
2. **`SITE_URL`** in `src/content/site.ts` — drives canonical URLs, the sitemap
   and Open Graph tags. The build prints a warning while it is unset.
3. Firm email, phone and postal address in `src/content/site.ts`.
4. The milestone years in `src/content/about.ts` — illustrative, not real history.
5. Fee amounts in `src/content/fees.ts` — confirm against your rate card.
6. `Sitemap:` host in `public/robots.txt`.

Run `grep -rn "PLACEHOLDER\|TODO(owner)" src/ public/ index.html` to list them all.

## Architecture in one paragraph

Every public page reads its content synchronously from `src/content/` via
`src/lib/content.ts` and paints on the first frame — no loading state, no
network request, no failure mode. Setting `VITE_ENABLE_LIVE_CONTENT=true`
additionally revalidates against the API after mount, so admin edits appear
without a redeploy; if that request is slow or fails, the visitor never notices
because the page is already complete. The admin panel always talks to the API
directly and is code-split out of the public bundle.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for why.

## Deploying

Push to `main`. Vercel builds and deploys. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for first-time setup, custom domains and
environment variables.

## The API (optional)

`api/` is an Express + Prisma + PostgreSQL service that backs the admin panel.
The public site does not need it.

> **Current state:** the deployed API responds on `/health` but every
> database-backed route returns 500 — the Postgres instance behind it is gone.
> The admin panel cannot be used until a database is provisioned. See
> [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#restoring-the-api).

```bash
cd api
npm install
cp .env.example .env      # fill in DATABASE_URL and JWT_SECRET
npm run db:generate
npm run db:migrate
npm run db:seed           # requires SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
npm run dev               # http://localhost:3001
```

## Security notes

- `.env` files are gitignored. `api/.env` and the root `.env` were previously
  **tracked**, so treat anything that was in them as exposed.
- `api/prisma/seed.ts` previously hard-coded a real admin email and plaintext
  password. That password is in git history and **must be rotated** — it is now
  read from `SEED_ADMIN_PASSWORD` instead.
- `JWT_SECRET` no longer has a fallback default. The API refuses to start
  without a valid one, because the old fallback string was public.

## Tech stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · shadcn/ui (Radix) ·
React Router 6 · Zustand · Zod · marked + DOMPurify

Backend: Express 4 · Prisma 5 · PostgreSQL · JWT
