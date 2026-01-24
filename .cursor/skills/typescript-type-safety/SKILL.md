---
name: typescript-type-safety
description: Ensures type safety across the codebase, generates types from Supabase schema, and maintains strict TypeScript standards. Use when adding new features requiring type definitions, refactoring for better type safety, generating database types after schema changes, debugging type errors, or working with JSONB, unions, generics, or type-safe API routes.
---

# TypeScript & Type Safety

## Core Principles

**Strict Type Safety**: Never use `any`. Use `unknown` if truly unknown. Always define explicit types for public functions. Match database column naming (snake_case).

## Type Generation from Supabase

### Regenerating Database Types

After schema changes, regenerate types:

```bash
npm run db:types
```

This runs: `npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > types/database.types.ts`

**When to regenerate:**
- After creating new tables
- After adding/modifying columns
- After creating new enums
- After schema migrations

### Using Generated Types

```typescript
import { Database } from '@/types/database.types'

// Type-safe table queries
type ExpressionEvent = Database['public']['Tables']['expression_events']['Row']
type ExpressionEventInsert = Database['public']['Tables']['expression_events']['Insert']
type ExpressionEventUpdate = Database['public']['Tables']['expression_events']['Update']

// In queries
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .returns<ExpressionEvent[]>()
```

## Type Standards

### Explicit Return Types

Always define return types for public functions:

```typescript
// ✅ Good
export async function getExpressionEvents(
  limit: number = 20
): Promise<ExpressionEvent[]> {
  // ...
}

// ❌ Bad
export async function getExpressionEvents(limit: number = 20) {
  // ...
}
```

### No `any` Types

```typescript
// ✅ Good - use unknown if truly unknown
function processData(data: unknown): string {
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

// ❌ Bad
function processData(data: any): string {
  return data
}
```

### Optional Chaining & Nullish Coalescing

```typescript
// ✅ Good
const userName = user?.full_name ?? 'Anonymous'
const email = profile?.email ?? null

// ❌ Bad
const userName = user ? user.full_name : 'Anonymous'
```

## Complex Type Definitions

### JSONB Types

For flexible JSONB columns, define specific types:

```typescript
// types/expression-data.ts
export interface ExpressionData {
  vibe_tags?: string[]
  mood?: 'energetic' | 'contemplative' | 'peaceful'
  weather?: {
    condition: string
    temperature?: number
  }
  metadata?: Record<string, unknown>
}

// Usage with database types
type ExpressionEvent = Database['public']['Tables']['expression_events']['Row'] & {
  expression_data: ExpressionData
}
```

### Union Types

Use discriminated unions for type-safe state:

```typescript
type ModerationStatus = 
  | { status: 'pending'; reviewed_at: null }
  | { status: 'approved'; reviewed_at: string; reviewed_by: string }
  | { status: 'rejected'; reviewed_at: string; reviewed_by: string; reason: string }

function handleModeration(item: ModerationStatus) {
  if (item.status === 'approved') {
    // TypeScript knows item.reviewed_at is string here
    console.log(item.reviewed_at)
  }
}
```

### Generic Types

Use generics for reusable utilities:

```typescript
// lib/utils/pagination.ts
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export async function paginateQuery<T>(
  query: PostgrestQueryBuilder<any, any, any>,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<T>> {
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  const { data, count } = await query
    .select('*', { count: 'exact' })
    .range(from, to)
    .returns<T[]>()
  
  return {
    data: data ?? [],
    page,
    limit,
    total: count ?? 0,
    hasMore: (count ?? 0) > to + 1
  }
}
```

## Type-Safe API Route Handlers

### Next.js API Routes

```typescript
// app/api/expression-events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { ExpressionEventInsert } from '@/types/database.types'

const createSchema = z.object({
  content: z.string().min(5).max(500),
  expression_data: z.object({
    vibe_tags: z.array(z.string()).max(5).optional(),
    mood: z.enum(['energetic', 'contemplative', 'peaceful']).optional()
  }).optional()
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const validated = createSchema.parse(body)
    
    const supabase = createClient()
    const { data, error } = await supabase
      .from('expression_events')
      .insert(validated as ExpressionEventInsert)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Type-Safe Error Responses

```typescript
// types/api.ts
export interface ApiError {
  error: string
  details?: unknown
  code?: string
}

