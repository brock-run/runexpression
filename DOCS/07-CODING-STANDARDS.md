# RunExpression V1: Coding Standards

**Last Updated:** 2025-12-14
**Maintainer:** Engineering Team
**Status:** Living Document

---

## Overview

This document defines coding standards for RunExpression V1. All code (TypeScript, React, CSS) should follow these conventions to ensure consistency, maintainability, and scalability.

**Goals:**
- **Consistency:** Code looks like it was written by one person
- **Readability:** New developers can understand code quickly
- **Maintainability:** Easy to modify without breaking things
- **Performance:** Follow patterns that optimize bundle size and runtime
- **Type Safety:** Leverage TypeScript to catch bugs at compile time

---

## 1. TypeScript Standards

### 1.1 Type Definitions

**Always define types explicitly:**
```typescript
// ✅ Good
interface FlowPost {
  id: string
  user_id: string | null
  type: 'text' | 'image' | 'drawing'
  content: string | null
  media_url: string | null
  vibe_tags: string[]
  created_at: string
}

// ❌ Bad (using `any`)
interface FlowPost {
  id: any
  content: any
  vibe_tags: any
}
```

**Use `unknown` instead of `any` when type is truly unknown:**
```typescript
// ✅ Good
function parseJSON(json: string): unknown {
  return JSON.parse(json)
}

// ❌ Bad
function parseJSON(json: string): any {
  return JSON.parse(json)
}
```

**Prefer interfaces over type aliases for object shapes:**
```typescript
// ✅ Good
interface User {
  id: string
  email: string
}

// ❌ Avoid (use interfaces for objects)
type User = {
  id: string
  email: string
}
```

**Use type aliases for unions and primitives:**
```typescript
// ✅ Good
type PostType = 'text' | 'image' | 'drawing'
type UUID = string
```

### 1.2 Null Handling

**Use optional chaining and nullish coalescing:**
```typescript
// ✅ Good
const userName = user?.full_name ?? 'Anonymous'
const postCount = user?.expression_data?.post_count ?? 0

// ❌ Bad
const userName = user && user.full_name ? user.full_name : 'Anonymous'
```

**Explicitly handle null in database queries:**
```typescript
// ✅ Good
const { data, error } = await supabase
  .from('profiles')
  .select('full_name')
  .eq('id', userId)
  .maybeSingle()  // Returns null if not found (not error)

if (!data) {
  return { error: 'User not found' }
}
```

### 1.3 Function Signatures

**Use explicit return types for public functions:**
```typescript
// ✅ Good
export async function submitToFlow(content: string): Promise<{ data: FlowPost | null; error: string | null }> {
  // ...
}

// ❌ Bad (no return type)
export async function submitToFlow(content: string) {
  // ...
}
```

**Use `void` for functions with no return:**
```typescript
// ✅ Good
function logAnalytics(event: string): void {
  console.log(event)
}
```

---

## 2. React Standards

### 2.1 Server Components vs Client Components

**Default to Server Components:**
```tsx
// ✅ Good (Server Component by default)
// app/flow/page.tsx
import { FlowWall } from '@/components/flow/flow-wall'

export default async function FlowPage() {
  const { data: posts } = await supabase
    .from('expression_events')
    .select('*')
    .eq('moderation_status', 'approved')

  return <FlowWall posts={posts} />
}
```

**Use Client Components only when needed:**
```tsx
// ✅ Good (Client Component for interactivity)
// components/flow/flow-submit-form.tsx
'use client'

import { useState } from 'react'

export function FlowSubmitForm() {
  const [content, setContent] = useState('')
  // Form logic...
}
```

**When to use `'use client'`:**
- Interactive forms (useState, useEffect)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Framer Motion animations
- Real-time subscriptions (Supabase Realtime)

### 2.2 Component Structure

**File naming:**
```
components/
  flow/
    flow-wall.tsx          # Component: FlowWall
    flow-submit-form.tsx   # Component: FlowSubmitForm
    flow-post-card.tsx     # Component: FlowPostCard
```

**Component naming:**
```tsx
// ✅ Good (PascalCase for components)
export function FlowPostCard({ post }: { post: FlowPost }) {
  return <div>...</div>
}

// ❌ Bad (camelCase)
export function flowPostCard({ post }) {
  return <div>...</div>
}
```

**Props interface naming:**
```tsx
// ✅ Good
interface FlowPostCardProps {
  post: FlowPost
  onLike?: () => void
}

export function FlowPostCard({ post, onLike }: FlowPostCardProps) {
  // ...
}
```

### 2.3 Hooks

