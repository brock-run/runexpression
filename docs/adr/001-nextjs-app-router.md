# ADR-001: Adopt Next.js 14+ with App Router

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** frontend, framework, architecture

## Context

RunExpression V1 requires a frontend framework that can deliver:
- **SEO-optimized content** for the manifesto, blog, and public pages
- **Interactive, real-time features** for The Flow canvas and clubhouse
- **Server-side and client-side rendering** flexibility
- **Modern developer experience** with TypeScript support
- **Production-ready deployment** with minimal configuration

The application has three distinct experiences:
1. Public marketing (homepage, blog) - needs SSR/SSG for SEO
2. Interactive canvas (The Flow) - needs CSR and real-time updates
3. Authenticated clubhouse - needs both SSR (initial load) and CSR (interactions)

Additionally, the AI Coach platform will eventually share the same codebase, requiring a scalable foundation.

## Decision

We will use **Next.js 14+ with the App Router** as our frontend framework.

### Key Implementation Details:

- **App Router** (`app/` directory) for modern routing and Server Components
- **Server Components by default** for initial renders and SEO
- **Client Components** (`"use client"`) for interactivity
- **Route Groups** to organize pages by access level: `(public)`, `(flow)`, `(app)`
- **TypeScript** throughout for type safety
- **Deployed on Vercel** for zero-config hosting

## Consequences

### Positive

- **Best-in-class SEO:** Server-side rendering with automatic metadata handling
- **Performance:** React Server Components reduce client-side bundle size
- **Developer experience:** Hot reload, TypeScript support, great documentation
- **Deployment synergy:** Vercel is built for Next.js (edge functions, preview deployments)
- **Flexibility:** Can use SSR, SSG, or CSR per page/component as needed
- **Image optimization:** Built-in `<Image>` component with automatic WebP conversion
- **Future-ready:** App Router is the future of Next.js (Pages Router is legacy)
- **AI Coach integration:** Same stack can power future AI features

### Negative

- **Learning curve:** App Router is newer, less Stack Overflow content than Pages Router
- **Server/Client split:** Developers must understand when to use each (can be confusing)
- **Vercel lock-in:** While Next.js can run elsewhere, Vercel deployment is heavily optimized
- **Bundle size:** Next.js adds ~85KB (gzipped) baseline to all pages

### Neutral

- **React 18+ required:** Must use latest React (we wanted this anyway)
- **Node.js required:** Server-side runtime needed (expected for SSR)

## Alternatives Considered

### Alternative 1: Remix

**Description:** Modern React framework with focus on web fundamentals and progressive enhancement.

**Pros:**
- Excellent nested routing and data loading
- Strong focus on web standards (native `<form>`, HTTP caching)
- Good TypeScript support
- Less "magic" than Next.js (more explicit)

**Cons:**
- Smaller ecosystem and community than Next.js
- Less mature hosting options (Vercel equivalent not as polished)
- Image optimization not built-in
- Less documentation and examples for our use cases

**Why rejected:** Next.js has better deployment options (Vercel), larger community for troubleshooting, and built-in image optimization which is critical for The Flow and Clubhouse media.

---

### Alternative 2: Vite + React (SPA)

**Description:** Build a pure Single-Page Application with Vite as bundler.

**Pros:**
- Extremely fast dev server
- Simple mental model (all client-side)
- Full control over routing and rendering
- Lightweight bundle

**Cons:**
- **Poor SEO:** No SSR out of the box (homepage manifesto wouldn't rank)
- Manual setup for code splitting, image optimization, etc.
- Need separate solution for blog (maybe Astro or static site generator)
- No built-in API routes (need separate backend for webhooks)

**Why rejected:** SEO is critical for RunExpression's growth strategy. The homepage manifesto and blog content need to be crawlable and fast on initial load.

---

### Alternative 3: Next.js Pages Router

**Description:** Use Next.js but with the older Pages Router (`pages/` directory).

**Pros:**
- More mature, more examples online
- Simpler mental model (everything is a page)
- Slightly better known by developers

**Cons:**
- **Legacy approach:** Vercel and React are moving away from this pattern
- No Server Components (less performant)
- Worse code organization (harder to group routes)
- Will eventually need migration to App Router anyway

**Why rejected:** App Router is the future of Next.js. Starting with Pages Router means a painful migration later, especially as the AI Coach is integrated.

---

### Alternative 4: Astro + React Islands

**Description:** Use Astro for static content with React islands for interactivity.

**Pros:**
- Excellent performance for content-heavy sites
- "Islands architecture" sends minimal JS
- Great DX for blogs and marketing sites
- Built-in Markdown support

**Cons:**
- **Awkward for highly interactive features:** The Flow and Clubhouse need significant client-side logic
- Split mental model (Astro + React)
- Less suitable for auth-heavy applications
- Real-time features (Supabase Realtime) harder to integrate

**Why rejected:** While Astro excels at content sites, RunExpression's core value is in interactive, real-time community features. Next.js handles both content and interactivity better.

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- RunExpression Docs: `DOCS/03-TECHNICAL-DESIGN.md`

## Notes

- **Deployment target:** Vercel (see deployment docs)
- **TypeScript config:** Strict mode enabled for type safety
- **Fallback plan:** If App Router proves problematic, Pages Router is still an option (but unlikely to be needed)
- **Monitoring:** Use Vercel Analytics and Sentry to track performance and errors

---

**Related ADRs:**
- [ADR-003: Pragmatic Monolith](./003-pragmatic-monolith.md) - Supports monolith architecture
