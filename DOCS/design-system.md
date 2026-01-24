# RunExpression Design System

**Version:** 1.0
**Last Updated:** January 2026
**Maintainer:** Design & Engineering Team
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Brand Philosophy](#brand-philosophy)
3. [Typography](#typography)
4. [Colors](#colors)
5. [Components](#components)
6. [Animations](#animations)
7. [Utilities](#utilities)
8. [Design Principles](#design-principles)
9. [Developer Guidelines](#developer-guidelines)
10. [Migration Guide](#migration-guide)
11. [Resources](#resources)

---

## Overview

The RunExpression design system embodies the "Sage in the Parking Lot" philosophy — wise enough to discuss universal flow, grounded enough to do it while eating bacon after a track workout. This system provides the visual language, components, and patterns to build expressive, accessible interfaces that honor both discipline and joy.

**Core Values:**
- **Expressive, not minimal:** Embrace personality through sage green, purple glows, and monospace fonts
- **Accessible by default:** WCAG 2.1 AA compliance minimum (4.5:1 contrast ratios)
- **Motion with purpose:** Animations enhance meaning, never distract
- **Generous spacing:** Let content breathe (philosophy over density)
- **Progressive disclosure:** Reveal complexity gradually

---

## Brand Philosophy

### The Sage in the Parking Lot

Our design aesthetic reflects the RunExpression voice: **deep but accessible, serious but lighthearted, philosophical but grounded.**

**Design Translation:**
- **Deep but accessible:** Serif body text (Merriweather) with conversational line-height (1.8)
- **Serious but lighthearted:** Monospace UI labels (DM Mono) balanced with organic, hand-drawn border radius
- **Philosophical but grounded:** Sage green and purple (transformation, nature) tempered with cream warmth
- **Invitational:** Generous whitespace, soft shadows, never aggressive or stark

### Brand Aesthetic

**Visual Identity:**
- **Colors:** Sage green (#6B7F6E primary), purple (#8B5CF6 accent), cream (#F5F5DC neutral)
- **Typography:** DM Mono (UI labels, buttons), Merriweather (body text), monospace for code/data
- **Tone:** Laboratory aesthetic (clean, scientific) meets parking lot philosophy (raw, authentic)

---

## Typography

### Font Families

**DM Mono** (Monospace — UI elements, labels, buttons)

```tsx
// Usage in components
<Button className="font-mono">Share Your Run</Button>
<label className="font-mono text-sm">Email Address</label>
```

**Merriweather** (Serif — body text, manifesto, long-form content)

```tsx
// Usage in content sections
<p className="font-sans text-lg leading-relaxed">
  We believe running is not just a physical act; it is a creative one...
</p>
```

### Type Scale

```css
/* Tailwind utility classes */
.text-xs    /* 12px - Metadata, timestamps, captions */
.text-sm    /* 14px - Form labels, secondary text */
.text-base  /* 16px - Body text, paragraphs */
.text-lg    /* 18px - Emphasized body, card content */
.text-xl    /* 20px - Subheadings */
.text-2xl   /* 24px - Section headings */
.text-3xl   /* 30px - Page titles (mobile) */
.text-4xl   /* 36px - Page titles (tablet) */
.text-5xl   /* 48px - Hero headings */
.text-6xl   /* 60px - Large manifesto text */
.text-7xl   /* 72px - Hero headings (desktop) */
```

### Responsive Typography

**Mobile-first approach with fluid scaling:**

```tsx
// ✅ Good - Responsive heading
<h1 className="text-3xl md:text-5xl lg:text-7xl font-mono">
  The Expressive Runner's Creed
</h1>

// ✅ Good - Body text with optimal line length
<p className="text-base md:text-lg max-w-prose leading-relaxed">
  Leave heavy. Return light. It's the most predictable magic trick your body knows.
</p>
```

### Typography Guidelines

**DO:**
- ✅ Use `font-mono` for UI labels, buttons, form fields, CTAs
- ✅ Use `font-sans` (Merriweather) for body text, manifesto sections, blog posts
- ✅ Use `leading-relaxed` (1.625) or `leading-loose` (1.8) for long-form content
- ✅ Limit line length to `max-w-prose` (65-75 characters) for readability

**DON'T:**
- ❌ Mix serif and monospace within the same sentence
- ❌ Use monospace for long paragraphs (strains readability)
- ❌ Use all-caps for body text (accessibility concern)
- ❌ Go below 16px font size for body text (mobile readability)

---

## Colors

### Brand Color Palette

**Primary (Sage Green) - Trust, growth, nature**

```css
run-primary-50:  hsl(147, 15%, 95%)  /* Lightest - backgrounds */
run-primary-100: hsl(147, 15%, 88%)  /* Borders, dividers */
run-primary-200: hsl(147, 15%, 76%)  /* Subtle accents */
run-primary-300: hsl(147, 20%, 64%)  /* Muted text */
run-primary-400: hsl(147, 25%, 52%)  /* Hover states */
run-primary-500: hsl(147, 30%, 40%)  /* Primary CTAs, links */
run-primary-600: hsl(147, 35%, 32%)  /* Active states */
run-primary-700: hsl(147, 40%, 24%)  /* Dark text */
run-primary-800: hsl(147, 45%, 16%)  /* Headers */
run-primary-900: hsl(147, 50%, 10%)  /* Darkest - main text */
```

**Accent (Purple) - Energy, flow, transformation**

```css
run-accent-50:  hsl(270, 30%, 96%)  /* Lightest - glow backgrounds */
run-accent-100: hsl(270, 30%, 92%)  /* Subtle accents */
run-accent-200: hsl(270, 30%, 84%)  /* Tag backgrounds */
run-accent-300: hsl(270, 35%, 72%)  /* Muted accent */
run-accent-400: hsl(270, 40%, 60%)  /* Interactive accents */
run-accent-500: hsl(270, 50%, 48%)  /* Purple glows, highlights */
run-accent-600: hsl(270, 55%, 38%)  /* Active accent */
run-accent-700: hsl(270, 60%, 28%)  /* Dark accent */
run-accent-800: hsl(270, 65%, 20%)  /* Deep purple */
run-accent-900: hsl(270, 70%, 12%)  /* Darkest purple */
```

**Neutral (Cream) - Warmth, approachability**

```css
run-neutral-0:   hsl(0, 0%, 100%)    /* Pure white */
run-neutral-50:  hsl(40, 25%, 98%)   /* Off-white (cream) */
run-neutral-100: hsl(40, 25%, 95%)   /* Light cream */
run-neutral-200: hsl(40, 20%, 90%)   /* Card backgrounds */
run-neutral-300: hsl(40, 15%, 85%)   /* Borders */
run-neutral-400: hsl(40, 12%, 75%)   /* Muted text */
```

### Semantic Tokens

**Light Mode (Default)**

```tsx
// Usage in Tailwind
<div className="bg-background text-foreground">
  <div className="bg-card border border-border rounded-lg p-6">
    <Button className="bg-primary text-primary-foreground">
      Join The Flow
    </Button>
  </div>
</div>
```

**Token Reference:**

```css
--background:         run-neutral-50   /* Page background */
--foreground:         run-primary-900  /* Main text */
--card:               run-neutral-0    /* Card backgrounds */
--card-foreground:    run-primary-900  /* Card text */
--primary:            run-primary-500  /* Primary actions */
--primary-foreground: run-neutral-0    /* Text on primary */
--secondary:          run-accent-500   /* Accent actions */
--muted:              run-neutral-200  /* Muted backgrounds */
--border:             run-primary-100  /* Border color */
--input:              run-primary-100  /* Input borders */
--ring:               run-primary-500  /* Focus rings */
```

### Color Usage Examples

**Buttons:**

```tsx
// Primary action (sage green)
<Button className="bg-run-primary-500 hover:bg-run-primary-600 text-white">
  Share Your Run
</Button>

// Secondary action (purple accent)
<Button className="bg-run-accent-500 hover:bg-run-accent-600 text-white">
  Enter The Flow
</Button>

// Outline button (neutral)
<Button variant="outline" className="border-run-primary-300 text-run-primary-700">
  Cancel
</Button>
```

**Text Hierarchy:**

```tsx
// Primary text (dark sage)
<h1 className="text-run-primary-900 font-mono text-4xl">The Flow</h1>

// Secondary text (muted sage)
<p className="text-run-primary-700 text-lg">Your squad is your battery pack.</p>

// Tertiary text (neutral gray)
<span className="text-run-neutral-400 text-sm">Posted 2 hours ago</span>
```

**Backgrounds:**

```tsx
// Page background (cream)
<div className="bg-run-neutral-50 min-h-screen">
  {/* Card on cream background */}
  <div className="bg-run-neutral-0 border border-run-primary-100 rounded-lg p-6">
    <p className="text-run-primary-900">Content here</p>
  </div>
</div>
```

### Accessibility Guidelines

**Contrast Requirements:**
- Body text: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Tested Combinations:**

```tsx
// ✅ PASS - Dark text on light background (12:1 ratio)
<p className="text-run-primary-900 bg-run-neutral-50">High contrast text</p>

// ✅ PASS - White text on sage primary (4.8:1 ratio)
<Button className="bg-run-primary-500 text-white">Accessible CTA</Button>

// ❌ FAIL - Light text on light background (1.2:1 ratio)
<p className="text-run-neutral-400 bg-run-neutral-50">Too low contrast</p>
```

**Color Blindness Considerations:**
- Purple and sage green are distinguishable for deuteranopia (most common)
- Never rely on color alone for meaning (use icons, labels, patterns)

---

## Components

### Buttons

**Variants:**

```tsx
import { Button } from '@/components/ui/button'

// Primary - Main actions (sage green)
<Button className="font-mono">
  Share Your Run
</Button>

// Secondary - Accent actions (purple)
<Button variant="secondary" className="font-mono">
  Enter The Flow
</Button>

// Outline - Cancel, back actions
<Button variant="outline" className="font-mono">
  Cancel
</Button>

// Destructive - Delete, remove actions
<Button variant="destructive" className="font-mono">
  Delete Post
</Button>

// Ghost - Subtle actions
<Button variant="ghost" className="font-mono">
  View More
</Button>
```

**Sizes:**

```tsx
<Button size="sm" className="font-mono">Small</Button>
<Button size="default" className="font-mono">Default</Button>
<Button size="lg" className="font-mono">Large</Button>
```

**States:**

```tsx
// Loading state
<Button disabled className="font-mono">
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Submitting...
</Button>

// Disabled state
<Button disabled className="font-mono opacity-50">
  Submit (5 character minimum)
</Button>
```

**Brand Customization:**

```tsx
// Sage green with purple glow on hover
<Button className="
  bg-run-primary-500
  hover:bg-run-primary-600
  hover:glow-purple
  transition-all
  duration-300
  font-mono
">
  Join The Flow
</Button>
```

### Cards

**Basic Card:**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card className="border-run-primary-100 bg-run-neutral-0 hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="font-mono text-run-primary-900">
      Today's Run
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="font-sans text-run-primary-700 leading-relaxed">
      Leave heavy. Return light.
    </p>
  </CardContent>
</Card>
```

**Flow Post Card (Brand Example):**

```tsx
<Card className="
  border-run-primary-100
  bg-run-neutral-0
  organic-edges
  hover:shadow-md
  hover:scale-[1.02]
  transition-all
  duration-300
">
  <CardContent className="p-6">
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-run-primary-200" />

      {/* Content */}
      <div className="flex-1">
        <p className="font-mono text-sm text-run-neutral-400">@runner_name</p>
        <p className="mt-2 text-run-primary-900 font-sans leading-relaxed">
          {post.content}
        </p>

        {/* Vibe tags */}
        <div className="mt-3 flex gap-2 flex-wrap">
          {post.vibeTags.map(tag => (
            <span
              key={tag}
              className="
                rounded-full
                bg-run-accent-100
                px-3 py-1
                text-xs
                font-mono
                text-run-accent-700
              "
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs text-run-neutral-400 font-mono">
          {formatDate(post.created_at)}
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Inputs

**Text Input:**

```tsx
import { Input } from '@/components/ui/input'

<div className="space-y-2">
  <label htmlFor="email" className="font-mono text-sm font-medium text-run-primary-900">
    Email Address
  </label>
  <Input
    id="email"
    type="email"
    placeholder="runner@example.com"
    className="
      border-run-primary-100
      focus:border-run-primary-500
      focus:ring-run-primary-500
      font-mono
    "
  />
</div>
```

**Textarea:**

```tsx
import { Textarea } from '@/components/ui/textarea'

<div className="space-y-2">
  <label htmlFor="content" className="font-mono text-sm font-medium">
    What did you discover on your run?
  </label>
  <Textarea
    id="content"
    placeholder="Today, I ran for..."
    rows={4}
    className="
      border-run-primary-100
      focus:border-run-primary-500
      font-sans
      resize-none
    "
  />
</div>
```

**Error State:**

```tsx
<div className="space-y-2">
  <label htmlFor="email" className="font-mono text-sm text-run-primary-900">
    Email
  </label>
  <Input
    id="email"
    type="email"
    className="border-red-500 focus:ring-red-500"
  />
  <p className="text-sm text-red-600 font-mono">
    Email is required
  </p>
</div>
```

### Dialogs

**Basic Dialog:**

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button className="font-mono">Share Your Run</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[600px] border-run-primary-100">
    <DialogHeader>
      <DialogTitle className="font-mono text-2xl text-run-primary-900">
        What did you discover?
      </DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Dialog content */}
    </div>
  </DialogContent>
</Dialog>
```

---

## Animations

### Brand Animations

**Glow Pulse** (Purple glow for interactive elements)

```tsx
// Used on cards, buttons, CTAs
<div className="
  rounded-lg
  border
  border-run-primary-100
  animate-glow-pulse
">
  {content}
</div>

// CSS definition (in tailwind.config.ts)
keyframes: {
  'glow-pulse': {
    '0%, 100%': {
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.1)'
    },
    '50%': {
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.2)'
    },
  }
}
```

**Float** (Gentle vertical motion)

```tsx
// Used on hero sections, featured cards
<div className="animate-float">
  <Image src="/hero.png" alt="Hero" />
</div>

// CSS definition
keyframes: {
  'float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  }
}
```

**Shimmer** (Gradient shimmer effect)

```tsx
// Used on loading states, featured content
<div className="
  bg-gradient-to-r
  from-run-primary-500
  via-run-accent-500
  to-run-primary-600
  bg-[length:200%_100%]
  animate-shimmer
">
  {content}
</div>

// CSS definition
keyframes: {
  'shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  }
}
```

**Fade In** (Subtle opacity entrance)

```tsx
// Used on page loads, content reveals
<div className="animate-fade-in">
  {content}
</div>

// CSS definition
keyframes: {
  'fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  }
}
```

**Slide Up** (Entrance from bottom)

```tsx
// Used on modals, cards entering view
<div className="animate-slide-up">
  {content}
</div>

// CSS definition
keyframes: {
  'slide-up': {
    from: { transform: 'translateY(10px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  }
}
```

### Animation Guidelines

**DO:**
- ✅ Use animations to enhance meaning (glow = interactive, float = featured)
- ✅ Keep durations subtle (200-400ms for interactions, 2-3s for ambient)
- ✅ Respect `prefers-reduced-motion` (automatically handled in `globals.css`)
- ✅ Use `ease-out` for entrances, `ease-in` for exits

**DON'T:**
- ❌ Animate on every interaction (causes fatigue)
- ❌ Use animations longer than 500ms for UI interactions
- ❌ Animate layout properties (width, height) — use `transform` instead
- ❌ Stack multiple animations on same element without purpose

### Reduced Motion Support

**Automatically disabled in `globals.css`:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Utilities

### Typography Utilities

**Text Balance & Pretty**

```tsx
// Balance - Equal line lengths (headlines)
<h1 className="text-balance font-mono text-5xl">
  Make running mean more.
</h1>

// Pretty - Avoid orphans (body text)
<p className="text-pretty font-sans leading-relaxed">
  We believe running is not just a physical act; it is a creative one.
</p>
```

### Visual Effects

**Organic Edges** (Hand-drawn border radius)

```tsx
// Large organic edges
<div className="organic-edges border-2 border-run-primary-300 p-6">
  {content}
</div>

// Small organic edges
<div className="organic-edges-sm border border-run-primary-200 p-3">
  {content}
</div>

// CSS definition
.organic-edges {
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
}

.organic-edges-sm {
  border-radius: 128px 8px 112px 8px/8px 112px 8px 128px;
}
```

**Glow Effects**

```tsx
// Purple glow (accent, energy)
<Button className="glow-purple bg-run-accent-500 text-white">
  Enter The Flow
</Button>

// Sage glow (primary, trust)
<Card className="glow-sage border-run-primary-300">
  {content}
</Card>

// CSS definitions
.glow-purple {
  box-shadow: 0 0 20px hsl(var(--run-accent-500) / 0.3),
              0 0 40px hsl(var(--run-accent-500) / 0.1);
}

.glow-sage {
  box-shadow: 0 0 20px hsl(var(--run-primary-500) / 0.3),
              0 0 40px hsl(var(--run-primary-500) / 0.1);
}
```

**Flow Gradient**

```tsx
// Signature gradient (sage → purple → sage)
<div className="flow-gradient text-white p-8 rounded-lg">
  <h2 className="font-mono text-3xl">The Flow</h2>
</div>

// CSS definition
.flow-gradient {
  background: linear-gradient(
    135deg,
    hsl(var(--run-primary-500)) 0%,
    hsl(var(--run-accent-500)) 50%,
    hsl(var(--run-primary-600)) 100%
  );
}
```

### Spacing Utilities

**Generous Spacing (Brand Philosophy)**

```tsx
// ✅ Good - Generous padding, breathing room
<section className="py-24 px-6 md:px-12 lg:px-24">
  <div className="space-y-8">
    <h2 className="text-4xl font-mono">Leave heavy. Return light.</h2>
    <p className="text-lg font-sans leading-loose max-w-prose">
      {content}
    </p>
  </div>
</section>

// ❌ Bad - Dense, cramped layout
<section className="py-4 px-2">
  <h2 className="text-2xl">Title</h2>
  <p className="text-sm">{content}</p>
</section>
```

---

## Design Principles

### 1. Expressive Over Minimal

**Philosophy:** Embrace personality, warmth, and humanity over sterile minimalism.

**Application:**
- Use organic, hand-drawn border radius (not perfect rectangles)
- Add subtle glows and animations (not stark, static layouts)
- Choose sage green and purple (not grayscale neutrals)
- Include monospace fonts for character (not just sans-serif)

**Example:**

```tsx
// ✅ Expressive - Personality and warmth
<Card className="
  organic-edges
  border-run-primary-100
  bg-run-neutral-0
  hover:glow-purple
  transition-all
  duration-300
">
  <CardContent className="p-8 space-y-4">
    <h3 className="font-mono text-2xl text-run-primary-900">
      The Bacon Ritual
    </h3>
    <p className="font-sans text-lg leading-relaxed text-run-primary-700">
      We cook bacon in a parking lot at 6 AM. On purpose.
    </p>
  </CardContent>
</Card>

// ❌ Minimal - Cold and sterile
<div className="border border-gray-300 bg-white p-4">
  <h3 className="text-xl">The Bacon Ritual</h3>
  <p className="text-base">We cook bacon at 6 AM.</p>
</div>
```

### 2. Accessible By Default

**Philosophy:** Design for all humans, all abilities, all contexts.

**Application:**
- 4.5:1 minimum contrast for text (WCAG AA)
- Keyboard navigation for all interactive elements
- ARIA labels for non-text elements
- Respect `prefers-reduced-motion`
- Semantic HTML structure

**Example:**

```tsx
// ✅ Accessible - Semantic, labeled, keyboard-friendly
<nav aria-label="Main navigation">
  <ul className="flex gap-6">
    <li>
      <Link
        href="/flow"
        className="
          font-mono
          text-run-primary-700
          hover:text-run-primary-900
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-run-primary-500
        "
      >
        The Flow
      </Link>
    </li>
  </ul>
</nav>

<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>
```

### 3. Motion With Purpose

**Philosophy:** Animations should enhance meaning, never distract or delay.

**Application:**
- Use animations to signal state changes (loading, success, error)
- Add subtle motion to emphasize importance (glow-pulse on CTAs)
- Keep durations fast (200-400ms for interactions)
- Never block user interaction with unnecessary animations

**Example:**

```tsx
// ✅ Purposeful - Animation signals importance
<Button className="
  bg-run-primary-500
  hover:bg-run-primary-600
  hover:glow-purple
  transition-all
  duration-300
  animate-glow-pulse
">
  Join The Flow
</Button>

// ✅ Purposeful - Stagger reveals context
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {posts.map(post => (
    <motion.div variants={itemVariants}>
      <FlowPostCard post={post} />
    </motion.div>
  ))}
</motion.div>

// ❌ Distracting - Animation adds no meaning
<div className="animate-bounce">
  <p>Static content that shouldn't move</p>
</div>
```

### 4. Progressive Disclosure

**Philosophy:** Reveal complexity gradually; respect the user's attention.

**Application:**
- Show essential information first (skeletons, hero content)
- Load secondary content asynchronously (Suspense boundaries)
- Use accordions, tabs, dialogs for optional details
- Never overwhelm with everything at once

**Example:**

```tsx
// ✅ Progressive - Hero loads first, posts load async
export default async function HomePage() {
  return (
    <>
      {/* Server-rendered, instant */}
      <HeroSection />

      {/* Async with fallback */}
      <Suspense fallback={<FlowSkeleton />}>
        <FlowPreview />
      </Suspense>

      {/* Details behind dialog */}
      <Dialog>
        <DialogTrigger>View Details</DialogTrigger>
        <DialogContent>
          <DetailedContent />
        </DialogContent>
      </Dialog>
    </>
  )
}
```

---

## Developer Guidelines

### Adding Components

**1. Check if Shadcn component exists:**

```bash
# Search available components
npx shadcn-ui@latest add --help

# Add component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

**2. Customize with brand tokens:**

```tsx
// BEFORE (generic shadcn)
<Button className="bg-blue-500 hover:bg-blue-600">
  Click me
</Button>

// AFTER (RunExpression brand)
<Button className="
  bg-run-primary-500
  hover:bg-run-primary-600
  hover:glow-purple
  transition-all
  duration-300
  font-mono
">
  Share Your Run
</Button>
```

**3. Add to Storybook (optional, for documentation):**

```tsx
// components/ui/button.stories.tsx
import { Button } from './button'

export default {
  title: 'UI/Button',
  component: Button,
}

export const Primary = {
  args: {
    children: 'Share Your Run',
    className: 'bg-run-primary-500 font-mono'
  }
}
```

### Using Colors

**Always use CSS variables (for theming):**

```tsx
// ✅ Good - Uses CSS variables
<div className="bg-run-primary-500 text-white">

// ❌ Bad - Hardcoded hex values
<div className="bg-[#6B7F6E] text-[#ffffff]">
```

**Semantic tokens for common patterns:**

```tsx
// ✅ Good - Uses semantic tokens
<Card className="bg-card border-border text-card-foreground">

// ❌ Bad - Bypasses semantic system
<Card className="bg-white border-gray-200 text-gray-900">
```

**Brand colors for specific meanings:**

```tsx
// Primary actions = run-primary (sage)
<Button className="bg-run-primary-500">Save</Button>

// Accent actions = run-accent (purple)
<Button className="bg-run-accent-500">Enter The Flow</Button>

// Destructive actions = destructive (red)
<Button variant="destructive">Delete</Button>
```

### Using Typography

**Font family selection:**

```tsx
// UI labels, buttons, form fields, metadata
<Button className="font-mono">Click me</Button>
<label className="font-mono text-sm">Email</label>

// Body text, paragraphs, manifesto
<p className="font-sans leading-relaxed">
  Leave heavy. Return light.
</p>

// Code, data, timestamps (falls back to monospace stack)
<code className="font-mono text-sm bg-run-neutral-200 px-2 py-1 rounded">
  npm run dev
</code>
```

**Responsive sizing:**

```tsx
// Mobile-first approach
<h1 className="
  text-3xl md:text-5xl lg:text-7xl
  font-mono
  text-run-primary-900
">
  Hero Heading
</h1>

// Fluid scaling with clamp (advanced)
<h1 className="text-[clamp(2rem,5vw,4rem)] font-mono">
  Fluid Heading
</h1>
```

### Adding Animations

**Use existing brand animations:**

```tsx
// Glow pulse for CTAs
<Button className="animate-glow-pulse">
  Join Now
</Button>

// Float for hero images
<div className="animate-float">
  <Image src="/hero.png" alt="Hero" />
</div>

// Fade in for page content
<section className="animate-fade-in">
  {content}
</section>
```

**Creating custom animations:**

```typescript
// 1. Add keyframes to tailwind.config.ts
keyframes: {
  'custom-animation': {
    '0%': { /* initial state */ },
    '100%': { /* final state */ }
  }
}

// 2. Add animation utility
animation: {
  'custom-animation': 'custom-animation 1s ease-in-out'
}

// 3. Use in component
<div className="animate-custom-animation">
  {content}
</div>
```

**Respect reduced motion:**

```tsx
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

## Migration Guide

### For Existing Components

**Step 1: Audit current component usage**

```bash
# Search for color usage
rg "bg-blue|text-blue|border-blue" --type tsx

# Search for font usage
rg "font-sans|font-serif|font-mono" --type tsx
```

**Step 2: Replace generic colors with brand tokens**

```tsx
// BEFORE
<Button className="bg-blue-500 hover:bg-blue-600">
  Submit
</Button>

// AFTER
<Button className="bg-run-primary-500 hover:bg-run-primary-600 font-mono">
  Submit
</Button>
```

**Step 3: Add monospace to UI elements**

```tsx
// BEFORE
<label className="text-sm font-medium">
  Email
</label>

// AFTER
<label className="text-sm font-medium font-mono">
  Email
</label>
```

**Step 4: Update card styles**

```tsx
// BEFORE
<Card className="border-gray-200 shadow-sm">
  {content}
</Card>

// AFTER
<Card className="
  border-run-primary-100
  organic-edges
  hover:shadow-md
  hover:scale-[1.02]
  transition-all
  duration-300
">
  {content}
</Card>
```

### For New Features

**1. Start with brand tokens from the beginning:**

```tsx
// ✅ Good - Uses design system from start
export function NewFeature() {
  return (
    <div className="bg-run-neutral-50 py-24 px-6">
      <h2 className="font-mono text-4xl text-run-primary-900">
        New Feature
      </h2>
      <p className="font-sans text-lg leading-relaxed text-run-primary-700 max-w-prose">
        Description using design system tokens.
      </p>
      <Button className="mt-6 bg-run-primary-500 hover:bg-run-primary-600 font-mono">
        Try It Now
      </Button>
    </div>
  )
}
```

**2. Use semantic components:**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Semantic components already have brand styling
export function FeatureCard() {
  return (
    <Card className="organic-edges">
      <CardHeader>
        <CardTitle className="font-mono">Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-sans leading-relaxed">Content</p>
        <Button className="mt-4 font-mono">Action</Button>
      </CardContent>
    </Card>
  )
}
```

**3. Reference this doc for color/typography decisions**

- **UI elements** (buttons, labels, form fields) → `font-mono`, `run-primary-*`
- **Body content** (paragraphs, descriptions) → `font-sans`, `leading-relaxed`
- **Primary actions** → `bg-run-primary-500`, `hover:glow-purple`
- **Accent actions** → `bg-run-accent-500`, `animate-glow-pulse`

---

## Resources

### Internal Documentation

- **[Brand & Content Guide](./04-BRAND-CONTENT-GUIDE.md)** - Voice, tone, messaging pillars
- **[UI/UX Patterns](./09-UI-UX-PATTERNS.md)** - Component patterns, accessibility, responsive design
- **[Coding Standards](./07-CODING-STANDARDS.md)** - TypeScript, React, database conventions
- **[Technical Design](./03-TECHNICAL-DESIGN.md)** - Architecture, stack decisions, data flow

### External References

- **[Shadcn/UI Components](https://ui.shadcn.com/)** - Base component library
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Accessibility standards
- **[DM Mono Font](https://fonts.google.com/specimen/DM+Mono)** - Monospace UI font
- **[Merriweather Font](https://fonts.google.com/specimen/Merriweather)** - Serif body font

### Quick Command Reference

```bash
# Add Shadcn component
npx shadcn-ui@latest add button

# Generate Supabase types (includes color tokens if stored in DB)
npm run db:types

# Format code
npm run format

# Type check
npm run type-check

# Run development server
npm run dev
```

---

## Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-24 | 1.0 | Initial design system documentation | Design & Engineering Team |

---

**Questions or feedback?** Reference the [Brand & Content Guide](./04-BRAND-CONTENT-GUIDE.md) for voice/tone questions, or [UI/UX Patterns](./09-UI-UX-PATTERNS.md) for implementation patterns.

**Next Steps:**
1. Audit existing components against this guide (see Migration Guide)
2. Update component library in Storybook (optional)
3. Create design system tests (component visual regression, accessibility)
4. Share with team for feedback and iteration
