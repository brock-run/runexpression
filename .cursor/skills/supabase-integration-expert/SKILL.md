---
name: supabase-integration-expert
description: Mastery of Supabase patterns including RLS policies, Realtime subscriptions, Storage, and Auth flows for Next.js App Router. Use when creating new database tables and policies, implementing real-time features (Flow wall updates), setting up file uploads, debugging RLS policy issues, or optimizing database queries.
---

# Supabase Integration Expert

## Client Setup

**Server Components:**
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()
```

**Client Components:**
```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

**Never use service role key in client code.** Use admin client only in API routes or server-side operations.

---

## Row Level Security (RLS)

### Enable RLS on All Tables

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Policy Patterns

**Public read, authenticated write:**
```sql
CREATE POLICY "Public can view approved expressions"
ON expression_events FOR SELECT
USING (moderation_status = 'approved' AND visibility = 'public');

CREATE POLICY "Authenticated users can create expressions"
ON expression_events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

**User owns their data:**
```sql
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);
```

**Members-only access:**
```sql
CREATE POLICY "Club members can view contributions"
ON club_contributions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM club_memberships
    WHERE user_id = auth.uid()
    AND club_id = club_contributions.club_id
  )
);
```

### Storage Policies

```sql
-- Public read
CREATE POLICY "Public uploads are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads'
  AND auth.role() = 'authenticated'
);

-- User can delete own files
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Realtime Subscriptions

### Enable Realtime for Table

```sql
ALTER TABLE public.expression_events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expression_events;
```

### Client-Side Subscription Pattern

```typescript
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function FlowWall() {
  const [expressions, setExpressions] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    fetchExpressions()

    // Subscribe to new inserts
    const channel = supabase
      .channel('flow-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expression_events',
          filter: 'moderation_status=eq.approved'
        },
        (payload) => {
          setExpressions((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchExpressions() {
    const { data } = await supabase
      .from('expression_events')
      .select('*')
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50)

    setExpressions(data || [])
  }
}
```

**Always clean up subscriptions** in useEffect cleanup function.

---

## Storage Upload Flows

### Bucket Structure

- `uploads` - General file uploads (Flow images, clubhouse content)
- `products` - Product images for shop
- `avatars` - User profile pictures

### File Path Pattern

```
uploads/
  flow/
    2025/
      12/
        {timestamp}-{userId}-{filename}.jpg
  clubhouse/
    {clubSlug}/
      {timestamp}-{filename}.jpg
```

### Client-Side Upload (with Compression)

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import Compressor from 'compressorjs'

async function uploadImage(file: File) {
  const supabase = createClient()
  
  // 1. Compress client-side
  const compressedFile = await new Promise<File>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 1920,
      success: resolve,
      error: reject
    })
  })

  // 2. Generate file path
  const fileName = `${Date.now()}-${file.name}`
  const filePath = `flow/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`

  // 3. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, compressedFile)

  if (error) throw error

  // 4. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath)

  return publicUrl
}
```

### Server-Side Presigned URL (for Large Files)

```typescript
// app/api/upload/route.ts
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { fileName, fileType } = await request.json()
  const filePath = `clubhouse/${Date.now()}-${fileName}`

  const { data, error } = await supabase.storage
    .from('uploads')
    .createSignedUploadUrl(filePath)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    filePath: data.path
  })
}
```

---

## Auth Callback Handling

### Next.js App Router Callback Route

```typescript
// app/api/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

### Get Current User (Server)

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/login')
}
```

### Get Current User (Client)

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const supabase = createClient()
const [user, setUser] = useState(null)

useEffect(() => {
  supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null)
    }
  )

  return () => subscription.unsubscribe()
}, [])
```

---

## Database Query Optimization

### Select Only Needed Columns

```typescript
// ✅ Good
const { data } = await supabase
  .from('expression_events')
  .select('id, content, created_at')
  .eq('moderation_status', 'approved')

// ❌ Bad (selects all columns)
const { data } = await supabase
  .from('expression_events')
  .select('*')
```

### JSONB Queries

```typescript
// Extract text value
const { data } = await supabase
  .from('profiles')
  .select('id, expression_data->>bio')
  .eq('expression_data->>why_i_run', 'To find clarity')

// Access nested values
const { data } = await supabase
  .from('profiles')
  .select('expression_data->preferences->>units')
```

### Indexes for JSONB

```sql
-- If querying JSONB frequently
CREATE INDEX idx_profiles_units 
ON profiles ((expression_data->'preferences'->>'units'));
```

### Pagination

```typescript
const { data } = await supabase
  .from('expression_events')
  .select('*')
  .eq('moderation_status', 'approved')
  .order('created_at', { ascending: false })
  .range(0, 49) // First 50 items
```

---

## Common Patterns

### Check Club Membership

```typescript
const { data: membership } = await supabase
  .from('club_memberships')
  .select('role')
  .eq('user_id', user.id)
  .eq('club_id', clubId)
  .single()

if (!membership) {
  return NextResponse.json({ error: 'Not a club member' }, { status: 403 })
}
```

### Database Functions

```sql
-- Helper function example
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

### Error Handling

```typescript
const { data, error } = await supabase
  .from('expression_events')
  .insert({ content, user_id: user.id })

if (error) {
  console.error('Database error:', error)
  return NextResponse.json(
    { error: 'Failed to create expression' },
    { status: 500 }
  )
}
```

---

## Naming Conventions

- **Tables**: Plural, snake_case (`expression_events`, `club_memberships`)
- **Columns**: snake_case (`user_id`, `created_at`, `moderation_status`)
- **Foreign Keys**: `{table_singular}_id` (`user_id`, `club_id`)
- **Timestamps**: `created_at`, `updated_at` (timestamptz)
- **RLS Policies**: Descriptive names in quotes (`"Public can view approved expressions"`)

---

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Storage policies configured for buckets
- [ ] Auth checks in API routes before database operations
- [ ] User ownership verified in policies (`auth.uid() = user_id`)
- [ ] Service role key never exposed to client
- [ ] Input validation before database queries
- [ ] JSONB queries use parameterized values (not string concatenation)


## Related ADRs

- [ADR-002: Use Supabase as Backend-as-a-Service](../../docs/adr/002-supabase-backend.md) - We will use **Supabase** as our Backend-as-a-Service platform, providing:
- PostgreSQL database (managed)
- Built-in authentication (Supabase Auth with JWT)
- File storage (Supabase Storage, S3-compatible)
- Real-time subscriptions (WebSocket-based)
- Auto-generated REST and GraphQL APIs
- Row Level Security enforcement at database level

### Key Implementation Details:

- **Database:** PostgreSQL 15+ with hybrid relational + JSONB schema
- **Auth:** Supabase Auth with email/password (OAuth deferred to V1. 1)
- **Storage:** Supabase Storage buckets (`uploads`, `products`, `avatars`)
- **Realtime:** Subscribe to `expression_events` table for live Flow updates
- **RLS Policies:** All security enforced at database level (see ADR-004)
- **Client Libraries:** `@supabase/ssr` for Next. js App Router integration.
