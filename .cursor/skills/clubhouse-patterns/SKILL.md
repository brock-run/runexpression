---
name: clubhouse-patterns
description: RunExpression Clubhouse patterns including upload portal multi-step flows, media archive lightbox patterns, lore story markdown rendering, and club-specific features. Use when implementing clubhouse features, upload workflows, media galleries, lore stories, or club-specific functionality.
---

# Clubhouse Patterns

## Overview

The Clubhouse is RunExpression's member archive for clubs (starting with DWTC - "Don't Waste The Coffee"). This skill covers patterns for upload portals, media archives, lore stories, and club-specific features.

## Upload Portal Multi-Step Flow

### Step Flow Structure

The upload portal uses a multi-step wizard pattern:

1. **Select Content Type** → Lore, Media, or Resource
2. **Upload File** (if applicable) → Image, video, or document
3. **Add Metadata** → Title, description, tags, date
4. **Review & Submit** → Preview and confirm
5. **Moderation Queue** → Admin approval (if needed)

### Implementation Pattern

```typescript
// components/clubhouse/upload-portal.tsx
'use client'

import { useState } from 'react'

type UploadStep = 'type' | 'file' | 'metadata' | 'review'

interface UploadState {
  step: UploadStep
  contentType: 'lore' | 'media' | 'resource' | null
  file: File | null
  metadata: {
    title: string
    description: string
    tags: string[]
    date: string
  }
}

export function UploadPortal() {
  const [state, setState] = useState<UploadState>({
    step: 'type',
    contentType: null,
    file: null,
    metadata: {
      title: '',
      description: '',
      tags: [],
      date: new Date().toISOString().split('T')[0]
    }
  })

  const handleNext = () => {
    const steps: UploadStep[] = ['type', 'file', 'metadata', 'review']
    const currentIndex = steps.indexOf(state.step)
    if (currentIndex < steps.length - 1) {
      setState(prev => ({ ...prev, step: steps[currentIndex + 1] }))
    }
  }

  const handleBack = () => {
    const steps: UploadStep[] = ['type', 'file', 'metadata', 'review']
    const currentIndex = steps.indexOf(state.step)
    if (currentIndex > 0) {
      setState(prev => ({ ...prev, step: steps[currentIndex - 1] }))
    }
  }

  return (
    <div className="upload-portal">
      {/* Step indicator */}
      <StepIndicator currentStep={state.step} />
      
      {/* Step content */}
      {state.step === 'type' && <ContentTypeSelector />}
      {state.step === 'file' && <FileUploader />}
      {state.step === 'metadata' && <MetadataForm />}
      {state.step === 'review' && <ReviewStep />}
      
      {/* Navigation */}
      <div className="upload-nav">
        {state.step !== 'type' && (
          <button onClick={handleBack}>Back</button>
        )}
        {state.step !== 'review' && (
          <button onClick={handleNext}>Next</button>
        )}
        {state.step === 'review' && (
          <button onClick={handleSubmit}>Add to Archive</button>
        )}
      </div>
    </div>
  )
}
```

### File Upload Pattern

```typescript
// components/clubhouse/file-uploader.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Compressor from 'compressorjs'

export function FileUploader({ onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const supabase = createClient()

  const handleFileSelect = async (file: File) => {
    setUploading(true)
    
    try {
      // Compress image if needed (ADR-008)
      let fileToUpload = file
      if (file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file)
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${fileToUpload.name}`
      const { data, error } = await supabase.storage
        .from('clubhouse-media')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setProgress(progress.percent || 0)
          }
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('clubhouse-media')
        .getPublicUrl(data.path)

      onUploadComplete(urlData.publicUrl)
    } catch (error) {
      console.error('Upload failed:', error)
      // Show brand-aligned error
    } finally {
      setUploading(false)
    }
  }

  async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        success: (compressed) => resolve(compressed as File),
        error: reject
      })
    })
  }
}
```

## Media Archive Lightbox Patterns

### Gallery Grid Layout

```typescript
// components/clubhouse/media-gallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MediaItem {
  id: string
  title: string
  image_url: string
  description?: string
  created_at: string
  uploaded_by: string
}

