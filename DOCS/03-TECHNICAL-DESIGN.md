# RunExpression V1 - Technical Design Specification

**Version:** 1.0
**Last Updated:** December 2025
**Owner:** Engineering Team

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Data Models & Database Schema](#data-models--database-schema)
4. [API Design](#api-design)
5. [Authentication & Authorization](#authentication--authorization)
6. [File Storage & Media Handling](#file-storage--media-handling)
7. [Real-Time Features](#real-time-features)
8. [Third-Party Integrations](#third-party-integrations)
9. [Frontend Architecture](#frontend-architecture)
10. [Performance Optimization](#performance-optimization)
11. [Security Considerations](#security-considerations)
12. [Deployment & Infrastructure](#deployment--infrastructure)
13. [Monitoring & Observability](#monitoring--observability)

---

## System Architecture

### Overview: The Pragmatic Monolith

RunExpression V1 is built as a **single Next.js application** (pragmatic monolith) to:
- Reduce operational complexity and deployment overhead
- Share authentication and user context across all features
- Enable rapid iteration without microservice coordination
- Minimize cost on generous free tiers (Vercel, Supabase)
- Provide clear migration path to AI Coach integration

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER DEVICES                        │
│          (Desktop, Mobile, Tablet Browsers)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                      │
│             (CDN, SSL, DDoS Protection)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 NEXT.JS 14+ APPLICATION                     │
│                   (App Router, RSC)                         │
│  ┌──────────────┬──────────────┬────────────────────────┐  │
│  │   PUBLIC     │     FLOW     │    CLUBHOUSE (Auth)    │  │
│  │  (Homepage,  │   (Canvas)   │   (Members Only)       │  │
│  │   Library)   │              │                        │  │
│  └──────────────┴──────────────┴────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API ROUTES (/app/api/*)                 │  │
│  │  - Auth callbacks      - Moderation queue            │  │
│  │  - Webhooks (Stripe)   - File upload handlers        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────┬────────────────────────┘
             │                      │
             ▼                      ▼
┌──────────────────────┐  ┌─────────────────────────────────┐
│   SUPABASE BACKEND   │  │   THIRD-PARTY SERVICES         │
│                      │  │                                 │
│  - PostgreSQL DB     │  │  - OpenAI Moderation API       │
│  - Auth (JWT)        │  │  - Stripe (Payments)           │
│  - Storage (S3-like) │  │  - Analytics (GA4/Amplitude)   │
│  - Realtime (WS)     │  │  - Email (ConvertKit?)         │
└──────────────────────┘  └─────────────────────────────────┘
```

### Component Communication Patterns

**Server-Side Rendering (SSR):**
- Homepage, blog posts, clubhouse pages (SEO-optimized)
- Rendered on Vercel Edge, cached aggressively

**Client-Side Rendering (CSR):**
- Interactive components (Flow canvas, upload forms)
- Real-time updates (new Flow entries, clubhouse notifications)

**API Routes (Server-Side):**
- Auth callbacks from Supabase
- Webhook handlers (Stripe payment confirmation)
- Moderation queue operations
- File upload initiation (presigned URLs)

**Direct Supabase Client Calls:**
- Read operations (fetch Flow entries, clubhouse content)
- Realtime subscriptions (new Flow entries appear live)
- File uploads (presigned URLs to Supabase Storage)

---

## Technology Stack

### Core Stack Rationale

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| **Frontend Framework** | Next.js | 14.2+ | Best-in-class React framework; App Router for modern patterns; SSR/SSG for SEO; Vercel deployment synergy |
| **Language** | TypeScript | 5.3+ | Type safety reduces bugs; excellent DX with autocomplete; industry standard |
| **UI Framework** | React | 18.2+ | Component composition; rich ecosystem; team familiarity |
| **Styling** | Tailwind CSS | 3.4+ | Rapid development; utility-first; easy theming; small bundle size |
| **UI Components** | Shadcn/UI | Latest | Accessible, customizable components; copy-paste ownership; built on Radix UI |
| **Animation** | Framer Motion | 11+ | Smooth scroll-triggered reveals; declarative API; performant |
| **Backend-as-a-Service** | Supabase | Latest | PostgreSQL + Auth + Storage + Realtime in one platform; generous free tier; AI Coach will share same DB |
| **Database** | PostgreSQL | 15+ (via Supabase) | Relational + JSONB flexibility; industry standard; strong querying |
| **Auth** | Supabase Auth | Latest | JWT-based; email/password + OAuth; Row Level Security (RLS) support |
| **Storage** | Supabase Storage | Latest | S3-compatible; presigned URLs; image optimization; same platform as DB |
| **Content** | MDX | 3.0+ (next-mdx-remote) | Markdown + React components; version-controlled content; flexible |
| **Payments** | Stripe | Latest | Industry standard; Checkout hosted pages; good DX; webhooks |
| **Deployment** | Vercel | Latest | Zero-config Next.js deployment; edge network; preview deployments |
| **Monitoring** | Sentry | Latest | Error tracking; performance monitoring; release tracking |

### Additional Libraries

**Production Dependencies:**
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",

    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",

    "tailwindcss": "^3.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",

    "framer-motion": "^11.0.0",

    "next-mdx-remote": "^5.0.0",
    "@mdx-js/react": "^3.0.0",

    "stripe": "^14.0.0",

    "lucide-react": "^0.400.0",
    "date-fns": "^3.0.0",

    "compressorjs": "^1.2.1",
    "react-masonry-css": "^1.0.16",

    "fabric": "^5.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",

    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.0.0",

    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",

    "@sentry/nextjs": "^8.0.0"
  }
}
```

---

## Data Models & Database Schema

### Philosophy: Hybrid Relational + JSONB

**Core Principles:**
- **Structured data** (users, clubs, events) uses relational tables for integrity
- **Flexible attributes** (vibe tags, metadata, preferences) use JSONB columns for evolution
- **AI-ready design** captures context for future personalization
- **Row Level Security (RLS)** enforces access control at database level

See **[06-DATA-SCHEMA.md](./06-DATA-SCHEMA.md)** for complete schema definitions.

### High-Level Entity Relationship Diagram

```
┌─────────────┐
│   profiles  │  (1) ──────────── (*) club_memberships
└──────┬──────┘                           │
       │                                  │
       │ (1)                              │ (*)
       │                          ┌───────▼────────┐
       │                          │     clubs      │
       │                          └────────────────┘
       │
       ├── (1) ────────── (*) expression_events (The Flow)
       │
       ├── (1) ────────── (*) club_contributions (Clubhouse)
       │
       ├── (1) ────────── (*) ai_coach_waitlist
       │
       └── (1) ────────── (*) orders (Shop)


┌──────────────────┐
│    products      │
└────────┬─────────┘
         │ (*)
         │
         ▼ (*)
   ┌───────────────┐
   │ product_       │
   │ variants       │
   └────────────────┘


┌──────────────────┐
│  content_library │  (Blog/Library)
│  (MDX-backed or  │
│   DB-stored)     │
└──────────────────┘
```

### Key Tables Summary

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User identity & preferences | id, email, full_name, expression_data (JSONB) |
| `clubs` | Running clubs (DWTC, etc.) | id, name, slug, manifesto (JSONB) |
| `club_memberships` | Link users to clubs with roles | user_id, club_id, role (admin/coach/member) |
| `expression_events` | Flow canvas submissions | id, user_id, type, content, vibe_tags, metadata (JSONB) |
| `club_contributions` | Clubhouse uploads | id, club_id, user_id, type, title, body, media_url, tags |
| `products` | Shop items | id, stripe_price_id, name, description, type (physical/digital) |
| `product_variants` | SKUs for physical products | id, product_id, external_variant_id, size, color, price |
| `orders` | Purchase records | id, user_id, stripe_session_id, status, items (JSONB) |
| `ai_coach_waitlist` | Email capture for AI Coach | id, email, why_running, coach_expectations, source |
| `content_library` | Blog posts (optional DB) | id, title, slug, mdx_body, author_id, published_at |

---

## API Design

### API Architecture

RunExpression uses a **hybrid approach**:
- **Supabase Client SDK** for most read/write operations (leverages RLS)
- **Next.js API Routes** for server-side logic (webhooks, moderation, complex operations)
- **Supabase Edge Functions** (future) for real-time AI moderation or notifications

### Supabase Client Operations

**Client-Side (Browser):**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server-Side (App Router):**
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### Next.js API Routes

#### Authentication Callback
**Route:** `app/api/auth/callback/route.ts`

**Purpose:** Handle Supabase auth redirects (email confirmation, OAuth)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, request.url))
}
```

---

#### Flow Submission (with OpenAI Moderation)
**Route:** `app/api/flow/submit/route.ts`

**Purpose:** Create Flow entry with AI moderation check

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const { content, vibe_tags, type, media_url } = body

  // 1. OpenAI Moderation Check
  const moderation = await openai.moderations.create({
    input: content || ''
  })

  if (moderation.results[0].flagged) {
    return NextResponse.json(
      { error: 'Content flagged by moderation' },
      { status: 400 }
    )
  }

  // 2. Trust Scoring
  let moderation_status = 'pending'
  if (user) {
    const { count } = await supabase
      .from('expression_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('moderation_status', 'approved')

    if (count && count >= 3) {
      moderation_status = 'approved'
    }
  }

  // 3. Create Entry
  const { data, error } = await supabase
    .from('expression_events')
    .insert({
      user_id: user?.id || null,
      type,
      content,
      media_url,
      vibe_tags,
      moderation_status,
      visibility: moderation_status === 'approved' ? 'public' : 'pending'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, moderation_status })
}
```

---

#### Stripe Webhook Handler
**Route:** `app/api/webhooks/stripe/route.ts`

**Purpose:** Handle Stripe events (payment confirmation, unlock digital products)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = createClient()

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      // Record order in database
      await supabase.from('orders').insert({
        stripe_session_id: session.id,
        user_id: session.metadata?.user_id || null,
        status: 'paid',
        items: session.metadata?.items ? JSON.parse(session.metadata.items) : []
      })

      // If digital product, send download link via email
      // (implementation depends on email provider)

      break

    // Handle other event types as needed
  }

  return NextResponse.json({ received: true })
}
```

---

#### Clubhouse Upload Handler
**Route:** `app/api/clubhouse/upload/route.ts`

**Purpose:** Generate presigned URL for file upload to Supabase Storage

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check club membership
  const { data: membership } = await supabase
    .from('club_memberships')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return NextResponse.json({ error: 'Not a club member' }, { status: 403 })
  }

  const { fileName, fileType, clubSlug } = await request.json()

  // Generate unique file path
  const filePath = `clubhouse/${clubSlug}/${Date.now()}-${fileName}`

  // Create presigned URL for upload (Supabase handles this natively)
  const { data, error } = await supabase.storage
    .from('uploads')
    .createSignedUploadUrl(filePath)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    filePath: data.path
  })
}
```

---

### Supabase Row Level Security (RLS) Policies

RLS policies enforce access control at the database level, making the application more secure and reducing server-side logic.

**Example: `expression_events` (Flow) Policies**

```sql
-- Public read for approved entries
CREATE POLICY "Public can view approved expressions"
ON expression_events
FOR SELECT
USING (visibility = 'public' AND moderation_status = 'approved');

-- Users can view their own entries regardless of status
CREATE POLICY "Users can view own expressions"
ON expression_events
FOR SELECT
USING (auth.uid() = user_id);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can create expressions"
ON expression_events
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own pending entries
CREATE POLICY "Users can update own pending expressions"
ON expression_events
FOR UPDATE
USING (auth.uid() = user_id AND moderation_status = 'pending');
```

**Example: `club_contributions` (Clubhouse) Policies**

```sql
-- Only club members can view contributions
CREATE POLICY "Club members can view contributions"
ON club_contributions
FOR SELECT
USING (
  club_id IN (
    SELECT club_id FROM club_memberships
    WHERE user_id = auth.uid()
  )
  OR visibility = 'public'
);

-- Club members can insert
CREATE POLICY "Club members can create contributions"
ON club_contributions
FOR INSERT
WITH CHECK (
  club_id IN (
    SELECT club_id FROM club_memberships
    WHERE user_id = auth.uid()
  )
);

-- Admins can update (moderate)
CREATE POLICY "Admins can moderate contributions"
ON club_contributions
FOR UPDATE
USING (
  club_id IN (
    SELECT club_id FROM club_memberships
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

---

## Authentication & Authorization

### Supabase Auth Flow

**Sign Up:**
1. User submits email/password via signup form
2. Client calls `supabase.auth.signUp({ email, password })`
3. Supabase creates `auth.users` record (hashed password)
4. Supabase sends verification email
5. User clicks link → redirected to `/api/auth/callback?code=xxx`
6. Session established, user redirected to app

**Log In:**
1. User submits email/password via login form
2. Client calls `supabase.auth.signInWithPassword({ email, password })`
3. Supabase returns JWT session
4. Session stored in cookies (handled by @supabase/ssr)
5. User redirected to intended destination

**Session Management:**
- JWT tokens stored in HTTP-only cookies (via Supabase SSR)
- Tokens auto-refresh before expiry
- Middleware checks auth status on protected routes

### Protected Routes (Middleware)

**File:** `middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/club', '/profile', '/dashboard']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/club/:path*', '/profile', '/dashboard']
}
```

### Role-Based Access Control (RBAC)

**Roles:**
- `public` - No account (can view public content, submit to Flow anonymously)
- `user` - Registered account (can save Flow entries, view profile)
- `member` - Club member (can access clubhouse, upload content)
- `admin` - Club admin (can moderate, feature content)

**Implementation:**
- Stored in `club_memberships.role` field
- Enforced via RLS policies on database
- Checked in API routes for sensitive operations
- React components conditionally render based on role

**Example: Check Admin Role**
```typescript
// Server component
import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('club_memberships')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'admin') {
    return <div>Forbidden: Admin access required</div>
  }

  // Render admin interface
  return <AdminDashboard />
}
```

---

## File Storage & Media Handling

### Supabase Storage Architecture

**Buckets:**
- `uploads` - General file uploads (Flow images, clubhouse content)
- `products` - Product images for shop
- `avatars` - User profile pictures (V1.1)

**File Paths:**
```
uploads/
  flow/
    2025/
      12/
        {timestamp}-{userId}-{filename}.jpg
  clubhouse/
    dwtc/
      media/
        {timestamp}-{filename}.jpg
      documents/
        {timestamp}-{filename}.pdf
```

### Upload Flow

**Client-Side (React Component):**
```typescript
// components/upload/ImageUpload.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Compressor from 'compressorjs'

export function ImageUpload({ onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    // 1. Compress image client-side
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 1920,
      success: async (compressedFile) => {
        // 2. Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`
        const filePath = `flow/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`

        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(filePath, compressedFile)

        if (error) {
          console.error('Upload failed:', error)
          setUploading(false)
          return
        }

        // 3. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath)

        onUploadComplete(publicUrl)
        setUploading(false)
      },
      error: (err) => {
        console.error('Compression failed:', err)
        setUploading(false)
      }
    })
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  )
}
```

### Storage Policies (RLS for Storage)

```sql
-- Anyone can read public uploads
CREATE POLICY "Public uploads are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads'
  AND auth.role() = 'authenticated'
);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Real-Time Features

### Supabase Realtime for The Flow

**Purpose:** New approved Flow entries appear on the wall without page refresh

**Client-Side Subscription:**
```typescript
// components/flow/FlowWall.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function FlowWall() {
  const [expressions, setExpressions] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    fetchExpressions()

    // Subscribe to new inserts
    const channel = supabase
      .channel('flow-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expression_events',
          filter: 'moderation_status=eq.approved'
        },
        (payload) => {
          setExpressions((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchExpressions() {
    const { data } = await supabase
      .from('expression_events')
      .select('*')
      .eq('moderation_status', 'approved')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(50)

    setExpressions(data || [])
  }

  return (
    <div className="masonry-grid">
      {expressions.map((expr) => (
        <ExpressionCard key={expr.id} expression={expr} />
      ))}
    </div>
  )
}
```

**Database Setup:**
```sql
-- Enable Realtime for expression_events table
ALTER TABLE expression_events REPLICA IDENTITY FULL;

-- Publish changes
ALTER PUBLICATION supabase_realtime ADD TABLE expression_events;
```

---

## Third-Party Integrations

### OpenAI Moderation API

**Purpose:** Automated content moderation for Flow submissions

**Implementation:** See API route example above

**Configuration:**
```bash
# .env.local
OPENAI_API_KEY=sk-proj-...
```

**Rate Limits:**
- Free tier: Sufficient for V1 (thousands of requests/month)
- Response time: <500ms typically

---

### Stripe Integration

**Setup:**
1. Create Stripe account
2. Create products and prices in Stripe Dashboard
3. Store `price_id` in `products` table
4. Generate webhook secret for signature verification

**Checkout Flow:**
```typescript
// app/shop/[slug]/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server'
import { CheckoutButton } from '@/components/shop/CheckoutButton'

export default async function ProductPage({ params }: Props) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <CheckoutButton priceId={product.stripe_price_id} />
    </div>
  )
}
```

```typescript
// components/shop/CheckoutButton.tsx (Client Component)
'use client'

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutButton({ priceId }: { priceId: string }) {
  const handleCheckout = async () => {
    const stripe = await stripePromise

    // Create checkout session via API route
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    })

    const { sessionId } = await response.json()

    // Redirect to Stripe Checkout
    await stripe.redirectToCheckout({ sessionId })
  }

  return <button onClick={handleCheckout}>Buy Now</button>
}
```

**Webhook Handling:** See API route example above

---

### Analytics (GA4 or Amplitude)

**Implementation:**
```typescript
// lib/analytics.ts
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}
```

**Usage:**
```typescript
import { trackEvent } from '@/lib/analytics'

trackEvent('flow_submit', {
  type: 'text',
  vibe_tags: ['Meditative', 'Morning Miles']
})
```

**Events to Track:** See Product Requirements doc for full list

---

## Frontend Architecture

### Project Structure

```
runexpression/
├── app/
│   ├── (public)/           # Route group (no auth required)
│   │   ├── page.tsx        # Homepage
│   │   ├── about/
│   │   └── library/        # Blog
│   ├── (flow)/             # Route group (Flow features)
│   │   └── flow/
│   │       └── page.tsx    # Canvas entry page
│   ├── (app)/              # Route group (authenticated)
│   │   ├── club/
│   │   │   └── [slug]/     # Dynamic clubhouse routes
│   │   │       ├── page.tsx
│   │   │       ├── lore/
│   │   │       ├── media/
│   │   │       └── upload/
│   │   ├── profile/
│   │   └── dashboard/
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   ├── flow/
│   │   │   └── submit/
│   │   ├── clubhouse/
│   │   │   └── upload/
│   │   └── webhooks/
│   │       └── stripe/
│   ├── shop/
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── login/
│   ├── signup/
│   ├── layout.tsx          # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                 # Shadcn components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── manifesto/          # Homepage scroll sections
│   │   ├── Hero.tsx
│   │   ├── Chapter.tsx
│   │   └── FlowPreview.tsx
│   ├── flow/               # Flow canvas components
│   │   ├── FlowWall.tsx
│   │   ├── SubmissionForm.tsx
│   │   └── ExpressionCard.tsx
│   ├── clubhouse/          # Clubhouse components
│   │   ├── Overview.tsx
│   │   ├── LoreCard.tsx
│   │   ├── MediaGrid.tsx
│   │   └── UploadPortal.tsx
│   └── shared/             # Reusable components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── stripe.ts
│   ├── analytics.ts
│   ├── utils.ts
│   └── constants.ts        # Vibe tags, config
│
├── types/
│   ├── database.types.ts   # Supabase generated types
│   └── index.ts
│
├── public/
│   ├── stickers/           # For V1.1 sticker studio
│   └── images/
│
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Component Patterns

**Server Components (Default):**
- Use for initial page renders, SEO-critical content
- Fetch data directly from Supabase (server client)
- No useState, useEffect, or event handlers

**Client Components ("use client"):**
- Use for interactivity (forms, animations, real-time)
- Handle user events, maintain state
- Subscribe to Realtime updates

**Example: Mixing Server and Client**
```typescript
// app/flow/page.tsx (Server Component)
import { FlowWall } from '@/components/flow/FlowWall'
import { SubmissionForm } from '@/components/flow/SubmissionForm'

export default function FlowPage() {
  return (
    <div>
      <h1>The Flow</h1>
      <SubmissionForm />  {/* Client Component */}
      <FlowWall />         {/* Client Component with Realtime */}
    </div>
  )
}
```

---

## Performance Optimization

### Image Optimization

**Next.js Image Component:**
```typescript
import Image from 'next/image'

<Image
  src={expression.media_url}
  alt={expression.content}
  width={600}
  height={400}
  loading="lazy"
  placeholder="blur"
/>
```

**Supabase Image Transformation:**
```typescript
const optimizedUrl = supabase.storage
  .from('uploads')
  .getPublicUrl(filePath, {
    transform: {
      width: 600,
      height: 400,
      format: 'webp',
      quality: 80
    }
  }).data.publicUrl
```

### Code Splitting

**Dynamic Imports:**
```typescript
// For heavy libraries (Fabric.js, Stripe)
const FabricEditor = dynamic(() => import('@/components/sticker-studio/FabricEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})
```

### Caching Strategy

**Static Pages (ISR):**
```typescript
// app/library/[slug]/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function BlogPost({ params }: Props) {
  // Page is statically generated, cached by Vercel CDN
  const post = await getPost(params.slug)
  return <Article post={post} />
}
```

**API Route Caching:**
```typescript
export const dynamic = 'force-static' // Cache API route response
export const revalidate = 60 // Revalidate every minute
```

### Bundle Size Monitoring

**next.config.mjs:**
```javascript
const nextConfig = {
  // Analyze bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/components': path.resolve(__dirname, 'components'),
      }
    }
    return config
  },
}
```

**Run:** `npx @next/bundle-analyzer`

---

## Security Considerations

### Content Security Policy (CSP)

**next.config.mjs:**
```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  connect-src 'self' *.supabase.co *.stripe.com;
  frame-src *.stripe.com;
`

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

### Input Sanitization

**MDX Content:**
```typescript
// Use next-mdx-remote with sanitization
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

const mdxSource = await serialize(content, {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSanitize], // Sanitize HTML
  }
})
```

**User Input:**
- All text inputs sanitized before database insert (handled by Supabase parameterized queries)
- HTML entities escaped in React (automatic)
- Never use `dangerouslySetInnerHTML` with user content

### Rate Limiting

**Vercel Edge Middleware:**
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }

  return NextResponse.next()
}
```

### Environment Variables

**Required Secrets:**
```bash
# .env.local (never commit!)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Server-only

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

OPENAI_API_KEY=sk-proj-...

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...  # If using GA4
```

---

## Deployment & Infrastructure

### Vercel Deployment

**Why Vercel:**
- Zero-config Next.js hosting
- Edge network (global CDN)
- Automatic HTTPS
- Preview deployments for every PR
- Generous free tier

**Setup:**
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings (usually auto-detected)

**Build Command:** `next build`
**Output Directory:** `.next`

**Environment Variables:**
- Add all secrets from `.env.local` to Vercel dashboard
- Separate values for Production, Preview, Development

### Supabase Project Setup

**Steps:**
1. Create project at database.new
2. Copy API keys to `.env.local`
3. Run SQL migrations for schema (see 06-DATA-SCHEMA.md)
4. Configure Storage buckets and policies
5. Enable Realtime for required tables
6. Set up authentication providers

### Custom Domain

**Vercel:**
- Add custom domain in project settings
- Configure DNS (A/CNAME records)
- Vercel auto-provisions SSL cert

**Supabase (optional):**
- Use custom domain for API (e.g., `api.runexpression.com`)

### CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://deploy-preview-${{ github.event.number }}.vercel.app
          budgetPath: ./lighthouse-budget.json
```

---

## Monitoring & Observability

### Error Tracking (Sentry)

**Setup:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

**Usage:**
- Automatic error capture for unhandled exceptions
- Manual error capture: `Sentry.captureException(error)`
- Performance monitoring for API routes
- Release tracking for deployments

### Logging

**Server-Side:**
```typescript
// Use structured logging
console.log(JSON.stringify({
  level: 'info',
  message: 'Flow entry created',
  userId: user.id,
  expressionId: data.id,
  timestamp: new Date().toISOString()
}))
```

**Vercel Logs:**
- Access logs via Vercel dashboard
- Filter by function, time range, severity
- Export for long-term storage if needed

### Uptime Monitoring

**Tools:**
- Vercel Analytics (built-in, basic)
- UptimeRobot (free tier)
- Better Uptime (paid, more features)

**Endpoints to Monitor:**
- Homepage: `https://runexpression.com`
- API health: `https://runexpression.com/api/health` (create simple route)
- Supabase: Use Supabase dashboard metrics

### Performance Monitoring

**Core Web Vitals:**
- Tracked via Vercel Analytics or GA4
- Monitor: LCP, FID, CLS
- Set alerts for regressions

**Database Performance:**
- Monitor slow queries in Supabase dashboard
- Add indexes as needed (see 06-DATA-SCHEMA.md)
- Query performance logging (Supabase built-in)

---

## Appendix: Development Workflow

### Local Development Setup

```bash
# 1. Clone repo
git clone https://github.com/brock-run/runexpression.git
cd runexpression

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase/Stripe keys

# 4. Run Supabase locally (optional)
npx supabase init
npx supabase start

# 5. Run migrations
npx supabase db push

# 6. Start dev server
npm run dev

# 7. Open browser
# http://localhost:3000
```

### Type Generation

**Generate TypeScript types from Supabase schema:**
```bash
npx supabase gen types typescript --project-id [your-project-id] > types/database.types.ts
```

### Testing Strategy

**Unit Tests (Jest + React Testing Library):**
```bash
npm run test
```

**E2E Tests (Playwright):**
```bash
npm run test:e2e
```

**Manual QA Checklist:**
- See 05-IMPLEMENTATION-PLAN.md for phase-specific checklists

---

## Document Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-14 | 1.0 | Initial technical design | Engineering Team |

---

**Next:** Review [04-BRAND-CONTENT-GUIDE.md](./04-BRAND-CONTENT-GUIDE.md) for voice, tone, and content strategy.
