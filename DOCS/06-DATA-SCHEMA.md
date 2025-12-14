# RunExpression V1 - Database Schema

**Version:** 1.0
**Last Updated:** December 2025
**Owner:** Engineering Team

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Table Definitions](#table-definitions)
3. [Relationships & Foreign Keys](#relationships--foreign-keys)
4. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
5. [Indexes](#indexes)
6. [Seed Data](#seed-data)
7. [Migrations](#migrations)

---

## Schema Overview

### Design Philosophy

**Hybrid Relational + JSONB Model:**
- **Core entities** (users, clubs, events) use relational tables for data integrity
- **Flexible attributes** (vibe tags, metadata, preferences) use JSONB columns for schema evolution
- **AI-ready design** captures structured and unstructured data for future personalization

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       User & Authentication                      │
└─────────────────────────────────────────────────────────────────┘

auth.users (managed by Supabase)
    ↓ (1:1)
profiles (extends auth.users)
    ↓ (1:*)
club_memberships ←──(*)──→ clubs
    ↓ (1:*)
    │
    ├──→ expression_events (The Flow)
    ├──→ club_contributions (Clubhouse)
    ├──→ orders (Shop)
    └──→ ai_coach_waitlist

┌─────────────────────────────────────────────────────────────────┐
│                         E-Commerce                               │
└─────────────────────────────────────────────────────────────────┘

products
    ↓ (1:*)
product_variants

orders
    ↓ (JSONB reference)
products

┌─────────────────────────────────────────────────────────────────┐
│                      Content (Optional)                          │
└─────────────────────────────────────────────────────────────────┘

content_library (if using DB for blog; MDX files are alternative)
```

---

## Table Definitions

---

## 1. `profiles`

**Purpose:** Extended user profile beyond Supabase Auth's `auth.users`

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `REFERENCES auth.users(id) ON DELETE CASCADE` | User ID (same as auth.users) |
| `email` | `text` | `NOT NULL` | User email (duplicated from auth for convenience) |
| `full_name` | `text` | | User's full name |
| `avatar_url` | `text` | | URL to avatar image (Supabase Storage or Gravatar) |
| `expression_data` | `jsonb` | `DEFAULT '{}'::jsonb` | Flexible user attributes (bio, preferences, etc.) |
| `membership_tier` | `text` | `CHECK (membership_tier IN ('free', 'premium'))`, `DEFAULT 'free'` | Future: Paid membership tiers |
| `created_at` | `timestamptz` | `DEFAULT now()` | Account creation timestamp |
| `updated_at` | `timestamptz` | `DEFAULT now()` | Last profile update timestamp |

**JSONB Structure (`expression_data`):**
```json
{
  "bio": "Runner, writer, bacon enthusiast",
  "why_i_run": "For clarity and community",
  "preferred_distance": "10k",
  "location": "Dubai",
  "instagram_handle": "@runner",
  "strava_id": "12345",
  "shoe_size": "10.5",
  "injury_history": ["IT band 2023"],
  "philosophies": ["process_over_outcome", "interdependence"],
  "onboarding_completed": true
}
```

**Indexes:**
- `CREATE INDEX idx_profiles_email ON profiles(email);`

**SQL:**
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  expression_data jsonb DEFAULT '{}'::jsonb,
  membership_tier text CHECK (membership_tier IN ('free', 'premium')) DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_email ON profiles(email);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 2. `clubs`

**Purpose:** Running clubs (DWTC, future clubs)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Club ID |
| `name` | `text` | `NOT NULL` | Club name (e.g., "DWest Track Crew") |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | URL-friendly slug (e.g., "dwtc") |
| `description` | `text` | | Club description |
| `manifesto` | `jsonb` | `DEFAULT '{}'::jsonb` | Club-specific branding, rituals, etc. |
| `logo_url` | `text` | | URL to club logo |
| `cover_image_url` | `text` | | URL to cover/hero image |
| `created_at` | `timestamptz` | `DEFAULT now()` | Club creation timestamp |
| `updated_at` | `timestamptz` | `DEFAULT now()` | Last update timestamp |

**JSONB Structure (`manifesto`):**
```json
{
  "tagline": "Where lore lives. Where miles turn into memories.",
  "primary_color": "#ea580c",
  "rituals": ["The Bacon Ritual", "Sub-16 Club"],
  "location": "Dubai",
  "founded_year": 2019,
  "member_count": 42
}
```

**Indexes:**
- `CREATE UNIQUE INDEX idx_clubs_slug ON clubs(slug);`

**SQL:**
```sql
CREATE TABLE clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  manifesto jsonb DEFAULT '{}'::jsonb,
  logo_url text,
  cover_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_clubs_slug ON clubs(slug);

CREATE TRIGGER update_clubs_updated_at
BEFORE UPDATE ON clubs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. `club_memberships`

**Purpose:** Link users to clubs with roles (many-to-many)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `uuid` | `REFERENCES profiles(id) ON DELETE CASCADE` | User ID |
| `club_id` | `uuid` | `REFERENCES clubs(id) ON DELETE CASCADE` | Club ID |
| `role` | `text` | `CHECK (role IN ('admin', 'coach', 'member'))`, `DEFAULT 'member'` | User's role in club |
| `joined_at` | `timestamptz` | `DEFAULT now()` | Membership start date |

**Primary Key:** `(user_id, club_id)` (composite)

**Indexes:**
- `CREATE INDEX idx_club_memberships_user ON club_memberships(user_id);`
- `CREATE INDEX idx_club_memberships_club ON club_memberships(club_id);`

**SQL:**
```sql
CREATE TABLE club_memberships (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  role text CHECK (role IN ('admin', 'coach', 'member')) DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, club_id)
);

CREATE INDEX idx_club_memberships_user ON club_memberships(user_id);
CREATE INDEX idx_club_memberships_club ON club_memberships(club_id);
```

---

## 4. `expression_events` (The Flow)

**Purpose:** User-generated content for The Flow canvas

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Expression ID |
| `user_id` | `uuid` | `REFERENCES profiles(id) ON DELETE SET NULL` | User ID (nullable for anonymous) |
| `type` | `text` | `CHECK (type IN ('text', 'image', 'drawing'))`, `NOT NULL` | Type of expression |
| `content` | `text` | | Text content (for type='text') |
| `media_url` | `text` | | URL to uploaded media (for type='image' or 'drawing') |
| `vibe_tags` | `text[]` | `DEFAULT '{}'` | Array of vibe tags (e.g., ['Meditative', 'Morning Miles']) |
| `metadata` | `jsonb` | `DEFAULT '{}'::jsonb` | Additional metadata (see below) |
| `moderation_status` | `text` | `CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged'))`, `DEFAULT 'pending'` | Moderation status |
| `visibility` | `text` | `CHECK (visibility IN ('public', 'pending', 'hidden'))`, `DEFAULT 'pending'` | Visibility status |
| `created_at` | `timestamptz` | `DEFAULT now()` | Creation timestamp |

**JSONB Structure (`metadata`):**
```json
{
  "mood": "grateful",
  "run_distance": "10k",
  "run_date": "2025-12-14",
  "perceived_effort": 7,
  "ai_moderation_result": {
    "flagged": false,
    "categories": {}
  },
  "source": "web"
}
```

**Indexes:**
- `CREATE INDEX idx_expression_events_user ON expression_events(user_id);`
- `CREATE INDEX idx_expression_events_status ON expression_events(moderation_status, visibility);`
- `CREATE INDEX idx_expression_events_created ON expression_events(created_at DESC);`
- `CREATE INDEX idx_expression_events_vibe_tags ON expression_events USING GIN (vibe_tags);`

**SQL:**
```sql
CREATE TABLE expression_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  type text CHECK (type IN ('text', 'image', 'drawing')) NOT NULL,
  content text,
  media_url text,
  vibe_tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  moderation_status text CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')) DEFAULT 'pending',
  visibility text CHECK (visibility IN ('public', 'pending', 'hidden')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_expression_events_user ON expression_events(user_id);
CREATE INDEX idx_expression_events_status ON expression_events(moderation_status, visibility);
CREATE INDEX idx_expression_events_created ON expression_events(created_at DESC);
CREATE INDEX idx_expression_events_vibe_tags ON expression_events USING GIN (vibe_tags);
```

---

## 5. `club_contributions`

**Purpose:** User-generated content for clubhouse (stories, media, documents)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Contribution ID |
| `club_id` | `uuid` | `REFERENCES clubs(id) ON DELETE CASCADE`, `NOT NULL` | Club ID |
| `user_id` | `uuid` | `REFERENCES profiles(id) ON DELETE SET NULL`, `NOT NULL` | User ID |
| `type` | `text` | `CHECK (type IN ('story', 'media', 'document'))`, `NOT NULL` | Type of contribution |
| `title` | `text` | `NOT NULL` | Title |
| `body` | `text` | | Body content (markdown for stories) |
| `media_url` | `text` | | URL to uploaded media (images, videos) |
| `doc_url` | `text` | | URL to uploaded document (PDFs, GPX) |
| `tags` | `text[]` | `DEFAULT '{}'` | Tags (e.g., ['race', 'time-trial', 'bacon']) |
| `metadata` | `jsonb` | `DEFAULT '{}'::jsonb` | Additional metadata (see below) |
| `moderation_status` | `text` | `CHECK (moderation_status IN ('pending', 'approved', 'rejected'))`, `DEFAULT 'pending'` | Moderation status |
| `visibility` | `text` | `CHECK (visibility IN ('public', 'members_only', 'hidden'))`, `DEFAULT 'members_only'` | Visibility status |
| `created_at` | `timestamptz` | `DEFAULT now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `DEFAULT now()` | Last update timestamp |

**JSONB Structure (`metadata`):**
```json
{
  "event_name": "Dubai Marathon 2025",
  "event_date": "2025-01-15",
  "location": "Dubai",
  "featured": true,
  "attribution_nickname": "Brock",
  "file_size_bytes": 2048000,
  "mime_type": "application/pdf"
}
```

**Indexes:**
- `CREATE INDEX idx_club_contributions_club ON club_contributions(club_id);`
- `CREATE INDEX idx_club_contributions_user ON club_contributions(user_id);`
- `CREATE INDEX idx_club_contributions_type ON club_contributions(type);`
- `CREATE INDEX idx_club_contributions_status ON club_contributions(moderation_status, visibility);`
- `CREATE INDEX idx_club_contributions_tags ON club_contributions USING GIN (tags);`

**SQL:**
```sql
CREATE TABLE club_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  type text CHECK (type IN ('story', 'media', 'document')) NOT NULL,
  title text NOT NULL,
  body text,
  media_url text,
  doc_url text,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  moderation_status text CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  visibility text CHECK (visibility IN ('public', 'members_only', 'hidden')) DEFAULT 'members_only',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_club_contributions_club ON club_contributions(club_id);
CREATE INDEX idx_club_contributions_user ON club_contributions(user_id);
CREATE INDEX idx_club_contributions_type ON club_contributions(type);
CREATE INDEX idx_club_contributions_status ON club_contributions(moderation_status, visibility);
CREATE INDEX idx_club_contributions_tags ON club_contributions USING GIN (tags);

CREATE TRIGGER update_club_contributions_updated_at
BEFORE UPDATE ON club_contributions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 6. `products`

**Purpose:** E-commerce products (physical and digital)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Product ID |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | URL-friendly slug |
| `stripe_price_id` | `text` | `UNIQUE` | Stripe Price ID (e.g., price_...) |
| `name` | `text` | `NOT NULL` | Product name |
| `description` | `text` | | Product description (markdown) |
| `type` | `text` | `CHECK (type IN ('physical', 'digital'))`, `NOT NULL` | Product type |
| `images` | `text[]` | `DEFAULT '{}'` | Array of image URLs |
| `price_cents` | `integer` | `NOT NULL` | Price in cents (e.g., 2500 = $25.00) |
| `active` | `boolean` | `DEFAULT true` | Is product active/available |
| `stock_status` | `text` | `CHECK (stock_status IN ('in_stock', 'out_of_stock', 'preorder', 'digital'))`, `DEFAULT 'in_stock'` | Stock status |
| `metadata` | `jsonb` | `DEFAULT '{}'::jsonb` | Additional metadata |
| `created_at` | `timestamptz` | `DEFAULT now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `DEFAULT now()` | Last update timestamp |

**Indexes:**
- `CREATE UNIQUE INDEX idx_products_slug ON products(slug);`
- `CREATE INDEX idx_products_active ON products(active);`

**SQL:**
```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  stripe_price_id text UNIQUE,
  name text NOT NULL,
  description text,
  type text CHECK (type IN ('physical', 'digital')) NOT NULL,
  images text[] DEFAULT '{}',
  price_cents integer NOT NULL,
  active boolean DEFAULT true,
  stock_status text CHECK (stock_status IN ('in_stock', 'out_of_stock', 'preorder', 'digital')) DEFAULT 'in_stock',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(active);

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 7. `product_variants` (V1.1 - Optional for V1)

**Purpose:** Product variants (size, color) for physical products

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Variant ID |
| `product_id` | `uuid` | `REFERENCES products(id) ON DELETE CASCADE`, `NOT NULL` | Product ID |
| `external_variant_id` | `text` | | External SKU (e.g., Printful variant ID) |
| `size` | `text` | | Size (e.g., "S", "M", "L", "XL") |
| `color` | `text` | | Color |
| `price_cents` | `integer` | `NOT NULL` | Price in cents (may differ from base product) |
| `stock_status` | `boolean` | `DEFAULT true` | In stock or not |
| `created_at` | `timestamptz` | `DEFAULT now()` | Creation timestamp |

**Indexes:**
- `CREATE INDEX idx_product_variants_product ON product_variants(product_id);`

**SQL:**
```sql
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  external_variant_id text,
  size text,
  color text,
  price_cents integer NOT NULL,
  stock_status boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
```

---

## 8. `orders`

**Purpose:** Purchase records

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Order ID |
| `user_id` | `uuid` | `REFERENCES profiles(id) ON DELETE SET NULL` | User ID (nullable for guest checkout) |
| `stripe_session_id` | `text` | `UNIQUE` | Stripe Checkout Session ID |
| `status` | `text` | `CHECK (status IN ('pending', 'paid', 'failed', 'refunded'))`, `DEFAULT 'pending'` | Order status |
| `items` | `jsonb` | `NOT NULL` | Order items (product IDs, quantities, prices) |
| `total_cents` | `integer` | `NOT NULL` | Total order amount in cents |
| `metadata` | `jsonb` | `DEFAULT '{}'::jsonb` | Additional metadata (shipping address, etc.) |
| `created_at` | `timestamptz` | `DEFAULT now()` | Order creation timestamp |
| `updated_at` | `timestamptz` | `DEFAULT now()` | Last update timestamp |

**JSONB Structure (`items`):**
```json
[
  {
    "product_id": "uuid",
    "name": "Runner Greeting Cards",
    "quantity": 1,
    "price_cents": 1500
  }
]
```

**Indexes:**
- `CREATE INDEX idx_orders_user ON orders(user_id);`
- `CREATE UNIQUE INDEX idx_orders_stripe_session ON orders(stripe_session_id);`

**SQL:**
```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_session_id text UNIQUE,
  status text CHECK (status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  items jsonb NOT NULL,
  total_cents integer NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE UNIQUE INDEX idx_orders_stripe_session ON orders(stripe_session_id);

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 9. `ai_coach_waitlist`

**Purpose:** Capture emails and context for AI Coach waitlist

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Waitlist entry ID |
| `email` | `text` | `NOT NULL` | Email address |
| `why_running` | `text` | | "What are you running for?" (optional) |
| `coach_expectations` | `text` | | "What kind of guidance would you want?" (optional) |
| `source` | `text` | | Source page (homepage, flow, clubhouse) |
| `user_id` | `uuid` | `REFERENCES profiles(id) ON DELETE SET NULL` | User ID if logged in |
| `created_at` | `timestamptz` | `DEFAULT now()` | Signup timestamp |

**Indexes:**
- `CREATE INDEX idx_waitlist_email ON ai_coach_waitlist(email);`

**SQL:**
```sql
CREATE TABLE ai_coach_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  why_running text,
  coach_expectations text,
  source text,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_waitlist_email ON ai_coach_waitlist(email);
```

---

## 10. `content_library` (Optional - if using DB for blog)

**Purpose:** Blog posts/articles (alternative to MDX files)

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Post ID |
| `slug` | `text` | `UNIQUE`, `NOT NULL` | URL-friendly slug |
| `title` | `text` | `NOT NULL` | Post title |
| `mdx_body` | `text` | `NOT NULL` | Post content (MDX/Markdown) |
| `excerpt` | `text` | | Short summary (for listings) |
| `cover_image_url` | `text` | | Cover image URL |
| `author_id` | `uuid` | `REFERENCES profiles(id) ON DELETE SET NULL` | Author |
| `tags` | `text[]` | `DEFAULT '{}'` | Tags/categories |
| `published_at` | `timestamptz` | | Publication timestamp (null = draft) |
| `created_at` | `timestamptz` | `DEFAULT now()` | Creation timestamp |
| `updated_at` | `timestamptz` | `DEFAULT now()` | Last update timestamp |

**Indexes:**
- `CREATE UNIQUE INDEX idx_content_slug ON content_library(slug);`
- `CREATE INDEX idx_content_published ON content_library(published_at DESC);`

**SQL:**
```sql
CREATE TABLE content_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  mdx_body text NOT NULL,
  excerpt text,
  cover_image_url text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_content_slug ON content_library(slug);
CREATE INDEX idx_content_published ON content_library(published_at DESC);

CREATE TRIGGER update_content_library_updated_at
BEFORE UPDATE ON content_library
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Relationships & Foreign Keys

### User-Centric Relationships

```
profiles (user)
    ├─→ club_memberships (many) ─→ clubs (many)
    ├─→ expression_events (many)
    ├─→ club_contributions (many)
    ├─→ orders (many)
    └─→ ai_coach_waitlist (one-to-many, usually one)
```

### Club-Centric Relationships

```
clubs
    ├─→ club_memberships (many) ─→ profiles (many users)
    └─→ club_contributions (many)
```

### E-Commerce Relationships

```
products
    ├─→ product_variants (many)
    └─→ orders (via JSONB reference)
```

---

## Row Level Security (RLS) Policies

### Enable RLS on All Tables

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE expression_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_waitlist ENABLE ROW LEVEL SECURITY;
```

---

### Policies for `profiles`

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Public can view basic profile info (for attribution)
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
USING (true);
```

---

### Policies for `clubs`

```sql
-- Anyone can view clubs
CREATE POLICY "Public can view clubs"
ON clubs FOR SELECT
USING (true);

-- Only admins can update clubs (enforce in application logic or custom function)
```

---

### Policies for `club_memberships`

```sql
-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
ON club_memberships FOR SELECT
USING (auth.uid() = user_id);

-- Club members can view all memberships for their clubs
CREATE POLICY "Members can view club memberships"
ON club_memberships FOR SELECT
USING (
  club_id IN (
    SELECT club_id FROM club_memberships
    WHERE user_id = auth.uid()
  )
);
```

---

### Policies for `expression_events`

```sql
-- Public can view approved expressions
CREATE POLICY "Public can view approved expressions"
ON expression_events FOR SELECT
USING (moderation_status = 'approved' AND visibility = 'public');

-- Users can view their own expressions (any status)
CREATE POLICY "Users can view own expressions"
ON expression_events FOR SELECT
USING (auth.uid() = user_id);

-- Authenticated users can insert expressions
CREATE POLICY "Authenticated users can create expressions"
ON expression_events FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own pending expressions
CREATE POLICY "Users can update own pending expressions"
ON expression_events FOR UPDATE
USING (auth.uid() = user_id AND moderation_status = 'pending');

-- Admins can update any expression (moderation)
-- Note: Implement admin check via custom function or application logic
```

---

### Policies for `club_contributions`

```sql
-- Club members can view contributions for their clubs
CREATE POLICY "Members can view club contributions"
ON club_contributions FOR SELECT
USING (
  club_id IN (
    SELECT club_id FROM club_memberships
    WHERE user_id = auth.uid()
  )
  OR visibility = 'public'
);

-- Club members can insert contributions
CREATE POLICY "Members can create contributions"
ON club_contributions FOR INSERT
WITH CHECK (
  club_id IN (
    SELECT club_id FROM club_memberships
    WHERE user_id = auth.uid()
  )
);

-- Admins can update contributions (moderation)
CREATE POLICY "Admins can moderate contributions"
ON club_contributions FOR UPDATE
USING (
  club_id IN (
    SELECT club_id FROM club_memberships
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

---

### Policies for `products`

```sql
-- Public can view active products
CREATE POLICY "Public can view products"
ON products FOR SELECT
USING (active = true);

-- Admins can manage products (implement via service role or admin UI)
```

---

### Policies for `orders`

```sql
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Only server (service role) can insert/update orders
-- No public INSERT policy; use API routes with service role client
```

---

### Policies for `ai_coach_waitlist`

```sql
-- Anyone can insert to waitlist
CREATE POLICY "Anyone can join waitlist"
ON ai_coach_waitlist FOR INSERT
WITH CHECK (true);

-- Users can view their own waitlist entries
CREATE POLICY "Users can view own waitlist entries"
ON ai_coach_waitlist FOR SELECT
USING (auth.uid() = user_id OR email = auth.jwt()->>'email');
```

---

## Indexes

All indexes are defined in the table creation SQL above. Summary:

| Table | Index | Purpose |
|-------|-------|---------|
| `profiles` | `email` | Fast email lookups |
| `clubs` | `slug` (unique) | URL routing |
| `club_memberships` | `user_id`, `club_id` | Join performance |
| `expression_events` | `user_id`, `status`, `created_at`, `vibe_tags` (GIN) | Filtering, sorting, tag queries |
| `club_contributions` | `club_id`, `user_id`, `type`, `status`, `tags` (GIN) | Clubhouse queries |
| `products` | `slug` (unique), `active` | Shop queries |
| `orders` | `user_id`, `stripe_session_id` (unique) | Order lookups |
| `ai_coach_waitlist` | `email` | Duplicate check |
| `content_library` | `slug` (unique), `published_at` | Blog queries |

---

## Seed Data

### Seed Clubs

```sql
INSERT INTO clubs (id, name, slug, description, manifesto, logo_url, cover_image_url)
VALUES (
  gen_random_uuid(),
  'DWest Track Crew',
  'dwtc',
  'Where lore lives. Where miles turn into memories.',
  '{
    "tagline": "Where lore lives. Where miles turn into memories.",
    "primary_color": "#ea580c",
    "rituals": ["The Bacon Ritual", "Sub-16 Club"],
    "location": "Dubai",
    "founded_year": 2019
  }'::jsonb,
  '/images/clubs/dwtc-logo.png',
  '/images/clubs/dwtc-cover.jpg'
);
```

### Seed Products

```sql
-- Physical Product: Runner Greeting Cards
INSERT INTO products (slug, stripe_price_id, name, description, type, images, price_cents, stock_status)
VALUES (
  'runner-greeting-cards',
  'price_...',  -- Replace with actual Stripe Price ID
  'Runner Greeting Cards (Pack of 5)',
  'Five cards for the expressive runner. Send encouragement, not empty platitudes.',
  'physical',
  ARRAY['/images/products/cards-01.jpg', '/images/products/cards-02.jpg'],
  1500,
  'in_stock'
);

-- Digital Product: Expressive Runner Handbook
INSERT INTO products (slug, stripe_price_id, name, description, type, images, price_cents, stock_status)
VALUES (
  'expressive-runner-handbook',
  'price_...',  -- Replace with actual Stripe Price ID
  'The Expressive Runner Handbook (PDF)',
  'A guide to running deeper, not just faster. 50 pages of philosophy and practice.',
  'digital',
  ARRAY['/images/products/handbook-cover.jpg'],
  1000,
  'digital'
);
```

### Seed Admin User

```sql
-- First, create user via Supabase Auth (signup flow)
-- Then, create profile and add to DWTC as admin

-- Assuming user_id from auth.users is known
INSERT INTO profiles (id, email, full_name)
VALUES (
  '[user-id-from-auth]',
  'brock@runexpression.com',
  'Brock'
);

-- Add to DWTC as admin
INSERT INTO club_memberships (user_id, club_id, role)
VALUES (
  '[user-id-from-auth]',
  (SELECT id FROM clubs WHERE slug = 'dwtc'),
  'admin'
);
```

---

## Migrations

### Initial Migration

**File:** `supabase/migrations/20251214000000_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create all tables (copy from sections above)
-- profiles
-- clubs
-- club_memberships
-- expression_events
-- club_contributions
-- products
-- product_variants
-- orders
-- ai_coach_waitlist
-- content_library (optional)

-- Create all indexes
-- (copy from sections above)

-- Enable RLS on all tables
-- (copy from sections above)

-- Create RLS policies
-- (copy from sections above)

-- Seed initial data
-- (copy seed data from above)

-- Enable Realtime for expression_events
ALTER TABLE expression_events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE expression_events;
```

### Running Migrations

**Local (Supabase CLI):**
```bash
npx supabase db push
```

**Production (Supabase Dashboard):**
1. Go to Database → SQL Editor
2. Paste migration SQL
3. Run

---

## Document Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-14 | 1.0 | Initial database schema | Engineering Team |

---

**This completes the database schema documentation. All tables, relationships, policies, and migrations are defined and ready for implementation.**
