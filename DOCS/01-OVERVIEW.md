# RunExpression V1 - Project Overview

**Version:** 1.0
**Last Updated:** December 2025
**Status:** Pre-Development

---

## Executive Summary

**RunExpression** is a digital ecosystem for "Expressive Runners" — athletes who view running as creative expression, community connection, and personal transformation rather than purely competitive performance. The platform reimagines running culture by shifting from "Independence" (Me vs. The Clock) to "Interdependence" (We vs. The Struggle).

### The Big Idea

Transform running from an isolated, metric-driven activity into a shared creative practice where motion creates emotion, process matters more than outcome, and the tribe becomes the ultimate performance enhancer.

### Core Value Proposition

- **For Runners:** A digital home that honors both the discipline and the joy, the PRs and the bacon, the struggle and the community
- **For Clubs:** A permanent archive and vibrant hub where lore lives, stories accumulate, and belonging deepens
- **For the Movement:** A laboratory for human potential where athletic rigor meets creative freedom

---

## V1 Vision: The Three Anchor Experiences

RunExpression V1 centers on three interconnected digital experiences that embody the brand philosophy:

### 1. **The Homepage: Make Running Mean More**
A motion-driven, scroll-based manifesto that weaves the "Expressive Runner's Creed" into an interactive narrative. This is the front door — the moment a visitor understands that RunExpression is different.

**Key Elements:**
- Hero with manifesto positioning
- Scroll-triggered chapter reveals (Motion Creates Emotion, Process Over Outcome, Interdependence, The Living Laboratory)
- Clear CTAs to "Enter the Flow" and "Visit the Clubhouse"
- Live preview strip of recent community expressions

**Brand Voice:** "The Sage in the Parking Lot" — deep but accessible, serious but lighthearted, reverent about the run but irreverent about ego.

### 2. **The Flow: "Why You Run" Interactive Canvas**
A living, communal wall where runners express what their run meant through text, images, and eventually sticker-composed art. This is the co-creation engine — proof that you're not alone on the road.

**Key Elements:**
- Simple prompt: "What did your run express today?"
- Multiple input modes: Text phrases, image uploads, (V1.1: sticker composition studio)
- Real-time or near-real-time public wall visualization
- Vibe Tags taxonomy for emotional/contextual capture
- Moderation workflow (AI + admin approval)

**Purpose:** Immediate belonging with zero friction. Turn individual struggles into collective flow.

### 3. **The DWTC Clubhouse: Where Lore Lives**
A polished, member-focused digital archive and community hub for the DWest Track Club. This is the permanent home for club stories, race reports, rituals, media, and resources.

**Key Sections (V1):**
- **Overview:** Hero with club identity, recent contributions, upcoming events
- **Lore & Stories:** Searchable archive of race reports, traditions, club mythology
- **Media Archive:** Photo/video gallery with tagging and filtering
- **Upload Portal:** Low-friction member contribution flow
- **Resources:** Training plans, routes, PDFs

**Purpose:** Provide DWTC members a clean, inspiring destination to contribute and browse; establish replicable model for future clubs.

---

## Strategic Context

### Why Now?

Building RunExpression now accomplishes two critical goals:

1. **Start building domain authority and SEO equity** for the brand immediately
2. **Create a sandbox to test the technology stack** that will eventually power the AI Coach platform

### The AI Coach Connection

RunExpression V1 is deliberately architected to share the same technical DNA as the future AI Coach:
- Unified user profiles and authentication (Supabase)
- Structured data capture (vibe tags, expression events, club contributions)
- JSONB-based flexibility for evolving user attributes
- All community content becomes context for personalized AI engagement

**V1 AI Coach Integration:**
- Teasers and waitlist on homepage, canvas, and clubhouse
- No live coach features in V1
- Data infrastructure ready for future activation

### Market Positioning

**RunExpression is NOT:**
- Another training log or performance tracker
- A generic running blog
- A corporate fitness app

