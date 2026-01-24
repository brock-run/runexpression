# Design System & Theme Configuration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish RunExpression brand design system with custom Tailwind theme, typography, colors, and shadcn/ui component customization

**Architecture:** Extend existing Tailwind CSS configuration with RunExpression brand colors (sage green, purple, cream), configure Google Fonts (DM Mono, Merriweather), customize CSS variables for semantic color tokens, and configure Framer Motion with reduced motion support

**Tech Stack:** Next.js 14, Tailwind CSS 3.x, shadcn/ui (Radix UI), Google Fonts, Framer Motion, CSS Variables

---

## Current State Analysis

**Existing Setup:**
- `tailwind.config.ts` - Has basic shadcn setup with generic colors
- `app/globals.css` - Has CSS variables for light/dark mode using generic HSL values
- `app/layout.tsx` - No font configuration (missing `next/font/google`)
- `components.json` - Configured for shadcn/ui with slate base color
- Existing components: Button, Card, Input, Label

**What Needs to Change:**
1. Add Google Fonts (DM Mono + Merriweather) to layout
2. Replace generic CSS variables with RunExpression brand colors
3. Extend Tailwind config with brand-specific utilities and animations
4. Customize shadcn/ui components with brand styling
5. Add reduced motion support for accessibility

---

## Task 1: Configure Google Fonts Typography System

**Files:**
- Modify: `app/layout.tsx:1-72`
- Test: Manual verification in browser

**Step 1: Import Google Fonts**

Add font imports after the Metadata import:

```typescript
import type { Metadata } from 'next'
import { DM_Mono, Merriweather } from 'next/font/google'
import './globals.css'
import * as Sentry from '@sentry/nextjs'

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
```

**Step 2: Apply font variables to HTML element**

Update the `<html>` tag in RootLayout:

```typescript
<html
  lang="en"
  suppressHydrationWarning
  className={`${dmMono.variable} ${merriweather.variable}`}
>
```

**Step 3: Verify in browser**

Run: `npm run dev` and open http://localhost:3000

Expected:
- Inspect `<html>` element - should have CSS variables `--font-mono` and `--font-sans`
- Text should render in Merriweather (serif, readable body text)
- Code/UI elements should use DM Mono when explicitly styled

**Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(design-system): configure Google Fonts (DM Mono + Merriweather)"
```

---

## Task 2: Define RunExpression Brand Color System

**Files:**
- Modify: `app/globals.css:1-71`
- Reference: `DOCS/specs/spec-brand-and-content.md` (brand colors)

**Step 1: Replace CSS variables with brand colors**

Update the `:root` block in `app/globals.css` (replace lines 6-27):

```css
@layer base {
  :root {
    /* RunExpression Brand Colors */
    /* Sage Green - Primary brand color for accents, CTAs, trust */
    --sage-50: 147 15% 95%;
    --sage-100: 147 15% 88%;
    --sage-200: 147 15% 76%;
    --sage-300: 147 20% 64%;
    --sage-400: 147 25% 52%;
    --sage-500: 147 30% 40%;    /* Primary sage */
    --sage-600: 147 35% 32%;
    --sage-700: 147 40% 24%;
    --sage-800: 147 45% 16%;
    --sage-900: 147 50% 10%;

    /* Purple - Energy, flow, transformation */
    --purple-50: 270 30% 96%;
    --purple-100: 270 30% 92%;
    --purple-200: 270 30% 84%;
    --purple-300: 270 35% 72%;
    --purple-400: 270 40% 60%;
    --purple-500: 270 50% 48%;  /* Primary purple */
    --purple-600: 270 55% 38%;
    --purple-700: 270 60% 28%;
    --purple-800: 270 65% 20%;
    --purple-900: 270 70% 12%;

    /* Cream/Warm Neutrals - Warmth, approachability */
    --cream-50: 40 25% 98%;
    --cream-100: 40 25% 95%;
    --cream-200: 40 20% 90%;
    --cream-300: 40 15% 85%;
    --cream-400: 40 12% 75%;

    /* Semantic Tokens (Light Mode) */
    --background: 40 25% 98%;        /* cream-50 */
    --foreground: 147 50% 10%;       /* sage-900 - deep sage for text */

    --card: 0 0% 100%;
    --card-foreground: 147 50% 10%;

    --popover: 0 0% 100%;
    --popover-foreground: 147 50% 10%;

    --primary: 147 30% 40%;          /* sage-500 - primary brand actions */
    --primary-foreground: 0 0% 100%;

    --secondary: 270 50% 48%;        /* purple-500 - secondary actions */
    --secondary-foreground: 0 0% 100%;

    --muted: 40 20% 90%;             /* cream-200 */
    --muted-foreground: 147 40% 24%; /* sage-700 */

    --accent: 270 30% 92%;           /* purple-100 - subtle accents */
    --accent-foreground: 270 70% 12%; /* purple-900 */

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;

    --border: 147 15% 88%;           /* sage-100 */
    --input: 147 15% 88%;            /* sage-100 */
    --ring: 147 30% 40%;             /* sage-500 - focus rings */

    --radius: 0.5rem;
  }
```

**Step 2: Update dark mode colors**

Update the `.dark` block (replace lines 29-49):

```css
  .dark {
    /* Dark mode: Invert the hierarchy, keep brand colors */
    --background: 147 50% 10%;       /* sage-900 - dark sage background */
    --foreground: 40 25% 98%;        /* cream-50 - light text */

    --card: 147 45% 16%;             /* sage-800 */
    --card-foreground: 40 25% 98%;

    --popover: 147 45% 16%;
    --popover-foreground: 40 25% 98%;

    --primary: 147 25% 52%;          /* sage-400 - lighter sage for dark bg */
    --primary-foreground: 147 50% 10%;

    --secondary: 270 40% 60%;        /* purple-400 - lighter purple */
    --secondary-foreground: 147 50% 10%;

    --muted: 147 40% 24%;            /* sage-700 */
    --muted-foreground: 40 20% 90%;  /* cream-200 */

    --accent: 270 60% 28%;           /* purple-700 */
    --accent-foreground: 270 30% 96%; /* purple-50 */

    --destructive: 0 62% 30%;
    --destructive-foreground: 0 0% 98%;

    --border: 147 35% 32%;           /* sage-600 */
    --input: 147 35% 32%;
    --ring: 147 25% 52%;             /* sage-400 */
  }
}
```

**Step 3: Verify colors in browser**

Run: `npm run dev`

Expected:
- Light mode: Cream background, sage text, sage primary buttons
- Toggle dark mode (if implemented): Dark sage background, cream text
- Inspect DevTools: CSS variables should show HSL color values

**Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(design-system): define RunExpression brand color system (sage/purple/cream)"
```

---

## Task 3: Extend Tailwind Config with Brand Utilities

**Files:**
- Modify: `tailwind.config.ts:1-110`

**Step 1: Add brand color extensions**

Add after line 69 (inside `extend.colors`):

```typescript
extend: {
  colors: {
    // ... existing shadcn color tokens ...

    // RunExpression brand colors
    sage: {
      50: 'hsl(var(--sage-50))',
      100: 'hsl(var(--sage-100))',
      200: 'hsl(var(--sage-200))',
      300: 'hsl(var(--sage-300))',
      400: 'hsl(var(--sage-400))',
      500: 'hsl(var(--sage-500))',
      600: 'hsl(var(--sage-600))',
      700: 'hsl(var(--sage-700))',
      800: 'hsl(var(--sage-800))',
      900: 'hsl(var(--sage-900))',
    },
    purple: {
      50: 'hsl(var(--purple-50))',
      100: 'hsl(var(--purple-100))',
      200: 'hsl(var(--purple-200))',
      300: 'hsl(var(--purple-300))',
      400: 'hsl(var(--purple-400))',
      500: 'hsl(var(--purple-500))',
      600: 'hsl(var(--purple-600))',
      700: 'hsl(var(--purple-700))',
      800: 'hsl(var(--purple-800))',
      900: 'hsl(var(--purple-900))',
    },
    cream: {
      50: 'hsl(var(--cream-50))',
      100: 'hsl(var(--cream-100))',
      200: 'hsl(var(--cream-200))',
      300: 'hsl(var(--cream-300))',
      400: 'hsl(var(--cream-400))',
    },
  },
```

**Step 2: Add RunExpression-specific animations**

Add after line 96 (inside `extend.keyframes`):

```typescript
keyframes: {
  // ... existing shadcn keyframes ...

  // RunExpression brand animations
  'glow-pulse': {
    '0%, 100%': {
      boxShadow: '0 0 20px rgba(147, 102, 153, 0.4), 0 0 40px rgba(147, 102, 153, 0.1)'
    },
    '50%': {
      boxShadow: '0 0 30px rgba(147, 102, 153, 0.6), 0 0 60px rgba(147, 102, 153, 0.2)'
    },
  },
  'float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  'shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
},
```

