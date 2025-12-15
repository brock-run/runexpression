# ADR-005: Use MDX for Blog Content

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** content, blog, cms, developer-experience

## Context

RunExpression V1 includes a blog/library section for long-form content:
- Philosophy essays ("The Expressive Runner's Creed")
- Training wisdom ("Process Over Outcome in Marathon Training")
- DWTC stories ("Why the Bacon Ritual Matters")
- Creative expression pieces (art, comics, playlists)

**Content Requirements:**
- **Rich formatting:** Headings, lists, quotes, images, code blocks
- **Interactive elements:** Embedded pace calculators, quote animations
- **Version control:** Track changes to articles over time
- **SEO-friendly:** Fast initial load, proper meta tags
- **Easy authoring:** Founder (non-technical) and developers both write content
- **Fast iteration:** Publish new posts quickly without backend changes

**Team Constraints:**
- Small team (1-2 devs)
- No dedicated content manager initially
- Want to avoid admin UI maintenance
- Prefer simple, file-based workflow

## Decision

We will use **MDX** (Markdown + React components) for blog content, rendered via `next-mdx-remote` in Next.js.

### Key Implementation Details:

**File Structure:**
```
/content/
  blog/
    expressive-runners-creed.mdx
    bacon-ritual.mdx
    process-over-outcome.mdx
```

**MDX Example:**
```mdx
---
title: "The Expressive Runner's Creed"
excerpt: "Why we run deeper, not just faster"
author: "Brock"
publishedAt: "2025-12-14"
tags: ["philosophy", "manifesto"]
---

# The Expressive Runner's Creed

We believe running is not just a physical act; it is a **creative one**.

<PaceCalculator />

Read on to understand why...
```

**Rendering:**
- Files read at build time or server-side
- `next-mdx-remote` serializes MDX → React components
- Custom React components embedded inline (calculators, quote blocks)
- Blog index auto-generated from file metadata

**Benefits:**
- Write in Markdown (familiar to everyone)
- Embed React components (interactive elements)
- Version controlled in Git (every change tracked)
- No database queries for content (fast)

## Consequences

### Positive

- **Simple workflow:** Create `.mdx` file, write content, commit, deploy
- **Version control:** Every edit tracked in Git history
- **Fast rendering:** Static or cached at CDN edge
- **React components:** Can embed pace calculator, Flow snippets, custom quote blocks
- **Type safety:** Frontmatter validated with Zod schemas
- **Portable:** MDX files can be moved to any framework (not locked to Next.js)
- **No admin UI to maintain:** No CMS backend to secure, update, or debug
- **Free:** No CMS hosting costs
- **SEO-optimized:** Server-rendered, fast initial load
- **Developer-friendly:** Write in VSCode with syntax highlighting, autocomplete

### Negative

