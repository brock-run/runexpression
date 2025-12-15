# ADR-004: Hybrid Relational + JSONB Schema

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** database, schema-design, scalability

## Context

RunExpression's data model includes:

**Well-defined entities:**
- Users (profiles, authentication)
- Clubs (DWTC and future clubs)
- Memberships (who belongs to which club)
- Products (shop items)
- Orders (purchase records)

**Flexible, evolving attributes:**
- User preferences ("Why do you run?", shoe size, injury history)
- Vibe tags for Flow submissions (Meditative, Aggressive, etc.)
- Club metadata (rituals, traditions, branding)
- Expression metadata (run context, perceived effort)

**Key Requirements:**
1. **Relational integrity:** Ensure memberships link valid users to valid clubs
2. **Flexible attributes:** Add new user preferences or vibe tags without schema migrations
3. **AI Coach readiness:** Store rich context (qualitative + quantitative) for future ML
4. **Query performance:** Fast lookups by relationships (user → clubs → contributions)
5. **Future evolution:** Schema must accommodate unknowns (new running metrics, new club types)

**Strategic Goal:** Balance structured data (relational) with flexibility (schemaless) to enable rapid iteration while maintaining data integrity.

## Decision

We will use a **Hybrid Relational + JSONB schema** in PostgreSQL:

- **Core entities** (users, clubs, memberships, products) as **relational tables** with foreign keys
- **Flexible attributes** (metadata, preferences, tags) stored in **JSONB columns**
- **Arrays** for simple lists (tags, vibe_tags)
- **Row Level Security (RLS)** for access control at database level

### Key Implementation Details:

**Relational Tables for Structure:**
```sql
profiles (id, email, full_name, created_at)
clubs (id, name, slug)
club_memberships (user_id, club_id, role)  -- FK to both
```

**JSONB Columns for Flexibility:**
```sql
profiles.expression_data JSONB  -- {bio, why_i_run, preferences}
clubs.manifesto JSONB           -- {rituals, branding, traditions}
expression_events.metadata JSONB  -- {run_distance, perceived_effort}
```

**Hybrid Example:**
```sql
-- User profile (relational + JSONB)
INSERT INTO profiles (id, email, full_name, expression_data) VALUES (
  uuid,
  'runner@example.com',
  'Sarah Runner',
  '{
    "bio": "Running for clarity",
    "why_i_run": "Community and growth",
    "shoe_size": "8.5",
    "preferred_distance": "10k",
    "injury_history": ["IT band 2023"]
  }'::jsonb
);

-- Query both relational and JSONB
SELECT full_name, expression_data->>'why_i_run' as motivation
FROM profiles WHERE email = 'runner@example.com';
```

## Consequences

### Positive

- **Schema evolution without migrations:** Add new JSONB fields instantly (no ALTER TABLE)
- **Relational integrity preserved:** Foreign keys prevent orphaned data (user deleted → memberships deleted)
- **Rich querying:** PostgreSQL's JSONB operators enable complex queries (`expression_data->>'shoe_size'`)
- **AI-ready data:** JSONB captures unstructured context (qualitative reflections, metadata)
- **Index support:** Can create GIN indexes on JSONB for fast lookups
- **Future-proof:** Can accommodate new running metrics, club types, user attributes
- **Type flexibility:** JSONB columns can evolve independently per row (some users have more fields)
- **Single database:** No need for separate NoSQL store

### Negative

- **Schema ambiguity:** JSONB structure not enforced by database (rely on application validation)
- **Tooling limitations:** ORMs don't always handle JSONB well (we're using raw SQL mostly anyway)
- **Query complexity:** JSONB queries more verbose than column queries (`->` vs `.`)
- **Type safety (client):** TypeScript types for JSONB require manual maintenance
- **Storage overhead:** JSONB has ~10-20% overhead vs. columns
- **Learning curve:** Developers must understand when to use JSONB vs. columns

### Neutral

- **PostgreSQL only:** JSONB is Postgres-specific (but we chose Postgres via Supabase)
- **No schema validation in DB:** Application layer must validate JSONB structure

## Alternatives Considered

### Alternative 1: Pure Relational Schema