**Step 3: Add animation utilities**

Add after line 102 (inside `extend.animation`):

```typescript
animation: {
  // ... existing shadcn animations ...

  // RunExpression brand animations
  'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
  'float': 'float 3s ease-in-out infinite',
  'shimmer': 'shimmer 8s linear infinite',
},
```

**Step 4: Verify Tailwind config compiles**

Run: `npm run build`

Expected: Build succeeds without errors

**Step 5: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(design-system): add brand color classes and custom animations"
```

---

## Task 4: Add Reduced Motion Support for Accessibility

**Files:**
- Modify: `app/globals.css:71` (append)

**Step 1: Add prefers-reduced-motion media query**

Append to `app/globals.css`:

```css
/* Accessibility: Respect prefers-reduced-motion */
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

/* Accessibility: Focus visible for keyboard navigation */
@layer base {
  *:focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }
}
```

**Step 2: Verify reduced motion works**

Run: `npm run dev`

Test:
1. Open DevTools > Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce`
2. Trigger any animation (button hover, page transition)

Expected: Animations are nearly instant (0.01ms), not distracting

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(a11y): add reduced motion support and focus-visible styles"
```

---

## Task 5: Create Brand-Specific Utility Classes

**Files:**
- Modify: `app/globals.css:62-70` (replace utilities layer)

**Step 1: Expand utility layer with brand patterns**

Replace the existing `@layer utilities` block (lines 62-70):

```css
/* RunExpression brand utilities */
@layer utilities {
  /* Typography utilities */
  .text-balance {
    text-wrap: balance;
  }

  .text-pretty {
    text-wrap: pretty;
  }

  /* Brand-specific border radius (organic, hand-drawn feeling) */
  .organic-edges {
    border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  }

  .organic-edges-sm {
    border-radius: 128px 8px 112px 8px/8px 112px 8px 128px;
  }

  /* Purple glow effect for interactive elements */
  .glow-purple {
    box-shadow: 0 0 20px rgba(147, 102, 153, 0.3),
                0 0 40px rgba(147, 102, 153, 0.1);
  }

  .glow-sage {
    box-shadow: 0 0 20px rgba(99, 128, 116, 0.3),
                0 0 40px rgba(99, 128, 116, 0.1);
  }

  /* Flow gradient (for The Flow feature) */
  .flow-gradient {
    background: linear-gradient(
      135deg,
      hsl(var(--sage-500)) 0%,
      hsl(var(--purple-500)) 50%,
      hsl(var(--sage-600)) 100%
    );
  }

  /* Manifesto chapter styling */
  .manifesto-text {
    font-family: var(--font-sans);
    line-height: 1.8;
    letter-spacing: 0.01em;
  }

  /* Monospace UI elements */
  .ui-mono {
    font-family: var(--font-mono);
    font-weight: 400;
    letter-spacing: -0.02em;
  }
}
```

**Step 2: Verify utilities are available**

Run: `npm run dev`

Test: Add a test component with these classes temporarily:
```tsx
<div className="organic-edges glow-purple p-4">
  <p className="manifesto-text">Test text</p>
</div>
```

Expected:
- Organic border radius visible
- Purple glow around element
- Merriweather font for .manifesto-text

**Step 3: Remove test component and commit**

```bash
git add app/globals.css
git commit -m "feat(design-system): add brand-specific utility classes"
```

---

## Task 6: Install and Customize Core shadcn/ui Components

**Files:**
- Create: Multiple component files
- Modify: Existing components for brand styling

**Step 1: Install missing core components**

Run these commands sequentially:

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add toast
```

Expected: Each command creates a new component file in `components/ui/`

**Step 2: Verify components were created**

Run: `ls -la components/ui/`

Expected files:
- `dialog.tsx`
- `tabs.tsx`
- `badge.tsx`
- `avatar.tsx`
- `separator.tsx`
- `skeleton.tsx`
- `toast.tsx`
- `toaster.tsx` (created with toast)
- `use-toast.ts` (hook created with toast)

**Step 3: Commit new components**

```bash
git add components/ui/
git commit -m "feat(design-system): install core shadcn/ui components"
```

---

## Task 7: Customize Button Component with Brand Styling

