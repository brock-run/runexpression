---
name: content-moderation-trust-systems
description: Implementing OpenAI moderation, trust scoring, and moderation queue workflows for user-generated content. Use when implementing Flow submission moderation, clubhouse upload approval workflows, building admin tools, handling edge cases in moderation, or integrating content filtering and validation.
---

# Content Moderation & Trust Systems

## Overview

RunExpression uses a multi-stage moderation system:
1. **OpenAI Moderation API** - Real-time text filtering (blocks obvious violations)
2. **Trust Scoring** - Auto-approve trusted users (>3 approved posts)
3. **Admin Queue** - Manual review for new users and edge cases
4. **Publication** - Approved content becomes public via Realtime

---

## OpenAI Moderation Integration

### Setup

**Environment Variable:**
```typescript
// env.ts
OPENAI_API_KEY: z.string().min(1)
```

**API Route Pattern:**
```typescript
// app/api/flow/submit/route.ts
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const body = await request.json()
  const { content, vibe_tags, type, media_url } = body

  // 1. OpenAI Moderation Check (text only)
  if (content) {
    try {
      const moderation = await openai.moderations.create({
        input: content
      })

      if (moderation.results[0].flagged) {
        // Store moderation result in metadata for analysis
        const categories = moderation.results[0].categories
        const flaggedCategories = Object.entries(categories)
          .filter(([_, flagged]) => flagged)
          .map(([category]) => category)

        return NextResponse.json(
          { 
            error: "Your submission couldn't be posted. Please ensure your content is respectful and appropriate.",
            flagged: true,
            categories: flaggedCategories
          },
          { status: 400 }
        )
      }
    } catch (error) {
      // Fallback: If OpenAI is down, proceed to manual queue (don't block)
      console.error('OpenAI moderation error:', error)
      // Continue to trust scoring...
    }
  }

  // 2. Proceed to trust scoring...
}
```

### What OpenAI Checks

- Hate speech
- Harassment/threatening
- Self-harm
- Sexual content
- Violence

### What Still Needs Manual Review

- **Images** (OpenAI Moderation is text-only)
- **Context/quality** (is submission meaningful?)
- **Spam** (repetitive submissions)

### Error Handling

**If OpenAI API is down:**
- Don't block submissions
- Log error and proceed to trust scoring
- Content goes to admin queue for manual review

**User-friendly error messages:**
```typescript
// ❌ Bad
{ error: 'Content flagged by moderation' }

// ✅ Good
{ error: "Your submission couldn't be posted. Please ensure your content is respectful and appropriate." }
```

---

## Trust Scoring

### Database Function

```sql
-- supabase/migrations/20250101000002_realtime_and_functions.sql
CREATE OR REPLACE FUNCTION public.get_user_trust_score(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM public.expression_events
        WHERE user_id = p_user_id
        AND moderation_status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Trust Scoring Logic

**Auto-approve threshold:** 3 approved posts

```typescript
// After OpenAI moderation passes
let moderation_status = 'pending'
let visibility = 'pending'

if (user) {
  const { count } = await supabase
    .from('expression_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('moderation_status', 'approved')

  if (count && count >= 3) {
    moderation_status = 'approved'
    visibility = 'public'
  }
}

// Create entry
const { data, error } = await supabase
  .from('expression_events')
  .insert({
    user_id: user?.id || null,
    type,
    content,
    media_url,
    vibe_tags,
    moderation_status,
    visibility,
    metadata: {
      ai_moderation_result: moderation.results?.[0] || null,
      trust_score_at_submission: count || 0
    }
  })
  .select()
  .single()
```

### Trust Score States

| User Status | Approved Posts | Moderation Status | Visibility |
|------------|----------------|-------------------|------------|
| New user | 0-2 | `pending` | `pending` |
| Trusted user | 3+ | `approved` | `public` |

---

## Database Schema

### expression_events Table

```sql
CREATE TABLE public.expression_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Content
    type TEXT CHECK (type IN ('text', 'image', 'photo_text')) NOT NULL,
    content TEXT,
    media_url TEXT,

    -- Moderation
    moderation_status TEXT CHECK (moderation_status IN ('pending', 'approved', 'rejected')) 
        DEFAULT 'pending' NOT NULL,
    moderation_reason TEXT,
    moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    moderated_at TIMESTAMPTZ,

    -- Visibility
    visibility TEXT CHECK (visibility IN ('public', 'private', 'pending')) 
        DEFAULT 'pending' NOT NULL,

    -- Metadata (store moderation results here)
    metadata JSONB DEFAULT '{}'::jsonb
    -- Example: {"ai_moderation_result": {...}, "trust_score_at_submission": 5}
);
```

### RLS Policies

```sql
-- Public can view approved expressions
CREATE POLICY "Public can view approved expressions"
    ON public.expression_events FOR SELECT
    USING (visibility = 'public' AND moderation_status = 'approved');

-- Users can view their own expressions (even pending)
CREATE POLICY "Users can view their own expressions"
    ON public.expression_events FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create expressions
CREATE POLICY "Users can create expressions"
    ON public.expression_events FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