export interface ApiSuccess<T> {
  data: T
  meta?: Record<string, unknown>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// Helper function
export function isApiError<T>(
  response: ApiResponse<T>
): response is ApiError {
  return 'error' in response
}
```

## Type Inference Optimization

### Let TypeScript Infer When Appropriate

```typescript
// ✅ Good - TypeScript infers the array type
const vibeTags = ['energetic', 'peaceful', 'contemplative']

// ✅ Good - Explicit when needed for function parameters
function filterByTags(tags: string[]): ExpressionEvent[] {
  // ...
}

// ❌ Avoid - Unnecessary type annotation
const vibeTags: string[] = ['energetic', 'peaceful', 'contemplative']
```

### Use `as const` for Literal Types

```typescript
// ✅ Good - Type is readonly tuple
const STATUSES = ['pending', 'approved', 'rejected'] as const
type Status = typeof STATUSES[number] // 'pending' | 'approved' | 'rejected'

// ❌ Bad - Type is string[]
const STATUSES = ['pending', 'approved', 'rejected']
```

### Utility Types

Leverage TypeScript utility types:

```typescript
// Pick specific fields
type ExpressionEventSummary = Pick<ExpressionEvent, 'id' | 'content' | 'created_at'>

// Omit sensitive fields
type PublicProfile = Omit<User, 'email' | 'stripe_customer_id'>

// Partial for updates
type ExpressionEventUpdate = Partial<Pick<ExpressionEvent, 'content' | 'expression_data'>>

// Required for strict types
type RequiredFields = Required<Pick<ExpressionEvent, 'content' | 'user_id'>>
```

## Database Column Naming

**Match Supabase schema (snake_case):**

```typescript
// ✅ Good - matches database
interface User {
  id: string
  full_name: string
  created_at: string
  updated_at: string
}

// ❌ Bad - camelCase doesn't match database
interface User {
  id: string
  fullName: string
  createdAt: string
  updatedAt: string
}
```

## Type Checking Workflow

### Before Committing

```bash
npm run type-check
```

This runs `tsc --noEmit` to check types without building.

### Common Type Errors & Fixes

**Error: Property 'x' does not exist on type 'y'**
- Check if type is correct (may need to regenerate from Supabase)
- Verify optional chaining: `obj?.property`
- Check if union type needs narrowing

**Error: Type 'string' is not assignable to type 'number'**
- Use type assertion only when necessary: `value as number`
- Better: Fix the source type or add validation

**Error: Object is possibly 'null' or 'undefined'**
- Use nullish coalescing: `value ?? defaultValue`
- Use optional chaining: `obj?.property`
- Add type guard: `if (obj) { ... }`

## Integration with Zod

Use Zod schemas for runtime validation, TypeScript for compile-time:

```typescript
import { z } from 'zod'

// Define schema
const expressionSchema = z.object({
  content: z.string().min(5).max(500),
  vibe_tags: z.array(z.string()).max(5).optional()
})

// Infer TypeScript type from schema
type ExpressionInput = z.infer<typeof expressionSchema>

// Use in API route
const validated = expressionSchema.parse(body) // Runtime validation
// validated is typed as ExpressionInput
```

## Best Practices Checklist

When working with types:

- [ ] Regenerate database types after schema changes
- [ ] Use explicit return types for public functions
- [ ] Never use `any` (use `unknown` if needed)
- [ ] Match database column naming (snake_case)
- [ ] Use optional chaining and nullish coalescing
- [ ] Define JSONB types explicitly
- [ ] Use discriminated unions for state
- [ ] Validate with Zod, type with TypeScript
- [ ] Run `npm run type-check` before committing
- [ ] Prefer type inference for simple cases
- [ ] Use `as const` for literal types
