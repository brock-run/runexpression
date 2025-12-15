# RunExpression V1: Database Conventions

**Last Updated:** 2025-12-14
**Maintainer:** Engineering Team
**Status:** Living Document

---

## Overview

This document defines database conventions for RunExpression V1. All database schema, queries, and migrations should follow these standards to ensure consistency, performance, and maintainability.

**Database:** PostgreSQL 15+ (via Supabase)
**Schema Approach:** Hybrid relational + JSONB (see [ADR-004](../docs/adr/004-hybrid-schema.md))

**Goals:**
- **Clear naming:** Table and column names are self-documenting
- **Type safety:** Database types map cleanly to TypeScript
- **Security:** RLS policies enforce access control
- **Performance:** Indexes optimize common queries
- **Flexibility:** JSONB allows schema evolution

---

## 1. Table Naming

### 1.1 Naming Rules

**Use plural nouns:**
```sql
-- ✅ Good
CREATE TABLE profiles (...);
CREATE TABLE clubs (...);
CREATE TABLE expression_events (...);

-- ❌ Bad
CREATE TABLE profile (...);
CREATE TABLE club (...);
```

**Use snake_case:**
```sql
-- ✅ Good
CREATE TABLE club_memberships (...);
CREATE TABLE ai_coach_waitlist (...);

-- ❌ Bad
CREATE TABLE clubMemberships (...);
CREATE TABLE AiCoachWaitlist (...);
```

**Junction tables use both entity names:**
```sql
-- ✅ Good (many-to-many relationship)
CREATE TABLE club_memberships (
  user_id uuid REFERENCES profiles(id),
  club_id uuid REFERENCES clubs(id),
  PRIMARY KEY (user_id, club_id)
);

-- ❌ Bad
CREATE TABLE memberships (...);  -- Unclear what entities
```

### 1.2 Table Categories

**Core entities:**
```
profiles               -- User profiles
clubs                  -- Running clubs (DWTC, etc.)
club_memberships       -- User-club relationships
```

**Feature-specific:**
```
expression_events      -- Flow posts
club_contributions     -- Clubhouse uploads
products               -- Shop items
orders                 -- Shop purchases
ai_coach_waitlist      -- AI Coach signups
```

---

## 2. Column Naming

### 2.1 Primary Keys

**Always use `id` for primary key:**
```sql
-- ✅ Good
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);

-- ❌ Bad
CREATE TABLE profiles (
  profile_id uuid PRIMARY KEY,  -- Use `id`, not `profile_id`
  ...
);
```

**Exception: Auth users table uses Supabase's `auth.users(id)`:**
```sql
-- Profiles reference auth.users
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ...
);
```

### 2.2 Foreign Keys

**Use `{table_singular}_id` for foreign keys:**
```sql
-- ✅ Good
CREATE TABLE club_memberships (
  user_id uuid REFERENCES profiles(id),
  club_id uuid REFERENCES clubs(id),
  ...
);

-- ❌ Bad
CREATE TABLE club_memberships (
  user uuid REFERENCES profiles(id),  -- Missing _id suffix
  club_ref uuid REFERENCES clubs(id),  -- Inconsistent naming
  ...
);
```

### 2.3 Timestamps

**Always include `created_at`, optionally `updated_at`:**
```sql
-- ✅ Good
CREATE TABLE expression_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz  -- Optional, if updates are common
);

-- ❌ Bad (no timestamps)
CREATE TABLE expression_events (
  id uuid PRIMARY KEY,
  content text
);
```

**Use `timestamptz` (timestamp with timezone):**
```sql
-- ✅ Good
created_at timestamptz DEFAULT now()

-- ❌ Bad (no timezone)
created_at timestamp DEFAULT now()
```

### 2.4 Boolean Columns

**Use `is_` prefix or descriptive adjectives:**
```sql
-- ✅ Good
is_active boolean DEFAULT true
is_public boolean DEFAULT false
featured boolean DEFAULT false

-- ❌ Bad
active boolean  -- Unclear if true means active or inactive
public boolean  -- Reserved keyword
```

