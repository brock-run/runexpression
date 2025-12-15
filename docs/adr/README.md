# Architectural Decision Records (ADRs)

This directory contains Architectural Decision Records for the RunExpression project.

## What are ADRs?

An Architectural Decision Record (ADR) captures an important architectural decision made along with its context and consequences. They help teams understand:

- **Why** we made specific technical choices
- **What** alternatives we considered
- **When** the decision was made and by whom
- **What** the implications are (positive and negative)

## Format

Each ADR follows this structure:

```markdown
# ADR-XXX: Title

**Date:** YYYY-MM-DD
**Status:** Accepted | Proposed | Deprecated | Superseded
**Deciders:** [who made this decision]

## Context
What is the issue we're facing?

## Decision
What decision did we make?

## Consequences
What are the positive and negative outcomes?

## Alternatives Considered
What other options did we evaluate?
```

## Status Definitions

- **Proposed:** Under discussion, not yet approved
- **Accepted:** Approved and currently in use
- **Deprecated:** No longer recommended, but may still be in use
- **Superseded:** Replaced by a newer ADR (link to the new one)

## ADR Index

### Critical Architecture Decisions

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [001](./001-nextjs-app-router.md) | Adopt Next.js 14+ with App Router | Accepted | 2025-12-14 |
| [002](./002-supabase-backend.md) | Use Supabase as Backend-as-a-Service | Accepted | 2025-12-14 |
| [003](./003-pragmatic-monolith.md) | Build as Pragmatic Monolith | Accepted | 2025-12-14 |
| [004](./004-hybrid-schema.md) | Hybrid Relational + JSONB Schema | Accepted | 2025-12-14 |
| [005](./005-mdx-content.md) | Use MDX for Blog Content | Accepted | 2025-12-14 |

### Important Implementation Decisions

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [006](./006-stripe-hosted-checkout.md) | Use Stripe Hosted Checkout | Accepted | 2025-12-14 |
| [007](./007-openai-moderation.md) | OpenAI Moderation API for Content Filtering | Accepted | 2025-12-14 |
| [008](./008-client-side-compression.md) | Client-Side Image Compression | Accepted | 2025-12-14 |
| [009](./009-shadcn-ui.md) | Adopt Shadcn/UI Component System | Accepted | 2025-12-14 |
| [010](./010-defer-sticker-studio.md) | Defer Sticker Studio to V1.1 | Accepted | 2025-12-14 |

## How to Create a New ADR

1. Copy the template from `000-template.md`
2. Number it sequentially (next available number)
3. Fill in all sections thoughtfully
4. Submit for review via PR
5. Update this index when accepted

## Revisiting Decisions

ADRs are **immutable records** of decisions at a point in time. If a decision needs to change:

1. Create a **new ADR** documenting the new decision
2. Mark the old ADR as **Superseded** and link to the new one
3. Update the index

This preserves the history of why decisions were made.

---

**Last Updated:** 2025-12-14
**Maintained By:** Engineering Team
