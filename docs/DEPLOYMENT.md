# Deployment Runbook

> How to get this site live on Vercel, and how to restore the optional admin API.

---

## 1. Deploy the frontend to Vercel

`vercel.json` is committed, so configuration is already correct. Two routes:

### Option A — Dashboard (recommended for the first deploy)

1. Go to [vercel.com/new](https://vercel.com/new) and import
   `simplethingslabs/ipr-zenith-hub`.
2. Vercel reads `vercel.json` and detects Vite. **Leave every build setting at
   its default** — overriding them will conflict with the committed config.
3. Deploy. First build takes ~1–2 minutes.

Every push to `main` deploys automatically after this. Pull requests get preview
URLs.

### Option B — CLI

```bash
npm i -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production
```

### What `vercel.json` configures

| Setting | Value | Why |
|---|---|---|
| Rewrite | `/(.*)` → `/index.html` | Fallback for a genuinely unmatched path. Every public route (`/fees`, `/blog/:slug`, …) now ships as its own prerendered `<route>.html` file — see [PRERENDERING.md](PRERENDERING.md) — which Vercel's Clean URLs feature resolves directly from disk before this rewrite is ever consulted. This rule only fires for a path matching none of those files, e.g. a stale or mistyped URL, and correctly falls through to the client-side 404 page. |
| `/assets/*` cache | `max-age=31536000, immutable` | Vite fingerprints filenames, so these can be cached forever |
| `/index.html` cache | `max-age=0, must-revalidate` | Or a deploy never reaches returning visitors |
| Security headers | HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` | None were set previously |

---

## 2. Pre-launch checklist

Values carried over from the original database seed are placeholders. List them:

```bash
grep -rn "PLACEHOLDER\|TODO(owner)" src/ public/ index.html
```

**Blocking:**

- [ ] **`WHATSAPP_NUMBER`** in `src/content/site.ts` — international format, digits only, no `+`. **This is the primary CTA on every page and is currently fake.**
- [ ] **`SITE_URL`** in `src/content/site.ts` — drives canonical URLs, the sitemap and OG tags. The build prints a warning while it is unset.
- [ ] Firm `email`, `phone`, `address` in `src/content/site.ts`
- [ ] `Sitemap:` host in `public/robots.txt`
- [ ] Rotate the admin password that is in git history (see §5)
- [ ] Replace or delete the invented milestone timeline in `src/content/about.ts`
- [ ] Confirm every fee amount in `src/content/fees.ts`
- [ ] Have `src/content/legal.ts` reviewed — particularly the professional-conduct wording

**Recommended:**

- [ ] Add an OG preview image to `public/` and reference it in `index.html`
- [ ] `rm bun.lockb` — two lockfiles means the host may pick either
- [ ] Verify the site in a real browser at mobile and desktop widths

---

## 3. Custom domain

1. Vercel project → **Settings → Domains → Add**.
2. Add the DNS records Vercel shows at your registrar (usually an `A` record for
   the apex and a `CNAME` for `www`).
3. HTTPS is provisioned automatically.
4. **Then** update `SITE_URL` in `src/content/site.ts` and the `Sitemap:` line in
   `public/robots.txt`, and redeploy — otherwise canonical URLs point at the
   placeholder domain.
5. Submit `https://yourdomain/sitemap.xml` in Google Search Console.

---

## 4. Environment variables

None are required for a static deployment — the defaults in code produce a fully
static site.

Set these in Vercel → Settings → Environment Variables only if you want the
public pages to also pull live content from the API:

| Variable | Value | Effect |
|---|---|---|
| `VITE_ENABLE_LIVE_CONTENT` | `true` | Public pages revalidate against the API after painting. Leave unset for fully static. |
| `VITE_API_BASE_URL` | `https://your-api/api` | Overrides the built-in default. **Must include the `/api` suffix.** |

> A previous `src/.env.production` was ignored entirely — Vite only reads env
> files from the project root — and its value was also missing the `/api` suffix,
> so it would have broken every request had it ever been picked up. It has been
> deleted; `.env.example` at the root documents the real variables.

Only `VITE_`-prefixed variables reach the browser, and everything that does is
compiled into the public bundle. Never put a secret there.

---

## 5. Restoring the API

> **Current state, measured 2026-08-23:**
> ```
> GET  /health         → 200 (32.3 s cold start)
> GET  /api/settings   → 500
> GET  /api/posts      → 500
> GET  /api/fees       → 500
> POST /api/auth/login → 500
> ```
> The Express process is alive; every database-backed route fails. The
> free-tier Postgres instance behind it is gone. `/health` returned 200 because
> it never touches the database.
>
> **The public site does not need this.** Only the admin panel does.

### Steps

**1. Provision PostgreSQL.** Render's free tier expires, which is what happened
here. For something you want to keep working, use a persistent managed instance —
[Neon](https://neon.tech) and [Supabase](https://supabase.com) both have durable
free tiers.

**2. Set environment variables** on the Render service:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Connection string from step 1 |
| `JWT_SECRET` | **Required.** `openssl rand -base64 48`. The API now refuses to start without a valid one — the old fallback default was a public string, so any deployment missing this was signing admin tokens with a publicly known key. |
| `CORS_ORIGIN` | Comma-separated. Must include your Vercel domain. |
| `NODE_ENV` | `production` |
| `SEED_ADMIN_EMAIL` | Seed only |
| `SEED_ADMIN_PASSWORD` | Seed only. **Minimum 12 characters.** |
| `SEED_ADMIN_NAME` | Seed only, optional |

**3. Render service settings:**

```
Root Directory:  api
Build Command:   npm ci && npx prisma generate && npx prisma migrate deploy
Start Command:   npm run start
```

**4. Seed the admin account:**

```bash
cd api && npm run db:seed
```

**5. Verify:**

```bash
curl https://your-api.onrender.com/health        # 200
curl https://your-api.onrender.com/api/settings  # 200 with JSON, not 500
```

**6. Optionally enable live content** — set `VITE_ENABLE_LIVE_CONTENT=true` in
Vercel and redeploy.

### 🔴 Rotate the compromised credential

`api/prisma/seed.ts` previously hard-coded a real admin email and plaintext
password. **That password is in git history.** Removing it from `HEAD` does not
remove it from clones, forks or the reflog.

- Do not reuse it as `SEED_ADMIN_PASSWORD`.
- If it is used anywhere else, change it there too.
- To purge it from history entirely you would need `git filter-repo` plus a force
  push, which rewrites every commit hash. Rotating the credential is the
  practical fix; purging history is optional hygiene.

`.env` and `api/.env` were also tracked. They contained example-grade values
(`your-super-secret-jwt-key-change-this-in-production`, a localhost database URL
with `yourpassword`), so nothing high-value leaked there — but they are now
untracked and gitignored.

### Cold starts

Even healthy, a free-tier Render service sleeps after ~15 minutes idle and takes
~30 s to wake. That is why the static architecture matters: **the public site
never waits on it.** The admin panel will feel slow on first use after idle,
which is acceptable for a single-operator tool.

---

## 6. Rollback

Vercel keeps every deployment. **Deployments → ⋯ → Promote to Production** on any
previous build. No rebuild, effective immediately.

---

## 7. Alternative hosts

| Host | Config needed |
|---|---|
| **Cloudflare Pages** | Build `npm run build`, output `dist`. Add `public/_redirects` containing `/* /index.html 200` |
| **Netlify** | Add `netlify.toml` with a `/*` → `/index.html` 200 redirect |
| **Apache / cPanel** | `public/.htaccess` is already committed with the SPA rewrite. Upload the contents of `dist/`. |
| **GitHub Pages** | Works, but needs a 404.html SPA shim; not recommended here |

---

## 8. Post-deploy verification

```bash
BASE=https://your-domain

# Deep links must return 200, not 404 — the site now ships every public route
# as its own prerendered static file (see PRERENDERING.md), so this should
# resolve directly rather than falling through to the SPA rewrite.
for p in / /services /practice-areas /fees /about /blog /contact /privacy /terms; do
  printf "%-20s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $BASE$p)"
done

# The core thing prerendering exists to fix: each route's raw HTML — no JS
# execution — must show its OWN title, not one generic title for every page.
for p in / /fees /blog/understanding-trademark-registration-india; do
  echo "$p: $(curl -s $BASE$p | grep -oE '<title>[^<]*</title>')"
done

curl -s -o /dev/null -w "sitemap %{http_code}\n" $BASE/sitemap.xml
curl -s -o /dev/null -w "robots  %{http_code}\n" $BASE/robots.txt
curl -sI $BASE | grep -i strict-transport-security
```

Then by hand:

- [ ] Every WhatsApp CTA opens WhatsApp with the right prefilled message
- [ ] `mailto:` and `tel:` links work on a phone
- [ ] Footer practice-area links jump to the correct anchors
- [ ] Refresh directly on `/blog/understanding-trademark-registration-india`
- [ ] Mobile menu opens, closes on navigation, closes on `Escape`
- [ ] Page titles differ between routes (browser tab) — confirmed above via
      `curl`, but also worth eyeballing in a real browser tab
- [ ] Click through several pages in a real browser: confirm hydration is
      seamless (no flash, no layout jump) — this is the one prerendering check
      that can't be done with `curl` alone
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
      on the home page and one article — confirms the platform that actually
      renders link previews sees the right title/description/image
- [ ] X/Twitter card preview on the same two URLs
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) on the
      home page and one article — confirms the JSON-LD is valid in the
      deployed static HTML, not just present locally
