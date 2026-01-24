---
name: database-schema-migration
description: Designing database schemas, writing migrations, and maintaining data integrity using hybrid relational + JSONB patterns. Use when adding new features requiring database changes, optimizing query performance, creating seed data for development/testing, or planning schema evolution.
---

# Database Schema & Migration

## Core Principles

**Hybrid Schema Approach:**
- **Relational tables** for core entities (users, clubs, memberships) with foreign keys
- **JSONB columns** for flexible, evolving attributes (metadata, preferences, tags)
- **Arrays** for simple lists (vibe_tags, permissions)
- **RLS enabled** on all tables for security

**When to use relational vs JSONB:**
- ✅ **Relational**: Always-present data, foreign keys, frequently queried, strict types
- ✅ **JSONB**: Optional attributes, evolving structure, sparse data, unstructured metadata

---

## Table Design Patterns

### Naming Conventions

**Tables:** Plural nouns, snake_case
```sql
-- ✅ Good
CREATE TABLE expression_events (...);
CREATE TABLE club_memberships (...);

-- ❌ Bad
CREATE TABLE expressionEvent (...);
CREATE TABLE membership (...);
```

**Columns:** snake_case, descriptive names
```sql
-- ✅ Good
user_id uuid REFERENCES profiles(id)
created_at timestamptz DEFAULT now()
is_active boolean DEFAULT true

-- ❌ Bad
userId uuid
createdAt timestamp
active boolean
```

### Standard Table Structure

```sql
CREATE TABLE public.example_table (
    -- Primary key (always `id`)
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys (pattern: {table_singular}_id)
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
    
    -- Core relational columns
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    
    -- Timestamps (always timestamptz)
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now(),
    
    -- Boolean flags (is_ prefix)
    is_active boolean DEFAULT true NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    
    -- Enums via CHECK constraints (not PostgreSQL ENUM types)
    status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    
    -- Arrays for simple lists
    tags text[] DEFAULT ARRAY[]::TEXT[],
    
    -- JSONB for flexible attributes
    metadata jsonb DEFAULT '{}'::jsonb,
    expression_data jsonb DEFAULT '{}'::jsonb
);
```

---

## JSONB Column Patterns

### When to Use JSONB

**Good candidates:**
- User preferences (`expression_data`: bio, why_i_run, shoe_size)
- Club metadata (`manifesto`: rituals, traditions, branding)
- Event metadata (`metadata`: run_distance, perceived_effort, location)
- Flexible attributes that may evolve

**Always provide default:**
```sql
-- ✅ Good
metadata jsonb DEFAULT '{}'::jsonb

-- ❌ Bad (nullable JSONB harder to query)
metadata jsonb
```

### JSONB Structure Examples

```sql
-- Profile expression_data
{
  "bio": "Ultra runner and bacon enthusiast",
  "why_i_run": "To find clarity in chaos",
  "preferences": {
    "units": "miles",
    "privacy": "public"
  },
  "favorite_vibes": ["Meditative", "Flow State"]
}

-- Club manifesto
{
  "tagline": "Where lore lives",
  "values": ["Community", "Process", "Bacon"],
  "rituals": ["Bacon after long runs", "No pace shaming"]
}

-- Expression metadata
{
  "run_distance": 5.2,
  "run_date": "2025-01-15",
  "location": "Central Park",
  "perceived_effort": 7
}
```

### Querying JSONB

```typescript
// Extract text value
const { data } = await supabase
  .from('profiles')
  .select('id, expression_data->>bio')  // Returns text
  .eq('expression_data->>why_i_run', 'To find clarity')

// Access nested values
const { data } = await supabase
  .from('profiles')
  .select('expression_data->preferences->>units')

// Check if key exists
const { data } = await supabase
  .from('profiles')
  .select('*')
  .not('expression_data->bio', 'is', null)
```

---

## Migration Writing

### Migration File Naming

**Format:** `YYYYMMDDHHMMSS_description.sql`
```
supabase/migrations/
  20250101000000_initial_schema.sql
  20250115000001_add_vibe_tags_index.sql
  20250120000002_add_club_contributions.sql
```

### Migration Structure