**Files:**
- Modify: `components/ui/button.tsx:1-56`

**Step 1: Read current button implementation**

Run: `cat components/ui/button.tsx`

**Step 2: Add brand-specific button variants**

Update the `buttonVariants` definition to include RunExpression variants:

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // RunExpression brand variants
        sage: "bg-sage-500 text-white hover:bg-sage-600 hover:glow-sage transition-all duration-300",
        purple: "bg-purple-500 text-white hover:bg-purple-600 hover:glow-purple transition-all duration-300",
        flow: "flow-gradient text-white hover:opacity-90 hover:scale-105 transition-all duration-300",
        organic: "bg-sage-500 text-white hover:bg-sage-600 organic-edges transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-14 rounded-lg px-10 text-base", // For CTAs
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Step 3: Verify button variants render correctly**

Create temporary test page: `app/test-buttons/page.tsx`:

```typescript
import { Button } from '@/components/ui/button'

export default function TestButtons() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Button Variants</h1>
      <div className="flex gap-4 flex-wrap">
        <Button variant="sage">Sage Button</Button>
        <Button variant="purple">Purple Button</Button>
        <Button variant="flow">Flow Button</Button>
        <Button variant="organic">Organic Button</Button>
        <Button variant="sage" size="xl">CTA Button</Button>
      </div>
    </div>
  )
}
```

Run: `npm run dev` and visit http://localhost:3000/test-buttons

Expected:
- Sage button: green background, hover glow
- Purple button: purple background, hover glow
- Flow button: gradient background
- Organic button: irregular border radius

**Step 4: Delete test page and commit**

```bash
rm -rf app/test-buttons
git add components/ui/button.tsx
git commit -m "feat(design-system): add RunExpression brand button variants"
```

---

## Task 8: Update Existing Components with Brand Tokens

**Files:**
- Modify: `components/ui/card.tsx`
- Modify: `components/ui/input.tsx`

**Step 1: Enhance Card component with organic variant**

Add to `components/ui/card.tsx` after reading current implementation:

```typescript
import { cn } from "@/lib/utils"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        organic: "organic-edges border-sage-200 hover:glow-sage transition-all duration-300",
        flow: "border-purple-200 hover:border-purple-400 transition-colors",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

// ... rest of component (Header, Title, Description, Content, Footer unchanged)
```

**Step 2: Enhance Input component with brand focus states**

Modify `components/ui/input.tsx` - update the className:

```typescript
className={cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
  className
)
```

**Step 3: Verify enhanced components**

Create test page: `app/test-components/page.tsx`:

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function TestComponents() {
  return (
    <div className="p-8 space-y-8">
      <Card variant="organic" className="max-w-md">
        <CardHeader>
          <CardTitle>Organic Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has organic edges and sage glow on hover.</p>
        </CardContent>
      </Card>

      <Card variant="flow" className="max-w-md">
        <CardHeader>
          <CardTitle>Flow Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has purple border transitions.</p>
        </CardContent>
      </Card>

      <div className="max-w-md space-y-4">
        <Input placeholder="Type to see sage focus ring..." />
      </div>
    </div>
  )
}
```

Run: Visit http://localhost:3000/test-components

Expected:
- Organic card has irregular borders and glows on hover
- Flow card has purple borders
- Input shows sage-colored focus ring when clicked

**Step 4: Delete test page and commit**

```bash
rm -rf app/test-components
git add components/ui/card.tsx components/ui/input.tsx
git commit -m "feat(design-system): enhance Card and Input with brand variants"
```

---

## Task 9: Create Design System Documentation

**Files:**
- Create: `DOCS/design-system.md`

**Step 1: Write comprehensive design system guide**

```markdown
# RunExpression Design System

**Last Updated:** 2026-01-24

## Overview

The RunExpression design system embodies "The Sage in the Parking Lot" - wise yet grounded, serious yet lighthearted, spiritual yet practical.

---

## Typography

### Fonts

**DM Mono** (`--font-mono`)
- Usage: UI elements, buttons, labels, nav, numbers
- Weights: 300 (Light), 400 (Regular), 500 (Medium)
- Character: Technical, clean, modern

**Merriweather** (`--font-sans`)
- Usage: Body text, manifesto, long-form content
- Weights: 300 (Light), 400 (Regular), 700 (Bold), 900 (Black)
- Character: Readable, warm, literary

### Usage Guidelines