---

## Admin Moderation Queue

### Query Pending Entries

```typescript
// app/api/admin/moderation-queue/route.ts
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('expression_events')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email
      )
    `)
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

### Approve/Reject Actions

```typescript
// app/api/admin/moderate/route.ts
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // IMPORTANT: Use server client (not admin) to get the authenticated user
  // The admin client has no session context and getUser() would fail
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Verify user is authenticated
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin (from app_metadata set during signup/by admin)
  const isAdmin = user.app_metadata?.role === 'admin'

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  const body = await request.json()
  const { entry_id, action, reason } = body // action: 'approve' | 'reject'

  const moderation_status = action === 'approve' ? 'approved' : 'rejected'
  const visibility = action === 'approve' ? 'public' : 'private'

  // Use admin client for the update to bypass RLS
  // (moderation updates may need to modify rows the user can't normally access)
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('expression_events')
    .update({
      moderation_status,
      visibility,
      moderation_reason: reason || null,
      moderated_by: user.id,
      moderated_at: new Date().toISOString()
    })
    .eq('id', entry_id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

### Bulk Actions

```typescript
// Bulk approve safe entries
export async function POST(request: Request) {
  const body = await request.json()
  const { entry_ids, action } = body

  const moderation_status = action === 'approve' ? 'approved' : 'rejected'
  const visibility = action === 'approve' ? 'public' : 'private'

  const { data, error } = await supabase
    .from('expression_events')
    .update({
      moderation_status,
      visibility,
      moderated_by: user.id,
      moderated_at: new Date().toISOString()
    })
    .in('id', entry_ids)
    .select()

  return NextResponse.json({ data, count: data?.length || 0 })
}
```

---

## User Experience Patterns

### Optimistic UI

```typescript
// Client component
'use client'

import { useState } from 'react'

export function FlowSubmitForm() {
  const [submitted, setSubmitted] = useState(false)
  const [pendingEntry, setPendingEntry] = useState(null)

  const handleSubmit = async (formData) => {
    // Optimistic: Show entry immediately
    const optimisticEntry = {
      id: 'temp-' + Date.now(),
      ...formData,
      moderation_status: 'pending',
      visibility: 'pending'
    }
    setPendingEntry(optimisticEntry)
    setSubmitted(true)

    // Submit to API
    const response = await fetch('/api/flow/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    const result = await response.json()

    if (result.data) {
      // Replace optimistic entry with real one
      setPendingEntry(result.data)
      
      if (result.moderation_status === 'approved') {
        // Show success: "Your expression is live!"
      } else {
        // Show pending: "Your expression is being reviewed"
      }
    }
  }
}
```

### Pending State Indicators

```typescript
// Show subtle indicator for pending entries
{entry.moderation_status === 'pending' && (
  <div className="text-sm text-gray-500">
    Your expression is being reviewed
  </div>
)}
```

---

## Edge Cases & Best Practices

### Image Moderation

**Current:** Images are not moderated by OpenAI (text-only API). Manual review required.

**Future (V1.1):** Consider Clarifai or AWS Rekognition for image moderation.

### False Positives

**Handling:**
- Store moderation results in `metadata.ai_moderation_result`
- Allow admins to override AI decisions
- Track false positive rate for analysis

**Appeal Process (V1.1):**
- Users can request review of rejected content
- Admin dashboard shows appeal requests

### Privacy Considerations

- Disclose in privacy policy that user content is sent to OpenAI for moderation
- Store moderation results in database for audit trail
- Don't log full content in error logs (privacy)

### Performance

- OpenAI Moderation API: <500ms response time
- Free tier: 1M requests/month (sufficient for V1)
- Rate limit: 3K requests/min (far exceeds needs)

---

## Testing Patterns

### Mock OpenAI Moderation

```typescript
// __mocks__/openai.ts
export const mockModeration = {
  results: [{
    flagged: false,
    categories: {},
    category_scores: {}
  }]
}

// In tests
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    moderations: {
      create: jest.fn(() => Promise.resolve(mockModeration))
    }
  }))
}))
```

### Test Trust Scoring

```typescript
// Test auto-approve after 3 posts
it('auto-approves trusted users', async () => {
  // Create 3 approved posts for user
  await createApprovedPosts(userId, 3)
  
  // Submit new post
  const response = await submitFlowEntry(userId, { content: 'Test' })
  
  expect(response.moderation_status).toBe('approved')
  expect(response.visibility).toBe('public')
})
```

---

## Related Patterns

- **RLS Policies:** See `supabase-integration-expert` skill
- **Realtime Updates:** Approved entries push to wall via Supabase Realtime
- **Error Handling:** User-friendly messages, never expose technical details
- **Database Types:** Generate types after schema changes: `npm run db:types`


## Related ADRs

- [ADR-007: OpenAI Moderation API for Content Filtering](../../docs/adr/007-openai-moderation.md) - We will use **OpenAI Moderation API** to automatically filter text submissions in real-time before they enter the moderation queue. ### Key Implementation Details:

**Flow:**
1. User submits text to The Flow
2.
