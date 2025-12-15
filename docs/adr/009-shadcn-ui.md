# ADR-009: Shadcn/UI Component System

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** frontend, components, ui, developer-experience

## Context

RunExpression V1 requires a robust UI component system for:
- Forms (login, waitlist, Flow submissions, club uploads)
- Interactive elements (dialogs, tooltips, dropdowns)
- Data display (cards, tables, lists)
- Navigation (menus, tabs)
- Feedback (toasts, alerts, loading states)

**UI Requirements:**
- **Accessible:** WCAG 2.1 AA compliance (keyboard nav, screen readers)
- **Customizable:** Must match RunExpression's unique brand (sage green, purple, monospace fonts)
- **Performant:** Minimal bundle size, tree-shakeable
- **Developer-friendly:** Fast to implement, TypeScript support, good DX
- **Consistent:** Reusable patterns across all pages

**Constraints:**
- Small team (1-2 devs) — can't build everything from scratch
- Tailwind CSS already chosen for styling
- Need to ship V1 in 6-8 weeks
- Brand is highly custom (not Material Design or Bootstrap aesthetic)

**Examples of Custom Needs:**
- Dialog overlays with purple glows (not default gray shadows)
- Monospace font buttons (not rounded sans-serif)
- Accordion sections for Clubhouse Lore (unique styling)
- Toast notifications with brand voice ("Your run was captured in The Flow")

## Decision

We will use **Shadcn/UI** — a collection of copy-paste React components built on Radix UI primitives, styled with Tailwind CSS.

### Key Implementation Details:

**What Shadcn/UI is:**
- **Not a library:** Components copied into your codebase (`/components/ui/`)
- **Built on Radix UI:** Uses Radix primitives (accessible, unstyled components)
- **Styled with Tailwind:** All styling via Tailwind classes
- **Customizable:** You own the code, modify as needed

**Installation Example:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button dialog form toast accordion
```

**Component Structure:**
```
/components/ui/
  button.tsx        # <Button variant="outline" size="lg" />
  dialog.tsx        # <Dialog><DialogTrigger>...</Dialog>
  form.tsx          # <Form> with react-hook-form integration
  toast.tsx         # Toast notifications
  accordion.tsx     # Expandable sections
  input.tsx         # Form inputs
  select.tsx        # Dropdowns
