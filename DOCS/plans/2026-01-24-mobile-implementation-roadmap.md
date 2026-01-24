# Mobile Implementation Roadmap: RUN-21, RUN-6, RUN-7, RUN-8

> **For Mobile Claude Code:** This document provides explicit, step-by-step instructions for implementing the next phase of RunExpression. Follow each section sequentially. Mobile Claude Code has limitations, so this plan is extra explicit.

**Created:** 2026-01-24
**Owner:** Brock Butler
**Target Features:** Middleware/Auth, Homepage, Flow Canvas, DWTC Clubhouse

---

## Table of Contents

1. [Prerequisites Check](#prerequisites-check)
2. [Dependency Analysis](#dependency-analysis)
3. [Implementation Order](#implementation-order)
4. [Phase 1: RUN-21 - Middleware & Route Protection](#phase-1-run-21---middleware--route-protection)
5. [Phase 2: RUN-6 - Homepage & Manifesto](#phase-2-run-6---homepage--manifesto)
6. [Phase 3: RUN-7 - The Flow Canvas](#phase-3-run-7---the-flow-canvas)
7. [Phase 4: RUN-8 - DWTC Clubhouse](#phase-4-run-8---dwtc-clubhouse)
8. [Skills & Agents Reference](#skills--agents-reference)
9. [MCP Servers Reference](#mcp-servers-reference)
10. [Testing Strategy](#testing-strategy)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## Prerequisites Check

Before starting, verify these are in place:

### ✅ Already Complete
- [x] RUN-18: Supabase Project Setup
- [x] RUN-19: Design System & Theme Configuration
- [x] Basic middleware exists at `middleware.ts`
- [x] Supabase clients configured (`lib/supabase/`)
- [x] Brand design system (colors, typography, components)

### 📋 Required Access
- [x] Linear MCP connected (for issue tracking)
- [x] Supabase MCP connected (for database operations)
- [x] GitHub access (for branches and PRs)
- [x] Vercel access (for deployments)

### 🔧 Development Environment
- [x] Node.js and npm installed
- [x] Environment variables in `.env.local`
- [x] Git configured with your credentials

---

## Dependency Analysis

**Q: Is RUN-21 required before RUN-6, RUN-7, RUN-8?**

**A: Partially. Here's the breakdown:**

| Feature | Requires Auth? | Dependency on RUN-21 |
|---------|---------------|---------------------|
| **RUN-21** (Middleware) | N/A | None - can start immediately |
| **RUN-6** (Homepage) | ❌ No - public page | Optional - can be done in parallel |
| **RUN-7** (Flow Canvas) | ⚠️ Partial - viewing is public, submissions need auth | Required for submission flows |
| **RUN-8** (Clubhouse) | ✅ Yes - member uploads need auth | Required for upload flows |

**Recommended Order:**
1. **RUN-21** (2 points) - Complete auth callbacks ← **START HERE**
2. **RUN-6** (25 points) - Homepage (no auth dependency, can overlap)
3. **RUN-7** (30 points) - Flow Canvas (needs auth for submissions)
4. **RUN-8** (35 points) - Clubhouse (needs full auth)

**Why this order:**
- RUN-21 is quick (2 points) and unblocks RUN-7 and RUN-8
- RUN-6 can be done in parallel with RUN-21 if desired
- RUN-7 and RUN-8 require auth, so RUN-21 must be complete first

---

## Implementation Order

### Quick Reference

```
Phase 1: RUN-21 (Auth) ──┐
                         ├──> Phase 3: RUN-7 (Flow)
Phase 2: RUN-6 (Home) ───┤
                         └──> Phase 4: RUN-8 (Clubhouse)
```

**Time Estimates:**
- Phase 1 (RUN-21): 1-2 sessions
- Phase 2 (RUN-6): 3-4 sessions
- Phase 3 (RUN-7): 4-5 sessions
- Phase 4 (RUN-8): 5-6 sessions

---

## Phase 1: RUN-21 - Middleware & Route Protection

**Linear Issue:** https://linear.app/run-expression-website/issue/RUN-21/middleware-and-route-protection
**Estimate:** 2 points
**Priority:** Urgent
**Status:** Backlog → In Progress → Done

### 🎯 Goal

Complete the authentication middleware and route protection system. The basic middleware exists but needs auth callback routes and enhanced session handling.

### 📝 Requirements

**Acceptance Criteria:**
- [x] Supabase auth middleware configured (ALREADY EXISTS)
- [x] Protected routes identified (ALREADY EXISTS: /club, /profile, /dashboard)
- [ ] Auth callback routes created ← **TO DO**
- [x] Session refresh logic implemented (ALREADY EXISTS via createServerClient)
- [x] Redirect logic for unauthenticated users (ALREADY EXISTS)

### 🌿 Branch Strategy

```bash
# Create feature branch from master
git checkout master
git pull origin master
git checkout -b feature/RUN-21-middleware-route-protection

# When complete, merge back to master via PR
```

### 📂 Files to Create/Modify

**To Create:**
- `app/auth/callback/route.ts` - OAuth callback handler
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `app/auth/logout/route.ts` - Logout handler
- `components/auth/login-form.tsx` - Login form component
- `components/auth/signup-form.tsx` - Signup form component

**To Modify:**
- `middleware.ts` - Add /auth/* to public paths
- `lib/supabase/server.ts` - Verify session refresh

### 🛠️ Skills to Use

**Primary Skills:**
- `superpowers:brainstorming` - Before starting implementation
- `superpowers:writing-plans` - Create detailed implementation plan
- `superpowers:executing-plans` OR `superpowers:subagent-driven-development` - Execute the plan
- `supabase-integration-expert` - Supabase Auth setup
- `nextjs-app-router-specialist` - Route handlers and pages
- `frontend-development-agent` - Auth form components

**CRITICAL:** Invoke `superpowers:brainstorming` first, then `superpowers:writing-plans`, then choose execution approach.

### 🔌 MCP Servers to Use

**Linear:**
- `linear:get_issue` - Fetch RUN-21 details
- `linear:update_issue` - Update status to "In Progress" when starting
- `linear:create_comment` - Add progress updates
- `linear:update_issue` - Set status to "Done" when complete

**Supabase:**
- `supabase:list_tables` - Verify auth.users table
- `supabase:execute_sql` - Test auth queries if needed
- `supabase:get_project_url` - Confirm project URL for callbacks

### 📋 Implementation Steps

#### Step 1: Start Session

```bash
# Invoke brainstorming skill first
/brainstorming "Implement auth callback routes and login/signup flows for RUN-21"

# After brainstorming, create detailed plan
/writing-plans "RUN-21 Middleware & Route Protection"
```

#### Step 2: Update Linear Status

Use Linear MCP:
```typescript
// Tell Claude Code:
"Update RUN-21 status to In Progress and add a comment that we're starting implementation"
```

#### Step 3: Create Auth Callback Route

**File:** `app/auth/callback/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the page they were trying to access
  return NextResponse.redirect(new URL(next, request.url))
}
```

#### Step 4: Create Login Page

**File:** `app/auth/login/page.tsx`

```typescript
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | RunExpression',
  description: 'Sign in to your RunExpression account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-mono text-4xl font-bold text-sage-900 mb-2">
            Welcome Back
          </h1>
          <p className="font-sans text-run-primary-700">
            Sign in to continue your expressive running journey
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
```

#### Step 5: Create Login Form Component

**File:** `components/auth/login-form.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(next)
      router.refresh()
    }
  }

  const handleSignup = () => {
    router.push(`/auth/signup?next=${encodeURIComponent(next)}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="sage"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSignup}
              className="text-sm text-sage-600 hover:text-sage-800 underline"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### Step 6: Create Signup Page and Form

**File:** `app/auth/signup/page.tsx`

```typescript
import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up | RunExpression',
  description: 'Create your RunExpression account',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-mono text-4xl font-bold text-sage-900 mb-2">
            Join RunExpression
          </h1>
          <p className="font-sans text-run-primary-700">
            Start your expressive running journey
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
```

**File:** `components/auth/signup-form.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const handleLogin = () => {
    router.push(`/auth/login?next=${encodeURIComponent(next)}`)
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">📧</div>
            <h2 className="font-mono text-xl font-bold">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent you a confirmation link. Click it to complete your signup.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="sage"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleLogin}
              className="text-sm text-sage-600 hover:text-sage-800 underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### Step 7: Create Logout Route

**File:** `app/auth/logout/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL!))
}
```

#### Step 8: Update Middleware

**File:** `middleware.ts`

Update to allow auth routes to be public:

```typescript
// Add to the existing middleware.ts around line 65:

// Public routes that don't require auth
const publicPaths = ['/auth', '/login', '/signup', '/', '/flow']
const isPublicPath = publicPaths.some(path =>
  request.nextUrl.pathname.startsWith(path)
)

// Protected routes
const protectedPaths = ['/club', '/profile', '/dashboard']
const isProtectedPath = protectedPaths.some(path =>
  request.nextUrl.pathname.startsWith(path)
)

if (isProtectedPath && !user && !isPublicPath) {
  const redirectUrl = new URL('/auth/login', request.url)
  redirectUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}
```

#### Step 9: Write Tests

**File:** `__tests__/auth/login-flow.test.ts`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/login-form'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue('/'),
  }),
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}))

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('submits form with valid credentials', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })
  })
})
```

#### Step 10: Manual Testing Checklist

Test in browser:

```bash
# Start dev server
npm run dev

# Test these flows:
1. Visit http://localhost:3000/auth/login
   - Should see login form
   - Try invalid credentials (should show error)
   - Try valid credentials (should redirect)

2. Visit http://localhost:3000/auth/signup
   - Should see signup form
   - Create new account
   - Check email for confirmation link

3. Visit protected route while logged out
   - http://localhost:3000/club
   - Should redirect to /auth/login with ?next=/club

4. Log in and verify redirect works

5. Test logout
   - POST to /auth/logout
   - Should redirect to home
```

#### Step 11: Commit and Push

```bash
# Add all changes
git add app/auth/ components/auth/ middleware.ts __tests__/auth/

# Commit with conventional format
git commit -m "feat(auth): implement login, signup, and callback routes

- Add OAuth callback handler at /auth/callback
- Create login page and form component
- Create signup page and form component
- Add logout route handler
- Update middleware to allow public auth routes
- Add auth flow tests
- Implements RUN-21 acceptance criteria

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to remote
git push origin feature/RUN-21-middleware-route-protection
```

#### Step 12: Create PR and Update Linear

```bash
# Create PR using linear-sync
/linear-sync pr

# Or manually with gh CLI
gh pr create \
  --title "feat(auth): Implement middleware and route protection (RUN-21)" \
  --body "Implements RUN-21 acceptance criteria:

- [x] Auth callback routes created
- [x] Login/signup pages implemented
- [x] Logout route added
- [x] Middleware updated for public auth routes
- [x] Tests added

Linear: https://linear.app/run-expression-website/issue/RUN-21

## Testing
- [x] Login flow works
- [x] Signup flow works with email confirmation
- [x] Protected routes redirect to login
- [x] Logout clears session
- [x] All tests passing" \
  --base master

# Update Linear issue
# Tell Claude Code: "Update RUN-21 status to Done and add comment with PR link"
```

### ✅ Phase 1 Complete Checklist

- [ ] Auth callback route created
- [ ] Login page and form implemented
- [ ] Signup page and form implemented
- [ ] Logout route implemented
- [ ] Middleware updated
- [ ] Tests written and passing
- [ ] Manual testing complete
- [ ] Committed with conventional commit format
- [ ] PR created and linked to Linear
- [ ] Linear issue updated to Done
- [ ] PR merged to master

---

## Phase 2: RUN-6 - Homepage & Manifesto

**Linear Issue:** https://linear.app/run-expression-website/issue/RUN-6/homepage-and-manifesto-experience
**Estimate:** 25 points
**Priority:** Urgent
**Dependencies:** None (no auth required)

### 🎯 Goal

Create the homepage with scroll-driven manifesto experience, Flow preview, and clubhouse teaser. This is the primary entry point for new users and embodies the RunExpression philosophy.

### 📝 Requirements

**Epic Description:**
- Homepage with scroll-driven manifesto
- 4 manifesto chapters with progressive reveal
- Flow preview section
- Clubhouse teaser
- Smooth scroll animations with Framer Motion
- Responsive design (mobile-first)

**Reference Documents:**
- `DOCS/02-PRODUCT-REQUIREMENTS.md` - Feature specifications
- `DOCS/04-BRAND-CONTENT-GUIDE.md` - Voice and tone
- `DOCS/design-system.md` - Brand components

### 🌿 Branch Strategy

```bash
git checkout master
git pull origin master
git checkout -b feature/RUN-6-homepage-manifesto-experience
```

### 📂 Files to Create/Modify

**To Create:**
- `app/(public)/page.tsx` - Homepage
- `components/home/manifesto-chapter.tsx` - Chapter component
- `components/home/flow-preview.tsx` - Flow teaser
- `components/home/clubhouse-teaser.tsx` - Clubhouse teaser
- `components/home/hero-section.tsx` - Hero/intro
- `hooks/use-scroll-progress.ts` - Scroll tracking hook
- `__tests__/home/manifesto.test.tsx` - Component tests

**To Modify:**
- `app/globals.css` - Add scroll animation utilities if needed

### 🛠️ Skills to Use

**Primary Skills:**
- `superpowers:brainstorming` - Explore approach
- `superpowers:writing-plans` - Create detailed plan
- `superpowers:subagent-driven-development` - Execute with subagents
- `frontend-development-agent` - React components
- `framer-motion-animation` - Scroll animations
- `content-brand-agent` - Manifesto content review
- `nextjs-app-router-specialist` - App Router patterns

### 🔌 MCP Servers to Use

**Linear:**
- Update RUN-6 status throughout development
- Add progress comments with screenshots

**Context7:** (if available)
- Query Framer Motion docs for scroll animations
- Query Next.js 14 App Router best practices

### 📋 Implementation Steps

#### Step 1: Brainstorming

```bash
/brainstorming "Create homepage with scroll-driven manifesto experience. 4 chapters should progressively reveal as user scrolls. Need smooth animations with Framer Motion, Flow preview section, and clubhouse teaser."
```

Key Questions to Explore:
- How should manifesto chapters transition? (Fade? Slide? Parallax?)
- Should scroll be handled with native CSS or Framer Motion?
- How to handle mobile vs desktop scroll behaviors?
- What's the fold-above-the-fold strategy?

#### Step 2: Create Implementation Plan

```bash
/writing-plans "RUN-6 Homepage & Manifesto Experience"
```

The plan should break down into tasks like:
1. Hero section with CTA
2. Manifesto chapter 1 (Motion Creates Emotion)
3. Manifesto chapter 2 (Process Over Outcome)
4. Manifesto chapter 3 (Interdependence)
5. Manifesto chapter 4 (Living Laboratory)
6. Flow preview section
7. Clubhouse teaser section
8. Scroll progress indicator
9. Responsive mobile layout
10. Animations and polish

#### Step 3: Execute Plan

```bash
# Use subagent-driven development
/subagent-driven-development "DOCS/plans/[plan-filename].md"

# This will:
# - Dispatch implementer subagent per task
# - Review after each task
# - Commit progressively
```

#### Step 4: Manifesto Content

**Chapter 1: Motion Creates Emotion**
```
The body speaks first.

Before your mind catches up, before you can name the feeling, your legs already know the truth: motion creates emotion.

Every run rewrites your nervous system. Not in abstraction—in the actual firing of neurons, the flood of chemicals, the rhythm of breath.

This isn't metaphor. This is biology becoming poetry.
```

**Chapter 2: Process Over Outcome**
```
You're not broken if you don't PR.

We've been lied to: that improvement requires measurement, that progress demands a number.

But what if the run itself is the point? What if showing up is the whole practice?

The outcome takes care of itself when you fall in love with the process.
```

**Chapter 3: Interdependence**
```
You're not in this alone.

The squad shows up on cold mornings. They pace you through the hard miles. They remind you why you started when you forget.

Interdependence isn't weakness—it's the actual structure of transformation.

We become together.
```

**Chapter 4: The Living Laboratory**
```
You are the experiment.

Every run is data. Every ache is information. Every breakthrough is a hypothesis confirmed.

We're not following someone else's plan—we're building our own.

This is how we learn: by living it.
```

#### Step 5: Component Architecture

**Example: Manifesto Chapter Component**

```typescript
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ManifestoChapterProps {
  number: number
  title: string
  content: string[]
  color: 'sage' | 'purple' | 'cream'
}

export function ManifestoChapter({ number, title, content, color }: ManifestoChapterProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="font-mono text-sm text-sage-500">
            {String(number).padStart(2, '0')}
          </div>

          <h2 className={`font-mono text-4xl md:text-6xl font-bold text-${color}-900`}>
            {title}
          </h2>

          <div className="space-y-6">
            {content.map((paragraph, i) => (
              <p
                key={i}
                className="manifesto-text text-sage-800 text-lg md:text-xl"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
```

#### Step 6: Testing

Create tests for each component:

```typescript
// __tests__/home/manifesto-chapter.test.tsx
import { render, screen } from '@testing-library/react'
import { ManifestoChapter } from '@/components/home/manifesto-chapter'

describe('ManifestoChapter', () => {
  it('renders chapter number and title', () => {
    render(
      <ManifestoChapter
        number={1}
        title="Motion Creates Emotion"
        content={['The body speaks first.']}
        color="sage"
      />
    )

    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Motion Creates Emotion')).toBeInTheDocument()
  })

  it('renders all content paragraphs', () => {
    const content = [
      'First paragraph',
      'Second paragraph',
      'Third paragraph'
    ]

    render(
      <ManifestoChapter
        number={1}
        title="Test"
        content={content}
        color="sage"
      />
    )

    content.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
```

#### Step 7: Accessibility

Ensure:
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic HTML (section, article, nav)
- Keyboard navigation works
- Reduced motion support (check `prefers-reduced-motion`)
- Alt text for any images
- ARIA labels where needed

#### Step 8: Performance

Optimize:
- Use Next.js Image component for any images
- Lazy load components below fold
- Minimize JavaScript bundle with dynamic imports
- Optimize font loading (already using `display: swap`)

#### Step 9: Commit Pattern

Commit after each major section:

```bash
git add app/(public)/page.tsx components/home/hero-section.tsx
git commit -m "feat(home): add hero section with CTA"

git add components/home/manifesto-chapter.tsx
git commit -m "feat(home): add manifesto chapter component with scroll animations"

git add components/home/flow-preview.tsx
git commit -m "feat(home): add Flow canvas preview section"

# ... and so on
```

#### Step 10: Final PR

```bash
git push origin feature/RUN-6-homepage-manifesto-experience

gh pr create \
  --title "feat(home): Implement homepage and manifesto experience (RUN-6)" \
  --body "Implements RUN-6 homepage with scroll-driven manifesto.

## Features
- Hero section with CTA
- 4 manifesto chapters with scroll animations
- Flow preview section
- Clubhouse teaser
- Responsive mobile-first design
- Framer Motion scroll effects
- Accessibility compliant

## Screenshots
[Add screenshots here]

Linear: https://linear.app/run-expression-website/issue/RUN-6

## Testing
- [x] Desktop scroll experience smooth
- [x] Mobile responsive and performant
- [x] Reduced motion respected
- [x] All tests passing
- [x] Lighthouse score >90" \
  --base master
```

### ✅ Phase 2 Complete Checklist

- [ ] Hero section implemented
- [ ] 4 manifesto chapters with animations
- [ ] Flow preview section
- [ ] Clubhouse teaser section
- [ ] Scroll progress indicator
- [ ] Mobile responsive
- [ ] Tests written and passing
- [ ] Accessibility audit passed
- [ ] Performance optimized (Lighthouse >90)
- [ ] Content reviewed by content-brand-agent
- [ ] PR created and linked to Linear
- [ ] Linear issue updated to Done

---

## Phase 3: RUN-7 - The Flow Canvas

**Linear Issue:** https://linear.app/run-expression-website/issue/RUN-7/the-flow-interactive-canvas
**Estimate:** 30 points
**Priority:** Urgent
**Dependencies:** RUN-21 (Auth) must be complete

### 🎯 Goal

Create The Flow: an interactive canvas where runners can post text/image submissions with vibe tags. Includes Fabric.js sticker studio, masonry wall layout, and realtime updates via Supabase Realtime.

### 📝 Requirements

**Epic Description:**
- Text/image submission flow
- Fabric.js sticker studio for creative posts
- Masonry wall layout for display
- Realtime updates (new posts appear live)
- Vibe tag system
- Like/reaction system
- Moderation queue (admin only)

**Technical Stack:**
- Fabric.js for canvas editing
- react-masonry-css for layout
- Supabase Storage for images
- Supabase Realtime for live updates
- Framer Motion for entrance animations

### 🌿 Branch Strategy

```bash
git checkout master
git pull origin master
git checkout -b feature/RUN-7-the-flow-interactive-canvas
```

### 📂 Files to Create/Modify

**To Create:**
- `app/(flow)/flow/page.tsx` - Main Flow page
- `components/flow/flow-wall.tsx` - Masonry grid
- `components/flow/flow-post-card.tsx` - Individual post
- `components/flow/submission-dialog.tsx` - Submit modal
- `components/flow/sticker-studio.tsx` - Fabric.js editor
- `components/flow/vibe-tag-selector.tsx` - Tag picker
- `lib/flow/submission-helpers.ts` - Submission logic
- `hooks/use-flow-posts.ts` - Data fetching hook
- `hooks/use-realtime-flow.ts` - Realtime subscriptions
- Database migrations (see below)

### 🗄️ Database Schema

**Migration:** `supabase/migrations/20260124_flow_tables.sql`

```sql
-- Flow posts table
CREATE TABLE flow_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'sticker')),
  text_content TEXT,
  image_url TEXT,
  sticker_data JSONB,
  vibe_tags TEXT[] DEFAULT '{}',
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_flow_posts_user_id ON flow_posts(user_id);
CREATE INDEX idx_flow_posts_moderation_status ON flow_posts(moderation_status);
CREATE INDEX idx_flow_posts_created_at ON flow_posts(created_at DESC);

-- RLS Policies
ALTER TABLE flow_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved posts
CREATE POLICY "Anyone can view approved flow posts"
  ON flow_posts FOR SELECT
  USING (moderation_status = 'approved');

-- Users can view their own posts regardless of status
CREATE POLICY "Users can view own flow posts"
  ON flow_posts FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create flow posts"
  ON flow_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id AND moderation_status = 'pending');

-- Users can update their own pending posts
CREATE POLICY "Users can update own pending posts"
  ON flow_posts FOR UPDATE
  USING (auth.uid() = user_id AND moderation_status = 'pending');

-- Users can delete their own posts
CREATE POLICY "Users can delete own flow posts"
  ON flow_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Likes table
CREATE TABLE flow_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES flow_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_flow_post_likes_post_id ON flow_post_likes(post_id);
CREATE INDEX idx_flow_post_likes_user_id ON flow_post_likes(user_id);

ALTER TABLE flow_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON flow_post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON flow_post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON flow_post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_flow_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE flow_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE flow_posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER flow_post_likes_count_trigger
  AFTER INSERT OR DELETE ON flow_post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_flow_post_likes_count();
```

### 🛠️ Skills to Use

**Primary Skills:**
- `superpowers:brainstorming` - Design submission UX
- `superpowers:writing-plans` - Detailed implementation plan
- `superpowers:subagent-driven-development` - Execute plan
- `full-stack-feature-agent` - End-to-end feature (frontend + backend)
- `frontend-development-agent` - React components
- `backend-database-agent` - Database schema and migrations
- `framer-motion-animation` - Post entrance animations
- `supabase-integration-expert` - Realtime subscriptions

### 🔌 MCP Servers to Use

**Linear:**
- Update RUN-7 throughout development

**Supabase:**
- `supabase:list_tables` - Verify schema
- `supabase:apply_migration` - Run migrations
- `supabase:execute_sql` - Test queries
- `supabase:generate_typescript_types` - Generate types after migration

### 📋 Implementation Steps

#### Step 1: Brainstorming

```bash
/brainstorming "Design Flow canvas submission experience. Users should be able to submit text, upload images, or create custom stickers with Fabric.js. Need vibe tags, realtime updates, and masonry layout."
```

Key Questions:
- Should submission be modal or dedicated page?
- How to handle image upload + editing flow?
- Fabric.js: full canvas or constrained template?
- Realtime: optimistic updates or wait for confirmation?
- Moderation: auto-approve or require review?

#### Step 2: Database Migration

```bash
# Create migration
npm run db:push

# Generate TypeScript types
npm run db:types
```

#### Step 3: Implement Submission Flow

**Core Component:** `components/flow/submission-dialog.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { TextSubmission } from './text-submission'
import { ImageSubmission } from './image-submission'
import { StickerSubmission } from './sticker-submission'

export function SubmissionDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sage" size="lg" className="fixed bottom-8 right-8 z-50">
          + Add to Flow
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-2xl">Share Your Flow</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="sticker">Sticker</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <TextSubmission onSuccess={() => setOpen(false)} />
          </TabsContent>

          <TabsContent value="image">
            <ImageSubmission onSuccess={() => setOpen(false)} />
          </TabsContent>

          <TabsContent value="sticker">
            <StickerSubmission onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
```

#### Step 4: Implement Fabric.js Sticker Studio

```bash
npm install fabric
```

**Component:** `components/flow/sticker-studio.tsx`

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { Button } from '@/components/ui/button'

export function StickerStudio({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#F5F5F0',
    })

    fabricRef.current = canvas

    return () => {
      canvas.dispose()
    }
  }, [])

  const addText = () => {
    if (!fabricRef.current) return

    const text = new fabric.IText('Your text here', {
      left: 100,
      top: 100,
      fontFamily: 'DM Mono',
      fill: '#2F4F4F',
    })

    fabricRef.current.add(text)
  }

  const addShape = (shape: 'circle' | 'rect') => {
    if (!fabricRef.current) return

    let obj: fabric.Object

    if (shape === 'circle') {
      obj = new fabric.Circle({
        radius: 50,
        fill: '#93C5B1',
        left: 150,
        top: 150,
      })
    } else {
      obj = new fabric.Rect({
        width: 100,
        height: 100,
        fill: '#936699',
        left: 150,
        top: 150,
      })
    }

    fabricRef.current.add(obj)
  }

  const handleSave = () => {
    if (!fabricRef.current) return

    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1,
    })

    onSave(dataUrl)
  }

  return (
    <div className="space-y-4">
      <div className="border border-sage-200 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>

      <div className="flex gap-2">
        <Button onClick={addText} variant="outline">
          Add Text
        </Button>
        <Button onClick={() => addShape('circle')} variant="outline">
          Add Circle
        </Button>
        <Button onClick={() => addShape('rect')} variant="outline">
          Add Rectangle
        </Button>
        <Button onClick={handleSave} variant="sage">
          Save Sticker
        </Button>
      </div>
    </div>
  )
}
```

#### Step 5: Implement Masonry Wall

```typescript
// components/flow/flow-wall.tsx
'use client'

import Masonry from 'react-masonry-css'
import { motion } from 'framer-motion'
import { FlowPostCard } from './flow-post-card'
import { useFlowPosts } from '@/hooks/use-flow-posts'
import { useRealtimeFlow } from '@/hooks/use-realtime-flow'

const breakpointColumns = {
  default: 4,
  1280: 3,
  768: 2,
  640: 1,
}

export function FlowWall() {
  const { posts, isLoading } = useFlowPosts()
  useRealtimeFlow() // Subscribe to realtime updates

  if (isLoading) {
    return <div>Loading flow...</div>
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <FlowPostCard post={post} />
        </motion.div>
      ))}
    </Masonry>
  )
}
```

#### Step 6: Implement Realtime Hook

```typescript
// hooks/use-realtime-flow.ts
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeFlow() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('flow_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'flow_posts',
          filter: 'moderation_status=eq.approved'
        },
        (payload) => {
          // Invalidate query to refetch
          queryClient.invalidateQueries({ queryKey: ['flow-posts'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, supabase])
}
```

#### Step 7: Testing

```typescript
// __tests__/flow/submission.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SubmissionDialog } from '@/components/flow/submission-dialog'

describe('SubmissionDialog', () => {
  it('opens submission dialog on button click', () => {
    render(<SubmissionDialog />)

    const button = screen.getByText(/add to flow/i)
    fireEvent.click(button)

    expect(screen.getByText(/share your flow/i)).toBeInTheDocument()
  })

  it('shows text, image, and sticker tabs', () => {
    render(<SubmissionDialog />)

    fireEvent.click(screen.getByText(/add to flow/i))

    expect(screen.getByRole('tab', { name: /text/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /image/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /sticker/i })).toBeInTheDocument()
  })
})
```

#### Step 8: Moderation Flow

Create admin-only moderation page:

```typescript
// app/(app)/admin/moderation/page.tsx
import { createClient } from '@/lib/supabase/server'
import { ModerationQueue } from '@/components/admin/moderation-queue'

export default async function ModerationPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin (implement your admin check)
  const isAdmin = user?.email?.endsWith('@runexpression.com')

  if (!isAdmin) {
    return <div>Access denied</div>
  }

  const { data: pendingPosts } = await supabase
    .from('flow_posts')
    .select('*')
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-8">
      <h1 className="font-mono text-3xl font-bold mb-6">Moderation Queue</h1>
      <ModerationQueue posts={pendingPosts || []} />
    </div>
  )
}
```

### ✅ Phase 3 Complete Checklist

- [ ] Database migration created and applied
- [ ] TypeScript types generated
- [ ] Text submission flow
- [ ] Image upload and submission
- [ ] Fabric.js sticker studio
- [ ] Vibe tag selector
- [ ] Masonry wall layout
- [ ] Realtime updates working
- [ ] Like/reaction system
- [ ] Moderation queue (admin)
- [ ] Tests written and passing
- [ ] Performance optimized
- [ ] PR created and linked to Linear
- [ ] Linear issue updated to Done

---

## Phase 4: RUN-8 - DWTC Clubhouse

**Linear Issue:** https://linear.app/run-expression-website/issue/RUN-8/dwtc-clubhouse
**Estimate:** 35 points
**Priority:** Urgent
**Dependencies:** RUN-21 (Auth) must be complete

### 🎯 Goal

Create the DWTC Clubhouse: a permanent digital home for club members with lore/stories, media archive, resources section, and member upload flows.

### 📝 Requirements

**Epic Description:**
- Lore & Stories section (markdown content)
- Media Archive (photos/videos from races and events)
- Resources section (workouts, race calendar, training plans)
- Member upload portal (authenticated)
- Search and filter capabilities
- Responsive gallery layouts

### 🌿 Branch Strategy

```bash
git checkout master
git pull origin master
git checkout -b feature/RUN-8-dwtc-clubhouse
```

### 📂 Files to Create/Modify

**To Create:**
- `app/club/[slug]/page.tsx` - Dynamic clubhouse pages
- `app/club/[slug]/lore/page.tsx` - Lore section
- `app/club/[slug]/media/page.tsx` - Media archive
- `app/club/[slug]/resources/page.tsx` - Resources
- `app/club/[slug]/upload/page.tsx` - Member upload
- `components/clubhouse/media-gallery.tsx` - Photo gallery
- `components/clubhouse/lore-viewer.tsx` - Story viewer
- `components/clubhouse/upload-form.tsx` - Upload form
- Database migrations (see below)

### 🗄️ Database Schema

**Migration:** `supabase/migrations/20260124_clubhouse_tables.sql`

```sql
-- Clubs table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  founded_year INTEGER,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club memberships
CREATE TABLE club_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- Lore/Stories
CREATE TABLE club_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown
  author_id UUID REFERENCES auth.users(id),
  cover_image_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, slug)
);

-- Media archive
CREATE TABLE club_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES auth.users(id),
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  event_date DATE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE club_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('workout', 'race', 'training_plan', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Markdown or JSON
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can view clubs
CREATE POLICY "Anyone can view clubs"
  ON clubs FOR SELECT
  USING (true);

-- Members can view memberships of their clubs
CREATE POLICY "Members can view club memberships"
  ON club_memberships FOR SELECT
  USING (
    club_id IN (
      SELECT club_id FROM club_memberships WHERE user_id = auth.uid()
    )
  );

-- Anyone can view published stories
CREATE POLICY "Anyone can view published stories"
  ON club_stories FOR SELECT
  USING (published_at IS NOT NULL);

-- Anyone can view club media
CREATE POLICY "Anyone can view club media"
  ON club_media FOR SELECT
  USING (true);

-- Members can upload media
CREATE POLICY "Members can upload club media"
  ON club_media FOR INSERT
  WITH CHECK (
    auth.uid() = uploader_id AND
    club_id IN (
      SELECT club_id FROM club_memberships WHERE user_id = auth.uid()
    )
  );

-- Anyone can view resources
CREATE POLICY "Anyone can view club resources"
  ON club_resources FOR SELECT
  USING (true);
```

### 🛠️ Skills to Use

**Primary Skills:**
- `superpowers:brainstorming` - Design clubhouse UX
- `superpowers:writing-plans` - Detailed plan
- `superpowers:subagent-driven-development` - Execute
- `full-stack-feature-agent` - End-to-end implementation
- `backend-database-agent` - Schema and queries
- `frontend-development-agent` - Components
- `content-brand-agent` - Review lore content
- `supabase-integration-expert` - Storage setup

### 🔌 MCP Servers to Use

**Linear:**
- Update RUN-8 throughout

**Supabase:**
- `supabase:apply_migration` - Run migrations
- `supabase:generate_typescript_types` - Generate types
- Configure Supabase Storage bucket for media

### 📋 Implementation Steps

#### Step 1: Brainstorming

```bash
/brainstorming "Design DWTC Clubhouse experience. Need sections for lore/stories, media archive with photos, resources like workouts, and member upload portal. How should navigation work? What's the member vs public experience?"
```

#### Step 2: Database & Storage Setup

```bash
# Run migration
npm run db:push

# Generate types
npm run db:types
```

**Create Storage Bucket:**
Use Supabase MCP or manually:
```sql
-- Create storage bucket for club media
INSERT INTO storage.buckets (id, name, public)
VALUES ('club-media', 'club-media', true);

-- RLS policy for uploads
CREATE POLICY "Members can upload club media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'club-media' AND
    auth.uid() IN (
      SELECT user_id FROM club_memberships
    )
  );
```

#### Step 3: Seed DWTC Club Data

```typescript
// scripts/seed-dwtc.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedDWTC() {
  // Insert DWTC club
  const { data: club } = await supabase
    .from('clubs')
    .insert({
      slug: 'dwtc',
      name: 'DWTC (Dead Weather Track Club)',
      description: 'New York City running club founded on community, creativity, and showing up.',
      founded_year: 2018,
      location: 'Brooklyn, NY'
    })
    .select()
    .single()

  console.log('DWTC club created:', club)

  // Insert sample story
  await supabase
    .from('club_stories')
    .insert({
      club_id: club.id,
      title: 'The Origin Story',
      slug: 'origin-story',
      content: `# How DWTC Began

It started with a question: What if running could be about more than PRs?

In 2018, a small group gathered in Prospect Park. No fancy gear. No pressure. Just movement and community.

That was the first DWTC run. And we haven't stopped since.`,
      published_at: new Date().toISOString()
    })

  console.log('Sample story created')
}

seedDWTC()
```

Run it:
```bash
npx tsx scripts/seed-dwtc.ts
```

#### Step 4: Implement Clubhouse Layout

```typescript
// app/club/[slug]/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { ClubNav } from '@/components/clubhouse/club-nav'
import { notFound } from 'next/navigation'

export default async function ClubLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const supabase = createClient()

  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!club) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 bg-sage-100">
        {club.hero_image_url && (
          <img
            src={club.hero_image_url}
            alt={club.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <h1 className="font-mono text-4xl font-bold text-white">
            {club.name}
          </h1>
          <p className="text-cream-100 mt-2">{club.description}</p>
        </div>
      </div>

      {/* Navigation */}
      <ClubNav slug={params.slug} />

      {/* Content */}
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  )
}
```

#### Step 5: Implement Media Gallery

```typescript
// components/clubhouse/media-gallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Masonry from 'react-masonry-css'

interface MediaItem {
  id: string
  url: string
  thumbnail_url: string | null
  caption: string | null
  event_date: string | null
}

interface MediaGalleryProps {
  items: MediaItem[]
}

export function MediaGallery({ items }: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  return (
    <>
      <Masonry
        breakpointCols={{ default: 3, 1024: 2, 640: 1 }}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="mb-4 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedItem(item)}
          >
            <Image
              src={item.thumbnail_url || item.url}
              alt={item.caption || 'Club media'}
              width={400}
              height={300}
              className="rounded-lg w-full h-auto"
            />
            {item.caption && (
              <p className="text-sm text-sage-700 mt-2">{item.caption}</p>
            )}
          </div>
        ))}
      </Masonry>

      {/* Lightbox */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl">
            <Image
              src={selectedItem.url}
              alt={selectedItem.caption || 'Club media'}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            {selectedItem.caption && (
              <p className="mt-4 text-center">{selectedItem.caption}</p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
```

#### Step 6: Implement Upload Form

```typescript
// app/club/[slug]/upload/page.tsx
import { createClient } from '@/lib/supabase/server'
import { UploadForm } from '@/components/clubhouse/upload-form'
import { redirect } from 'next/navigation'

export default async function UploadPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=/club/${params.slug}/upload`)
  }

  // Check membership
  const { data: membership } = await supabase
    .from('club_memberships')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return <div>You must be a club member to upload media</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-mono text-3xl font-bold mb-6">Upload Media</h1>
      <UploadForm clubSlug={params.slug} />
    </div>
  )
}
```

### ✅ Phase 4 Complete Checklist

- [ ] Database migration created and applied
- [ ] Storage bucket configured
- [ ] DWTC club data seeded
- [ ] Clubhouse layout and navigation
- [ ] Lore/stories section
- [ ] Media archive with gallery
- [ ] Resources section
- [ ] Member upload portal
- [ ] Search and filtering
- [ ] Tests written and passing
- [ ] PR created and linked to Linear
- [ ] Linear issue updated to Done

---

## Skills & Agents Reference

### 🎯 Superpowers Skills (Required Workflow)

**Always start with these in order:**

1. **`superpowers:brainstorming`** - Use FIRST before any implementation
   - Explores user intent, requirements, design choices
   - Surfaces questions and trade-offs
   - Required before planning

2. **`superpowers:writing-plans`** - Use SECOND to create detailed plan
   - Breaks work into bite-sized tasks
   - Specifies files, commands, code examples
   - Saves plan to `DOCS/plans/`

3. **Execution Options** - Choose ONE:
   - **`superpowers:subagent-driven-development`** - Same session, fresh subagent per task with review
   - **`superpowers:executing-plans`** - Separate parallel session, batch execution

**Other Workflow Skills:**

- **`superpowers:test-driven-development`** - Use when implementing features (write test first, make it pass)
- **`superpowers:systematic-debugging`** - Use when encountering bugs or failures
- **`superpowers:requesting-code-review`** - Use when major work is complete
- **`superpowers:finishing-a-development-branch`** - Use when implementation is done (guides merge/PR)
- **`superpowers:verification-before-completion`** - Use before claiming work is complete

### 🤖 Specialized Agents

**Frontend:**
- **`frontend-development-agent`** - React components, UI/UX, client-side
- **`shadcn-ui-component-builder`** - Creating/customizing Shadcn components

**Backend:**
- **`backend-database-agent`** - Database schema, migrations, RLS policies, queries

**Full-Stack:**
- **`full-stack-feature-agent`** - End-to-end features (frontend + backend)

**Domain-Specific:**
- **`supabase-integration-expert`** - Supabase patterns, Realtime, Storage, Auth
- **`nextjs-app-router-specialist`** - Next.js 14 App Router, SSR/SSG, route handlers
- **`framer-motion-animation`** - Scroll animations, transitions, motion
- **`content-brand-agent`** - Brand voice review, UI copy, content creation
- **`stripe-payment-integration`** - Payment flows (if needed later)

**Quality:**
- **`testing-qa-agent`** - Test writing, test infrastructure, quality assurance
- **`code-reviewer`** - Code review after major implementations

**Deployment:**
- **`devops-deployment-agent`** - Vercel deployment, CI/CD, monitoring

### 📖 How to Use Skills/Agents

```bash
# Invoke a skill
/brainstorming "your prompt here"

# Or tell Claude Code to use an agent
"Use the full-stack-feature-agent to implement the Flow submission feature"

# Mobile Claude Code: Just reference the skill name
"I need to use brainstorming skill for the homepage design"
```

---

## MCP Servers Reference

### 🔷 Linear MCP

**Available Commands:**

```typescript
// Get issue details
linear:get_issue { id: "RUN-6" }

// Update issue
linear:update_issue {
  id: "RUN-6",
  state: "In Progress"
}

// Add comment
linear:create_comment {
  issueId: "RUN-6",
  body: "Starting implementation of hero section"
}

// List issues
linear:list_issues {
  team: "Run Expression Website",
  state: "Backlog"
}
```

**Common Workflow:**

```bash
# 1. Start work - update to In Progress
"Update RUN-6 status to In Progress"

# 2. Add progress updates
"Add comment to RUN-6: Completed manifesto chapter components"

# 3. Complete work - update to Done
"Update RUN-6 status to Done and add comment with PR link"
```

### 🟦 Supabase MCP

**Available Commands:**

```typescript
// List tables
supabase:list_tables {}

// Execute SQL
supabase:execute_sql {
  sql: "SELECT * FROM flow_posts WHERE moderation_status = 'pending'"
}

// Apply migration
supabase:apply_migration {
  file: "supabase/migrations/20260124_flow_tables.sql"
}

// Generate TypeScript types
supabase:generate_typescript_types {}

// Get project info
supabase:get_project {}
```

**Common Workflow:**

```bash
# 1. Create migration file
# Write SQL to supabase/migrations/[timestamp]_[name].sql

# 2. Apply migration
"Apply the flow_tables migration"

# 3. Generate types
npm run db:types

# 4. Verify
"List all tables to confirm flow_posts exists"
```

### 🌐 Context7 MCP (Optional)

Query library documentation:

```typescript
// Get Framer Motion scroll docs
context7:query-docs {
  libraryId: "framer-motion",
  query: "scroll-triggered animations useScroll"
}

// Get Next.js App Router docs
context7:query-docs {
  libraryId: "nextjs",
  query: "app router server components"
}
```

---

## Testing Strategy

### 🧪 Test Pyramid

```
        /\
       /  \  E2E (Playwright) - Critical user flows
      /____\
     /      \  Integration - API routes, database
    /________\
   /          \  Unit - Components, utilities, hooks
  /____________\
```

**Unit Tests (Most):**
- Individual components
- Utility functions
- Custom hooks
- Located in `__tests__/` or `component.test.tsx`

**Integration Tests (Some):**
- API routes
- Database queries
- Auth flows

**E2E Tests (Few):**
- Critical paths: login → submit → view
- Playwright for browser automation

### 📝 Testing Commands

```bash
# Run all tests
npm run test

# Run tests in CI mode (no watch)
npm run test:ci

# Run specific test file
npm run test flow/submission.test.tsx

# Run with coverage
npm run test -- --coverage
```

### ✅ Test Checklist Per Feature

- [ ] Component renders without crashing
- [ ] Props are handled correctly
- [ ] User interactions work (clicks, typing, etc.)
- [ ] Loading states shown
- [ ] Error states handled
- [ ] Success states shown
- [ ] Accessibility attributes present
- [ ] Responsive behavior (if applicable)

---

## Troubleshooting Guide

### 🐛 Common Issues

#### Issue: TypeScript errors after migration

**Problem:** Types out of sync with database

**Solution:**
```bash
npm run db:types
# Restart TypeScript server in IDE
```

#### Issue: Supabase RLS blocking queries

**Problem:** Row Level Security policy too restrictive

**Solution:**
```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test as specific user
SET ROLE authenticated;
SET request.jwt.claims.sub = 'user-uuid';
SELECT * FROM your_table;
```

#### Issue: Images not uploading to Supabase Storage

**Problem:** Missing storage bucket or RLS policy

**Solution:**
```bash
# Use Supabase MCP to check buckets
"List all Supabase storage buckets"

# Create bucket if missing (see Phase 4 Step 2)
```

#### Issue: Middleware redirecting incorrectly

**Problem:** Auth routes not marked as public

**Solution:**
Check `middleware.ts` has auth routes in public paths:
```typescript
const publicPaths = ['/auth', '/login', '/signup', '/', '/flow']
```

#### Issue: Realtime not working

**Problem:** Channel not subscribed or RLS blocking

**Solution:**
```typescript
// Check subscription status
const channel = supabase.channel('flow_posts')
console.log('Channel status:', channel.state)

// Verify RLS allows SELECT for realtime
```

#### Issue: Tests failing with "Cannot find module"

**Problem:** Missing test dependencies or imports

**Solution:**
```bash
# Install missing test types
npm install --save-dev @types/jest @testing-library/jest-dom

# Check jest.setup.ts is configured
```

### 📞 Getting Help

**If stuck on mobile Claude Code:**

1. **Reference this plan** - Point Claude Code to specific section
2. **Be explicit** - "Follow Step 3 of Phase 2 exactly"
3. **One task at a time** - Don't skip ahead
4. **Ask for clarification** - If unclear, ask Claude Code to explain
5. **Check Linear** - Issue might have additional context

**Useful prompts for mobile Claude Code:**

```
"Read the implementation plan for RUN-6 and start with Phase 2, Step 1"

"I'm stuck on [specific step]. Can you help troubleshoot?"

"Show me the exact files I need to create for the Flow submission feature"

"What's the next step after completing the auth callback routes?"
```

---

## Summary & Quick Start

### 🚀 Quick Start Checklist

To start implementation on mobile Claude Code:

1. **Read this entire plan** - Skim to understand phases
2. **Check Linear access** - Verify you can see RUN-21, RUN-6, RUN-7, RUN-8
3. **Verify environment** - `npm run dev` works, env vars set
4. **Start with RUN-21** - It's quick (2 points) and unblocks others
5. **Follow the skills workflow** - Always brainstorm → plan → execute
6. **Commit frequently** - After each major step
7. **Update Linear** - Keep issues current with status/comments
8. **Test before PR** - Run tests and manual checks
9. **Create PRs with `/linear-sync pr`** - Links to Linear automatically

### 📊 Implementation Timeline

| Phase | Issue | Points | Est. Sessions | Dependencies |
|-------|-------|--------|--------------|-------------|
| 1 | RUN-21 (Auth) | 2 | 1-2 | None |
| 2 | RUN-6 (Homepage) | 25 | 3-4 | None |
| 3 | RUN-7 (Flow) | 30 | 4-5 | RUN-21 ✅ |
| 4 | RUN-8 (Clubhouse) | 35 | 5-6 | RUN-21 ✅ |

**Total:** 92 points, ~13-17 sessions

### 🎯 Success Criteria

Each phase is complete when:
- ✅ All acceptance criteria met
- ✅ Tests written and passing
- ✅ Manual testing complete
- ✅ Code reviewed (use code-reviewer agent)
- ✅ PR merged to master
- ✅ Linear issue marked Done
- ✅ Deployed to Vercel (automatic on merge)

### 📱 Mobile Claude Code Tips

**Limitations to be aware of:**
- Smaller context window - refer to this plan often
- May not have all MCP servers - check availability
- Typing is harder - use voice if available
- Screen size limits - focus on one file at a time

**Best practices:**
- Break work into smaller chunks
- Reference plan sections by name ("Phase 2, Step 4")
- Commit after every working piece
- Test frequently (npm run test, npm run dev)
- Ask Claude Code to "verify current step is complete" before moving on

---

## Appendix

### 📚 Reference Documents

- **Product Requirements:** `DOCS/02-PRODUCT-REQUIREMENTS.md`
- **Technical Design:** `DOCS/03-TECHNICAL-DESIGN.md`
- **Brand Guide:** `DOCS/04-BRAND-CONTENT-GUIDE.md`
- **Data Schema:** `DOCS/06-DATA-SCHEMA.md`
- **Coding Standards:** `DOCS/07-CODING-STANDARDS.md`
- **Design System:** `DOCS/design-system.md`
- **AI Agent Guide:** `AI-AGENT-GUIDE.md`

### 🔗 External Resources

- **Next.js 14 Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Fabric.js:** http://fabricjs.com/docs/
- **Linear API:** https://developers.linear.app/

### 📝 Convention Reminders

**File Naming:**
- Components: `kebab-case.tsx` (flow-post-card.tsx)
- Components names: `PascalCase` (FlowPostCard)
- Hooks: `use-hook-name.ts` (use-flow-posts.ts)
- Utils: `kebab-case.ts` (submission-helpers.ts)

**Commit Format:**
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scopes: auth, home, flow, clubhouse, db, ui

Example: feat(flow): add realtime subscription hook

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**PR Title Format:**
```
<type>(<scope>): <description> (<issue-id>)

Example: feat(flow): Implement Flow canvas submission (RUN-7)
```

---

**Good luck! 🏃‍♀️ This plan has everything you need. Take it one step at a time, follow the skills workflow, and you'll build something amazing.**

**Remember: Motion Creates Emotion. Start moving. The code will follow.**