```tsx
<h1 className="font-sans text-4xl font-bold">Manifesto Headline</h1>
<p className="manifesto-text">Long-form content with optimal readability...</p>
<button className="ui-mono">Enter the Flow</button>
```

---

## Colors

### Brand Colors

**Sage Green** - Primary brand color
- Represents: Trust, growth, grounded wisdom
- Usage: Primary CTAs, focus states, key UI elements
- Palette: `sage-50` through `sage-900`
- Primary: `sage-500` (hsl(147, 30%, 40%))

**Purple** - Energy and transformation
- Represents: Flow state, creative energy, universal connection
- Usage: Secondary actions, accents, The Flow feature
- Palette: `purple-50` through `purple-900`
- Primary: `purple-500` (hsl(270, 50%, 48%))

**Cream** - Warmth and approachability
- Represents: Accessibility, comfort, human touch
- Usage: Backgrounds, subtle accents
- Palette: `cream-50` through `cream-400`

### Semantic Tokens

Light mode uses cream backgrounds with sage text.
Dark mode uses deep sage backgrounds with cream text.

```tsx
<div className="bg-background text-foreground"> // Automatically adapts to theme
<Button variant="sage">Primary Action</Button>
<Button variant="purple">Secondary Action</Button>
```

---

## Components

### Buttons

**Brand Variants:**

```tsx
<Button variant="sage">Sage CTA</Button>
<Button variant="purple">Purple Action</Button>
<Button variant="flow">Flow Gradient</Button>
<Button variant="organic">Organic Edges</Button>
<Button variant="sage" size="xl">Hero CTA</Button>
```

**Usage Guidelines:**
- Primary CTAs: `variant="sage"` with `size="xl"` for hero sections
- Secondary actions: `variant="purple"`
- The Flow submissions: `variant="flow"`
- Clubhouse/organic content: `variant="organic"`

### Cards

**Brand Variants:**

```tsx
<Card variant="organic">Clubhouse Content</Card>
<Card variant="flow">Expression Events</Card>
```

**Usage Guidelines:**
- User-generated content: `variant="organic"` (hand-drawn feel)
- Flow wall posts: `variant="flow"` (purple accents)
- Admin/system: `variant="default"` (clean, neutral)

### Inputs

All inputs have sage-colored focus rings for brand consistency.

```tsx
<Input placeholder="Add your intention..." />
// Focus ring: sage-500 with 2px width
```

---

## Animations

### Brand Animations

**Glow Pulse** - Ethereal, attention-drawing
```tsx
<div className="animate-glow-pulse">Interactive element</div>
```

**Float** - Gentle, weightless movement
```tsx
<div className="animate-float">Floating content</div>
```

**Shimmer** - Energy, flow, transformation
```tsx
<div className="animate-shimmer bg-gradient-to-r from-sage-500 via-purple-500 to-sage-500">
  Loading state
</div>
```

### Accessibility

All animations respect `prefers-reduced-motion`. Users with motion sensitivity see instant transitions (0.01ms).

Test: DevTools > Rendering > Emulate `prefers-reduced-motion: reduce`

---

## Utilities

### Typography

- `.text-balance` - Balanced line wrapping for headlines
- `.text-pretty` - Optimized paragraph wrapping
- `.manifesto-text` - Manifesto content styling (Merriweather, 1.8 line-height)
- `.ui-mono` - UI element text (DM Mono)

### Visual Effects

- `.organic-edges` - Irregular border radius (large)
- `.organic-edges-sm` - Irregular border radius (small)
- `.glow-purple` - Purple glow shadow
- `.glow-sage` - Sage glow shadow
- `.flow-gradient` - Sage-to-purple gradient

### Usage Examples

```tsx
<h1 className="text-balance font-sans text-5xl">
  Make running mean more.
</h1>

<div className="organic-edges glow-sage p-6 bg-white">
  Clubhouse story card
</div>

<div className="flow-gradient p-1 rounded-lg">
  <div className="bg-white rounded-lg p-4">
    Gradient border effect
  </div>
</div>
```

---

## Design Principles

### 1. Motion Creates Emotion
Use animations to enhance emotional resonance, not distract.

### 2. Process Over Outcome
Design for engagement and experience, not just conversions.

### 3. Interdependence
Components work together as a system. Consistency over novelty.

### 4. The Sage in the Parking Lot
Balance sophistication (serif fonts, organic shapes) with grit (monospace UI, high contrast).

---