### 2.5 Enums via CHECK Constraints

**Use text with CHECK for enum-like columns:**
```sql
-- ✅ Good
CREATE TABLE expression_events (
  type text CHECK (type IN ('text', 'image', 'drawing')),
  moderation_status text CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  visibility text CHECK (visibility IN ('public', 'members', 'private'))
);

-- ❌ Bad (PostgreSQL enum - harder to migrate)
CREATE TYPE post_type AS ENUM ('text', 'image', 'drawing');
CREATE TABLE expression_events (
  type post_type  -- Harder to add new values later
);
```

---

## 3. JSONB Columns

### 3.1 When to Use JSONB

**Use JSONB for flexible, non-critical attributes:**
```sql
-- ✅ Good (JSONB for optional/flexible data)
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  email text NOT NULL,  -- Relational (required)
  full_name text,       -- Relational (queryable)
  expression_data jsonb DEFAULT '{}'::jsonb  -- JSONB (flexible)
);

-- expression_data example:
{
  "bio": "Ultra runner and bacon enthusiast",
  "why_i_run": "To find clarity in chaos",
  "preferences": {
    "units": "miles",
    "privacy": "public"
  }
}
```

**Don't use JSONB for relational data:**
```sql
-- ❌ Bad (use foreign key, not JSONB)
CREATE TABLE club_memberships (
  user_data jsonb  -- Don't embed user data, use user_id FK
);
```

### 3.2 JSONB Column Naming

**Use descriptive names ending in `_data` or `_metadata`:**
```sql
-- ✅ Good
expression_data jsonb   -- Profile's expression-related attributes
metadata jsonb          -- Post metadata (run context, GPS, etc.)
manifesto jsonb         -- Club's manifesto and rituals
```

### 3.3 JSONB Default Values

**Always provide default empty object:**
```sql
-- ✅ Good
expression_data jsonb DEFAULT '{}'::jsonb

-- ❌ Bad (nullable JSONB is harder to query)
expression_data jsonb
```

### 3.4 Querying JSONB

**Use `->>` for text values, `->` for JSON objects:**
```typescript
// ✅ Good
const { data } = await supabase
  .from('profiles')
  .select('id, expression_data->>bio')  // Extract `bio` as text
  .eq('expression_data->>why_i_run', 'To find clarity')

// Access nested values
const { data } = await supabase
  .from('profiles')
  .select('expression_data->preferences->>units')
```

**Index JSONB fields for performance:**
```sql
-- ✅ Good (if querying JSONB frequently)
CREATE INDEX idx_profiles_units ON profiles ((expression_data->'preferences'->>'units'));
```

---

## 4. Row Level Security (RLS)

### 4.1 Enable RLS on All Tables

**Always enable RLS:**
```sql
-- ✅ Good
CREATE TABLE expression_events (...);
ALTER TABLE expression_events ENABLE ROW LEVEL SECURITY;

-- ❌ Bad (no RLS = data exposed)
CREATE TABLE expression_events (...);
-- Missing: ALTER TABLE expression_events ENABLE ROW LEVEL SECURITY;
```

### 4.2 RLS Policy Templates

**Public read (authenticated write):**
```sql
-- Public can read approved posts
CREATE POLICY "Public can view approved posts"
ON expression_events FOR SELECT
USING (moderation_status = 'approved' AND visibility = 'public');

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
ON expression_events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

**User owns their data:**
```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);
```

**Service role bypass:**
```sql
-- Service role can do anything (for admin operations)
CREATE POLICY "Service role full access"
ON expression_events FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

**Members-only access:**
```sql
-- Only club members can view contributions
CREATE POLICY "Club members can view contributions"
ON club_contributions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM club_memberships
    WHERE club_memberships.club_id = club_contributions.club_id
      AND club_memberships.user_id = auth.uid()
  )
);
```