- **Non-technical editors:** Founder must learn Markdown (minor barrier)
- **No GUI editor:** No WYSIWYG like WordPress (can add later with Tina/Sanity if needed)
- **Git required:** Content changes require Git workflow (commit → push → deploy)
- **Build step:** New posts require redeploy (acceptable with Vercel's instant deploys)
- **Limited scheduling:** No built-in "publish at X time" (can add with Vercel cron)
- **No collaborative editing:** Only one person can edit a file at a time (conflicts)

### Neutral

- **Markdown learning curve:** Founder must learn `# Heading`, `**bold**`, etc. (quick to learn)
- **Custom components require dev work:** Interactive elements need React components (expected)

## Alternatives Considered

### Alternative 1: Headless CMS (Sanity, Contentful, Payload)

**Description:** Use a dedicated CMS with admin UI, store content in their database or ours.

**Pros:**
- **GUI editor:** WYSIWYG interface for non-technical editors
- **Rich media management:** Upload images, organize in folders
- **Scheduling:** Publish posts at future dates
- **Multi-user:** Multiple people can edit simultaneously
- **Preview:** See draft before publish
- **Versioning:** Track content changes in CMS

**Cons:**
- **Complexity:** Another service to set up, learn, maintain
- **Cost:** Sanity/Contentful have free tiers, but can get expensive ($99-299/mo at scale)
- **Vendor lock-in:** Content trapped in proprietary format
- **Setup time:** Configure schemas, set up webhooks, deploy admin UI (1-2 weeks)
- **Security:** Admin UI is another attack surface
- **Overhead:** Overkill for 5-10 blog posts initially

**Why rejected:** MDX is simpler for V1. If content volume grows (50+ posts) or non-technical team members struggle with Markdown, we can migrate to Sanity or Tina CMS later. Starting with MDX delays this decision without cost.

---

### Alternative 2: Database-Stored Markdown

**Description:** Store blog posts as rows in Supabase (`content_library` table), render Markdown server-side.

**Pros:**
- **Dynamic:** Edit content without redeploy
- **Custom admin UI:** Build exactly what we need
- **Search built-in:** Full-text search via PostgreSQL
- **Relational:** Can link posts to authors, tags, etc.

**Cons:**
- **Admin UI required:** Must build interface for writing/editing posts
- **No version control:** Changes not tracked in Git (need custom audit log)
- **Slower iteration:** Creating post requires form submission vs. file creation
- **Loss of developer tools:** No VSCode autocomplete, syntax highlighting
- **Migration effort:** More code to write and maintain

**Why rejected:** MDX provides better developer experience and simpler workflow for V1. Database storage makes sense if we have many non-technical editors, but that's not V1 reality.

---

### Alternative 3: Notion as CMS (with Notion API)

**Description:** Write posts in Notion, sync to Next.js via Notion API at build time.

**Pros:**
- **Familiar UI:** Team already uses Notion (maybe)
- **Collaborative:** Multiple editors, commenting
- **Rich media:** Embedding, images, tables all built-in
- **No custom admin:** Notion is the admin UI

**Cons:**
- **API limits:** Rate limits and data structure complexity
- **Notion structure lock-in:** Hard to customize rendering
- **Syncing complexity:** Need build-time fetch from Notion API
- **Version control loss:** Changes in Notion, not Git
- **Reliability:** Build depends on Notion API uptime

**Why rejected:** Notion API adds fragility (build fails if API down). MDX keeps content in our repo, fully controlled.

---

### Alternative 4: WordPress (Headless)

**Description:** Use WordPress for CMS, fetch content via REST/GraphQL API.

**Pros:**
- **Mature ecosystem:** Plugins, themes, huge community
- **Familiar to many:** Non-technical users know WordPress
- **Rich editor:** Gutenberg editor is powerful
- **Plugins:** SEO, scheduling, analytics all available

**Cons:**
- **PHP hosting required:** Need WordPress server (separate from Next.js)
- **Security burden:** WordPress is frequent attack target
- **Performance:** WordPress can be slow, adds latency
- **Complexity:** Managing two systems (WordPress + Next.js)
- **Cost:** Hosting WordPress separately ($10-20/mo minimum)
- **Overkill:** WordPress is built for enterprise, not 5-10 posts

**Why rejected:** Too much infrastructure for V1 blog. MDX gives us 80% of WordPress benefits (rich content, version control) with 20% of the complexity.

---

### Alternative 5: Pure Markdown (without JSX)

**Description:** Use plain Markdown (`.md`) without React component support.

**Pros:**
- **Simpler:** No JSX, just Markdown
- **Universal:** Markdown works everywhere
- **Lightweight:** Smaller bundle (no MDX parser)

**Cons:**
- **No interactivity:** Can't embed PaceCalculator or custom components
- **Limited formatting:** Can't create custom quote blocks, callouts
- **Less engaging:** Blog posts are static text only

**Why rejected:** RunExpression's blog should be as expressive as the brand. Embedding interactive elements (calculators, Flow snippets) makes content richer. MDX enables this.

## References

- [MDX Documentation](https://mdxjs.com/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Next.js + MDX Guide](https://nextjs.org/docs/pages/building-your-application/configuring/mdx)
- [Content Collections (Future Alternative)](https://www.contentlayer.dev/)
- RunExpression Docs: `DOCS/02-PRODUCT-REQUIREMENTS.md` (F4: Blog/Library)

## Notes

- **Frontmatter validation:** Use Zod to validate YAML frontmatter (title, date, etc.)
- **Syntax highlighting:** Use `rehype-prism-plus` for code blocks
- **Image optimization:** MDX images processed through Next.js `<Image>` component
- **Custom components:** Create `components/mdx/` for reusable blog elements (Callout, Quote, PaceCalculator)
- **Future migration path:** If we outgrow MDX, migrate to Sanity/Payload by importing MDX files programmatically

**When to revisit this decision:**
- If non-technical team members struggle with Markdown (add Tina CMS, a GUI for MDX)
- If we need scheduled publishing (add Vercel cron + draft/publish logic)
- If content volume exceeds ~50 posts and file management becomes unwieldy
- If we want collaborative editing (migrate to Sanity or similar)

---

**Related ADRs:**
- [ADR-001: Next.js App Router](./001-nextjs-app-router.md) - MDX integrates seamlessly with Next.js
