---
name: flow-feature-patterns
description: RunExpression Flow feature patterns including vibe tag taxonomy, moderation workflows, real-time subscription patterns, and Flow wall implementation. Use when implementing Flow features, vibe tag filtering, moderation queues, real-time updates, or Flow submission flows.
---

# Flow Feature Patterns

## Overview

The Flow is RunExpression's interactive canvas where runners express themselves through text and images. This skill covers the patterns, conventions, and implementation details for all Flow-related features.

## Vibe Tag Taxonomy

### Core Vibe Tags

The Flow uses a curated set of vibe tags that capture the emotional and experiential quality of a run:

**Emotional States:**
- `Meditative` - Quiet, reflective, contemplative runs
- `Aggressive` - Hard efforts, pushing limits, intensity
- `Playful` - Fun, lighthearted, experimental runs
- `Grateful` - Appreciation, thankfulness, perspective
- `Heavy` - Emotional weight, processing, difficult runs

**Run Characteristics:**
- `Solo` - Running alone
- `Social` - Running with others, crew runs
- `Trail` - Off-road, nature-focused
- `Grind` - Hard work, persistence, tough runs
- `Recovery` - Easy, restorative runs

**Special:**
- `DWTC` - "Don't Waste The Coffee" club-specific runs
- `Morning Miles` - Early morning runs
- `Float` - Effortless, flow-state runs

### Vibe Tag Usage Patterns

```typescript
// Vibe tags are stored as array in expression_events table
const vibeTags: string[] = ['Meditative', 'Solo', 'Morning Miles'];

// Maximum 5 tags per submission
const MAX_VIBE_TAGS = 5;

// Tags are case-sensitive and must match exact strings
const VALID_VIBE_TAGS = [
  'Meditative', 'Aggressive', 'Playful', 'Grateful', 'Heavy',
  'Solo', 'Social', 'Trail', 'Grind', 'Recovery',
  'DWTC', 'Morning Miles', 'Float'
];
```

### Vibe Tag Filtering

```typescript
// Filter Flow entries by vibe tag
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .contains('vibe_tags', [selectedTag]);

// Multiple tag filtering (AND logic)
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .contains('vibe_tags', ['Meditative', 'Solo']);
```

## Moderation Workflow Patterns

### Submission Flow

1. **User submits** → Text/image to `/api/flow/submit`
2. **OpenAI Moderation** → Text checked via OpenAI Moderation API (ADR-007)
3. **Trust Scoring** → Check user's trust score (auto-approve if trusted)
4. **Admin Queue** → If not auto-approved, add to moderation queue
5. **Publish** → Once approved, appears on Flow wall

### Trust Scoring Logic

```typescript
// Trust score increases with each approved submission
const TRUST_THRESHOLD = 5; // Auto-approve after 5 approved posts

interface UserTrustScore {
  user_id: string;
  approved_count: number;
  rejected_count: number;
  trust_score: number; // 0-100
}

// Auto-approve logic
function shouldAutoApprove(user: UserTrustScore): boolean {
  return user.approved_count >= TRUST_THRESHOLD && 
         user.rejected_count === 0;
}
```

### Moderation Queue Patterns

```typescript
// Get pending moderation items
const { data: pending } = await supabase
  .from('expression_events')
  .select('*')
  .eq('moderation_status', 'pending')
  .order('created_at', { ascending: true });

// Approve submission
await supabase
  .from('expression_events')
  .update({ 
    moderation_status: 'approved',
    approved_at: new Date().toISOString(),
    approved_by: adminUserId
  })
  .eq('id', submissionId);

// Reject submission
await supabase
  .from('expression_events')
  .update({ 
    moderation_status: 'rejected',
    rejected_at: new Date().toISOString(),
    rejection_reason: 'Inappropriate content'
  })
  .eq('id', submissionId);
```

### OpenAI Moderation Integration

```typescript
// app/api/flow/submit/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function moderateContent(text: string) {
  const moderation = await openai.moderations.create({ input: text });
  
  if (moderation.results[0].flagged) {
    return {
      flagged: true,
      categories: moderation.results[0].categories,
      reason: 'Content flagged by moderation'
    };
  }
  
  return { flagged: false };
}
```

## Real-Time Subscription Patterns

### Flow Wall Updates

```typescript
// components/flow/flow-wall.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function FlowWall() {
  const [posts, setPosts] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to new Flow entries
    const channel = supabase
      .channel('flow-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'expression_events',
        filter: 'moderation_status=eq.approved'
      }, (payload) => {
        // Add new post to top of list
        setPosts(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // ... render posts
}
```

### Filtered Real-Time Updates