## Developer Guidelines

### Adding New Components

1. Start with shadcn/ui base component
2. Add brand variants using `cva()`
3. Use semantic tokens (`bg-primary`) over direct colors (`bg-sage-500`)
4. Test with both light and dark modes
5. Verify reduced motion compatibility

### Color Usage

**Do:**
- Use semantic tokens for adaptable UI (`bg-background`, `text-foreground`)
- Use brand colors for intentional brand moments (`bg-sage-500`)
- Maintain WCAG AA contrast ratios (4.5:1 text, 3:1 UI)

**Don't:**
- Mix brand colors without purpose (sage + purple should be intentional)
- Override semantic tokens with hardcoded colors in components
- Use brand colors for destructive actions (use `destructive` token)

### Typography Usage

**Do:**
- Use `font-sans` (Merriweather) for body text and manifesto content
- Use `ui-mono` utility or `font-mono` for UI elements
- Use `.manifesto-text` for long-form expressive content

**Don't:**
- Use monospace for long-form reading (readability)
- Mix fonts within a single paragraph
- Override font loading with custom font stacks

---

## Migration Guide

### For Existing Components

Replace generic classes:
```tsx
// Before
<Button className="bg-blue-500">Click me</Button>

// After
<Button variant="sage">Click me</Button>
```

Replace focus rings:
```tsx
// Before
<input className="focus:ring-blue-500" />

// After
<Input /> // Sage focus ring built-in
```

### For New Features

1. Check if a shadcn component exists
2. Use brand variants when available
3. Apply semantic tokens for adaptability
4. Add custom utilities for repeated patterns

---

## Resources

- **Brand Guide:** `DOCS/specs/spec-brand-and-content.md`
- **Component Library:** `components/ui/`
- **Tailwind Config:** `tailwind.config.ts`
- **CSS Variables:** `app/globals.css`

---

**Questions?** See `.claude/skills/shadcn-ui-component-builder/SKILL.md` for component patterns.
```

**Step 2: Commit documentation**

```bash
git add DOCS/design-system.md
git commit -m "docs(design-system): add comprehensive design system documentation"
```

---

## Task 10: Add Design System Tests

**Files:**
- Create: `__tests__/design-system/colors.test.ts`
- Create: `__tests__/design-system/typography.test.ts`

**Step 1: Create test directory**

```bash
mkdir -p __tests__/design-system
```

**Step 2: Write color system tests**

Create `__tests__/design-system/colors.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals'

describe('Design System - Colors', () => {
  it('should define sage color scale', () => {
    const styles = getComputedStyle(document.documentElement)
    const sage500 = styles.getPropertyValue('--sage-500')
    expect(sage500).toBeTruthy()
    expect(sage500).toContain('147') // Hue
  })

  it('should define purple color scale', () => {
    const styles = getComputedStyle(document.documentElement)
    const purple500 = styles.getPropertyValue('--purple-500')
    expect(purple500).toBeTruthy()
    expect(purple500).toContain('270') // Hue
  })

  it('should define cream color scale', () => {
    const styles = getComputedStyle(document.documentElement)
    const cream50 = styles.getPropertyValue('--cream-50')
    expect(cream50).toBeTruthy()
    expect(cream50).toContain('40') // Hue
  })

  it('should map semantic tokens to brand colors', () => {
    const styles = getComputedStyle(document.documentElement)
    const primary = styles.getPropertyValue('--primary')
    expect(primary).toBeTruthy()
    // Primary should be sage-500
    expect(primary).toContain('147 30% 40%')
  })
})
```

**Step 3: Write typography tests**

Create `__tests__/design-system/typography.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals'

