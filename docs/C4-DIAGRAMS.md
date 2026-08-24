# C4 Model Diagrams

> Architecture of the IPR Central website at the four levels of the
> [C4 model](https://c4model.com): **Context → Container → Component → Code**.
>
> Each level zooms into one box from the level above. Diagrams render natively on
> GitHub and in the published artifact.
>
> Companion: [ARCHITECTURE.md](ARCHITECTURE.md) explains *why* the structure is
> shaped this way.

---

## Level 1 — System Context

Who uses the system and what it depends on.

```mermaid
graph TB
    Client["<b>Prospective Client</b><br/><i>[Person]</i><br/>Founder, creator or business<br/>looking for IP protection"]
    Admin["<b>Firm Administrator</b><br/><i>[Person]</i><br/>Publishes posts, maintains<br/>fees and firm details"]

    System["<b>IPR Central Website</b><br/><i>[Software System]</i><br/>Presents the firm's services, fee<br/>schedule and IP commentary; routes<br/>enquiries to WhatsApp"]

    WhatsApp["<b>WhatsApp</b><br/><i>[External System]</i><br/>Carries all client enquiries"]
    Fonts["<b>Google Fonts</b><br/><i>[External System]</i><br/>Serves Inter and Playfair Display"]
    Search["<b>Search Engines</b><br/><i>[External System]</i><br/>Crawl and index public pages"]

    Client -->|"Browses services,<br/>fees and articles"| System
    Client -->|"Starts an enquiry<br/>(wa.me deep link)"| WhatsApp
    Admin -->|"Manages content<br/>via /admin"| System

    System -->|"Requests webfonts<br/>HTTPS"| Fonts
    System -->|"Exposes sitemap.xml,<br/>robots.txt, JSON-LD"| Search
    System -.->|"Links out to"| WhatsApp

    classDef person fill:#0b3d6b,stroke:#08243f,color:#fff
    classDef system fill:#1168bd,stroke:#0b4884,color:#fff
    classDef external fill:#6b7785,stroke:#4a535e,color:#fff
    class Client,Admin person
    class System system
    class WhatsApp,Fonts,Search external
```

**Note the absence of a payment provider, analytics platform, chat widget or
email service.** The system collects nothing from visitors, which is what makes
the privacy position in `src/content/legal.ts` factually accurate.

---

## Level 2 — Containers

The deployable units inside the system boundary.

```mermaid
graph TB
    Client["<b>Prospective Client</b><br/><i>[Person]</i>"]
    Admin["<b>Firm Administrator</b><br/><i>[Person]</i>"]

    subgraph Boundary["IPR Central Website"]
        SPA["<b>Web Application</b><br/><i>[Container: React 18 + Vite]</i><br/>Static SPA. Public pages render from<br/>content compiled into the bundle.<br/>~101 kB gzip first load."]
        CDN["<b>Static Hosting + CDN</b><br/><i>[Container: Vercel]</i><br/>Serves the built assets. SPA rewrite,<br/>immutable asset caching,<br/>security headers."]
        API["<b>Admin API</b><br/><i>[Container: Node + Express 4]</i><br/>REST endpoints for posts, fees,<br/>settings and auth. JWT-protected writes.<br/>OPTIONAL — public site never calls it."]
        DB[("<b>Database</b><br/><i>[Container: PostgreSQL + Prisma]</i><br/>Posts, fees, settings, users,<br/>contact submissions<br/>NOT CURRENTLY PROVISIONED")]
    end

    WhatsApp["<b>WhatsApp</b><br/><i>[External]</i>"]
    Fonts["<b>Google Fonts</b><br/><i>[External]</i>"]

    Client -->|"HTTPS"| CDN
    Admin -->|"HTTPS /admin"| CDN
    CDN -->|"Delivers HTML,<br/>JS, CSS"| SPA

    SPA -->|"Enquiry deep link<br/>(user-initiated)"| WhatsApp
    SPA -->|"Webfont request"| Fonts
    SPA -.->|"<b>Admin panel only:</b><br/>JSON/HTTPS + Bearer JWT"| API
    SPA -.->|"<b>Only if</b><br/>VITE_ENABLE_LIVE_CONTENT=true:<br/>background revalidation"| API
    API -->|"SQL via Prisma"| DB

    classDef person fill:#0b3d6b,stroke:#08243f,color:#fff
    classDef container fill:#438dd5,stroke:#2e6295,color:#fff
    classDef optional fill:#8fa8bf,stroke:#5f7a88,color:#1a2733,stroke-dasharray: 5 3
    classDef external fill:#6b7785,stroke:#4a535e,color:#fff
    class Client,Admin person
    class SPA,CDN container
    class API,DB optional
    class WhatsApp,Fonts external
```

### The critical property

The two **dotted** edges into the API are the entire difference between this
architecture and the previous one.

| Path | Previously | Now |
|---|---|---|
| Public page → API | **Solid. Blocking.** Page could not render until it resolved. | **Absent by default.** |
| Admin panel → API | Solid | Solid — unchanged |

Because no solid line runs from a public page to the API or the database, **the
public site's availability is the CDN's availability.** The API being cold, slow,
broken or entirely absent is invisible to visitors.

### Container responsibilities

| Container | Technology | Responsibility |
|---|---|---|
| Web Application | React 18, TypeScript, Vite 5, Tailwind 3 | Renders all pages. Owns content in `src/content/`. Client-side routing. |
| Static Hosting + CDN | Vercel | Serves `dist/`. SPA rewrite so deep links resolve. Cache and security headers per `vercel.json`. |
| Admin API | Express 4, Prisma 5, JWT | CRUD for posts/fees/settings. Zod validation, bcrypt auth, CORS allowlist. |
| Database | PostgreSQL | Persists admin-managed content. |

---

## Level 3 — Components (Web Application)

Inside the Web Application container.

```mermaid
graph TB
    subgraph App["Web Application (React SPA)"]
        Router["<b>App / Router</b><br/><i>[React Router 6]</i><br/>Route table. Two lazy boundaries:<br/>AdminRoutes and BlogPost."]

        subgraph PublicLayer["Public Pages — eager"]
            Pages["<b>Page Components</b><br/>Home · Services · PracticeAreas<br/>Fees · About · Blog · Contact<br/>Legal (Privacy/Terms) · NotFound"]
            BlogPost["<b>BlogPost</b><br/><i>[lazy chunk]</i><br/>Isolated so marked + DOMPurify<br/>load on this route only"]
        end

        subgraph Shared["Shared Components"]
            Layout["<b>PublicLayout</b><br/>Header · Footer · Container"]
            Seo["<b>Seo</b><br/>Per-route title, description,<br/>canonical, OG, JSON-LD"]
            Cta["<b>WhatsAppCta</b><br/>wa.me deep link with<br/>prefilled message"]
            Scroll["<b>ScrollToTop</b><br/>Scroll restoration,<br/>anchor-aware"]
        end

        subgraph Domain["Content & Domain Layer"]
            ContentHook["<b>lib/content.ts</b><br/>useSiteSettings · usePublishedPosts<br/>usePostBySlug · useFees<br/><b>Static-first, no loading state</b>"]
            ContentData["<b>content/*.ts</b><br/>site · home · services<br/>practice-areas · about<br/>fees · posts · legal"]
            Markdown["<b>lib/markdown.ts</b><br/>marked → DOMPurify<br/>tag + URI allowlist"]
            Structured["<b>lib/structured-data.ts</b><br/>schema.org LegalService"]
        end

        subgraph AdminLayer["Admin — single lazy chunk"]
            AdminRoutes["<b>AdminRoutes</b><br/>Route table + Toaster host"]
            AdminPages["<b>Admin Pages</b><br/>Login · Dashboard · PostsManager<br/>PostEditor · FeesManager · Settings"]
            AdminShell["<b>AdminLayout</b><br/>Sidebar + client-side auth guard"]
            AuthStore["<b>stores/authStore.ts</b><br/><i>[Zustand + persist]</i><br/>JWT and user in localStorage"]
        end

        ApiClient["<b>lib/api.ts</b><br/>Typed fetch wrapper.<br/>Bearer header, error normalisation,<br/>204 handling"]
    end

    ExtApi["<b>Admin API</b><br/><i>[Container]</i>"]

    Router --> Pages
    Router --> BlogPost
    Router --> AdminRoutes

    Pages --> Layout
    Pages --> Seo
    Pages --> Cta
    Pages --> ContentHook
    BlogPost --> ContentHook
    BlogPost --> Markdown
    Router --> Scroll
    Layout --> ContentHook
    Pages --> Structured

    ContentHook -->|"reads<br/><b>synchronously</b>"| ContentData
    ContentHook -.->|"revalidate<br/><b>only if flag on</b>"| ApiClient

    AdminRoutes --> AdminPages
    AdminPages --> AdminShell
    AdminPages --> ApiClient
    AdminPages --> Markdown
    AdminShell --> AuthStore
    ApiClient --> AuthStore
    ApiClient -->|"JSON/HTTPS"| ExtApi

    classDef comp fill:#85bbf0,stroke:#5d82a8,color:#12283d
    classDef data fill:#b8d4ea,stroke:#7f9ab0,color:#12283d
    classDef admin fill:#c9b8ea,stroke:#8f7fb0,color:#231a3d
    classDef ext fill:#6b7785,stroke:#4a535e,color:#fff
    class Router,Pages,BlogPost,Layout,Seo,Cta,Scroll comp
    class ContentHook,ContentData,Markdown,Structured,ApiClient data
    class AdminRoutes,AdminPages,AdminShell,AuthStore admin
    class ExtApi ext
```

### Reading the diagram

- **`lib/content.ts` is the seam.** Every public page depends on it; none imports
  `lib/api.ts` directly. That is what makes the static guarantee enforceable
  rather than a convention — adding a blocking fetch to a page means bypassing
  the layer deliberately.
- **`content/*.ts` has no inbound arrow from the API.** It is build-time data.
- **The admin subgraph touches `lib/api.ts` directly.** It is not static-first,
  because an editor must see real database state.
- **`lib/markdown.ts` is shared** by the public blog and the admin preview, so
  both are sanitised by the same allowlist and render identically.

---

## Level 3b — Components (Admin API)

```mermaid
graph TB
    subgraph API["Admin API (Express)"]
        Entry["<b>index.ts</b><br/>helmet · CORS allowlist<br/>morgan · json body parser<br/>/health"]
        RouteIdx["<b>routes/index.ts</b><br/>Mounts /auth /posts<br/>/fees /settings /contact"]

        subgraph Routes["Route Handlers"]
            AuthR["<b>auth.ts</b><br/>POST /login<br/>bcrypt.compare → JWT"]
            PostsR["<b>posts.ts</b><br/>GET list/slug (public)<br/>POST PUT DELETE (protected)<br/>slug generation"]
            FeesR["<b>fees.ts</b><br/>GET (public)<br/>POST PUT DELETE (protected)"]
            SettingsR["<b>settings.ts</b><br/>GET (public)<br/>PUT (protected)<br/>singleton row 'main'"]
            ContactR["<b>contact.ts</b><br/>POST — persists submission<br/><i>no longer called by the site</i>"]
        end

        subgraph Middleware["Middleware"]
            AuthMw["<b>auth.ts</b><br/>Bearer extraction<br/>→ verifyToken → req.user"]
            ValidateMw["<b>validate.ts</b><br/>Zod schema per route<br/>→ 400 with field errors"]
            ErrorMw["<b>errorHandler.ts</b><br/>notFoundHandler<br/>+ errorHandler"]
        end

        subgraph Utils["Utilities"]
            Jwt["<b>utils/jwt.ts</b><br/>sign / verify, 24 h<br/><b>throws at startup if<br/>JWT_SECRET missing</b>"]
            PrismaC["<b>utils/prisma.ts</b><br/>PrismaClient singleton"]
        end
    end

    DB[("<b>PostgreSQL</b><br/>User · Post · FeeItem<br/>Settings · ContactSubmission")]

    Entry --> RouteIdx
    RouteIdx --> AuthR & PostsR & FeesR & SettingsR & ContactR

    AuthR --> ValidateMw
    PostsR --> AuthMw
    PostsR --> ValidateMw
    FeesR --> AuthMw
    FeesR --> ValidateMw
    SettingsR --> AuthMw
    SettingsR --> ValidateMw
    ContactR --> ValidateMw

    AuthMw --> Jwt
    AuthR --> Jwt
    Entry --> ErrorMw

    AuthR & PostsR & FeesR & SettingsR & ContactR --> PrismaC
    PrismaC --> DB

    classDef comp fill:#85bbf0,stroke:#5d82a8,color:#12283d
    classDef mw fill:#f0d585,stroke:#a89b5d,color:#3d3512
    classDef util fill:#b8d4ea,stroke:#7f9ab0,color:#12283d
    classDef db fill:#438dd5,stroke:#2e6295,color:#fff
    class Entry,RouteIdx,AuthR,PostsR,FeesR,SettingsR,ContactR comp
    class AuthMw,ValidateMw,ErrorMw mw
    class Jwt,PrismaC util
    class DB db
```

---

## Level 4 — Code: the content resolution path

The mechanism that eliminated the loading states. This is the one piece of code
worth reading at this level, because the whole architecture rests on it.

```mermaid
sequenceDiagram
    autonumber
    participant P as Fees page
    participant H as useFees()
    participant R as useRevalidated()
    participant S as content/fees.ts
    participant A as lib/api.ts
    participant X as Admin API

    Note over P,S: Render pass 1 — synchronous
    P->>H: useFees()
    H->>R: useRevalidated(staticFees, fetcher)
    R->>S: import (already in bundle)
    S-->>R: FeeItem[]
    R-->>H: FeeItem[]
    H-->>P: FeeItem[]
    Note over P: Painted. Complete page.<br/>Zero network requests.

    Note over R,X: After mount — conditional
    alt VITE_ENABLE_LIVE_CONTENT unset (default)
        R->>R: early return — no effect body runs
        Note over P: Site is fully static. Done.
    else flag is "true"
        R->>A: fetcher()
        A->>X: GET /api/fees
        alt API healthy
            X-->>A: 200 FeeItem[]
            A-->>R: FeeItem[]
            R->>R: setValue(fresh)
            Note over P: Re-render with live data
        else API cold / 500 / unreachable
            X--xA: timeout or error
            A--xR: rejects
            R->>R: .catch() — swallowed
            Note over P: <b>Visitor sees nothing change.</b><br/>Static content stands.
        end
    end
```

### Why the type signature matters

```ts
function useRevalidated<T>(initial: T, fetcher: () => Promise<T>): T
```

The return type is `T` — not `{ data: T; isLoading: boolean; error: Error | null }`.

There is no loading flag to branch on and no error to render, so a page
*cannot* reintroduce a blocking spinner without deliberately bypassing this
layer. The old code had six independent copies of the
`isLoading → spinner / error → retry button / data → content` triangle, each
subtly different; one of them rendered a second, duplicated 130-line copy of the
footer as its loading state. Removing the states from the type removed the
possibility of that class of bug.

---

## Deployment view

```mermaid
graph LR
    Dev["<b>Developer</b><br/>edits src/content/*.ts"]
    Git["<b>GitHub</b><br/>simplethingslabs/<br/>ipr-zenith-hub"]

    subgraph Vercel["Vercel"]
        Build["<b>Build</b><br/>npm run build<br/>↓ vite build<br/>↓ postbuild: sitemap"]
        Edge["<b>Global CDN</b><br/>SPA rewrite<br/>immutable assets<br/>HSTS + headers"]
    end

    subgraph Render["Render — optional"]
        Svc["<b>Web Service</b><br/>npm run start"]
        PG[("<b>PostgreSQL</b><br/>needs provisioning")]
    end

    Visitor["<b>Visitor</b>"]
    AdminUser["<b>Administrator</b>"]

    Dev -->|"git push main"| Git
    Git -->|"webhook"| Build
    Build --> Edge
    Edge --> Visitor
    Edge --> AdminUser
    AdminUser -.->|"XHR + Bearer JWT"| Svc
    Svc --> PG

    classDef ok fill:#438dd5,stroke:#2e6295,color:#fff
    classDef warn fill:#c9a227,stroke:#8f731a,color:#231a00
    class Build,Edge,Git ok
    class Svc,PG warn
```

The frontend pipeline is complete and verified. The Render half is drawn in amber
because the database it needs does not currently exist — see
[DEPLOYMENT.md](DEPLOYMENT.md#restoring-the-api).