```typescript
// Real-time updates that respect vibe tag filter
useEffect(() => {
  if (!selectedVibeTag) {
    // Subscribe to all approved posts
    const channel = supabase
      .channel('flow-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'expression_events',
        filter: 'moderation_status=eq.approved'
      }, handleNewPost)
      .subscribe()
    
    return () => supabase.removeChannel(channel)
  }

  // For filtered views, poll instead (Supabase Realtime doesn't support JSONB filters)
  const interval = setInterval(() => {
    fetchFilteredPosts(selectedVibeTag)
  }, 5000) // Poll every 5 seconds

  return () => clearInterval(interval)
}, [selectedVibeTag])
```

## Flow Submission Patterns

### Text Submission

```typescript
// components/flow/flow-submission-form.tsx
'use client'

import { z } from 'zod'

const submissionSchema = z.object({
  content: z.string().min(5).max(500),
  vibe_tags: z.array(z.string()).max(5).optional(),
  image_url: z.string().url().optional()
})

export function FlowSubmissionForm() {
  const handleSubmit = async (data: z.infer<typeof submissionSchema>) => {
    const response = await fetch('/api/flow/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      // Show brand-aligned error message
      setError(error.error || "Oops, that didn't work. Try again?")
      return
    }

    // Success - show brand message
    showSuccess("Your expression just joined the Flow.")
  }
}
```

### Image Submission with Compression

```typescript
// Client-side image compression (ADR-008)
import Compressor from 'compressorjs'

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      convertTypes: ['image/png'],
      convertSize: 5000000, // 5MB
      success: (compressedFile) => resolve(compressedFile as File),
      error: reject
    })
  })
}

// Upload compressed image to Supabase Storage
async function uploadFlowImage(file: File) {
  const compressed = await compressImage(file)
  const fileName = `${Date.now()}-${compressed.name}`
  
  const { data, error } = await supabase.storage
    .from('flow-images')
    .upload(fileName, compressed, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error
  return data.path
}
```

## Flow Wall Display Patterns

### Post Card Component

```typescript
// components/flow/flow-post-card.tsx
interface FlowPost {
  id: string
  content: string | null
  image_url: string | null
  vibe_tags: string[]
  user_id: string
  created_at: string
  user?: {
    full_name: string
    avatar_url?: string
  }
}

export function FlowPostCard({ post }: { post: FlowPost }) {
  return (
    <article className="flow-post">
      {post.image_url && (
        <img src={post.image_url} alt={post.content || 'Flow image'} />
      )}
      {post.content && <p>{post.content}</p>}
      <div className="vibe-tags">
        {post.vibe_tags.map(tag => (
          <span key={tag} className="vibe-tag">{tag}</span>
        ))}
      </div>
      <footer>
        <span>{post.user?.full_name || 'Anonymous'}</span>
        <time>{formatDate(post.created_at)}</time>
      </footer>
    </article>
  )
}
```

### Pagination Pattern

```typescript
// Infinite scroll or pagination
const POSTS_PER_PAGE = 20

async function fetchFlowPosts(page: number = 0, vibeTag?: string) {
  let query = supabase
    .from('expression_events')
    .select('*, profiles(full_name, avatar_url)')
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1)

  if (vibeTag) {
    query = query.contains('vibe_tags', [vibeTag])
  }

  const { data, error } = await query
  return { data, error }
}
```

## Database Schema

```sql
-- expression_events table structure
CREATE TABLE expression_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  image_url text,
  vibe_tags text[] DEFAULT '{}',
  moderation_status text DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderation_metadata jsonb,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid REFERENCES profiles(id)
);

-- Index for vibe tag filtering
CREATE INDEX idx_expression_events_vibe_tags ON expression_events USING GIN(vibe_tags);

-- Index for moderation queue
CREATE INDEX idx_expression_events_moderation ON expression_events(moderation_status, created_at);
```

## Related ADRs

- [ADR-007: OpenAI Moderation API](../../docs/adr/007-openai-moderation.md) - Content filtering approach
- [ADR-008: Client-Side Image Compression](../../docs/adr/008-client-side-compression.md) - Image handling
- [ADR-002: Supabase Backend](../../docs/adr/002-supabase-backend.md) - Real-time capabilities

## Related Documentation

- **Product Requirements**: `docs/02-PRODUCT-REQUIREMENTS.md` (Section F2: The Flow)
- **Database Schema**: `docs/06-DATA-SCHEMA.md`
- **Content Moderation Skill**: `.cursor/skills/content-moderation-trust-systems/SKILL.md`

---

**Remember**: The Flow is about expression, not perfection. Every submission should make runners feel less alone.
