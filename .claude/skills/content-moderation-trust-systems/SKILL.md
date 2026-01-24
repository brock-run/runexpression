---
name: content-moderation-trust-systems
description: Use when implementing Flow submission moderation, clubhouse upload approval workflows, building admin tools, handling edge cases in moderation, or integrating content filtering and validation with OpenAI moderation API and trust scoring
---

# Content Moderation & Trust Systems

## Overview

RunExpression uses multi-stage moderation: OpenAI Moderation API (real-time text filtering) → Trust Scoring (auto-approve trusted users) → Admin Queue (manual review) → Publication via Realtime.

## OpenAI Moderation Integration

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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const body = await request.json()
  const { content } = body

  // OpenAI Moderation Check (text only)
  if (content) {
    try {
      const moderation = await openai.moderations.create({ input: content })

      if (moderation.results[0].flagged) {
        const flaggedCategories = Object.entries(moderation.results[0].categories)
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
    }
  }

  // Proceed to trust scoring...
}
```

**What OpenAI Checks:** Hate speech, harassment, self-harm, sexual content, violence

**What Needs Manual Review:** Images (text-only API), context/quality, spam

**Error Handling:** If OpenAI API is down, don't block - log error and proceed to trust scoring

## Trust Scoring

**Auto-approve threshold:** 3 approved posts

```sql
-- Database function
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
```

| User Status | Approved Posts | Moderation Status | Visibility |
|------------|----------------|-------------------|------------|
| New user | 0-2 | `pending` | `pending` |
| Trusted user | 3+ | `approved` | `public` |

## Database Schema

```sql
CREATE TABLE public.expression_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Content
    type TEXT CHECK (type IN ('text', 'image', 'photo_text')) NOT NULL,
    content TEXT,
    media_url TEXT,

    -- Moderation
    moderation_status TEXT CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    moderation_reason TEXT,
    moderated_by UUID REFERENCES public.profiles(id),
    moderated_at TIMESTAMPTZ,

    -- Visibility
    visibility TEXT CHECK (visibility IN ('public', 'private', 'pending')) DEFAULT 'pending',

    -- Metadata (store moderation results)
    metadata JSONB DEFAULT '{}'::jsonb
);
```

**RLS Policies:**
```sql
-- Public can view approved expressions
CREATE POLICY "Public can view approved expressions"
    ON public.expression_events FOR SELECT
    USING (visibility = 'public' AND moderation_status = 'approved');

-- Users can view their own expressions
CREATE POLICY "Users can view their own expressions"
    ON public.expression_events FOR SELECT
    USING (auth.uid() = user_id);
```

## Admin Moderation Queue

**Query Pending Entries:**
```typescript
// app/api/admin/moderation-queue/route.ts
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('expression_events')
    .select(`*, profiles:user_id (id, full_name, email)`)
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: false })

  return NextResponse.json({ data })
}
```

**Approve/Reject Actions:**
```typescript
// app/api/admin/moderate/route.ts
export async function POST(request: Request) {
  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { entry_id, action, reason } = await request.json()

  const moderation_status = action === 'approve' ? 'approved' : 'rejected'
  const visibility = action === 'approve' ? 'public' : 'private'

  const { data } = await supabase
    .from('expression_events')
    .update({
      moderation_status,
      visibility,
      moderation_reason: reason || null,
      moderated_by: user.id,
      moderated_at: new Date().toISOString()
    })
    .eq('id', entry_id)

  return NextResponse.json({ data })
}
```

## User Experience Patterns

**Optimistic UI:**
```typescript
'use client'
export function FlowSubmitForm() {
  const [pendingEntry, setPendingEntry] = useState(null)

  const handleSubmit = async (formData) => {
    // Show entry immediately
    setPendingEntry({ ...formData, moderation_status: 'pending' })

    const response = await fetch('/api/flow/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    const result = await response.json()
    if (result.moderation_status === 'approved') {
      // "Your expression is live!"
    } else {
      // "Your expression is being reviewed"
    }
  }
}
```

## Edge Cases

**Image Moderation:** Images not moderated by OpenAI (text-only API). Manual review required. Consider Clarifai or AWS Rekognition for V1.1.

**False Positives:** Store moderation results in `metadata.ai_moderation_result`. Allow admins to override.

**Privacy:** Disclose in privacy policy that content is sent to OpenAI for moderation. Don't log full content in error logs.

**Performance:** OpenAI Moderation API <500ms, free tier 1M requests/month, rate limit 3K requests/min.

## Testing Patterns

**Mock OpenAI:**
```typescript
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    moderations: {
      create: jest.fn(() => Promise.resolve({
        results: [{ flagged: false, categories: {} }]
      }))
    }
  }))
}))
```

**Test Trust Scoring:**
```typescript
it('auto-approves trusted users', async () => {
  await createApprovedPosts(userId, 3)
  const response = await submitFlowEntry(userId, { content: 'Test' })
  expect(response.moderation_status).toBe('approved')
})
```

## Related Patterns

- **RLS Policies:** See `supabase-integration-expert` skill
- **Realtime Updates:** Approved entries push to wall via Supabase Realtime
- **Database Types:** Generate types after schema changes: `npm run db:types`
