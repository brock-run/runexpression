# ADR-003: Build as Pragmatic Monolith

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** architecture, deployment, scalability

## Context

RunExpression V1 includes multiple distinct experiences:
1. **Public marketing** (homepage, blog, manifesto)
2. **The Flow** (interactive canvas with real-time updates)
3. **DWTC Clubhouse** (authenticated, member-only area)
4. **Shop** (e-commerce with Stripe integration)
5. **Tools** (pace calculator, future interactive utilities)

We must decide: Should these be separate applications (microservices) or a single codebase (monolith)?

**Key Constraints:**
- **Small team:** 1-2 developers initially
- **Fast time-to-market:** 6-8 weeks to V1 launch
- **Shared context:** All features share user authentication and database
- **Future AI Coach:** Will integrate deeply with existing features
- **Limited budget:** Must minimize operational complexity and costs

**Strategic Goal:** Ship V1 quickly while maintaining clear path to scale when AI Coach launches.

## Decision

We will build RunExpression V1 as a **Pragmatic Monolith**: a single Next.js application containing all features, with clear internal boundaries and modular code organization.

### Key Implementation Details:

**Single Codebase:**
- One Next.js application
- One Supabase database
- One Vercel deployment
- Shared authentication across all features

**Internal Modularity:**
- Route groups for logical separation: `(public)`, `(flow)`, `(app)`, `(shop)`
- Feature-based component organization (`components/flow/`, `components/clubhouse/`)
- Shared utilities in `lib/` (auth, database clients, analytics)
- Clear API route structure (`api/flow/`, `api/clubhouse/`, `api/webhooks/`)

**Deliberate Constraints:**
- No microservices (yet)
- No separate databases per feature
- No complex service mesh or API gateway
- Simple deployment (single Vercel project)

## Consequences

### Positive

- **Faster development:** No inter-service communication, shared code, single deployment
- **Easier debugging:** All code in one place, single log stream
- **Simplified deployment:** One `git push` deploys entire app
- **Shared authentication:** User sessions work across all features naturally
- **Lower operational overhead:** One server, one database, one monitoring dashboard
- **Better developer experience:** Single dev environment, single `npm run dev`
- **Database transactions:** Features can share transactions (e.g., order + unlock digital content)
- **Cost efficiency:** No duplicate infrastructure, single Vercel/Supabase bill
- **Clear upgrade path:** Can extract microservices later if/when needed

### Negative

- **Scaling limitations (theoretical):** Can't independently scale Flow vs Clubhouse (unlikely to matter at V1 scale)
- **Deployment coupling:** Any change requires full redeploy (mitigated by Vercel's edge caching)
- **Potential merge conflicts:** With multiple devs, requires good Git hygiene
- **Bundle size:** All code shipped to client initially (mitigated by code splitting)
- **Single point of failure:** If app goes down, all features go down (but simpler to fix)

### Neutral

- **Code organization discipline required:** Must maintain clear boundaries between features
- **Testing strategy:** Integration tests more valuable than unit tests (acceptable)

## Alternatives Considered

### Alternative 1: Microservices from Day 1

**Description:** Build separate services for each feature:
- Service 1: Public marketing site (Next.js)
- Service 2: The Flow API (Node.js + GraphQL)
- Service 3: Clubhouse API (Node.js + REST)
- Service 4: Shop (Shopify or custom)

**Pros:**
- Independent scaling (Flow could scale differently from Clubhouse)
- Independent deployments (shop update doesn't affect Flow)
- Team autonomy (different teams could own different services)
- Technology flexibility (could use different languages)

**Cons:**
- **Massive overhead for V1:** API versioning, service discovery, distributed auth
- **Cross-service queries expensive:** Joining user + club + contributions requires multiple API calls
- **Operational complexity:** Multiple deploys, multiple monitoring systems, multiple DBs
- **Development friction:** Changes spanning features require coordinating multiple services
- **Delayed launch:** Infrastructure setup alone could take 2-3 weeks
- **Higher costs:** Multiple databases, multiple serverless functions

**Why rejected:** Microservices solve problems RunExpression doesn't have yet (massive scale, many teams). The overhead delays V1 launch and adds complexity without current benefit.

---

### Alternative 2: Monorepo with Separate Apps

**Description:** Use Nx or Turborepo to manage multiple Next.js apps in one repository.

**Pros:**
- Shared code via workspace packages
- Independent deployments (each app to its own Vercel project)
- Can enforce boundaries better than monolith
- Better for eventual team scaling

**Cons:**
- **Configuration overhead:** Setting up monorepo tooling (Nx/Turbo) takes time
- **Duplicated infrastructure:** Each app needs its own Vercel project
- **Auth complexity:** Sharing auth across domains/subdomains is harder
- **Delayed development:** More initial setup, steeper learning curve
- **Overkill for V1:** Benefits don't outweigh costs at 1-2 developers

**Why rejected:** Monorepo tooling adds complexity without immediate benefit. We can always extract apps later if needed (Next.js makes this easier).

---

### Alternative 3: Modular Monolith with NX

**Description:** Single deployment but enforced module boundaries using Nx or similar tooling.

**Pros:**
- Enforced boundaries (can't import `clubhouse/` from `flow/` accidentally)
- Better code organization than pure monolith
- Easier to extract to microservices later
- Single deployment like monolith

**Cons:**
- **Added tooling:** Nx adds build complexity and learning curve
- **Slower builds (sometimes):** Nx caching helps, but not always
- **Configuration overhead:** Defining module boundaries takes time
- **Possible over-engineering:** May not need this strictness yet

**Why rejected:** We can achieve good boundaries through discipline and code review without added tooling. If boundaries become problem later, we can add Nx or extract services.

---

### Alternative 4: Serverless Functions (Vercel Functions) per Feature

**Description:** Keep frontend as one Next.js app, but split backend into separate Vercel Functions.

**Pros:**
- Backend logic independently scalable
- Can use different languages for different functions
- Still shares frontend codebase

**Cons:**
- **Cold starts:** Serverless functions have latency on first request
- **Harder debugging:** Distributed logs across functions
- **Database connection pooling:** Each function maintains own connections (potential exhaustion)
- **Complexity without benefit:** We're not hitting scale where this matters

**Why rejected:** Next.js API routes (also serverless on Vercel) are sufficient. Separating functions adds complexity without solving a current problem.

## References

- [Shopify's Modular Monolith](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity)
- [Martin Fowler: MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html)
- [When to use Microservices](https://martinfowler.com/articles/microservices.html)
- RunExpression Docs: `DOCS/03-TECHNICAL-DESIGN.md`

## Notes

- **Migration path:** If we hit scaling limits, Next.js makes it easy to extract features to separate apps
- **Monitoring:** Single application is easier to monitor (Vercel Analytics + Sentry)
- **Code organization:** Use route groups and feature folders to maintain clear boundaries
- **Future consideration:** AI Coach will initially live in same monolith; extract only if performance requires it

**When to revisit this decision:**
- If we have 5+ developers working on codebase (conflicts increase)
- If one feature (e.g., Flow) requires significantly different scaling than others
- If we need to deploy features independently for compliance/risk reasons
- If monolith grows beyond ~50K lines of code and becomes hard to navigate

---

**Related ADRs:**
- [ADR-001: Next.js App Router](./001-nextjs-app-router.md) - Framework supports monolith architecture
- [ADR-002: Supabase Backend](./002-supabase-backend.md) - Single database supports monolith