**Description:** Model everything as tables and columns. Add new columns via migrations.

**Pros:**
- **Type safety:** Database enforces schema
- **Explicit structure:** Every field is a column
- **Better tooling:** ORMs work perfectly
- **Query simplicity:** Standard SQL only

**Cons:**
- **Rigid:** Every new user attribute requires migration
- **Over-normalization risk:** End up with dozens of tables for simple data
- **Slow iteration:** Adding "preferred_shoe_brand" requires migration + deploy
- **AI limitations:** Hard to store rich, unstructured context

**Why rejected:** RunExpression's data model has inherently flexible aspects (user philosophies, club rituals). Pure relational forces us into premature schema decisions and slows iteration.

---

### Alternative 2: Pure NoSQL (e.g., MongoDB, DynamoDB)

**Description:** Store everything as documents with no schema enforcement.

**Pros:**
- **Maximum flexibility:** Change structure anytime
- **Fast writes:** No foreign key checks
- **Schemaless:** Natural fit for evolving data

**Cons:**
- **No relational integrity:** Can't enforce "user must belong to valid club"
- **Query limitations:** No joins (need application-side data assembly)
- **Data duplication:** Must duplicate data across documents to avoid lookups
- **Migration complexity:** Hard to query "all users in club X" efficiently
- **Supabase doesn't support it:** Would need separate database (Firebase, MongoDB Atlas)

**Why rejected:** Memberships, clubs, and contributions have clear relational structure. NoSQL makes these relationships harder to query and maintain.

---

### Alternative 3: EAV (Entity-Attribute-Value) Model

**Description:** Store flexible attributes in a separate table:
```sql
user_attributes (user_id, attribute_name, attribute_value)
```

**Pros:**
- **Flexible:** Can add attributes without migrations
- **Relational:** Still uses SQL

**Cons:**
- **Query complexity:** Queries become extremely verbose (joins for every attribute)
- **Performance:** Horrible performance (each attribute is a row, not a column)
- **No type safety:** All values stored as text, need application-level parsing
- **Developer experience:** Universally hated pattern

**Why rejected:** EAV is an anti-pattern. JSONB provides same flexibility with better performance and DX.

---

### Alternative 4: Hybrid with Separate NoSQL Store

**Description:** Use PostgreSQL for relational data, add DynamoDB/MongoDB for flexible attributes.

**Pros:**
- **Best of both worlds:** Relational integrity + schemaless flexibility
- **Optimized querying:** Each store optimized for its use case

**Cons:**
- **Complexity:** Two databases to manage, sync, backup
- **Data consistency:** Keeping Postgres and NoSQL in sync is hard
- **Cost:** Two database bills
- **Operational overhead:** Two monitoring systems, two failure modes
- **Overkill:** PostgreSQL JSONB provides 90% of NoSQL benefits

**Why rejected:** PostgreSQL's JSONB is powerful enough that we don't need a separate NoSQL database. Operational simplicity wins.

## References

- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)
- [JSONB Indexing](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING)
- [When to use JSONB](https://www.citusdata.com/blog/2016/07/14/choosing-nosql-hstore-json-jsonb/)
- RunExpression Docs: `DOCS/06-DATA-SCHEMA.md`

## Notes

- **JSONB vs JSON:** Always use JSONB (binary, faster queries, supports indexing)
- **Validation:** Use Zod or similar for application-level JSONB validation
- **Indexes:** Create GIN indexes on frequently-queried JSONB fields
- **Migration strategy:** Start with minimal JSONB, add fields as needed
- **AI Coach impact:** JSONB makes it easy to store rich running context without schema changes

**When to avoid JSONB:**
- Data that's **always present and structured** → use columns (e.g., `email`, `created_at`)
- Data used in **foreign keys or indexes** → use columns
- Data with **strict type requirements** → use columns

**When to use JSONB:**
- Optional or **evolving attributes** (user preferences)
- **Unstructured metadata** (run context, club rituals)
- **Sparse data** (different users have different fields)
- **API payloads** that need to be stored verbatim

---

**Related ADRs:**
- [ADR-002: Supabase Backend](./002-supabase-backend.md) - Provides PostgreSQL with JSONB