**Custom hooks start with `use`:**
```tsx
// ✅ Good
export function useFlowSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (content: string) => {
    setIsSubmitting(true)
    // ...
  }

  return { submit, isSubmitting }
}
```

**Place hooks at top of component:**
```tsx
// ✅ Good
export function FlowSubmitForm() {
  const [content, setContent] = useState('')
  const { submit, isSubmitting } = useFlowSubmit()
  const router = useRouter()

  // Component logic...
}

// ❌ Bad (hooks after conditional)
export function FlowSubmitForm() {
  if (someCondition) return null

  const [content, setContent] = useState('')  // ❌ Hooks after return
}
```

### 2.4 Event Handlers

**Name handlers with `handle` prefix:**
```tsx
// ✅ Good
function FlowSubmitForm() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // ...
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  return <form onSubmit={handleSubmit}>...</form>
}

// ❌ Bad (unclear naming)
function FlowSubmitForm() {
  const onSubmit = async (e) => { /* ... */ }
  const changeInput = (e) => { /* ... */ }
}
```

---

## 3. File Organization

### 3.1 Folder Structure

```
/app/
  (public)/           # Public routes (no auth required)
    page.tsx          # Homepage
    about/
    blog/
  (flow)/             # Flow routes
    flow/
      page.tsx        # Flow wall
      submit/
  (app)/              # Authenticated app routes
    dashboard/
    clubhouse/
  api/                # API routes
    flow/
      submit/
        route.ts

/components/
  ui/                 # Shadcn/UI components
    button.tsx
    dialog.tsx
  flow/               # Flow-specific components
    flow-wall.tsx
    flow-post-card.tsx
  clubhouse/          # Clubhouse-specific components
  shared/             # Shared across features
    header.tsx
    footer.tsx

/lib/
  supabase/           # Supabase client and utilities
    client.ts
    server.ts
  utils/              # Utility functions
    date.ts
    format.ts
  types/              # Shared TypeScript types
    database.ts
    flow.ts
```

### 3.2 Import Ordering

**Order imports by category:**
```tsx
// 1. React and Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libraries
import { motion } from 'framer-motion'
import { toast } from 'sonner'

// 3. Internal modules (using @ alias)
import { Button } from '@/components/ui/button'
import { FlowPostCard } from '@/components/flow/flow-post-card'
import { createClient } from '@/lib/supabase/client'
import type { FlowPost } from '@/lib/types/flow'

// 4. Relative imports (avoid if possible)
import { formatDate } from './utils'

// 5. Styles (if any)
import './styles.css'
```

**Use path aliases:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

```tsx
// ✅ Good
import { Button } from '@/components/ui/button'

// ❌ Bad
import { Button } from '../../../components/ui/button'
```

---

## 4. Naming Conventions

### 4.1 Files and Folders

```
kebab-case for files:     flow-post-card.tsx
kebab-case for folders:   /clubhouse/upload-portal/
PascalCase for components: FlowPostCard
```

### 4.2 Variables and Functions

```typescript
// camelCase for variables
const userName = 'Brock'
const postCount = 42

// camelCase for functions
function calculatePace(distance: number, time: number): number {
  return time / distance
}

// PascalCase for React components
export function FlowWall() { /* ... */ }

// UPPER_SNAKE_CASE for constants
const MAX_POST_LENGTH = 500
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
```

### 4.3 Database Naming (Match Supabase Schema)

```typescript
// ✅ Good (matches database columns)
interface Profile {
  id: string
  full_name: string
  membership_tier: string
  created_at: string
}

// ❌ Bad (doesn't match database)
interface Profile {
  id: string
  fullName: string  // Database uses full_name
  membershipTier: string
  createdAt: string
}
```

---

## 5. Error Handling

### 5.1 API Routes

**Always return structured errors:**
```typescript
// ✅ Good
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Process request
    const { data, error } = await supabase
      .from('expression_events')
      .insert({ content: body.content })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Flow submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 5.2 Client-Side Error Handling

**Use toast notifications for user-facing errors:**
```tsx
// ✅ Good
async function handleSubmit() {
  try {
    const response = await fetch('/api/flow/submit', {
      method: 'POST',
      body: JSON.stringify({ content })
    })

    const result = await response.json()

    if (!response.ok) {
      toast.error(result.error || 'Something went wrong')
      return
    }

    toast.success('Your run was captured in The Flow')

  } catch (error) {
    console.error('Submit error:', error)
    toast.error('Failed to submit. Please try again.')
  }
}
```

### 5.3 Logging

**Use structured logging:**
```typescript
// ✅ Good
console.error('Flow submission failed:', {
  userId: user.id,
  error: error.message,
  timestamp: new Date().toISOString()
})