```

**Usage Example:**
```tsx
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export function FlowSubmitDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-mono">
          Share Your Run
        </Button>
      </DialogTrigger>
      <DialogContent className="border-purple-500">
        {/* Form content */}
      </DialogContent>
    </Dialog>
  )
}
```

**Why This Works for RunExpression:**
- Components live in our codebase → full customization (change colors, fonts, animations)
- Radix UI handles accessibility → keyboard nav, ARIA attributes, focus management
- Tailwind integration → consistent with our existing styling approach
- Copy-paste approach → no version conflicts, no breaking changes from upstream

## Consequences

### Positive

- **Full control:** Own the code, modify components to match brand exactly
- **No bundle bloat:** Only include components you use (no unused code shipped)
- **Accessibility built-in:** Radix UI primitives handle complex ARIA patterns correctly
- **Tailwind integration:** Seamless styling with our existing Tailwind setup
- **No version lock-in:** Components don't break when "library" updates
- **TypeScript-first:** Excellent type safety and autocomplete
- **Fast iteration:** Copy component, customize, done (no fighting with CSS overrides)
- **Small bundle:** ~5-10KB per component (vs 300KB+ for full Material UI)
- **Modern primitives:** Radix UI is best-in-class for headless components

### Negative

- **Manual updates:** If Shadcn/UI improves a component, must manually copy new version
- **No central updates:** Can't run `npm update` to get bug fixes (must track changes manually)
- **Code duplication:** Each component is duplicated in your codebase (not DRY if using in multiple projects)
- **Learning curve:** Developers must understand Radix UI primitive patterns (DialogTrigger, PortalRoot, etc.)
- **No official support:** Shadcn/UI is a collection, not a maintained library (community support only)

### Neutral

- **More files in codebase:** ~20-30 component files added to `/components/ui/`
- **Radix UI dependency:** Still depend on Radix UI primitives under the hood (but stable)

## Alternatives Considered

### Alternative 1: Material UI (MUI)

**Description:** Google's Material Design component library for React.

**Pros:**
- **Comprehensive:** 50+ components (autocomplete, data grid, date picker)
- **Mature:** 10+ years of development, huge community
- **Theming system:** Built-in theme provider for customization
- **Documentation:** Excellent docs, many examples

**Cons:**
- **Bundle size:** ~300KB+ minified (entire library imported by default)
- **Material Design aesthetic:** Hard to escape the "Google look" (rounded corners, shadows)
- **Customization fights:** Overriding styles requires `sx` prop or complex theme config
- **Performance:** Heavy runtime (style injection, theme context)
- **Not Tailwind-friendly:** Uses JSS/Emotion, conflicts with Tailwind approach

**Why rejected:** Material Design aesthetic doesn't match RunExpression's monospace, purple-glow, sage-green brand. Customizing MUI to look unique requires fighting the framework. Bundle size too large for our needs.

---

### Alternative 2: Chakra UI

**Description:** Accessible React component library with built-in theming.

**Pros:**
- **Accessibility-first:** WCAG compliant out of the box
- **Theming:** Excellent theme system (colors, fonts, spacing)
- **Developer experience:** Great DX, simple API
- **Composability:** Components compose well together

**Cons:**
- **CSS-in-JS:** Uses Emotion (adds runtime cost, not Tailwind)
- **Bundle size:** ~80-100KB (better than MUI, but still chunky)
- **Styling approach mismatch:** Conflicts with Tailwind methodology
- **Customization limits:** Theme system flexible, but still constrained by Chakra's primitives
- **Less control:** Components are in `node_modules`, can't modify directly

**Why rejected:** Chakra's CSS-in-JS approach conflicts with our Tailwind setup. We'd need to choose one or the other, and Tailwind is better for our custom brand. Bundle size still larger than Shadcn/UI.

---

### Alternative 3: Ant Design

**Description:** Enterprise-grade React UI library from Alibaba.

**Pros:**
- **Comprehensive:** 70+ components (data-heavy components like tables, charts)
- **Enterprise features:** Advanced form handling, internationalization
- **Design system:** Consistent Ant Design aesthetic
- **Documentation:** Excellent docs, Chinese and English

**Cons:**
- **Enterprise aesthetic:** Looks like admin dashboard (not creative/expressive)
- **Bundle size:** ~500KB+ (massive for our needs)
- **Customization difficulty:** Ant Design theme is opinionated, hard to escape
- **Overkill:** We don't need enterprise features (data grids, complex tables)
- **Not Tailwind-compatible:** Uses Less/CSS modules

**Why rejected:** Ant Design is built for enterprise dashboards, not creative, expressive websites. Aesthetic completely wrong for RunExpression. Massive bundle size for features we don't need.

---

### Alternative 4: Build Custom Components from Scratch

**Description:** Write all components ourselves using base HTML elements.

**Pros:**
- **Full control:** Exactly what we need, no more, no less
- **Smallest bundle:** Only code we write is included
- **No dependencies:** No third-party component libraries
- **Perfect brand match:** Built exactly for our brand

**Cons:**
- **Accessibility is hard:** Implementing ARIA correctly for dialogs, menus, etc. takes weeks
- **Time-consuming:** Would take 2-3 weeks to build 20+ accessible components
- **Reinventing the wheel:** Solutions already exist and are battle-tested
- **Maintenance burden:** We own all bugs, accessibility issues
- **Delays V1:** Can't ship in 6-8 weeks if building components from scratch

**Why rejected:** Building accessible components (especially dialogs, dropdowns, tooltips) is complex and time-consuming. Radix UI solves this perfectly. Shadcn/UI gives us the best of both worlds: Radix accessibility + full customization.

---

### Alternative 5: Headless UI (Tailwind Labs)

**Description:** Unstyled, accessible UI components from Tailwind CSS team.

**Pros:**
- **Tailwind-native:** Built by Tailwind team, perfect integration
- **Unstyled:** Full styling control via Tailwind classes
- **Accessible:** Proper ARIA attributes, keyboard navigation
- **Small bundle:** Only include components you use

**Cons:**
- **Less comprehensive:** Fewer components than Radix UI (no Accordion, Tabs, Toast)
- **More manual work:** No pre-styled examples (must style everything yourself)
- **No form integration:** Doesn't include form components (inputs, selects)
- **Less mature:** Newer than Radix UI, smaller community

**Why rejected:** Headless UI is great, but Shadcn/UI (built on Radix) gives us more components AND pre-styled examples we can customize. Radix UI is more comprehensive and battle-tested. Shadcn/UI is the best of Headless UI (unstyled primitives) + ready-to-use examples.

## References

- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Radix UI Accessibility Guide](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [Tailwind CSS](https://tailwindcss.com/)
- RunExpression Docs: `DOCS/03-TECHNICAL-DESIGN.md` (Tech Stack)

## Notes

- **Component catalog:** Start with Button, Dialog, Form, Toast, Accordion, Input, Select, Dropdown Menu
- **Customization approach:** Copy Shadcn component → modify Tailwind classes → match brand
- **Accessibility testing:** Use axe DevTools to verify WCAG compliance after customization
- **Form integration:** Shadcn/UI includes `react-hook-form` integration out of the box (perfect for Flow submissions, waitlist)
- **Animation:** Radix UI components work perfectly with Framer Motion for custom transitions

**Example Customizations:**
- **Button:** Change to monospace font (`font-mono`), purple outline (`border-purple-500`), sage green fill (`bg-sage-600`)
- **Dialog:** Add purple glow (`shadow-purple-500/50`), smooth scale transition (Framer Motion)
- **Toast:** Custom positioning (bottom-right), brand voice messages

**Future Enhancements:**
- V1.1: Create RunExpression-specific component library (extend Shadcn components)
- V1.1: Add Storybook for component documentation and testing
- V2: Consider publishing internal component library if patterns stabilize

**When to revisit this decision:**
- If Radix UI becomes unmaintained (unlikely, but possible)
- If we need 50+ components and Shadcn/UI coverage is insufficient (migrate to full design system)
- If bundle size becomes critical and we need even smaller primitives (consider Headless UI)

---

**Related ADRs:**
- [ADR-001: Next.js App Router](./001-nextjs-app-router.md) - Shadcn/UI integrates seamlessly with Next.js
- [ADR-003: Pragmatic Monolith](./003-pragmatic-monolith.md) - Components centralized in single codebase