**RunExpression IS:**
- A cultural movement with a digital home
- A laboratory for expressive, interdependent running
- A platform that treats runners as whole humans (artists, philosophers, community builders)

---

## V1 Scope Definition

### IN SCOPE for V1

**Core Experiences:**
- ✅ Homepage with manifesto scroll experience
- ✅ "Why You Run" Canvas (text + image submissions, basic moderation)
- ✅ DWTC Clubhouse (Overview, Lore, Media Archive, Upload Portal)
- ✅ Blog/Library foundation (MDX-based content system)
- ✅ Shop framework (product catalog setup, Stripe integration)
- ✅ Interactive tools placeholder (1-2 tools like Pace Calculator)
- ✅ AI Coach waitlist and teaser positioning

**Technical Foundation:**
- ✅ Next.js 14+ (App Router) with TypeScript
- ✅ Supabase (Auth, Database, Storage, Realtime)
- ✅ Tailwind CSS + Shadcn/UI design system
- ✅ MDX for content
- ✅ Stripe for payments
- ✅ Basic analytics instrumentation

**Content & Brand:**
- ✅ Complete brand voice guide implementation
- ✅ Manifesto copy finalized
- ✅ Seed content for blog and clubhouse
- ✅ Visual design system (typography, colors, motion)

### OUT OF SCOPE for V1 (Deferred to V1.1+)

- ❌ Advanced sticker composition studio (Fabric.js integration)
- ❌ Drawing pad for freehand sketches
- ❌ Print-on-Demand fulfillment automation
- ❌ Premium membership tiers with paywalls
- ❌ Advanced analytics and personalization
- ❌ Full AI Coach implementation
- ❌ Multiple club support (DWTC only for V1)
- ❌ Native mobile apps
- ❌ Complex gamification ("The Long Run" game)

### MAYBE for V1 (Evaluate During Build)

- 🤔 Strava integration for runners
- 🤔 Newsletter/email automation (ConvertKit/Mailchimp)
- 🤔 Comments on blog posts
- 🤔 User profiles (public vs. private data)
- 🤔 Calendar/events management system

---

## Success Criteria for V1 Launch

### Functional Success
- [ ] All three anchor experiences (Homepage, Flow, Clubhouse) are live and functional
- [ ] Users can submit to The Flow and see their contributions reflected
- [ ] DWTC members can upload content and browse the archive
- [ ] Blog posts render correctly with MDX
- [ ] Shop catalog is browsable (products may launch post-V1)
- [ ] AI Coach waitlist captures emails
- [ ] All CTAs and navigation work across devices

### Technical Success
- [ ] Core Web Vitals meet standards (LCP < 2s, FID < 100ms, CLS < 0.1)
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Mobile-responsive across iOS/Android
- [ ] Authentication works (signup, login, password reset)
- [ ] Media uploads functional (images to Supabase Storage)
- [ ] Moderation queue works for Flow submissions

### Brand Success
- [ ] Voice and tone consistent across all touchpoints
- [ ] Visual design feels cohesive and distinct
- [ ] Manifesto scroll experience is smooth and engaging
- [ ] Copy reviewed and approved
- [ ] "Sage in the Parking Lot" personality comes through

### Engagement Success (First 30 Days)
- Target: 100+ Flow submissions
- Target: 50+ email/waitlist signups
- Target: 20+ DWTC clubhouse uploads
- Target: >35% homepage scroll-to-CTA engagement
- Target: Avg. session duration >2 minutes

---

## Key Architectural Decisions

### The Pragmatic Monolith Approach

All V1 features live in a single Next.js application ("pragmatic monolith") to:
- Reduce operational complexity
- Share authentication and user context across features
- Enable rapid iteration
- Maintain cost efficiency on generous free tiers

