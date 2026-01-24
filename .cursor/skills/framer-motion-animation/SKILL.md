---
name: framer-motion-animation
description: Implementing smooth, performant animations with Framer Motion that respect accessibility preferences. Use when creating scroll-triggered animations (manifesto chapters), stagger animations for lists, shared element transitions, modal/dialog transitions, Flow wall entry animations, or any motion-heavy features.
---

# Framer Motion Animation

## Quick Start

When implementing animations:

1. Always respect `prefers-reduced-motion` using `useReducedMotion()`
2. Use `transform` and `opacity` for GPU-accelerated performance
3. Prefer variants for reusable animation patterns
4. Use `useInView` for scroll-triggered animations
5. Keep animations subtle and purposeful (RunExpression brand: deep but accessible)

## Core Principles

### Accessibility First

**Always check for reduced motion preference:**

```tsx
import { useReducedMotion } from 'framer-motion'

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: shouldReduceMotion ? 0 : -20,
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
      }}
    >
      {content}
    </motion.div>
  )
}
```

### Performance Best Practices

**Use GPU-accelerated properties:**
```tsx
// ✅ Good (transform and opacity are GPU-accelerated)
<motion.div
  animate={{ opacity: 1, scale: 1.05, y: 0 }}
/>

// ❌ Bad (causes layout reflow)
<motion.div
  animate={{ width: '500px', height: '300px' }}
/>
```

## Common Animation Patterns

### Scroll-Triggered Animations

**For manifesto chapters and scroll-reveal content:**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: 'easeOut',
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
```

**Key points:**
- Use `useInView` with `once: true` to trigger once
- Set `margin: '-100px'` to trigger before element enters viewport
- Use `useAnimation` for programmatic control

### Stagger Animations for Lists

**For Flow wall posts and card grids:**

```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 100ms delay between children
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: 'easeOut' },
        },
      }}
    >
      <ItemCard item={item} />
    </motion.div>
  ))}
</motion.div>
```

**Stagger timing guidelines:**
- Fast lists (many items): `0.05` - `0.08`
- Medium lists: `0.1` - `0.15`
- Slow, dramatic reveals: `0.2` - `0.3`

### Shared Element Transitions

**For smooth transitions between list and detail views:**

```tsx
// List view
<motion.div layoutId={`post-${post.id}`}>
  <FlowPostCard post={post} />
</motion.div>

// Detail view (same layoutId)
<motion.div layoutId={`post-${post.id}`}>
  <FlowPostDetail post={post} />
</motion.div>
```

**Requirements:**
- Both elements must have the same `layoutId`
- Elements should be similar in structure for smooth transition
- Works best with AnimatePresence for exit animations

### Modal/Dialog Transitions

**For Shadcn Dialog and modal components:**

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'

function AnimatedDialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent asChild>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
```

**Overlay animation:**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-black/50"
/>
```

### Fade In on Mount

**Simple fade for any component:**

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### Hover and Tap Interactions

**For interactive elements (buttons, cards):**

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  <Button>Interactive Button</Button>
</motion.div>
```

**Brand-specific hover effects:**
```tsx
// Purple glow on hover (RunExpression brand)
<motion.div
  whileHover={{ 
    scale: 1.02,
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
  }}
  className="rounded-lg border transition-shadow"
>
  {content}
</motion.div>
```

## Advanced Patterns

### AnimatePresence for Exit Animations

**When elements are conditionally rendered:**

```tsx
import { AnimatePresence } from 'framer-motion'

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

**Modes:**
- `mode="wait"`: Wait for exit before entering
- `mode="sync"`: Exit and enter simultaneously (default)

### Layout Animations

**For automatic layout transitions:**

```tsx
<motion.div layout>
  {/* Content that changes size/position */}
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Use cases:**
- Filtering lists
- Expanding/collapsing sections
- Reordering items

### Scroll-Linked Animations

**For parallax or scroll progress animations:**

```tsx
import { useScroll, useTransform } from 'framer-motion'

function ScrollLinkedComponent() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  return (
    <motion.div
      style={{ opacity, scale }}
    >
      {content}
    </motion.div>
  )
}
```

## RunExpression-Specific Patterns

### Manifesto Chapter Animation

**Based on actual implementation:**

```tsx
function Chapter({ number, headline, body }: ChapterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: 'easeOut',
          },
        },
      }}
      className="mx-auto max-w-3xl px-4 py-20 md:py-32"
    >
      {/* Chapter content */}
    </motion.div>
  )
}
```

### Flow Wall Entry Animation

**For new posts appearing in real-time:**

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{
    type: 'spring',
    stiffness: 300,
    damping: 25,
  }}
>
  <FlowPostCard post={post} />
</motion.div>
```

## Timing and Easing

### Duration Guidelines

- **Fast interactions** (hover, tap): `0.1s - 0.2s`
- **Standard transitions** (fade, slide): `0.2s - 0.3s`
- **Scroll reveals**: `0.5s - 0.8s`
- **Complex animations**: `0.8s - 1.2s`

### Easing Functions

```tsx
// ✅ Good (smooth, natural motion)
transition={{ ease: 'easeOut' }}
transition={{ ease: [0.4, 0, 0.2, 1] }} // Custom cubic-bezier

// ✅ Good (spring physics for interactive)
transition={{ type: 'spring', stiffness: 300, damping: 25 }}

// ❌ Avoid (jarring)
transition={{ ease: 'linear' }}
```

## Testing Checklist

Before finalizing animations:

- [ ] Respects `prefers-reduced-motion` (test with system setting)
- [ ] Uses GPU-accelerated properties (transform, opacity)
- [ ] Performance is smooth (60fps, no jank)
- [ ] Works on mobile devices
- [ ] Exit animations use AnimatePresence
- [ ] Scroll-triggered animations use `once: true` to avoid retriggering
- [ ] Timing feels natural (not too fast or slow)
- [ ] Animations enhance UX, don't distract

## Common Pitfalls

### ❌ Don't Animate Layout Properties

```tsx
// ❌ Bad (causes layout reflow)
<motion.div animate={{ width: '500px', height: '300px' }} />

// ✅ Good (use transform)
<motion.div animate={{ scale: 1.2 }} />
```

### ❌ Don't Forget Reduced Motion

```tsx
// ❌ Bad (ignores user preference)
<motion.div animate={{ y: -20 }} />

// ✅ Good (respects preference)
const shouldReduceMotion = useReducedMotion()
<motion.div animate={{ y: shouldReduceMotion ? 0 : -20 }} />
```

### ❌ Don't Over-Animate

```tsx
// ❌ Bad (too many animations)
<motion.div
  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 }}
/>

// ✅ Good (focused, purposeful)
<motion.div
  animate={{ opacity: 1, y: 0 }}
/>
```

## Additional Resources

- **Framer Motion Docs:** https://www.framer.com/motion/
- **Brand Guide:** See `DOCS/specs/spec-brand-and-content.md`
- **Tech Design:** See `DOCS/specs/spec-tech-design.md`
- **Example Implementation:** See `components/home/manifesto-chapters.tsx`
