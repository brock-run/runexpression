---
name: shadcn-ui-component-builder
description: Creates and customizes Shadcn/UI components using Radix UI primitives, Tailwind CSS, and RunExpression brand styling. Use when building new UI components, customizing existing Shadcn components, ensuring accessibility compliance, or implementing brand-specific visual patterns (sage green, purple glows, monospace fonts).
---

# Shadcn/UI Component Builder

## Quick Start

When building or customizing Shadcn/UI components:

1. Use Radix UI primitives for accessibility
2. Apply Tailwind CSS with brand colors and typography
3. Ensure WCAG 2.1 AA compliance (keyboard navigation, ARIA labels)
4. Match RunExpression brand aesthetic (sage green, purple glows, monospace fonts)

## Component Structure

### Standard Pattern

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  'base-classes font-mono', // Always include font-mono for UI elements
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        // Add brand variants
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Component-specific props
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Component.displayName = 'Component'

export { Component, componentVariants }
```

## Brand Styling

### Colors

**Primary (Sage Green):**
- Use `bg-sage-600` or `bg-sage-700` for primary actions
- Hover: `hover:bg-sage-700` or `hover:bg-sage-800`
- Text: `text-sage-700` or `text-sage-600`

**Accent (Purple):**
- Glow effects: `shadow-[0_0_20px_rgba(139,92,246,0.3)]`
- Accent text: `text-purple-600` or `text-purple-700`
- Background: `bg-purple-100` for tags/badges

**Neutral:**
- Background: `bg-background` (uses CSS variables)
- Foreground: `text-foreground`
- Borders: `border-border`

### Typography

**UI Elements (Buttons, Labels, Navigation):**
```tsx
// ✅ Always use font-mono for UI
<Button className="font-mono">Share Your Run</Button>
<label className="font-mono text-sm">Email</label>
```

**Body Content:**
```tsx
// ✅ Use serif (default) for body text
<p className="font-serif text-lg leading-relaxed">
  Content here...
</p>
```

### Brand Effects

**Purple Glow (Interactive Elements):**
```tsx
// ✅ Hover glow effect
<div className="rounded-lg border hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow">
  {content}
</div>
```

**Organic Edges (Optional, for special elements):**
```tsx
// ✅ Use organic-edges utility for unique shapes
<div className="organic-edges bg-sage-100 p-6">
  {content}
</div>
```

## Accessibility Requirements

### Keyboard Navigation

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
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault() // Prevent page scroll on Space
      handleClick()
    }
  }}
  aria-label="Submit form"
>
  Submit
</div>
```

### ARIA Labels

**Label all non-text interactive elements:**
```tsx
// ✅ Good (icon button with label)
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// ✅ Good (form field with label)
<label htmlFor="email" className="font-mono text-sm">
  Email
</label>
<input id="email" type="email" aria-describedby="email-error" />
```

### Focus Indicators

**Always show visible focus rings:**
```tsx
// ✅ Good (default Shadcn focus styles)
<Button className="focus-visible:ring-2 focus-visible:ring-ring">
  Submit
</Button>

// ✅ Good (custom purple focus for brand)
<Button className="focus-visible:ring-2 focus-visible:ring-purple-500">
  Submit
</Button>
```

### Screen Reader Support

**Announce dynamic content:**
```tsx
// ✅ Good (live region for status updates)
<div role="status" aria-live="polite" aria-atomic="true">
  {submissionResult && (
    <p>{submissionResult.success ? 'Post created!' : 'Submission failed'}</p>
  )}
</div>
```

## Common Component Patterns

### Button Variants

```tsx
import { Button } from '@/components/ui/button'

// Primary (sage green)
<Button className="bg-sage-600 hover:bg-sage-700 font-mono">
  Share Your Run
</Button>

// Secondary (outline)
<Button variant="outline" className="border-sage-400 text-sage-700 font-mono">
  Cancel
</Button>

// Destructive
<Button variant="destructive" className="font-mono">
  Delete Post
</Button>

// Ghost
<Button variant="ghost" className="font-mono">
  View More
</Button>
```