### 4.3 Policy Naming

**Use descriptive names:**
```sql
-- ✅ Good
CREATE POLICY "Public can view approved posts" ...
CREATE POLICY "Users can update own profile" ...
CREATE POLICY "Club members can upload media" ...

-- ❌ Bad
CREATE POLICY "select_policy" ...
CREATE POLICY "policy_1" ...
```

---

## 5. Indexes

### 5.1 When to Create Indexes

**Index foreign keys:**
```sql
-- ✅ Good
CREATE INDEX idx_expression_events_user_id ON expression_events(user_id);
CREATE INDEX idx_club_memberships_club_id ON club_memberships(club_id);
```

**Index frequently queried columns:**
```sql
-- ✅ Good (if filtering by moderation_status often)
CREATE INDEX idx_expression_events_moderation_status
ON expression_events(moderation_status);

-- ✅ Good (if sorting by created_at)
CREATE INDEX idx_expression_events_created_at
ON expression_events(created_at DESC);
```

**Composite indexes for multi-column queries:**
```sql
-- ✅ Good (if filtering by status AND visibility together)
CREATE INDEX idx_expression_events_status_visibility
ON expression_events(moderation_status, visibility);
```

### 5.2 Index Naming

**Use `idx_{table}_{column(s)}` pattern:**
```sql
-- ✅ Good
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_clubs_slug ON clubs(slug);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- ❌ Bad
CREATE INDEX email_index ON profiles(email);
CREATE INDEX idx1 ON clubs(slug);
```

---

## 6. Migrations

### 6.1 Migration Naming

**Use timestamp + descriptive name:**
```
migrations/
  20251214_001_create_profiles.sql
  20251214_002_create_clubs.sql
  20251214_003_create_expression_events.sql
  20251214_004_add_rls_policies.sql
```

### 6.2 Migration Structure

**Include UP and DOWN migrations:**
```sql
-- migrations/20251214_001_create_profiles.sql

-- UP Migration
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  expression_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- DOWN Migration (commented out, run manually if needed)
-- DROP POLICY "Users can view own profile" ON profiles;
-- DROP TABLE profiles;
```

### 6.3 Migration Best Practices

**Add columns with defaults (non-breaking):**
```sql
-- ✅ Good (existing rows get default value)
ALTER TABLE profiles ADD COLUMN bio text DEFAULT '';

-- ❌ Bad (breaks if NULL not allowed)
ALTER TABLE profiles ADD COLUMN bio text NOT NULL;  -- Fails if table has data
```

**Backfill data in separate transaction:**
```sql
-- ✅ Good
ALTER TABLE profiles ADD COLUMN membership_tier text DEFAULT 'free';

-- Backfill in separate statement
UPDATE profiles SET membership_tier = 'free' WHERE membership_tier IS NULL;
```

---

## 7. Common Query Patterns

### 7.1 Fetching Related Data

**Use Supabase's join syntax:**
```typescript
// ✅ Good (fetch posts with user profiles)
const { data } = await supabase
  .from('expression_events')
  .select(`
    id,
    content,
    created_at,
    profiles:user_id (
      full_name,
      expression_data
    )
  `)
  .eq('moderation_status', 'approved')
  .order('created_at', { ascending: false })
  .limit(20)
```

### 7.2 Filtering by JSONB

**Query JSONB fields:**
```typescript
// ✅ Good
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, expression_data')
  .eq('expression_data->>why_i_run', 'To find clarity')

// ✅ Good (check if JSONB key exists)
const { data } = await supabase
  .from('profiles')
  .select('*')
  .not('expression_data->bio', 'is', null)
```

### 7.3 Counting Records

**Use `count` option:**
```typescript
// ✅ Good
const { count } = await supabase
  .from('expression_events')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)

console.log(`User has ${count} posts`)
```

### 7.4 Pagination