```sql
-- RunExpression V1 - Migration: Add feature X
-- Description: What this migration does

-- UP Migration
CREATE TABLE public.new_table (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    -- ... columns
);

-- Enable RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view approved items"
    ON public.new_table FOR SELECT
    USING (is_public = true AND is_active = true);

CREATE POLICY "Users can create items"
    ON public.new_table FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Indexes (always index foreign keys)
CREATE INDEX idx_new_table_user_id ON public.new_table(user_id);
CREATE INDEX idx_new_table_created_at ON public.new_table(created_at DESC);

-- DOWN Migration (commented, for reference)
-- DROP INDEX idx_new_table_created_at;
-- DROP INDEX idx_new_table_user_id;
-- DROP POLICY "Users can create items" ON public.new_table;
-- DROP POLICY "Public can view approved items" ON public.new_table;
-- DROP TABLE public.new_table;
```

### Adding Columns (Non-Breaking)

```sql
-- ✅ Good (with default for existing rows)
ALTER TABLE profiles ADD COLUMN bio text DEFAULT '';

-- ❌ Bad (fails if table has data)
ALTER TABLE profiles ADD COLUMN bio text NOT NULL;

-- Backfill in separate statement if needed
UPDATE profiles SET bio = '' WHERE bio IS NULL;
```

### Migration Workflow

1. Create migration file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Write SQL changes (tables, columns, indexes, RLS policies)
3. Test locally: `npm run db:push` (or `npx supabase db push`)
4. Generate TypeScript types: `npm run db:types`
5. Commit both migration and updated types file

---

## Index Optimization

### When to Create Indexes

**Always index foreign keys:**
```sql
CREATE INDEX idx_expression_events_user_id ON expression_events(user_id);
CREATE INDEX idx_club_memberships_club_id ON club_memberships(club_id);
```

**Index frequently queried columns:**
```sql
-- Filtering by status
CREATE INDEX idx_expression_events_moderation_status
ON expression_events(moderation_status);

-- Sorting by created_at
CREATE INDEX idx_expression_events_created_at
ON expression_events(created_at DESC);
```

**Composite indexes for multi-column queries:**
```sql
-- Filtering by status AND visibility together
CREATE INDEX idx_expression_events_status_visibility
ON expression_events(moderation_status, visibility);
```

**Index JSONB fields (if frequently queried):**
```sql
CREATE INDEX idx_profiles_units 
ON profiles ((expression_data->'preferences'->>'units'));
```

### Index Naming

**Pattern:** `idx_{table}_{column(s)}`
```sql
-- ✅ Good
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- ❌ Bad
CREATE INDEX email_index ON profiles(email);
CREATE INDEX idx1 ON clubs(slug);
```

---

## Row Level Security (RLS)

### Enable RLS on All Tables

```sql
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
```

### Common RLS Policy Patterns

**Public read, authenticated write:**
```sql
CREATE POLICY "Public can view approved posts"
ON expression_events FOR SELECT
USING (moderation_status = 'approved' AND visibility = 'public');

CREATE POLICY "Authenticated users can create posts"
ON expression_events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

**User owns their data:**
```sql
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);
```

**Members-only access:**
```sql
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

### RLS Policy Naming Standards

**Pattern:** `{Who} can {action} {what} [{condition}]`

**Naming conventions:**
- Use descriptive, human-readable names
- Start with the actor (Public, Authenticated users, Users, Club members, Admins)
- Use action verbs (view, create, update, delete)
- Include conditions when relevant
- Use title case for readability

**Examples:**
```sql
-- ✅ Good - Clear and descriptive
CREATE POLICY "Public can view approved posts"
ON expression_events FOR SELECT
USING (moderation_status = 'approved' AND visibility = 'public');

CREATE POLICY "Authenticated users can create posts"
ON expression_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Club members can view club contributions"
ON clubhouse_lore FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM club_memberships
    WHERE user_id = auth.uid()
    AND club_id = clubhouse_lore.club_id
  )
);

CREATE POLICY "Admins can moderate all content"
ON expression_events FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  )
);
```

**❌ Bad - Generic or unclear:**
```sql
-- ❌ Bad - Too generic
CREATE POLICY "select_policy" ON expression_events FOR SELECT ...
CREATE POLICY "policy_1" ON profiles FOR UPDATE ...
CREATE POLICY "users_policy" ON club_memberships FOR SELECT ...

-- ❌ Bad - Unclear actor
CREATE POLICY "Can view" ON expression_events FOR SELECT ...
CREATE POLICY "Update allowed" ON profiles FOR UPDATE ...
```

