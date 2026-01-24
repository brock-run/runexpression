---
name: nextjs-app-router-specialist
description: Use when setting up new routes and layouts, optimizing page performance, implementing SSR/SSG strategies, debugging Next.js-specific issues, or making Server/Client Component decisions for Next.js 14+ App Router
---

# Next.js App Router Specialist

## Core Principle

**Server Components First**: Default to Server Components. Only use Client Components (`'use client'`) when interactivity is required.

## Server vs Client Decision

### Use Server Components (Default)

- Initial page renders, SEO-critical content
- Data fetching from Supabase (`@/lib/supabase/server`)
- Static content, layouts
- No `useState`, `useEffect`, event handlers

```typescript
// ✅ Server Component (default)
import { createClient } from '@/lib/supabase/server'

export default async function FlowPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('expression_events')
    .select('*')
    .eq('moderation_status', 'approved')

  return <FlowWall posts={posts} />
}
```

### Use Client Components

Only when you need:
- Interactive forms (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)
- Framer Motion animations
- Supabase Realtime subscriptions

```typescript
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function FlowSubmitForm() {
  const [content, setContent] = useState('')
  // ...
}
```

## Route Groups

Use `(name)` to organize routes without affecting URL structure:

```
app/
  (public)/          # No auth
    page.tsx         # → /
    login/page.tsx   # → /login
  (app)/             # Authenticated
    club/[slug]/page.tsx  # → /club/[slug]
  api/               # API routes
```

## API Route Best Practices

```typescript
// app/api/flow/submit/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // Process...

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Image Optimization

Always use `next/image`:

```typescript
import Image from 'next/image'

// Static image
<Image
  src="/images/hero.jpg"
  alt="Expressive runner"
  width={1200}
  height={600}
  priority // Above-the-fold
/>

// Dynamic from Supabase
<Image
  src={imageUrl}
  alt="User image"
  width={800}
  height={600}
  unoptimized // If external or requires auth
/>
```

## Dynamic Imports

For heavy components (Framer Motion, Fabric.js):

```typescript
import dynamic from 'next/dynamic'

const CanvasEditor = dynamic(
  () => import('@/components/sticker-studio/canvas-editor'),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
)
```

## Middleware (Auth)

```typescript
// middleware.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

**SSR (Default):** Dynamic content
**SSG:** Use `generateStaticParams` for static pages
**ISR:** Use `revalidate` for semi-static content

```typescript
// Static generation
export async function generateStaticParams() {
  const supabase = createClient()
  const { data: clubs } = await supabase.from('clubs').select('slug')
  return clubs?.map((club) => ({ slug: club.slug })) ?? []
}

// ISR
export const revalidate = 3600 // Revalidate every hour
```

## Query Optimization

```typescript
// ✅ Good - selective, paginated
const { data } = await supabase
  .from('expression_events')
  .select('id, content, created_at, user_id')
  .eq('moderation_status', 'approved')
  .order('created_at', { ascending: false })
  .range(0, 19) // First 20 items

// ❌ Bad
const { data } = await supabase.from('expression_events').select('*')
```

## Common Patterns

**Metadata Export:**
```typescript
export const metadata = {
  title: 'The Flow | RunExpression',
  description: 'Share your running expressions'
}
```

**Loading States:**
```typescript
// app/flow/loading.tsx
export default function Loading() {
  return <div>Loading flow...</div>
}
```

**Error Boundaries:**
```typescript
// app/flow/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Debugging Tips

1. Check component type (Server vs Client mismatch)
2. Verify imports (correct Supabase client)
3. Inspect network (API route responses)
4. Check middleware (route protection logic)
5. Bundle analysis (`@next/bundle-analyzer`)

## Project Conventions

- **File naming**: kebab-case (`flow-wall.tsx`)
- **Component naming**: PascalCase (`FlowWall`)
- **Route groups**: `(public)`, `(app)`
- **TypeScript**: Explicit types, no `any`, match database naming (snake_case)