describe('Design System - Typography', () => {
  it('should load DM Mono font', () => {
    const styles = getComputedStyle(document.documentElement)
    const monoFont = styles.getPropertyValue('--font-mono')
    expect(monoFont).toBeTruthy()
  })

  it('should load Merriweather font', () => {
    const styles = getComputedStyle(document.documentElement)
    const sansFont = styles.getPropertyValue('--font-sans')
    expect(sansFont).toBeTruthy()
  })

  it('should apply font variables to body', () => {
    const body = document.querySelector('body')
    const styles = body ? getComputedStyle(body) : null
    expect(styles?.fontFamily).toBeTruthy()
  })
})
```

**Step 4: Run tests**

```bash
npm run test:ci
```

Expected: All tests pass (2 test suites)

**Step 5: Commit tests**

```bash
git add __tests__/design-system/
git commit -m "test(design-system): add color and typography tests"
```

---

## Task 11: Update shadcn components.json Configuration

**Files:**
- Modify: `components.json:1-21`

**Step 1: Update baseColor to sage**

Change line 9:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",  // <- Change this to "green" (closest to sage)
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Updated version:

```json
"baseColor": "green",
```

**Step 2: Verify config is valid JSON**

```bash
cat components.json | jq .
```

Expected: Valid JSON output with no errors

**Step 3: Commit config update**

```bash
git add components.json
git commit -m "chore(design-system): update shadcn baseColor to green"
```

---

## Task 12: Create Brand Color Usage Examples

**Files:**
- Create: `components/examples/design-system-showcase.tsx`

**Step 1: Create showcase component**

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

/**
 * Design System Showcase
 *
 * This component demonstrates all brand colors, typography, and components.
 * Use this as a reference for implementing RunExpression brand patterns.
 */
export function DesignSystemShowcase() {
  return (
    <div className="container mx-auto py-12 space-y-16">
      {/* Typography */}
      <section>
        <h2 className="text-3xl font-sans font-bold mb-8">Typography</h2>
        <div className="space-y-4">
          <p className="manifesto-text text-2xl">
            Manifesto Text: Leave heavy. Return light. (Merriweather)
          </p>
          <p className="ui-mono text-lg">
            UI Mono: Enter the Flow (DM Mono)
          </p>
        </div>
      </section>

      {/* Colors */}
      <section>
        <h2 className="text-3xl font-sans font-bold mb-8">Brand Colors</h2>

        <h3 className="text-xl font-semibold mb-4">Sage Green</h3>
        <div className="flex gap-2 mb-8">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
            <div
              key={weight}
              className={`w-16 h-16 rounded flex items-center justify-center text-xs text-white bg-sage-${weight}`}
            >
              {weight}
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-4">Purple</h3>
        <div className="flex gap-2 mb-8">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
            <div
              key={weight}
              className={`w-16 h-16 rounded flex items-center justify-center text-xs text-white bg-purple-${weight}`}
            >
              {weight}
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-4">Cream</h3>
        <div className="flex gap-2 mb-8">
          {[50, 100, 200, 300, 400].map((weight) => (
            <div
              key={weight}
              className={`w-16 h-16 rounded flex items-center justify-center text-xs border bg-cream-${weight}`}
            >
              {weight}
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-3xl font-sans font-bold mb-8">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="sage">Sage Primary</Button>
          <Button variant="purple">Purple Secondary</Button>
          <Button variant="flow">Flow Gradient</Button>
          <Button variant="organic">Organic Edges</Button>
          <Button variant="sage" size="xl">CTA Button</Button>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-3xl font-sans font-bold mb-8">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              Standard card styling
            </CardContent>
          </Card>

          <Card variant="organic">
            <CardHeader>
              <CardTitle>Organic Card</CardTitle>
            </CardHeader>
            <CardContent>
              Irregular borders, sage glow on hover
            </CardContent>
          </Card>

          <Card variant="flow">
            <CardHeader>
              <CardTitle>Flow Card</CardTitle>
            </CardHeader>
            <CardContent>
              Purple border transitions
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Utilities */}
      <section>
        <h2 className="text-3xl font-sans font-bold mb-8">Utilities</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Glow Effects</h3>
            <div className="flex gap-4">
              <div className="glow-sage p-8 bg-sage-500 text-white rounded">
                Sage Glow
              </div>
              <div className="glow-purple p-8 bg-purple-500 text-white rounded">
                Purple Glow
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Organic Edges</h3>
            <div className="flex gap-4">
              <div className="organic-edges p-8 bg-sage-500 text-white">
                Large Organic
              </div>
              <div className="organic-edges-sm p-8 bg-purple-500 text-white">
                Small Organic
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Flow Gradient</h3>
            <div className="flow-gradient p-8 text-white rounded text-center text-xl font-bold">
              Sage → Purple → Sage
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Animations</h3>
            <div className="flex gap-4">
              <div className="animate-glow-pulse p-8 bg-purple-500 text-white rounded">
                Glow Pulse
              </div>
              <div className="animate-float p-8 bg-sage-500 text-white rounded">
                Float
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section>
        <h2 className="text-3xl font-sans font-bold mb-8">Forms</h2>
        <div className="max-w-md space-y-4">
          <Input placeholder="Type to see sage focus ring..." />
          <Input placeholder="Another input example" />
        </div>
      </section>
    </div>
  )
}
```