**Policy naming checklist:**
- ✅ Clearly identifies who the policy applies to
- ✅ States the action (view, create, update, delete)
- ✅ Describes what resource/condition
- ✅ Is unique and searchable
- ✅ Follows consistent pattern across project

---

## Seed Data Creation

### Seed File Structure

```sql
-- supabase/seed/01_seed_data.sql

-- Insert default clubs
INSERT INTO clubs (id, name, slug, description, manifesto, is_public)
VALUES
  (
    gen_random_uuid(),
    'Damn We''re The Champions',
    'dwtc',
    'A running club that believes in bacon, joy, and interdependence.',
    '{"rituals": ["Bacon after long runs", "No pace shaming"], "values": ["Joy", "Community"]}'::jsonb,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert test users (development only)
INSERT INTO profiles (id, email, full_name, expression_data)
VALUES
  (
    'test-user-uuid-here',
    'test@runexpression.com',
    'Test Runner',
    '{"bio": "Testing the platform", "why_i_run": "For the community"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
```

### Best Practices

- Use `ON CONFLICT DO NOTHING` for idempotent seeds
- Only seed development data locally (never in production)
- Use `gen_random_uuid()` for new UUIDs
- Validate JSONB structure matches expected schema

---

## Type Generation

### Generate TypeScript Types

After schema changes, regenerate types:
```bash
npm run db:types
# or
npx supabase gen types typescript --project-id <project-id> > types/database.types.ts
```

### Using Generated Types

```typescript
import type { Database } from '@/types/database.types'

type FlowPost = Database['public']['Tables']['expression_events']['Row']

const { data } = await supabase
  .from('expression_events')
  .select('*')
  .returns<FlowPost[]>()
```

---

## Common Patterns

### Junction Tables (Many-to-Many)

```sql
CREATE TABLE public.club_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    role text CHECK (role IN ('admin', 'coach', 'member')) DEFAULT 'member',
    joined_at timestamptz DEFAULT now() NOT NULL,
    
    -- Prevent duplicates
    UNIQUE(user_id, club_id)
);

-- Index both foreign keys
CREATE INDEX idx_club_memberships_user_id ON club_memberships(user_id);
CREATE INDEX idx_club_memberships_club_id ON club_memberships(club_id);
```

### Updated_at Trigger

```sql
-- Function (create once)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to table
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

### Soft Deletes

```sql
-- Add is_active flag
ALTER TABLE profiles ADD COLUMN is_active boolean DEFAULT true NOT NULL;

-- Filter in queries
SELECT * FROM profiles WHERE is_active = true;

-- Filter in RLS policies
CREATE POLICY "Active profiles viewable"
ON profiles FOR SELECT
USING (is_active = true);
```

---

## Schema Evolution Checklist

When adding a new feature requiring database changes:

- [ ] Design table structure (relational vs JSONB decision)
- [ ] Create migration file with timestamp
- [ ] Define table with standard columns (id, timestamps, is_active)
- [ ] Add foreign keys with proper CASCADE behavior
- [ ] Enable RLS and create policies
- [ ] Create indexes (foreign keys + frequently queried columns)
- [ ] Test migration locally (`npm run db:push`)
- [ ] Generate TypeScript types (`npm run db:types`)
- [ ] Update application code to use new schema
- [ ] Commit migration + types together

---

## References

- **Database Conventions:** `docs/08-DATABASE-CONVENTIONS.md` (detailed naming, patterns, examples)
- **Data Schema:** `docs/06-DATA-SCHEMA.md` (complete schema documentation)
- **Hybrid Schema ADR:** `docs/adr/004-hybrid-schema.md` (rationale for JSONB approach)
- **Existing Migrations:** `supabase/migrations/` (reference implementations)


## Related ADRs

- [ADR-004: Hybrid Relational + JSONB Schema](../../docs/adr/004-hybrid-schema.md) - We will use a **Hybrid Relational + JSONB schema** in PostgreSQL:

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
profiles. expression_data JSONB  -- {bio, why_i_run, preferences}
clubs. manifesto JSONB           -- {rituals, branding, traditions}
expression_events.
