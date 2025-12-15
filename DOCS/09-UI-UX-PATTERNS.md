# RunExpression V1: UI/UX Patterns

**Last Updated:** 2025-12-14
**Maintainer:** Engineering Team, Design Lead
**Status:** Living Document

---

## Overview

This document defines UI/UX patterns for RunExpression V1. All interfaces should follow these standards to ensure consistency, accessibility, and brand alignment.

**Design Philosophy:**
- **Expressive, not minimal:** Embrace personality (purple glows, monospace fonts)
- **Accessible by default:** WCAG 2.1 AA compliance minimum
- **Motion with purpose:** Animations enhance meaning, not distraction
- **Generous spacing:** Let content breathe (sage runner philosophy)
- **Progressive disclosure:** Show complexity gradually

**Brand Aesthetic:**
- **Colors:** Sage green (#6B7F6E), purple (#8B5CF6), cream (#F5F5DC)
- **Typography:** Monospace (DM Mono) for UI, serif (Merriweather) for body text
- **Tone:** Serious but lighthearted, deep but accessible ("Sage in the parking lot")

---

## 1. Component Patterns

### 1.1 Buttons

**Primary button (main actions):**
```tsx
import { Button } from '@/components/ui/button'

// ✅ Good
<Button className="bg-sage-600 hover:bg-sage-700 font-mono">
  Share Your Run
</Button>
```

**Secondary button (cancel, back):**
```tsx
// ✅ Good
<Button variant="outline" className="border-sage-400 text-sage-700 font-mono">
  Cancel
</Button>
```

**Destructive button (delete, remove):**
```tsx
// ✅ Good
<Button variant="destructive" className="font-mono">
  Delete Post
</Button>
```

**Button states:**
```tsx
// Loading state
<Button disabled className="font-mono">
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Submitting...
</Button>

// Disabled state
<Button disabled className="opacity-50 cursor-not-allowed font-mono">
  Submit (5 character minimum)
</Button>
```

**Button sizing:**
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### 1.2 Forms

**Form structure with validation:**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const FlowSubmitSchema = z.object({
  content: z.string().min(5, 'Minimum 5 characters').max(500, 'Maximum 500 characters'),
  vibeTags: z.array(z.string()).max(5, 'Maximum 5 tags').optional()
})

export function FlowSubmitForm() {
  const form = useForm({
    resolver: zodResolver(FlowSubmitSchema),
    defaultValues: { content: '', vibeTags: [] }
  })

  async function onSubmit(data: z.infer<typeof FlowSubmitSchema>) {
    // Submit logic...
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Input field */}
        <div>
          <label htmlFor="content" className="font-mono text-sm">
            What did you discover on your run?
          </label>
          <textarea
            id="content"
            {...form.register('content')}
            className="w-full rounded-md border p-3"
            rows={4}
          />
          {form.formState.errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Share'}
        </Button>
      </div>
    </form>
  )
}
```

**Form field patterns:**
```tsx
// ✅ Good (label + input + error message)
<div className="space-y-2">
  <label htmlFor="email" className="font-mono text-sm font-medium">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="w-full rounded-md border border-gray-300 p-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
    placeholder="runner@example.com"
  />
  <p className="text-sm text-red-600">Email is required</p>
</div>

// ❌ Bad (no label, no error feedback)
<input type="email" placeholder="Email" />
```

### 1.3 Cards

**Content card pattern:**
```tsx
// ✅ Good (Flow post card)
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
  <div className="flex items-start gap-4">
    {/* Avatar */}
    <div className="h-10 w-10 rounded-full bg-sage-200" />

    {/* Content */}
    <div className="flex-1">
      <p className="font-mono text-sm text-gray-600">@runner_name</p>
      <p className="mt-2 text-gray-900">{post.content}</p>

      {/* Vibe tags */}
      <div className="mt-3 flex gap-2">
        {post.vibeTags.map(tag => (
          <span key={tag} className="rounded-full bg-purple-100 px-3 py-1 text-xs font-mono text-purple-700">
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-500">{formatDate(post.created_at)}</p>
    </div>
  </div>
</div>
```

---

## 2. Loading States

### 2.1 Skeleton Loaders

**Use skeletons for content loading:**
```tsx
// ✅ Good (skeleton while loading posts)
{isLoading ? (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="animate-pulse rounded-lg border p-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  posts.map(post => <FlowPostCard key={post.id} post={post} />)
)}
```

**Spinner for inline actions:**
```tsx
import { Loader2 } from 'lucide-react'

// ✅ Good (spinner for button loading)
<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Submitting...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### 2.2 Progressive Loading

**Show initial content immediately:**
```tsx
// ✅ Good (show hero immediately, load posts async)
export default async function HomePage() {
  return (
    <>
      <HeroSection />  {/* Server-rendered, instant */}
      <Suspense fallback={<FlowSkeleton />}>
        <FlowPreview />  {/* Async component, loads after */}
      </Suspense>
    </>
  )
}
```

---

## 3. Error States

### 3.1 Inline Errors (Forms)

**Show errors near input:**
```tsx
// ✅ Good
<div>
  <input
    {...form.register('email')}
    className={cn(
      "w-full rounded-md border p-2",
      form.formState.errors.email && "border-red-500"
    )}
  />
  {form.formState.errors.email && (
    <p className="mt-1 text-sm text-red-600">
      {form.formState.errors.email.message}
    </p>
  )}
</div>

// ❌ Bad (error far from input)
<input {...form.register('email')} />
{/* ... 20 lines later ... */}
<p className="text-red-600">Email error here</p>
```

### 3.2 Toast Notifications

**Use toasts for action feedback:**
```tsx
import { toast } from 'sonner'

// ✅ Success toast
async function handleSubmit() {
  const result = await submitToFlow(content)

  if (result.error) {
    toast.error('Failed to submit', {
      description: result.error
    })
    return
  }

  toast.success('Your run was captured in The Flow', {
    description: 'Visible to the community in ~5 minutes'
  })
}

// ✅ Loading toast
const toastId = toast.loading('Uploading image...')
await uploadImage(file)
toast.success('Image uploaded!', { id: toastId })  // Replace loading toast
```

### 3.3 Error Pages

**Friendly error messages:**
```tsx
// ✅ Good (404 page)
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-mono text-6xl text-sage-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">This trail doesn't exist yet.</p>
      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
```

---

## 4. Accessibility

### 4.1 Keyboard Navigation

**All interactive elements must be keyboard accessible:**
```tsx
// ✅ Good (button is keyboard accessible)
<Button onClick={handleClick}>Submit</Button>

// ❌ Bad (div is not keyboard accessible)
<div onClick={handleClick}>Submit</div>

// ✅ Good (if must use div, add keyboard support)
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Submit
</div>
```

**Focus indicators:**
```css
/* ✅ Good (visible focus ring) */
.button:focus-visible {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}

/* ❌ Bad (removes focus indicator) */
.button:focus {
  outline: none;
}
```

### 4.2 ARIA Labels

**Label non-text elements:**
```tsx
// ✅ Good (icon button with label)
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// ❌ Bad (no label)
<Button>
  <X className="h-4 w-4" />
</Button>
```

**Use semantic HTML:**
```tsx
// ✅ Good (semantic elements)
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/flow">The Flow</a></li>
    <li><a href="/clubhouse">Clubhouse</a></li>
  </ul>
</nav>

// ❌ Bad (divs for everything)
<div>
  <div onClick={() => navigate('/flow')}>The Flow</div>
  <div onClick={() => navigate('/clubhouse')}>Clubhouse</div>
</div>
```

### 4.3 Screen Reader Support

**Announce dynamic content:**
```tsx
// ✅ Good (announce form submission result)
<div role="status" aria-live="polite">
  {submissionResult && (
    <p>{submissionResult.success ? 'Post created!' : 'Submission failed'}</p>
  )}
</div>
```

**Alt text for images:**
```tsx
// ✅ Good
<Image
  src={post.media_url}
  alt="Trail photo from morning run in Griffith Park"
  width={600}
  height={400}
/>

// ❌ Bad
<Image src={post.media_url} alt="" width={600} height={400} />
```

### 4.4 Color Contrast

**Ensure WCAG AA contrast (4.5:1 for text):**
```css
/* ✅ Good (sufficient contrast) */
.text-primary {
  color: #2D3748; /* Dark gray on white = 12:1 */
}

/* ❌ Bad (insufficient contrast) */
.text-gray {
  color: #CBD5E0; /* Light gray on white = 1.5:1 */
}
```

---

## 5. Animation Guidelines

### 5.1 Framer Motion Patterns

**Fade in on mount:**
```tsx
import { motion } from 'framer-motion'

// ✅ Good (subtle fade in)
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

**Slide in from bottom (modals, cards):**
```tsx
// ✅ Good (modal enter animation)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  <DialogContent>...</DialogContent>
</motion.div>
```

**Stagger children (lists):**
```tsx
// ✅ Good (Flow posts stagger in)
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {posts.map(post => (
    <motion.div
      key={post.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <FlowPostCard post={post} />
    </motion.div>
  ))}
</motion.div>
```

### 5.2 Performance

**Use `layoutId` for shared element transitions:**
```tsx
// ✅ Good (smooth transition between list and detail)
<motion.div layoutId={`post-${post.id}`}>
  <FlowPostCard post={post} />
</motion.div>

// On detail page:
<motion.div layoutId={`post-${post.id}`}>
  <FlowPostDetail post={post} />
</motion.div>
```

**Prefer `transform` and `opacity` for performance:**
```tsx
// ✅ Good (GPU-accelerated)
<motion.div
  animate={{ opacity: 1, scale: 1.05 }}
/>

// ❌ Bad (causes layout reflow)
<motion.div
  animate={{ width: '500px', height: '300px' }}
/>
```

### 5.3 Respect `prefers-reduced-motion`

```tsx
// ✅ Good (respect user preferences)
import { useReducedMotion } from 'framer-motion'

export function AnimatedCard() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: shouldReduceMotion ? 0 : -20
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3
      }}
    >
      {content}
    </motion.div>
  )
}
```

---

## 6. Responsive Design

### 6.1 Mobile-First Approach

**Start with mobile, enhance for desktop:**
```tsx
// ✅ Good (mobile first)
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-2xl md:text-4xl lg:text-6xl">The Flow</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {posts.map(post => <FlowPostCard key={post.id} post={post} />)}
  </div>
</div>
```

**Breakpoints (Tailwind defaults):**
```
sm:  640px   (Small tablets, large phones landscape)
md:  768px   (Tablets)
lg:  1024px  (Laptops)
xl:  1280px  (Desktops)
2xl: 1536px  (Large desktops)
```

### 6.2 Touch Targets

**Minimum 44x44px touch targets (iOS HIG):**
```tsx
// ✅ Good (adequate touch target)
<Button className="min-h-[44px] min-w-[44px] p-3">
  <Heart className="h-5 w-5" />
</Button>

// ❌ Bad (too small)
<button className="p-1">
  <Heart className="h-3 w-3" />
</button>
```

### 6.3 Responsive Typography

**Scale font sizes with viewport:**
```css
/* ✅ Good (responsive heading) */
.heading {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

```tsx
// ✅ Good (Tailwind responsive text)
<h1 className="text-3xl md:text-5xl lg:text-7xl font-mono">
  The Expressive Runner's Creed
</h1>
```

---

## 7. Brand-Specific Patterns

### 7.1 Purple Glow Effects

**Subtle glow for interactive elements:**
```tsx
// ✅ Good (purple glow on hover)
<div className="rounded-lg border border-gray-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
  {content}
</div>
```

### 7.2 Monospace UI Text

**Use monospace for UI labels, buttons:**
```tsx
// ✅ Good
<Button className="font-mono">Share Your Run</Button>
<label className="font-mono text-sm">Email</label>

// ❌ Bad (serif for UI text)
<Button className="font-serif">Share Your Run</Button>
```

**Use serif for body content:**
```tsx
// ✅ Good
<p className="font-serif text-lg leading-relaxed">
  We believe running is not just a physical act; it is a creative one...
</p>
```

### 7.3 Sage Green Accents

**Use sage green for primary actions:**
```tsx
// ✅ Good
<Button className="bg-sage-600 hover:bg-sage-700 text-white">
  Join The Flow
</Button>
```

---

## 8. Dialog and Modal Patterns

### 8.1 Dialog Structure

```tsx
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

// ✅ Good
<Dialog>
  <DialogTrigger asChild>
    <Button>Share Your Run</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[600px]">
    <div className="space-y-4">
      <h2 className="text-2xl font-mono">What did you discover?</h2>
      <FlowSubmitForm />
    </div>
  </DialogContent>
</Dialog>
```

### 8.2 Confirmation Dialogs

```tsx
// ✅ Good (clear confirmation)
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Post</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This will permanently delete your post from The Flow. This action cannot be undone.
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} className="bg-red-600">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 9. Data Display

### 9.1 Empty States

**Friendly empty state messages:**
```tsx
// ✅ Good
{posts.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="h-24 w-24 rounded-full bg-sage-100 flex items-center justify-center mb-4">
      <Footprints className="h-12 w-12 text-sage-600" />
    </div>
    <h3 className="font-mono text-xl text-gray-900">No runs yet</h3>
    <p className="mt-2 text-gray-600">
      Share your first run to start building your Flow.
    </p>
    <Button className="mt-6">Share Your Run</Button>
  </div>
) : (
  posts.map(post => <FlowPostCard key={post.id} post={post} />)
)}
```

### 9.2 Date Formatting

**Use relative dates for recent content:**
```typescript
// ✅ Good
import { formatDistanceToNow } from 'date-fns'

function formatPostDate(date: string) {
  const postDate = new Date(date)
  const now = new Date()
  const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return formatDistanceToNow(postDate, { addSuffix: true })  // "2 hours ago"
  }

  return postDate.toLocaleDateString()  // "Dec 14, 2025"
}
```

---

## Change Log

| Date       | Changes                                      | Author           |
|------------|----------------------------------------------|------------------|
| 2025-12-14 | Initial UI/UX patterns document created      | Engineering Team |

---

## References

- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Framer Motion Documentation:** https://www.framer.com/motion/
- **Shadcn/UI Components:** https://ui.shadcn.com/
- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **React Hook Form:** https://react-hook-form.com/
- **Related Docs:** [04-BRAND-CONTENT-GUIDE.md](./04-BRAND-CONTENT-GUIDE.md), [07-CODING-STANDARDS.md](./07-CODING-STANDARDS.md)