// ❌ Bad
console.log('error')
```

**Use Sentry for production errors:**
```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // ...
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, action: 'flow-submit' }
  })
}
```

---

## 6. Performance

### 6.1 Bundle Size

**Dynamic imports for heavy components:**
```tsx
// ✅ Good (Framer Motion only loaded when needed)
import dynamic from 'next/dynamic'

const AnimatedManifesto = dynamic(
  () => import('@/components/homepage/animated-manifesto'),
  { ssr: false }
)
```

**Use next/image for all images:**
```tsx
// ✅ Good
import Image from 'next/image'

<Image
  src="/hero-runner.jpg"
  alt="Runner on trail"
  width={1920}
  height={1080}
  priority
/>

// ❌ Bad
<img src="/hero-runner.jpg" alt="Runner on trail" />
```

### 6.2 Database Queries

**Select only needed columns:**
```typescript
// ✅ Good
const { data } = await supabase
  .from('expression_events')
  .select('id, content, created_at')
  .limit(20)

// ❌ Bad (selects all columns)
const { data } = await supabase
  .from('expression_events')
  .select('*')
```

**Use pagination:**
```typescript
// ✅ Good
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .range(0, 19)  // First 20 posts
```

---

## 7. Testing

### 7.1 Unit Tests (Vitest)

**Test file naming:**
```
flow-submit.ts        → flow-submit.test.ts
format-date.ts        → format-date.test.ts
```

**Test structure:**
```typescript
import { describe, it, expect } from 'vitest'
import { formatPace } from './format-pace'

describe('formatPace', () => {
  it('should format pace correctly', () => {
    const result = formatPace(600, 2)  // 10 min/mile
    expect(result).toBe('10:00')
  })

  it('should handle edge cases', () => {
    expect(formatPace(0, 0)).toBe('0:00')
  })
})
```

### 7.2 Component Tests (React Testing Library)

```tsx
import { render, screen } from '@testing-library/react'
import { FlowPostCard } from './flow-post-card'

describe('FlowPostCard', () => {
  it('should render post content', () => {
    const post = {
      id: '1',
      content: 'Great run today!',
      created_at: '2025-12-14T10:00:00Z'
    }

    render(<FlowPostCard post={post} />)
    expect(screen.getByText('Great run today!')).toBeInTheDocument()
  })
})
```

---

## 8. Code Formatting

### 8.1 Prettier Configuration

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 8.2 ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

---

## 9. Comments and Documentation

### 9.1 When to Comment

**Comment complex logic:**
```typescript
// ✅ Good
// Trust scoring: Auto-approve users with 3+ approved posts
if (approvedPostCount >= 3) {
  moderationStatus = 'approved'
}
```

**Don't comment obvious code:**
```typescript
// ❌ Bad
// Set the content to the input value
setContent(e.target.value)
```

### 9.2 JSDoc for Public APIs

```typescript
/**
 * Submits content to The Flow with automatic moderation.
 *
 * @param content - The text or image URL to submit
 * @param vibeTags - Optional vibe tags (e.g., ['grateful', 'strong'])
 * @returns Promise resolving to the created post or error
 */
export async function submitToFlow(
  content: string,
  vibeTags?: string[]
): Promise<{ data: FlowPost | null; error: string | null }> {
  // ...
}
```

---

## 10. Security

### 10.1 Environment Variables

**Never commit secrets:**
```env
# ✅ Good (.env.local - gitignored)
SUPABASE_SERVICE_ROLE_KEY=secret_key_here
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...

# .env.example (committed)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

**Use `NEXT_PUBLIC_` prefix for client-side env vars:**
```typescript
// ✅ Good (accessible in browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// ❌ Bad (server-only, will be undefined in browser)
const supabaseUrl = process.env.SUPABASE_URL
```

### 10.2 Input Validation

**Always validate user input:**
```typescript
// ✅ Good
import { z } from 'zod'

const FlowSubmitSchema = z.object({
  content: z.string().min(1).max(500),
  vibeTags: z.array(z.string()).max(5).optional()
})

export async function POST(request: Request) {
  const body = await request.json()

  // Validate input
  const result = FlowSubmitSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 400 }
    )
  }

  // ...
}
```

---

## Change Log

| Date       | Changes                                      | Author           |
|------------|----------------------------------------------|------------------|
| 2025-12-14 | Initial coding standards document created    | Engineering Team |

---

## References

- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/
- **React Documentation:** https://react.dev/
- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Supabase Client Library:** https://supabase.com/docs/reference/javascript/
- **Related Docs:** [03-TECHNICAL-DESIGN.md](./03-TECHNICAL-DESIGN.md), [08-DATABASE-CONVENTIONS.md](./08-DATABASE-CONVENTIONS.md)
