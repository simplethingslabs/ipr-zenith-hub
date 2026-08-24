import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";
import { allRoutes } from "./scripts/routes";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // `componentTagger` is a Lovable dev-only plugin and is excluded from every
    // production build. It is kept so the Lovable editing workflow keeps working.
    mode === "development" && componentTagger(),
    /*
     * Prerendering — see docs/PRERENDERING.md for the full design doc.
     *
     * Runs a headless Chromium against the in-memory build output, once per
     * public route, and captures the fully-rendered HTML (including the
     * per-route <title>/<meta>/JSON-LD written by <Seo> on mount) to
     * dist/<route>.html (see the postProcess hook below for why it's a flat
     * file rather than <route>/index.html). Real visitors still get the same
     * JS bundle and the same interactive SPA — this only changes what a
     * non-executing fetch (link-preview scrapers, non-JS crawlers) sees.
     *
     * Restricted to `mode === "production"` — the plugin only runs on the
     * `generateBundle` hook, so it never touches the dev server, but it is
     * also skipped for `build:dev` (Lovable's unminified build) to avoid
     * spending ~20-40s launching Chromium for a build that isn't deployed.
     */
    mode === "production" &&
      prerender({
        routes: allRoutes,
        renderer: PuppeteerRenderer,
        /*
         * By default this plugin writes every route as `<route>/index.html`
         * (e.g. `/fees` → `dist/fees/index.html`). That only resolves for a
         * request to `/fees/` (trailing slash) on most static file servers —
         * confirmed locally: `vite preview` served the correct prerendered
         * file for `/fees/` but silently fell back to the generic root
         * `index.html` for `/fees` (no trailing slash), which is how every
         * link in this app is written (nav, footer, sitemap.xml — none of
         * them add a trailing slash).
         *
         * Flattening to `<route>.html` (e.g. `dist/fees.html`) sidesteps the
         * ambiguity entirely by matching Vercel's documented "Clean URLs"
         * behavior instead of relying on directory-index resolution: Vercel
         * serves `/fees` by looking for `fees.html` on disk, no redirect, no
         * trailing slash. This is a stable, documented platform feature,
         * not an assumption — see docs/PRERENDERING.md and
         * docs/DEPLOYMENT.md for the verification performed.
         */
        postProcess(route) {
          route.outputPath = route.route === "/" ? "index.html" : `${route.route.slice(1)}.html`;
        },
        rendererOptions: {
          /*
           * A fixed delay was tried first and proved unreliable: `/blog/:slug`
           * sits behind its own lazy `import()` boundary (see App.tsx — split
           * out specifically to keep marked + dompurify off every other
           * route), so on that one route "React has committed" is preceded by
           * an extra chunk fetch + parse + eval that a short fixed delay does
           * not reliably outlast. A 300ms delay captured that route's
           * Suspense fallback ("Loading…") instead of the article.
           *
           * `footer` is rendered by PublicLayout at the end of every public
           * page's tree (including BlogPost, once its lazy chunk has actually
           * mounted), so waiting for it to exist is a correctness condition,
           * not a guess at timing — fast routes capture almost immediately,
           * the lazy-loaded route waits exactly as long as it needs to.
           */
          renderAfterElementExists: "footer",
          headless: true,
          // Unbounded concurrency (the library default) opens one Chromium tab
          // per route simultaneously, which proved unstable — intermittent
          // "Target.closeTarget" protocol errors under all 12 routes at once.
          // Capping concurrency trades a few seconds of build time for a
          // reliable build.
          maxConcurrentRoutes: 4,
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Vendor code changes far less often than site content. Splitting it out
    // means a copy edit invalidates the small app chunk instead of forcing every
    // returning visitor to re-download React.
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          markdown: ["marked", "dompurify"],
        },
      },
    },
    // The default 500 kB warning fires on the React vendor chunk, which is
    // expected and already as small as it gets here.
    chunkSizeWarningLimit: 600,
  },
}));
