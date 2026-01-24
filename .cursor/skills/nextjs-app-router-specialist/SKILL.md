---
name: nextjs-app-router-specialist
description: Deep expertise in Next.js 14+ App Router patterns, Server/Client Components decision-making, route groups, API routes, image optimization, dynamic imports, and middleware patterns. Use when setting up new routes and layouts, optimizing page performance, implementing SSR/SSG strategies, or debugging Next.js-specific issues.
---

# Next.js App Router Specialist

## Core Principle

**Server Components First**: Default to Server Components. Only use Client Components (`'use client'`) when interactivity is required.

## Server vs Client Component Decision

### Use Server Components (Default)

- Initial page renders and SEO-critical content
- Data fetching from Supabase (use `@/lib/supabase/server`)
- Static content and layouts
- No `useState`, `useEffect`, or event handlers

```typescript
// ✅ Server Component (default)
// app/flow/page.tsx
import { createClient } from '@/lib/supabase/server'
import { FlowWall } from '@/components/flow/flow-wall'

export default async function FlowPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('expression_events')
    .select('*')
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })

  return <FlowWall posts={posts} />
}
```

### Use Client Components (`'use client'`)

Only when you need:
- Interactive forms (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`localStorage`, `window`, `document`)
- Framer Motion animations
- Supabase Realtime subscriptions
- Third-party libraries requiring client-side execution

```typescript
// ✅ Client Component (interactivity required)
// components/flow/flow-submit-form.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function FlowSubmitForm() {
  const [content, setContent] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Form submission logic...
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Route Groups and Layout Patterns

### Route Group Organization

Use route groups `(name)` to organize routes without affecting URL structure:

```
app/
  (public)/          # Public routes (no auth)
    page.tsx         # → /
    login/
      page.tsx       # → /login
  (app)/             # Authenticated routes
    club/
      [slug]/
        page.tsx     # → /club/[slug]
  api/               # API routes
    auth/
      callback/
        route.ts     # → /api/auth/callback
```

### Layout Hierarchy

Layouts cascade down the route tree:

```typescript
// app/layout.tsx (root layout)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/club/[slug]/layout.tsx (nested layout)
export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ClubhouseNav />
      {children}
    </div>
  )
}
```

## API Route Best Practices

### Route Handler Structure

```typescript
// app/api/flow/submit/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    // Validation and processing...

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Error Handling

Always return structured errors with appropriate status codes:

```typescript
// ✅ Good
return NextResponse.json(
  { error: 'Validation failed', details: errors },
  { status: 400 }
)

// ❌ Bad
throw new Error('Something went wrong')
```

## Image Optimization

Always use `next/image` for images:

```typescript
import Image from 'next/image'

// ✅ Good
<Image
  src="/images/hero.jpg"
  alt="Expressive runner"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// For dynamic images from Supabase Storage
<Image
  src={imageUrl}
  alt="User uploaded image"
  width={800}
  height={600}
  unoptimized // If external URL or requires auth
/>
```

## Dynamic Imports

Use dynamic imports for heavy components to reduce initial bundle size:

```typescript
// ✅ For heavy components (Framer Motion, Fabric.js)
import dynamic from 'next/dynamic'

const CanvasEditor = dynamic(
  () => import('@/components/sticker-studio/canvas-editor'),
  { 
    ssr: false, // Client-only component
    loading: () => <div>Loading editor...</div>
  }
)

export default function StickerStudioPage() {
  return <CanvasEditor />
}
```

## Middleware Patterns

### Auth Middleware

```typescript
// middleware.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Protect authenticated routes
  if (request.nextUrl.pathname.startsWith('/club') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/club/:path*']
}
```

## Performance Optimization

### SSR/SSG Strategies

- **SSR (Server-Side Rendering)**: Default for dynamic content
- **SSG (Static Site Generation)**: Use `generateStaticParams` for static pages
- **ISR (Incremental Static Regeneration)**: Use `revalidate` for semi-static content

```typescript
// Static generation with dynamic params
export async function generateStaticParams() {
  const supabase = createClient()
  const { data: clubs } = await supabase
    .from('clubs')
    .select('slug')

  return clubs?.map((club) => ({ slug: club.slug })) ?? []
}

// ISR with revalidation
export const revalidate = 3600 // Revalidate every hour
```

### Query Optimization

- Select only needed columns
- Use pagination for large datasets
- Leverage database indexes

```typescript
// ✅ Good (selective, paginated)
const { data } = await supabase
  .from('expression_events')
  .select('id, content, created_at, user_id')
  .eq('moderation_status', 'approved')
  .order('created_at', { ascending: false })
  .range(0, 19) // First 20 items

// ❌ Bad (selects all, no pagination)
const { data } = await supabase
  .from('expression_events')
  .select('*')
```

## Common Patterns

### Supabase Client Usage

```typescript
// Server Component
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()

// Client Component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

### Metadata Export

```typescript
// app/flow/page.tsx
export const metadata = {
  title: 'The Flow | RunExpression',
  description: 'Share your running expressions with the community'
}
```

### Loading and Error States

```typescript
// app/flow/loading.tsx
export default function Loading() {
  return <div>Loading flow...</div>
}

// app/flow/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Debugging Tips

1. **Check component type**: Server vs Client mismatch errors
2. **Verify imports**: Ensure correct Supabase client (`server` vs `client`)
3. **Inspect network**: Check API route responses in DevTools
4. **Check middleware**: Verify route protection logic
5. **Bundle analysis**: Use `@next/bundle-analyzer` for size issues

## Project-Specific Conventions

- **File naming**: kebab-case (`flow-wall.tsx`)
- **Component naming**: PascalCase (`FlowWall`)
- **Route groups**: `(public)`, `(app)` for organization
- **Import order**: React/Next.js → Third-party → Internal (`@/`) → Relative → Styles
- **TypeScript**: Explicit types, no `any`, match database naming (snake_case)


## Related ADRs

- [ADR-001: Adopt Next.js 14+ with App Router](../../docs/adr/001-nextjs-app-router.md) - js 14+ with the App Router** as our frontend framework. ### Key Implementation Details:

- **App Router** (`app/` directory) for modern routing and Server Components
- **Server Components by default** for initial renders and SEO
- **Client Components** (`"use client"`) for interactivity
- **Route Groups** to organize pages by access level: `(public)`, `(flow)`, `(app)`
- **TypeScript** throughout for type safety
- **Deployed on Vercel** for zero-config hosting.
