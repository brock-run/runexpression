---
name: testing-qa-automation
description: Writing unit tests, integration tests, and E2E tests for critical flows using Jest, React Testing Library, and Playwright. Includes test data factories, accessibility testing automation, and Next.js App Router testing patterns. Use when adding tests for new features, setting up test infrastructure, debugging test failures, or configuring CI/CD test pipelines.
---

# Testing & QA Automation

## Core Testing Stack

- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Playwright (recommended) or Cypress
- **Accessibility**: @testing-library/jest-dom, jest-axe
- **Test Data**: Factories for consistent test data generation

## Test File Naming

```
flow-submit.ts        → flow-submit.test.ts
format-date.ts        → format-date.test.ts
flow-post-card.tsx    → flow-post-card.test.tsx
```

## Unit Test Patterns

### Utility Functions

```typescript
// lib/utils.test.ts
import { formatPace } from './utils'

describe('formatPace', () => {
  it('should format pace correctly', () => {
    const result = formatPace(600, 2) // 10 min/mile
    expect(result).toBe('10:00')
  })

  it('should handle edge cases', () => {
    expect(formatPace(0, 0)).toBe('0:00')
  })
})
```

### API Route Handlers

```typescript
// app/api/flow/submit/route.test.ts
import { POST } from './route'
import { createAdminClient } from '@/lib/supabase/admin'

jest.mock('@/lib/supabase/admin')

describe('POST /api/flow/submit', () => {
  it('should create expression event', async () => {
    const mockSupabase = createAdminClient() as jest.MockedFunction<typeof createAdminClient>
    // Mock implementation...
    
    const request = new Request('http://localhost/api/flow/submit', {
      method: 'POST',
      body: JSON.stringify({ content: 'Test post', vibeTags: ['joy'] })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

## Component Testing (React Testing Library)

### Basic Component Test

```typescript
// components/flow/flow-post-card.test.tsx
import { render, screen } from '@testing-library/react'
import { FlowPostCard } from './flow-post-card'

describe('FlowPostCard', () => {
  it('should render post content', () => {
    const post = {
      id: '1',
      content: 'Great run today!',
      created_at: '2025-12-14T10:00:00Z',
      user_id: 'user-123'
    }

    render(<FlowPostCard post={post} />)
    expect(screen.getByText('Great run today!')).toBeInTheDocument()
  })
})
```

### Testing Client Components with Hooks

```typescript
// components/flow/flow-submit-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FlowSubmitForm } from './flow-submit-form'

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: {}, error: null })
    }))
  })
}))

describe('FlowSubmitForm', () => {
  it('should submit form with content', async () => {
    render(<FlowSubmitForm />)
    
    const textarea = screen.getByLabelText(/your expression/i)
    fireEvent.change(textarea, { target: { value: 'Test post' } })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/submitted/i)).toBeInTheDocument()
    })
  })
})
```

### Testing Server Components (Next.js App Router)

Server Components require special handling. Test the data fetching logic separately:

```typescript
// Test the data fetching function
// lib/flow/get-posts.test.ts
import { getFlowPosts } from './get-posts'
import { createClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server')

describe('getFlowPosts', () => {
  it('should fetch approved posts', async () => {
    const mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [{ id: '1', content: 'Test' }],
          error: null
        })
      }))
    }
    
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
    
    const posts = await getFlowPosts()
    expect(posts).toHaveLength(1)
  })
})
```

## Test Data Factories

Create reusable factories for consistent test data:

```typescript
// __tests__/factories/expression-event.factory.ts
import { Database } from '@/types/database.types'

type ExpressionEvent = Database['public']['Tables']['expression_events']['Row']

export function createExpressionEvent(
  overrides?: Partial<ExpressionEvent>
): ExpressionEvent {
  return {
    id: crypto.randomUUID(),
    user_id: 'user-123',
    content: 'Test expression',
    moderation_status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  }
}

export function createUser(overrides?: Partial<User>): User {
  return {
    id: crypto.randomUUID(),
    email: 'test@example.com',
    full_name: 'Test User',
    ...overrides
  }
}
```

Usage:

```typescript
import { createExpressionEvent } from '@/__tests__/factories/expression-event.factory'