### Technology Stack Rationale

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **Next.js 14+** | Frontend framework | Best-in-class SSR/SSG for SEO, App Router for modern patterns, Vercel deployment |
| **Supabase** | Backend-as-a-Service | PostgreSQL + Auth + Storage + Realtime in one platform; AI Coach will use same DB |
| **Tailwind + Shadcn** | UI/Styling | Rapid development, accessible components, easy theming |
| **Framer Motion** | Animation | Smooth scroll-triggered reveals for manifesto experience |
| **MDX** | Content management | Write content as code, version control, embed React components |
| **Stripe** | Payments | Industry standard, good developer experience, checkout hosted pages |
| **Fabric.js** (V1.1) | Canvas editor | Sticker studio for visual expression composition |

### Data Strategy: Flexible Foundation

**Hybrid Relational + JSONB Model:**
- Core entities (users, clubs, events) use relational tables
- Flexible attributes (vibe tags, metadata, preferences) use JSONB columns
- Enables schema evolution without breaking changes
- Supports future AI Coach contextual queries

---

## Project Principles

### 1. Build for Belonging
Every feature should answer: "Does this help a runner feel less alone?"

### 2. Process Over Outcome
Ship iteratively. V1 is the foundation, not the finish line. The bagel tastes better when you've earned it.

### 3. Creative Constraint
Limit V1 scope aggressively. Deep execution on three experiences beats shallow execution on ten.

### 4. AI-Ready, Not AI-First
Capture structured data now (vibe tags, expression events, club contributions) but don't build AI features until V2. We're laying track, not running the train yet.

### 5. The "Sage in the Parking Lot" Standard
If a feature feels corporate, sterile, or preachy — cut it or rewrite it. We're deep but accessible, serious but fun.

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Scope creep** | Delayed launch, burnout | Ruthless prioritization; "V1.1 backlog" for good ideas |
| **Moderation burden** | Inappropriate content on The Flow | OpenAI Moderation API + admin queue + trusted user system |
| **Low initial engagement** | Empty state feels dead | Seed The Flow with curated examples; recruit DWTC for clubhouse content |
| **Technical complexity** | Stalls development | Use Supabase/Vercel managed services; defer advanced features |
| **Brand misalignment** | Generic fitness site feel | Copy review checkpoint before launch; designer embedded in process |

---

## Team & Roles (Assumption)

- **Product Owner / Founder:** Vision, content, brand voice, final decisions
- **Developer(s):** Full-stack Next.js/Supabase implementation
- **Designer:** Visual design system, UI components, manifesto scroll experience (if not handled by dev)
- **Content Creator(s):** Seed blog posts, clubhouse lore, Flow examples

---

## Timeline Estimate

**Aggressive 6-Week Sprint to V1:**

- **Week 1-2:** Foundation (Next.js setup, Supabase, design system, auth)
- **Week 3:** Homepage + Manifesto scroll experience
- **Week 4:** The Flow (Canvas) - submissions and wall
- **Week 5:** DWTC Clubhouse (upload, browse, archive)
- **Week 6:** Polish, testing, content seeding, deployment

**More Realistic 8-10 Week Build:**
- Allows for design iteration, content creation, real-world testing

---

## Document Map

This overview should be read first, then consult detailed specs as needed:

1. **01-OVERVIEW.md** ← You are here
2. **02-PRODUCT-REQUIREMENTS.md** - Detailed feature specs, user stories, acceptance criteria
3. **03-TECHNICAL-DESIGN.md** - Architecture, API design, data models, tech stack deep dive
4. **04-BRAND-CONTENT-GUIDE.md** - Voice, tone, manifesto, copy, interactive content strategy
5. **05-IMPLEMENTATION-PLAN.md** - Phase breakdown, sprint tasks, dependency mapping
6. **06-DATA-SCHEMA.md** - Database schema, table definitions, relationships, seed data

---

## Next Steps

1. **Review this overview** with key stakeholders for alignment
2. **Clarify any V1 scope questions** (the MAYBE items especially)
3. **Read 02-PRODUCT-REQUIREMENTS.md** for feature details
4. **Begin Phase 1 setup** per 05-IMPLEMENTATION-PLAN.md

---

**Let's build a laboratory for human potential. 🏃‍♂️🔬🎨**
