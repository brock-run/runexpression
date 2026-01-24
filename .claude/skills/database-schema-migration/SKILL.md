---
name: database-schema-migration
description: Use when adding new features requiring database changes, optimizing query performance, creating seed data for development/testing, or planning schema evolution with hybrid relational + JSONB patterns
---

# Database Schema & Migration

## Core Principles

**Hybrid Schema:** Relational tables for core entities (users, clubs) with foreign keys + JSONB for flexible attributes (metadata, preferences) + Arrays for simple lists (vibe_tags) + RLS enabled on all tables.

**When to use:**
- ✅ **Relational**: Always-present data, foreign keys, frequently queried, strict types
- ✅ **JSONB**: Optional attributes, evolving structure, sparse data, unstructured metadata

## Table Design Patterns

**Naming:** Tables = plural snake_case, Columns = snake_case, Foreign keys = `{table_singular}_id`

```sql
CREATE TABLE public.example_table (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL,
    status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    tags text[] DEFAULT ARRAY[]::TEXT[],
    metadata jsonb DEFAULT '{}'::jsonb
);
```

## JSONB Column Patterns

**Always provide default:** `metadata jsonb DEFAULT '{}'::jsonb`

**Structure Examples:**
```sql
-- Profile expression_data
{"bio": "Ultra runner", "why_i_run": "To find clarity", "preferences": {"units": "miles"}}

-- Club manifesto
{"tagline": "Where lore lives", "values": ["Community", "Process"], "rituals": ["Bacon after runs"]}
```

**Querying JSONB:**
```typescript
// Extract text value
const { data } = await supabase
  .from('profiles')
  .select('id, expression_data->>bio')
  .eq('expression_data->>why_i_run', 'To find clarity')

// Access nested
.select('expression_data->preferences->>units')
```

## Migration Writing

**File Naming:** `YYYYMMDDHHMMSS_description.sql`

```sql
-- Migration Structure
CREATE TABLE public.new_table (...);

-- Enable RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view approved items"
    ON public.new_table FOR SELECT
    USING (is_public = true);

-- Indexes (always index foreign keys)
CREATE INDEX idx_new_table_user_id ON public.new_table(user_id);
CREATE INDEX idx_new_table_created_at ON public.new_table(created_at DESC);

-- DOWN Migration (commented)
-- DROP INDEX idx_new_table_created_at;
-- DROP TABLE public.new_table;
```

**Migration Workflow:**
1. Create file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Write SQL changes
3. Test: `npm run db:push`
4. Generate types: `npm run db:types`
5. Commit both migration and types

## Index Optimization

**Always index foreign keys:**
```sql
CREATE INDEX idx_expression_events_user_id ON expression_events(user_id);
```

**Frequently queried columns:**
```sql
CREATE INDEX idx_expression_events_moderation_status ON expression_events(moderation_status);
CREATE INDEX idx_expression_events_created_at ON expression_events(created_at DESC);
```

**Composite indexes:**
```sql
CREATE INDEX idx_expression_events_status_visibility ON expression_events(moderation_status, visibility);
```

**JSONB fields (if frequently queried):**
```sql
CREATE INDEX idx_profiles_units ON profiles ((expression_data->'preferences'->>'units'));
```

## Row Level Security (RLS)

**Enable on all tables:** `ALTER TABLE public.table ENABLE ROW LEVEL SECURITY;`

**Common patterns:**
```sql
-- Public read, authenticated write
CREATE POLICY "Public can view approved posts"
ON expression_events FOR SELECT
USING (moderation_status = 'approved' AND visibility = 'public');

-- User owns data
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Members-only
CREATE POLICY "Club members can view contributions"
ON club_contributions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM club_memberships
    WHERE user_id = auth.uid() AND club_id = club_contributions.club_id
  )
);
```

## Seed Data

```sql
-- supabase/seed/01_seed_data.sql
INSERT INTO clubs (id, name, slug, description, manifesto)
VALUES (
  gen_random_uuid(),
  'Damn We''re The Champions',
  'dwtc',
  'A running club that believes in bacon, joy, and interdependence.',
  '{"rituals": ["Bacon after runs"], "values": ["Joy", "Community"]}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
```

Use `ON CONFLICT DO NOTHING` for idempotent seeds.

## Type Generation

```bash
npm run db:types
# Generates types/database.types.ts
```

**Using types:**
```typescript
import type { Database } from '@/types/database.types'
type FlowPost = Database['public']['Tables']['expression_events']['Row']
```

## Common Patterns

**Junction Tables (Many-to-Many):**
```sql
CREATE TABLE public.club_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    role text CHECK (role IN ('admin', 'coach', 'member')) DEFAULT 'member',
    joined_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(user_id, club_id)
);
```

**Updated_at Trigger:**
```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
```

## Schema Evolution Checklist

- [ ] Design table structure (relational vs JSONB)
- [ ] Create migration file with timestamp
- [ ] Define table with standard columns
- [ ] Add foreign keys with CASCADE behavior
- [ ] Enable RLS and create policies
- [ ] Create indexes (foreign keys + frequently queried)
- [ ] Test: `npm run db:push`
- [ ] Generate types: `npm run db:types`
- [ ] Commit migration + types together

## References

- **Database Conventions:** `docs/08-DATABASE-CONVENTIONS.md`
- **Data Schema:** `docs/06-DATA-SCHEMA.md`
- **Hybrid Schema ADR:** `docs/adr/004-hybrid-schema.md`
- **Existing Migrations:** `supabase/migrations/`