export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  return (
    <>
      <div className="media-grid">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="media-thumbnail"
          >
            <Image
              src={item.image_url}
              alt={item.title}
              width={300}
              height={300}
              className="object-cover"
            />
            <div className="media-overlay">
              <h3>{item.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {selectedItem && (
        <Lightbox
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onNext={() => navigateNext()}
          onPrev={() => navigatePrev()}
        />
      )}
    </>
  )
}
```

### Lightbox Component

```typescript
// components/clubhouse/lightbox.tsx
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function Lightbox({ 
  item, 
  onClose, 
  onNext, 
  onPrev 
}: LightboxProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>
          <X />
        </button>
        
        <Image
          src={item.image_url}
          alt={item.title}
          width={1200}
          height={800}
          className="lightbox-image"
        />
        
        <div className="lightbox-info">
          <h2>{item.title}</h2>
          {item.description && <p>{item.description}</p>}
          <footer>
            <span>Uploaded by {item.uploaded_by}</span>
            <time>{formatDate(item.created_at)}</time>
          </footer>
        </div>

        <button className="lightbox-prev" onClick={onPrev}>
          <ChevronLeft />
        </button>
        <button className="lightbox-next" onClick={onNext}>
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
```

## Lore Story Markdown Rendering

### MDX/Markdown Rendering

```typescript
// components/clubhouse/lore-story.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'next/image'

interface LoreStory {
  id: string
  title: string
  content: string // Markdown content
  author_id: string
  created_at: string
  images?: string[]
}

export async function LoreStory({ story }: { story: LoreStory }) {
  // Serialize markdown to MDX
  const mdxSource = await serialize(story.content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: []
    }
  })

  // Custom components for MDX
  const components = {
    img: (props: any) => (
      <Image
        src={props.src}
        alt={props.alt || ''}
        width={800}
        height={600}
        className="lore-image"
      />
    ),
    h1: (props: any) => <h1 className="lore-heading" {...props} />,
    p: (props: any) => <p className="lore-paragraph" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="lore-quote" {...props} />
    )
  }

  return (
    <article className="lore-story">
      <header>
        <h1>{story.title}</h1>
        <div className="story-meta">
          <span>By {story.author?.full_name}</span>
          <time>{formatDate(story.created_at)}</time>
        </div>
      </header>
      
      <div className="lore-content">
        <MDXRemote {...mdxSource} components={components} />
      </div>
    </article>
  )
}
```

### Lore Story Seed Content Patterns

```typescript
// Example lore story structure
const loreStoryTemplate = {
  title: "The First Bacon Ritual",
  content: `
# The First Bacon Ritual

It was 5:30 AM on a Tuesday. The parking lot was empty except for us.

We'd just finished a brutal track workout. Someone—I don't remember who—pulled out a portable grill. Another person had bacon. The rest is history.

> "We take our fun very seriously. Our suffering, less so."

That first bacon ritual wasn't planned. It just happened. And now it's who we are.

![Bacon on grill](https://example.com/bacon-grill.jpg)

The ritual isn't about the bacon. It's about the gathering. The pause. The recognition that we did something hard together, and now we get to share a moment.

Process over outcome. Always.
  `,
  tags: ['DWTC', 'Ritual', 'Origin Story'],
  category: 'lore'
}
```

## Club-Specific Features

### Club Membership Check

```typescript
// lib/clubhouse/membership.ts
export async function checkClubMembership(
  userId: string,
  clubSlug: string
): Promise<boolean> {
  const supabase = createClient()
  
  const { data } = await supabase
    .from('club_memberships')
    .select('id')
    .eq('user_id', userId)
    .eq('club_id', (
      await supabase
        .from('clubs')
        .select('id')
        .eq('slug', clubSlug)
        .single()
    ).data?.id)
    .single()

  return !!data
}
```

### Club Upload Permissions

```typescript
// app/api/clubhouse/upload/route.ts
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check club membership
  const { searchParams } = new URL(request.url)
  const clubSlug = searchParams.get('club')
  
  const isMember = await checkClubMembership(user.id, clubSlug || 'dwtc')
  
  if (!isMember) {
    return NextResponse.json(
      { error: 'Club membership required' },
      { status: 403 }
    )
  }

  // Proceed with upload...
}
```

## Database Schema

```sql
-- Clubhouse content tables
CREATE TABLE clubhouse_lore (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL, -- Markdown
  author_id uuid REFERENCES profiles(id),
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE clubhouse_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id),
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE clubhouse_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  resource_type text CHECK (resource_type IN ('training-plan', 'route', 'document', 'other')),
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);
```

## Related ADRs

- [ADR-005: MDX Content](../../docs/adr/005-mdx-content.md) - Markdown rendering approach
- [ADR-008: Client-Side Image Compression](../../docs/adr/008-client-side-compression.md) - Image handling
- [ADR-002: Supabase Backend](../../docs/adr/002-supabase-backend.md) - Storage and database

## Related Documentation

- **Product Requirements**: `docs/02-PRODUCT-REQUIREMENTS.md` (Section F3: Clubhouse)
- **Database Schema**: `docs/06-DATA-SCHEMA.md`
- **Brand Voice**: `.cursor/skills/runexpression-brand-voice/SKILL.md`

---

**Remember**: The Clubhouse is about preserving memories and building lore. Every upload should honor the community's story.