**Step 2: Create showcase page (for dev reference only)**

Create `app/design-system-showcase/page.tsx`:

```typescript
import { DesignSystemShowcase } from '@/components/examples/design-system-showcase'

export default function ShowcasePage() {
  return <DesignSystemShowcase />
}
```

**Step 3: Verify showcase renders correctly**

Run: Visit http://localhost:3000/design-system-showcase

Expected:
- All colors render correctly
- Typography shows Merriweather and DM Mono
- Buttons show brand variants
- Cards have organic and flow variants
- Utilities (glow, organic edges, gradient) display correctly
- Animations run smoothly

**Step 4: Commit showcase**

```bash
git add components/examples/design-system-showcase.tsx app/design-system-showcase/
git commit -m "feat(design-system): add interactive design system showcase"
```

---

## Task 13: Update RUN-19 Status in Linear

**Files:**
- None (Linear API interaction)

**Step 1: Mark task as in progress**

Use Linear MCP tool or CLI:

```bash
# Using Linear skill/MCP
# This would be done via Linear integration
```

Or manually in Linear UI:
1. Navigate to RUN-19
2. Change status from "Backlog" to "In Progress"
3. Add comment: "Design system configuration complete. All tasks implemented."

**Step 2: Add completion comment**

Comment in RUN-19:
```
✅ Design System Configuration Complete

**Implemented:**
- Google Fonts (DM Mono + Merriweather) configured
- RunExpression brand colors (sage, purple, cream) with CSS variables
- Custom Tailwind utilities and animations
- Reduced motion support for accessibility
- Core shadcn/ui components installed (dialog, tabs, badge, avatar, etc.)
- Brand-specific button variants (sage, purple, flow, organic)
- Enhanced Card and Input components with brand styling
- Comprehensive design system documentation
- Color and typography tests
- Interactive design system showcase

**Next Steps:**
- Apply design system to homepage components
- Implement The Flow with brand styling
- Build manifesto chapters with custom animations
```

**Step 3: Move to "Done" or "Ready for Review"**

Change Linear status based on team workflow:
- "Ready for Review" if code review needed
- "Done" if this completes the task

---

## Final Verification Checklist

Run these commands to verify all changes:

```bash
# Type check
npm run type-check
# Expected: No errors

# Lint
npm run lint
# Expected: No errors

# Build
npm run build
# Expected: Build succeeds

# Tests
npm run test:ci
# Expected: All tests pass

# Visual verification
npm run dev
# Visit http://localhost:3000/design-system-showcase
# Expected: All components render with brand styling
```

---

## Summary

**Files Created:**
- `DOCS/design-system.md` - Comprehensive documentation
- `components/examples/design-system-showcase.tsx` - Interactive showcase
- `app/design-system-showcase/page.tsx` - Showcase page
- `components/ui/dialog.tsx` - New shadcn component
- `components/ui/tabs.tsx` - New shadcn component
- `components/ui/badge.tsx` - New shadcn component
- `components/ui/avatar.tsx` - New shadcn component
- `components/ui/separator.tsx` - New shadcn component
- `components/ui/skeleton.tsx` - New shadcn component
- `components/ui/toast.tsx` - New shadcn component
- `components/ui/toaster.tsx` - New shadcn component
- `components/ui/use-toast.ts` - New shadcn hook
- `__tests__/design-system/colors.test.ts` - Color tests
- `__tests__/design-system/typography.test.ts` - Typography tests

**Files Modified:**
- `app/layout.tsx` - Added Google Fonts
- `app/globals.css` - Brand colors, utilities, reduced motion
- `tailwind.config.ts` - Brand color classes and animations
- `components.json` - Updated baseColor
- `components/ui/button.tsx` - Added brand variants
- `components/ui/card.tsx` - Added organic and flow variants
- `components/ui/input.tsx` - Sage focus ring

**Commits:** 13 total
- All follow conventional commit format
- Each task is a separate commit for easy review

**Related Skills:**
- @.claude/skills/shadcn-ui-component-builder - Component implementation patterns
- @.claude/skills/framer-motion-animation - Animation guidelines
- @.DOCS/specs/spec-brand-and-content.md - Brand voice and identity

---

**RUN-19 Status:** Ready for review and integration into homepage