### Form Fields

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ✅ Good (label + input + error)
<div className="space-y-2">
  <Label htmlFor="email" className="font-mono text-sm">
    Email
  </Label>
  <Input
    id="email"
    type="email"
    className="font-mono"
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <p id="email-error" className="text-sm text-red-600" role="alert">
      {error}
    </p>
  )}
</div>
```

### Cards

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// ✅ Good (brand-styled card)
<Card className="hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-shadow">
  <CardHeader>
    <CardTitle className="font-mono">Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="font-serif">Card content...</p>
  </CardContent>
</Card>
```

### Dialogs

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// ✅ Good (accessible dialog)
<Dialog>
  <DialogTrigger asChild>
    <Button className="font-mono">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle className="font-mono text-2xl">Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

## Adding New Shadcn Components

### Installation

```bash
# Use npx shadcn-ui@latest add [component-name]
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

### Customization Workflow

1. **Install component** using shadcn CLI
2. **Review component** in `components/ui/[component-name].tsx`
3. **Apply brand styling:**
   - Add `font-mono` to UI text elements
   - Replace default colors with brand colors where appropriate
   - Add purple glow effects for interactive elements
4. **Verify accessibility:**
   - Test keyboard navigation
   - Check ARIA labels
   - Verify focus indicators
   - Test with screen reader

### Example: Customizing a Dialog

```tsx
// After installing: npx shadcn-ui@latest add dialog

// Customize DialogContent with brand styling
<DialogContent className="sm:max-w-[600px] border-sage-200">
  <DialogHeader>
    <DialogTitle className="font-mono text-2xl text-sage-700">
      {title}
    </DialogTitle>
  </DialogHeader>
  {/* Content */}
</DialogContent>
```

## Component Composition

### Using Radix UI Primitives

Shadcn components are built on Radix UI. When creating custom components:

```tsx
import * as Dialog from '@radix-ui/react-dialog'

// ✅ Good (compose with Radix primitives)
<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 font-mono">
      {/* Content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Responsive Design

### Mobile-First Approach

```tsx
// ✅ Good (mobile first, enhance for desktop)
<div className="p-4 md:p-8 lg:p-12">
  <Button className="w-full md:w-auto font-mono">
    Submit
  </Button>
</div>
```

### Touch Targets

**Minimum 44x44px for interactive elements:**
```tsx
// ✅ Good (adequate touch target)
<Button className="min-h-[44px] min-w-[44px] p-3 font-mono">
  <Icon className="h-5 w-5" />
</Button>
```

## Animation Integration

### With Framer Motion

```tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

// ✅ Good (animated button with brand styling)
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Button className="bg-sage-600 hover:bg-sage-700 font-mono">
    Animated Button
  </Button>
</motion.div>
```

### Respect Reduced Motion

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
      {/* Content */}
    </motion.div>
  )
}
```

## Testing Checklist

Before finalizing a component:

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators are visible
- [ ] ARIA labels are present for non-text elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Touch targets are minimum 44x44px
- [ ] Brand styling applied (font-mono, brand colors)
- [ ] Responsive on mobile and desktop
- [ ] Works with screen readers
- [ ] Respects `prefers-reduced-motion`

## Common Patterns Reference

### Loading States

```tsx
import { Loader2 } from 'lucide-react'

<Button disabled={isLoading} className="font-mono">
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Error States

```tsx
<div className="space-y-2">
  <Input
    className={cn(
      'font-mono',
      error && 'border-red-500 focus-visible:ring-red-500'
    )}
    aria-invalid={!!error}
    aria-describedby={error ? 'error-message' : undefined}
  />
  {error && (
    <p id="error-message" className="text-sm text-red-600" role="alert">
      {error}
    </p>
  )}
</div>
```

## Additional Resources

- **Shadcn/UI Docs:** https://ui.shadcn.com/
- **Radix UI Docs:** https://www.radix-ui.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Project UI Patterns:** See `docs/09-UI-UX-PATTERNS.md`
- **Brand Guide:** See `docs/04-BRAND-CONTENT-GUIDE.md`
