# Claude Skills Conversion Summary

## Overview

Successfully converted 10 cursor skills from `.cursor/skills/` to Claude skill format in `~/.claude/skills/`.

## Converted Skills

All skills have been converted and are now available for Claude Code:

1. **content-moderation-trust-systems** - OpenAI moderation, trust scoring, admin queue workflows
2. **database-schema-migration** - Database schema design, migrations, hybrid relational + JSONB patterns
3. **framer-motion-animation** - Smooth animations with accessibility support
4. **git-workflow-conventional-commits** - Git commit standards, branch strategies, PR best practices
5. **nextjs-app-router-specialist** - Next.js 14+ App Router patterns, Server/Client Components
6. **shadcn-ui-component-builder** - Shadcn/UI components with RunExpression branding
7. **stripe-payment-integration** - Stripe Checkout, webhooks, order management
8. **supabase-integration-expert** - RLS policies, Realtime, Storage, Auth flows
9. **testing-qa-automation** - Jest, React Testing Library, Playwright E2E tests
10. **typescript-type-safety** - Type safety, Supabase type generation, strict TypeScript

## Skill Format

Each skill follows Claude's skill format:

```markdown
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions and symptoms]
---

# Skill Name

## Overview
Core principle in 1-2 sentences.

## [Sections with patterns, examples, and best practices]
```

## Key Features

### Claude Search Optimization (CSO)

All skills have been optimized for Claude's search system:

- **"Use when..." descriptions**: Focuses on triggering conditions, not workflow
- **Rich keyword coverage**: Includes error messages, symptoms, tools
- **Technology-specific triggers**: Explicit when skill is tech-specific
- **Third-person descriptions**: Injected into system prompts

### Token Efficiency

Skills are concise and reference-focused:
- Essential patterns only
- Code examples are practical and complete
- Cross-references to project documentation
- No redundant explanations

## How to Use

Claude Code will automatically discover these skills when you work on related tasks. The skills provide:

- **Quick Reference**: Fast access to project patterns
- **Best Practices**: RunExpression-specific conventions
- **Code Examples**: Copy-paste ready patterns
- **Decision Support**: When to use which approach

## Verification

To verify skills are working:

```bash
# List all skills
ls -la ~/.claude/skills

# View a specific skill
cat ~/.claude/skills/nextjs-app-router-specialist/SKILL.md

# Check skill formatting
head -10 ~/.claude/skills/*/SKILL.md
```

## Location

- **Claude Skills**: `.claude/skills/` (10 skills, **project-specific**)
- **Original Cursor Skills**: `.cursor/skills/` (source of truth)
- **Conversion Script**: `convert-skills.sh` (for future updates)

**Note**: Skills are stored in the project directory, making them RunExpression-specific only. They will not be available when working on other projects.

## Skill Descriptions (CSO-Optimized)

### Content Moderation & Trust Systems
Use when implementing Flow submission moderation, clubhouse upload approval workflows, building admin tools, handling edge cases in moderation, or integrating content filtering and validation with OpenAI moderation API and trust scoring.

### Database Schema & Migration
Use when adding new features requiring database changes, optimizing query performance, creating seed data for development/testing, or planning schema evolution with hybrid relational + JSONB patterns.

### Framer Motion Animation
Use when creating scroll-triggered animations (manifesto chapters), stagger animations for lists, shared element transitions, modal/dialog transitions, Flow wall entry animations, or any motion-heavy features with accessibility support.

### Git Workflow & Conventional Commits
Use when setting up project Git standards, reviewing commit history, creating PR templates, configuring Husky hooks, writing commit messages, creating branches, or enforcing conventional commit format.

### Next.js App Router Specialist
Use when setting up new routes and layouts, optimizing page performance, implementing SSR/SSG strategies, debugging Next.js-specific issues, or making Server/Client Component decisions for Next.js 14+ App Router.

### Shadcn/UI Component Builder
Use when building new UI components, customizing existing Shadcn components, ensuring accessibility compliance, or implementing brand-specific visual patterns (sage green, purple glows, monospace fonts).

### Stripe Payment Integration
Use when implementing shop features, payment flows, webhook handlers, order management, digital product delivery, or debugging Stripe integration issues.

### Supabase Integration Expert
Use when creating new database tables and policies, implementing real-time features (Flow wall updates), setting up file uploads, debugging RLS policy issues, or optimizing database queries.

### Testing & QA Automation
Use when adding tests for new features, setting up test infrastructure, debugging test failures, or configuring CI/CD test pipelines with Jest, React Testing Library, and Playwright.

### TypeScript & Type Safety
Use when adding new features requiring type definitions, refactoring for better type safety, generating database types after schema changes, debugging type errors, or working with JSONB, unions, generics, or type-safe API routes.

## Maintenance

To update skills in the future:

1. Edit skills in `.cursor/skills/` (source of truth)
2. Run `./convert-skills.sh` to sync to Claude
3. Verify changes: `cat ~/.claude/skills/[skill-name]/SKILL.md`

## Related Documentation

- **Project Instructions**: `CLAUDE.md` (project overview, commands, architecture)
- **Product Requirements**: `DOCS/02-PRODUCT-REQUIREMENTS.md`
- **Technical Design**: `DOCS/03-TECHNICAL-DESIGN.md`
- **Brand Guide**: `DOCS/04-BRAND-CONTENT-GUIDE.md`
- **Database Schema**: `DOCS/06-DATA-SCHEMA.md`
- **Coding Standards**: `DOCS/07-CODING-STANDARDS.md`

## Notes

- Skills follow TDD principles from `superpowers:writing-skills`
- All skills include RunExpression-specific patterns
- Skills are optimized for Claude Code discovery
- Cursor skills remain the source of truth for future edits

---

**Created**: 2026-01-23
**Claude Code Version**: Sonnet 4.5
