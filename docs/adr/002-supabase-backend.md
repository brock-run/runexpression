# ADR-002: Use Supabase as Backend-as-a-Service

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** backend, database, infrastructure, auth

## Context

RunExpression V1 requires a backend solution that provides:
- **PostgreSQL database** with relational integrity and JSONB flexibility
- **Authentication** with email/password and OAuth providers
- **File storage** for user-uploaded images, videos, and documents
- **Real-time capabilities** for The Flow wall updates
- **Row Level Security (RLS)** for multi-tenant data access control
- **Generous free tier** to minimize initial costs
- **Future AI Coach compatibility** using the same database

The application needs to:
- Store structured data (users, clubs, products) relationally
- Store flexible data (vibe tags, metadata) in JSONB
- Handle file uploads from browsers (The Flow images, clubhouse media)
- Push new Flow entries to clients in real-time without polling
- Enforce access control (club members only see their club data)

Strategic requirement: **The AI Coach will eventually use the same database** to access user profiles, running history, and community context.

## Decision

We will use **Supabase** as our Backend-as-a-Service platform, providing:
- PostgreSQL database (managed)
- Built-in authentication (Supabase Auth with JWT)
- File storage (Supabase Storage, S3-compatible)
- Real-time subscriptions (WebSocket-based)
- Auto-generated REST and GraphQL APIs
- Row Level Security enforcement at database level

### Key Implementation Details:

- **Database:** PostgreSQL 15+ with hybrid relational + JSONB schema
- **Auth:** Supabase Auth with email/password (OAuth deferred to V1.1)
- **Storage:** Supabase Storage buckets (`uploads`, `products`, `avatars`)
- **Realtime:** Subscribe to `expression_events` table for live Flow updates
- **RLS Policies:** All security enforced at database level (see ADR-004)
- **Client Libraries:** `@supabase/ssr` for Next.js App Router integration

## Consequences

### Positive

- **All-in-one platform:** Database, auth, storage, realtime in one service (reduces complexity)
- **PostgreSQL power:** Full SQL capabilities, ACID compliance, advanced querying
- **RLS enforcement:** Security at database level, can't be bypassed by buggy application code
- **Generous free tier:** 500MB database, 1GB file storage, 50K monthly active users (sufficient for V1)
- **Real-time built-in:** No need for separate WebSocket server or polling
- **Type safety:** Auto-generated TypeScript types from schema (`supabase gen types`)
- **AI Coach ready:** Same database used for future AI features, no data migration needed
- **Open source:** Can self-host if needed (though unlikely)
- **Active development:** Backed by Y Combinator, frequent updates

### Negative

- **Vendor lock-in (moderate):** While open-source, migration off Supabase requires effort
- **Realtime limitations:** Broadcasts limited to 100 concurrent connections on free tier
- **Learning curve:** Developers must understand RLS policies (different from typical app-level auth)
- **Dashboard UI limitations:** Some advanced DB operations require raw SQL
- **Storage limits:** 1GB on free tier (will need upgrade for heavy media usage)
- **No built-in image processing:** Need client-side compression (see ADR-008)

### Neutral

- **PostgreSQL only:** Not an issue (we wanted PostgreSQL), but no NoSQL option
- **Hosted only on AWS:** Supabase infrastructure runs on AWS (acceptable)
- **SDK required:** Must use Supabase client libraries (trade-off for convenience)

## Alternatives Considered

### Alternative 1: Firebase

**Description:** Google's Backend-as-a-Service with Firestore (NoSQL) database.

**Pros:**
- Mature ecosystem, well-documented
- Real-time database built-in
- Generous free tier
- Google Cloud integration
- Good client libraries (React, mobile)

**Cons:**
- **Firestore is NoSQL:** No relational integrity, difficult queries (no joins)
- **Cost scaling:** Can become expensive quickly with reads/writes
- **Less SQL-like:** Harder to model relational data (clubs, memberships)
- **Auth lock-in:** Firebase Auth not easily portable
- **No RLS:** Security rules less powerful than PostgreSQL RLS

**Why rejected:** RunExpression's data model is inherently relational (users → memberships → clubs → contributions). PostgreSQL's relational model and JSONB flexibility fit better than Firestore's document model.

---

### Alternative 2: Custom Backend (Node.js + PostgreSQL)

**Description:** Build a custom Express.js or Fastify API with PostgreSQL and separate auth/storage.

**Pros:**
- Full control over architecture
- No vendor lock-in
- Can optimize exactly for our use cases
- Deep customization possible

**Cons:**
- **Significant development time:** Auth, file uploads, real-time all need building
- **Security burden:** Must implement and maintain auth, RLS, file validation
- **Infrastructure complexity:** Need to manage DB hosting, backups, scaling
- **Delayed V1 launch:** Weeks of backend work before frontend can start
- **Ongoing maintenance:** Updates, security patches, monitoring all on us

**Why rejected:** Building a custom backend delays V1 launch by 3-4 weeks minimum. Supabase provides production-ready auth, storage, and realtime immediately, allowing us to focus on product features.

---

### Alternative 3: AWS Amplify

**Description:** AWS's full-stack framework with managed backend services.

**Pros:**
- Deep AWS integration (Lambda, S3, RDS, etc.)
- Auto-scaling infrastructure
- GraphQL API generation
- AWS credibility and support

**Cons:**
- **Steep learning curve:** Complex setup with CloudFormation
- **Vendor lock-in (strong):** Heavily AWS-specific
- **Cost complexity:** Many AWS services to understand and optimize
- **Less developer-friendly:** More enterprise-focused than developer-focused
- **Real-time limitations:** AppSync subscriptions more complex than Supabase

**Why rejected:** Amplify's complexity is overkill for V1. Supabase provides similar capabilities with better DX and lower learning curve.

---

### Alternative 4: PlanetScale + Clerk + Cloudinary

**Description:** Best-of-breed approach combining specialized services.

**Pros:**
- **PlanetScale:** Excellent MySQL hosting with branching
- **Clerk:** Modern auth with great UX
- **Cloudinary:** Advanced image/video processing
- Each service best-in-class

**Cons:**
- **Multiple vendors:** Three different services to manage and bill
- **Integration complexity:** Need to wire auth, DB, and storage together
- **Cost:** Paid tiers for all three add up quickly
- **No real-time:** Would need separate service (Pusher, Ably)
- **MySQL not PostgreSQL:** Lose JSONB flexibility

**Why rejected:** Supabase provides all these capabilities in one platform with better integration and simpler pricing. The convenience outweighs any individual service advantages.

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Next.js Integration](https://supabase.com/docs/guides/auth/server-side/nextjs)
- RunExpression Docs: `DOCS/03-TECHNICAL-DESIGN.md`, `DOCS/06-DATA-SCHEMA.md`

## Notes

- **Free tier limits:** 500MB database, 1GB storage, 50K MAU
- **Upgrade triggers:** If we exceed limits or need better performance, Pro plan is $25/month
- **Backup strategy:** Supabase provides daily backups; consider additional exports for critical data
- **Self-hosting option:** If needed, Supabase is open-source and can be self-hosted (unlikely to be necessary)
- **AI Coach migration:** Zero migration needed - AI features will use same Supabase database and auth

---

**Related ADRs:**
- [ADR-004: Hybrid Relational + JSONB Schema](./004-hybrid-schema.md) - Leverages PostgreSQL + JSONB
- [ADR-007: OpenAI Moderation API](./007-openai-moderation.md) - Integrates with Supabase data flow