const post = createExpressionEvent({
  content: 'Custom content',
  moderation_status: 'pending'
})
```

## Supabase Mocking Patterns

### Mock Supabase Client

```typescript
// __tests__/mocks/supabase.ts
export const createMockSupabaseClient = () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({ data: [], error: null })
  })),
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    })
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null })
    }))
  }
})
```

### Mock RLS Context

```typescript
// __tests__/mocks/rls.ts
export const mockRLSContext = {
  authenticatedUserId: 'user-123',
  isAuthenticated: true,
  isAdmin: false
}
```

## Accessibility Testing

### Automated A11y Tests

```typescript
// components/flow/flow-submit-form.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { FlowSubmitForm } from './flow-submit-form'

expect.extend(toHaveNoViolations)

describe('FlowSubmitForm accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<FlowSubmitForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Keyboard Navigation Testing

```typescript
it('should be navigable via keyboard', () => {
  render(<FlowSubmitForm />)
  
  const textarea = screen.getByLabelText(/your expression/i)
  textarea.focus()
  expect(textarea).toHaveFocus()
  
  // Tab to submit button
  fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab' })
  // Verify focus moves to button
})
```

## E2E Testing with Playwright

### Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Critical User Journey Tests

```typescript
// e2e/flow-submission.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Flow Submission', () => {
  test('should submit expression and see it on wall', async ({ page }) => {
    // Navigate to flow page
    await page.goto('/flow')
    
    // Fill form
    await page.fill('textarea[name="content"]', 'E2E test expression')
    await page.click('button[type="submit"]')
    
    // Verify submission appears
    await expect(page.locator('text=E2E test expression')).toBeVisible()
  })

  test('should handle moderation queue', async ({ page }) => {
    // Test pending status display
    // Test admin approval flow
  })
})
```

### Homepage Manifesto Scroll Test

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage manifesto scroll experience', async ({ page }) => {
  await page.goto('/')
  
  // Verify hero section
  await expect(page.locator('h1')).toBeVisible()
  
  // Scroll through manifesto chapters
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  
  // Verify all chapters are visible
  const chapters = page.locator('[data-chapter]')
  await expect(chapters).toHaveCount(4)
})
```

## CI/CD Test Configuration

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Jest Setup File

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
import { jest } from '@jest/globals'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Supabase
jest.mock('@/lib/supabase/client')
jest.mock('@/lib/supabase/server')
```

### GitHub Actions CI

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Testing Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - tests implementation
expect(component.state.content).toBe('test')

// ✅ Good - tests user-visible behavior
expect(screen.getByText('test')).toBeInTheDocument()
```

### 2. Use Accessible Queries

Prefer queries that reflect how users interact:

```typescript
// Priority order:
// 1. getByRole (most accessible)
// 2. getByLabelText
// 3. getByPlaceholderText
// 4. getByText
// 5. getByTestId (last resort)
```

### 3. Test Error States

```typescript
it('should display error message on submission failure', async () => {
  // Mock API error
  mockSupabase.from().insert.mockRejectedValue(new Error('Network error'))
  
  render(<FlowSubmitForm />)
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})
```

### 4. Test Loading States

```typescript
it('should show loading state during submission', async () => {
  render(<FlowSubmitForm />)
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(screen.getByText(/submitting/i)).toBeInTheDocument()
})
```

## Common Testing Scenarios

### Flow Feature Tests
- Submit expression with text
- Submit expression with image
- Vibe tag selection
- Moderation queue display
- Real-time updates (mock Supabase Realtime)

### Clubhouse Tests
- Upload portal multi-step flow
- Media archive browsing
- Lore story rendering
- Member-only access control

### Auth Tests
- Login flow
- Signup validation
- Protected route redirects
- Session persistence

## Debugging Test Failures

1. **Run tests in watch mode**: `npm run test`
2. **Run single test file**: `jest path/to/test.test.ts`
3. **Run with verbose output**: `jest --verbose`
4. **Debug in VS Code**: Use Jest extension breakpoints
5. **Check test isolation**: Ensure tests don't share state

## Notes

- **Jest vs Vitest**: Project uses Jest (see package.json). Docs may reference Vitest but Jest is the active test runner.
- **Server Component Testing**: Test data fetching functions separately from component rendering.
- **Mock Supabase**: Always mock Supabase clients in tests to avoid hitting real database.
- **Accessibility First**: Include a11y tests for all interactive components.
