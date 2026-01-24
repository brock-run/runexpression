# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RunExpression is a Next.js 14+ (App Router) platform for "Expressive Runners" - where running is creative expression, community connection, and personal transformation. Built with TypeScript, Supabase (PostgreSQL + Auth + Storage + Realtime), Tailwind CSS, and Shadcn/UI.

## Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run db:types     # Generate TypeScript types from Supabase schema
npm run db:push      # Push migrations to Supabase
npm run test         # Jest in watch mode
npm run test:ci      # Jest once (CI mode)
```

## Architecture

### App Router Structure
- `app/(public)/` - Public routes (no auth required)
- `app/(flow)/` - Flow canvas routes
- `app/(app)/` - Authenticated routes
- `app/api/` - API routes
- `app/club/[slug]/` - Dynamic clubhouse routes (lore, media, upload, resources)

### Key Directories
- `components/ui/` - Shadcn/UI components (Button, Card, Dialog, etc.)
- `components/` - Feature components organized by domain (auth, home, clubhouse, flow)
- `lib/supabase/` - Three clients: `client.ts` (browser), `server.ts` (SSR), `admin.ts` (service role bypass)
- `lib/constants.ts` - Single source of truth for vibe tags, limits, pagination values
- `types/` - TypeScript types (auto-generated from Supabase schema)
- `supabase/migrations/` - SQL migrations (versioned)

### Supabase Client Usage
```typescript
// Server Component or API Route
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()

// Client Component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// API Route with RLS bypass (service role)
import { createAdminClient } from '@/lib/supabase/admin'
const supabase = createAdminClient()
```

### Environment Variables
Validated at runtime via `env.ts` with Zod schemas. Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-safe)
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID` (server-only)

## Conventions

### TypeScript
- Explicit types always, never use `any` (use `unknown` if truly unknown)
- Match database column naming: snake_case (`full_name`, not `fullName`)
- Use Zod for validation schemas

### React
- **Server Components by default** - only add `'use client'` for interactivity
- Component files: kebab-case (`flow-post-card.tsx`)
- Component names: PascalCase (`FlowPostCard`)
- Event handlers: `handle` prefix (`handleSubmit`, `handleInputChange`)

### Database
- Tables: plural, snake_case (`expression_events`, `club_memberships`)
- Primary keys: always `id` (uuid)
- Foreign keys: `{table_singular}_id` (`user_id`, `club_id`)
- JSONB for flexible attributes (`expression_data`, `metadata`)
- RLS enabled on all tables - security is enforced at database level

### Styling
- Tailwind CSS with CSS variables for theming
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Brand colors: `run-black`, `run-white`, `run-gray-*`
- Custom animations: `animate-fade-in`, `animate-slide-up`

### Git Commits
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, chore, build, ci
Example: feat(clubhouse): add story upload
```

## Key Patterns

### Adding a Shadcn Component
```bash
npx shadcn-ui@latest add component-name
```

### API Route Pattern
```typescript
// app/api/example/route.ts
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const { data, error } = await supabase.from('table').insert({ ...result.data })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}
```

### Database Migration
1. Create file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Write SQL changes
3. Test: `npm run db:push`
4. Generate types: `npm run db:types`
5. Commit both migration and types file

## Documentation Reference

- **Product requirements**: `DOCS/02-PRODUCT-REQUIREMENTS.md`
- **Technical design**: `DOCS/03-TECHNICAL-DESIGN.md`
- **Brand voice**: `DOCS/04-BRAND-CONTENT-GUIDE.md`
- **Database schema**: `DOCS/06-DATA-SCHEMA.md`
- **Coding standards**: `DOCS/07-CODING-STANDARDS.md`
- **ADRs**: `docs/adr/` (architectural decisions: why Next.js, Supabase, monolith, etc.)
- **AI Agent Guide**: `AI-AGENT-GUIDE.md` (auto-generated, comprehensive reference)