**Use `range` for offset pagination:**
```typescript
// ✅ Good (first page)
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .range(0, 19)  // First 20 items

// ✅ Good (second page)
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .range(20, 39)  // Next 20 items
```

**Use `gt` for cursor pagination (better performance):**
```typescript
// ✅ Good (cursor-based pagination)
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .gt('created_at', lastSeenTimestamp)
  .order('created_at', { ascending: false })
  .limit(20)
```

---

## 8. Type Generation

### 8.1 Generate TypeScript Types from Database

**Use Supabase CLI to generate types:**
```bash
# Generate types from database schema
npx supabase gen types typescript --project-id <project-id> > lib/types/database.ts
```

**Use generated types in queries:**
```typescript
import type { Database } from '@/lib/types/database'

type FlowPost = Database['public']['Tables']['expression_events']['Row']

const { data } = await supabase
  .from('expression_events')
  .select('*')
  .returns<FlowPost[]>()
```

### 8.2 Extend Database Types

**Create feature-specific types:**
```typescript
// lib/types/flow.ts
import type { Database } from './database'

export type FlowPost = Database['public']['Tables']['expression_events']['Row']

export interface FlowPostWithProfile extends FlowPost {
  profiles: {
    full_name: string | null
    expression_data: Record<string, any>
  } | null
}
```

---

## 9. Seed Data

### 9.1 Seed File Structure

```sql
-- seed.sql

-- Insert default clubs
INSERT INTO clubs (id, name, slug, description, manifesto)
VALUES
  (
    gen_random_uuid(),
    'Damn We''re The Champions',
    'dwtc',
    'A running club that believes in bacon, joy, and interdependence.',
    '{"rituals": ["Bacon after long runs", "No pace shaming"], "values": ["Joy", "Community"]}'::jsonb
  );

-- Insert test user (development only)
INSERT INTO profiles (id, email, full_name)
VALUES
  (
    'test-user-uuid-here',
    'test@runexpression.com',
    'Test Runner'
  );
```

### 9.2 Environment-Specific Seeds

**Only seed development data locally:**
```sql
-- seed-dev.sql (local only)
INSERT INTO profiles (id, email, full_name)
SELECT
  gen_random_uuid(),
  'user' || i || '@example.com',
  'Test User ' || i
FROM generate_series(1, 10) AS i;
```

---

## 10. Security Best Practices

### 10.1 Never Trust Client Input

**Validate in RLS policies:**
```sql
-- ✅ Good (RLS ensures user owns the post)
CREATE POLICY "Users can delete own posts"
ON expression_events FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 10.2 Use Service Role Carefully

**Only use service role key server-side:**
```typescript
// ✅ Good (server-side only)
// app/api/admin/moderate/route.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Server-side only
)

// ❌ Bad (NEVER use service role client-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!  // ❌ NEVER DO THIS
)
```

### 10.3 Sanitize JSONB Input

**Validate JSONB structure:**
```typescript
// ✅ Good
import { z } from 'zod'

const ExpressionDataSchema = z.object({
  bio: z.string().max(500).optional(),
  why_i_run: z.string().max(200).optional(),
  preferences: z.object({
    units: z.enum(['miles', 'kilometers']),
    privacy: z.enum(['public', 'private'])
  }).optional()
})

const result = ExpressionDataSchema.safeParse(req.body.expression_data)
if (!result.success) {
  return { error: 'Invalid expression data' }
}
```

---

## Change Log

| Date       | Changes                                      | Author           |
|------------|----------------------------------------------|------------------|
| 2025-12-14 | Initial database conventions document created | Engineering Team |

---

## References

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Supabase Database Guide:** https://supabase.com/docs/guides/database
- **Supabase RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **JSONB Documentation:** https://www.postgresql.org/docs/current/datatype-json.html
- **Related Docs:** [06-DATA-SCHEMA.md](./06-DATA-SCHEMA.md), [ADR-004: Hybrid Schema](../docs/adr/004-hybrid-schema.md)
