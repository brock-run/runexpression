# RunExpression

**Where runners express themselves through motion, community, and creative flow.**

RunExpression is a Next.js application built to celebrate the expressive side of running. It combines:

- **The Flow**: A living canvas where runners share their experiences
- **The Clubhouse**: Private spaces for running clubs to build lore and community
- **The Shop**: Thoughtfully designed products for expressive runners
- **AI Coach**: Future personalized coaching powered by your unique running expression

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router, React Server Components)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS + Shadcn/UI
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments**: Stripe
- **AI**: OpenAI (moderation)
- **Deployment**: Vercel
- **Monitoring**: Sentry

---

## Prerequisites

- Node.js 20+ and npm 10+
- Supabase account ([database.new](https://database.new))
- Stripe account (for shop features)
- OpenAI API key (for moderation)

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/brock-run/runexpression.git
cd runexpression
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_ID=your-project-id

# Stripe (optional for V1 development)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI (optional for V1 development)
OPENAI_API_KEY=sk-proj-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

Run migrations on your Supabase project:

```bash
# Option 1: Using npx (recommended)
npx supabase db push

# Option 2: Manual via Supabase SQL Editor
# Copy and run each migration file from supabase/migrations/ in order
```

Optional: Seed with sample data

```bash
# Connect to your Supabase project and run:
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/seed/01_seed_data.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
runexpression/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public routes (no auth)
│   ├── (flow)/              # Flow canvas routes
│   ├── (app)/               # Authenticated app routes
│   ├── api/                 # API routes
│   ├── login/               # Auth pages
│   ├── signup/
│   ├── shop/
│   └── layout.tsx
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── auth/                # Authentication components
│   ├── flow/                # Flow-specific components
│   ├── clubhouse/           # Clubhouse components
│   └── shared/              # Reusable components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── utils.ts             # Utility functions
│   └── constants.ts         # App constants
├── types/                   # TypeScript types
├── supabase/
│   ├── migrations/          # SQL migrations
│   └── seed/                # Seed data
├── public/                  # Static assets
└── DOCS/                    # Project documentation
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run db:types     # Generate TypeScript types from Supabase
npm run db:push      # Push migrations to Supabase
```

---

## Development Workflow

### Code Quality

Pre-commit hooks automatically run:

- **ESLint** for code quality
- **Prettier** for formatting
- **Type checking** via TypeScript

Commit message format (enforced):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, chore, build, ci
Example: feat(auth): add login functionality
```

### Database Migrations

When changing database schema:

1. Create new migration file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Write SQL for schema changes
3. Test locally: `npx supabase db push`
4. Commit migration file
5. Migration runs automatically in production (via Vercel + Supabase)

### Testing (Coming Soon)

```bash
npm run test        # Run tests in watch mode
npm run test:ci     # Run tests once (for CI)
```

---

## Architecture Highlights

### Type-Safe Environment Variables

Using `@t3-oss/env-nextjs` + Zod for runtime validation:

```typescript
import { env } from '@/env'

// ✅ Type-safe and validated
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
```

### Supabase Client Usage

**Browser (Client Components)**:

```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

**Server (Server Components / API Routes)**:

```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()
```

**Admin (Bypass RLS - API Routes Only)**:

```typescript
import { createAdminClient } from '@/lib/supabase/admin'
const supabase = createAdminClient()
```

### Row Level Security (RLS)

All database tables use RLS policies for security. See `supabase/migrations/` for policy definitions.

---

## Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy! Vercel auto-deploys on push to `main`

**Environment Variables Required**:

- All from `.env.example`
- Add `SKIP_ENV_VALIDATION=false` for production

### Supabase

- Migrations run automatically via Supabase CLI or manually via SQL Editor
- Set up Storage buckets: `uploads`, `products`
- Enable Realtime on `expression_events` table

---

## Documentation

- **[DOCS/](./DOCS/)**: Comprehensive V1 documentation
  - [01-OVERVIEW.md](./DOCS/01-OVERVIEW.md)
  - [02-PRODUCT-REQUIREMENTS.md](./DOCS/02-PRODUCT-REQUIREMENTS.md)
  - [03-TECHNICAL-DESIGN.md](./DOCS/03-TECHNICAL-DESIGN.md)
  - [04-BRAND-CONTENT-GUIDE.md](./DOCS/04-BRAND-CONTENT-GUIDE.md)
  - [05-IMPLEMENTATION-PLAN.md](./DOCS/05-IMPLEMENTATION-PLAN.md)
  - [06-DATA-SCHEMA.md](./DOCS/06-DATA-SCHEMA.md)
  - [07-CODING-STANDARDS.md](./DOCS/07-CODING-STANDARDS.md)
- **[docs/adr/](./docs/adr/)**: Architecture Decision Records
- **[AI-AGENT-GUIDE.md](./AI-AGENT-GUIDE.md)**: Guide for AI agents working on this project

---

## Contributing

See [DOCS/10-GIT-WORKFLOW.md](./DOCS/10-GIT-WORKFLOW.md) and [DOCS/07-CODING-STANDARDS.md](./DOCS/07-CODING-STANDARDS.md) for contribution guidelines.

---

## License

See [LICENSE](./LICENSE) file.

---

## Support

Questions? Issues? Open a GitHub issue or contact the team.

---

**Built with ❤️ for runners who feel things.**
