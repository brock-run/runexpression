# RunExpression V1 Task Breakdown

## Implementation Status Overview

### V1.0 - Foundation Launch (~80% Complete)
**Target**: Production-ready homepage, clubhouse UI shells, database schema, authentication UI
**Status**: Homepage ✅ | Clubhouse UI ✅ | Database ✅ | Auth UI ✅ | Backend Integration 🔄

### V1.1 - The Flow (Next Priority, 2-3 weeks)
**Target**: Complete Flow submission, moderation, wall + Clubhouse backend
**Status**: Not started ⏳

### V1.2 - Content & Commerce (2-4 weeks)
**Target**: Blog, Shop, Tools, Waitlist, Legal pages
**Status**: Not started ⏳

---

## V1.0 Foundation - Completion Tasks

### Epic 0: Environment & Infrastructure ✅
**Status**: Complete
**Effort**: 1-2 days

- ✅ Configure required env vars and `env.ts` validations
- ✅ Set up Supabase client configurations (browser, server, admin)
- ✅ Database schema with RLS policies
- 🔄 Analytics provider setup (structure ready, events TBD)
- ⏳ Error tracking (Sentry) baseline

**Remaining work**:
- Add Sentry configuration
- Define analytics event schema
- Test environment validation

---

### Epic 1: Authentication & Data Layer 🔄
**Status**: UI Complete, Backend 50%
**Effort**: 3-5 days
**Dependencies**: Epic 0

**Tasks**:
- ✅ Validate Supabase migrations and RLS policies
- ✅ Generate database types (`npm run db:types`)
- ✅ Auth UI components (login, signup forms)
- 🔄 Wire auth forms to Supabase Auth API
- ⏳ Implement password reset route and flow
- ⏳ Add basic profile route (`/profile`) with minimal fields
- ⏳ Add middleware for protected routes
- ⏳ Session persistence and refresh logic

**Acceptance criteria**:
- Users can sign up, log in, reset password end-to-end
- Protected routes redirect to login when unauthenticated
- Session persists across page refreshes

---

### Epic 8 (Partial): Navigation & Core Routes 🔄
**Status**: 70% Complete
**Effort**: 2-3 days

**Tasks**:
- ✅ Header with navigation links
- ✅ Footer with social and legal links
- ✅ Homepage route structure
- ✅ Clubhouse route shells
- 🔄 Ensure all header/footer links route correctly
- ⏳ 404 page
- ⏳ Loading states for route transitions

**Remaining for V1.2**:
- Legal pages (`/privacy`, `/terms`)
- Sitemap generation
- Structured data

---

### Epic 3 (Partial): Clubhouse UI Shells ✅
**Status**: UI Complete, Backend Missing
**Effort**: Already complete (UI)

**V1.0 Complete**:
- ✅ `/club/dwtc` overview page layout
- ✅ `/club/dwtc/lore` page shell
- ✅ `/club/dwtc/media` page shell
- ✅ `/club/dwtc/resources` page shell
- ✅ `/club/dwtc/upload` form UI

**V1.1 Remaining** (see below):
- Backend integration with Supabase
- Moderation workflow
- Content seeding

---

## V1.1 The Flow - Implementation Tasks (2-3 weeks)

### Epic 2: The Flow (Canvas + Wall) ⏳
**Status**: Not started
**Effort**: 1.5-2 weeks
**Dependencies**: Epic 0, Epic 1
**Priority**: Highest (core value prop)

**Phase 1: Submission Form (3-4 days)**
- ⏳ Create `/flow` route with entry form
- ⏳ Build text mode form (500 char limit, vibe tag selection)
- ⏳ Build image mode form (upload, compression, caption)
- ⏳ Add Zod validation schemas
- ⏳ Implement client-side image compression (~400KB target)
- ⏳ Wire to Supabase Storage for image uploads
- ⏳ Create `expression_events` insert mutations

**Phase 2: Moderation Pipeline (2-3 days)**
- ⏳ Create `/api/flow/submit` endpoint
- ⏳ Integrate OpenAI Moderation API
- ⏳ Implement trust scoring logic
- ⏳ Set up moderation queue in `expression_events` table
- ⏳ Add rate limiting on submission endpoint
- ⏳ Email notification for flagged content (optional for V1.1)

**Phase 3: Public Wall (3-4 days)**
- ⏳ Create `/flow/wall` route (or integrate into `/flow`)
- ⏳ Build masonry grid layout component
- ⏳ Implement infinite scroll pagination
- ⏳ Add Supabase Realtime subscription for new approved entries
- ⏳ Add animations for new entries appearing

**Phase 4: Admin Moderation (2-3 days)**
- ⏳ Create `/flow/admin` route with auth check
- ⏳ Build moderation queue UI (pending, flagged, approved, rejected)
- ⏳ Implement approve/reject actions
- ⏳ Add bulk moderation actions
- ⏳ Admin analytics dashboard (submission rate, approval rate)

**Phase 5: Content Seeding (1-2 days)**
- ⏳ Seed 50+ diverse Flow entries
- ⏳ Include mix of text and image posts
- ⏳ Cover all vibe tags
- ⏳ Set `is_featured` flags for homepage preview

**Acceptance criteria**:
- Users can submit text or image expressions
- Moderation pipeline blocks flagged content
- Approved items appear on public wall without refresh
- Admin can review and moderate submissions
- Realtime updates work reliably

---

### Epic 3 (Remainder): Clubhouse Backend Integration ⏳
**Status**: Not started
**Effort**: 1 week
**Dependencies**: Epic 1 (auth middleware)
**Priority**: High

**Phase 1: Membership Gating (1-2 days)**
- ⏳ Add `club_memberships` table queries
- ⏳ Create middleware to check membership for clubhouse routes
- ⏳ Implement join flow (waitlist or instant join TBD)
- ⏳ Add "Request Access" UI for non-members

**Phase 2: Lore Backend (2 days)**
- ⏳ Wire lore index to `club_stories` table
- ⏳ Implement lore detail page with markdown rendering
- ⏳ Add search and filtering (tags, date, author)
- ⏳ Implement `is_featured` flag display

**Phase 3: Media Archive (2 days)**
- ⏳ Wire media grid to `club_media` table with Supabase Storage URLs
- ⏳ Implement lightbox with keyboard navigation (← →, Esc)
- ⏳ Add filtering by media type (photos, videos)
- ⏳ Lazy loading for images

**Phase 4: Resources Downloads (1 day)**
- ⏳ Wire resources list to `club_resources` table
- ⏳ Generate Supabase Storage signed URLs for downloads
- ⏳ Track download analytics

**Phase 5: Upload Portal (2-3 days)**
- ⏳ Create `/api/club/upload` endpoint
- ⏳ Wire upload form to Supabase Storage
- ⏳ Insert into `club_contributions` with `pending` status
- ⏳ Add file type validation (images, PDFs, videos)
- ⏳ Size limits and compression

**Phase 6: Admin Moderation (1-2 days)**
- ⏳ Create `/club/dwtc/admin` route
- ⏳ Build moderation queue for club contributions
- ⏳ Implement approve/reject workflow
- ⏳ On approval, move from `club_contributions` to respective tables

**Phase 7: Content Seeding (2-3 days)**
- ⏳ Seed 10+ club stories with markdown content
- ⏳ Seed 50+ photos in media archive
- ⏳ Seed 3+ downloadable resources
- ⏳ Set featured flags and metadata

**Acceptance criteria**:
- Non-members see teaser, members see full content
- All clubhouse pages display real Supabase data
- Upload portal stores contributions with pending status
- Admin can moderate and publish contributions
- Search and filtering work on lore and media

---

## V1.2 Content & Commerce - Implementation Tasks (2-4 weeks)

### Epic 4: Blog / Library ⏳
**Status**: Not started
**Effort**: 1 week
**Dependencies**: None (independent)

**Phase 1: MDX Pipeline (2-3 days)**
- ⏳ Set up MDX plugin for Next.js
- ⏳ Create content structure (`/content/library/`)
- ⏳ Create MDX component registry (custom Image, Code, Callout)
- ⏳ Add frontmatter schema (title, date, author, tags, excerpt)

**Phase 2: Library Routes (2-3 days)**
- ⏳ Create `/library` index page with post grid
- ⏳ Add category/tag filtering
- ⏳ Implement featured post section
- ⏳ Create `/library/[slug]` detail page
- ⏳ Add reading time calculation

**Phase 3: SEO & Metadata (1-2 days)**
- ⏳ Add OpenGraph meta tags per post
- ⏳ Generate OG images with post title
- ⏳ Add JSON-LD structured data
- ⏳ Create RSS feed

**Phase 4: Content Seeding (1-2 days)**
- ⏳ Write/import 5+ seed posts
- ⏳ Cover key topics (running philosophy, training, community)
- ⏳ Add images and code examples

**Acceptance criteria**:
- MDX renders images, code blocks, and custom components
- Posts display with proper SEO meta
- Tag filtering works
- RSS feed validates

---

### Epic 5: Shop Framework ⏳
**Status**: Not started
**Effort**: 1 week
**Dependencies**: Stripe account setup

**Phase 1: Product Data (1 day)**
- ⏳ Seed `products` table with 2+ products (1 physical, 1 digital)
- ⏳ Add product images to Supabase Storage
- ⏳ Define product schema (price, description, type, inventory)

**Phase 2: Shop Routes (2-3 days)**
- ⏳ Create `/shop` index with product grid
- ⏳ Create `/shop/[slug]` detail page
- ⏳ Add "Add to Cart" / "Buy Now" CTA
- ⏳ Implement Stripe Checkout redirect

**Phase 3: Stripe Integration (2-3 days)**
- ⏳ Create Stripe Checkout session API route
- ⏳ Add success and cancel pages
- ⏳ Implement `/api/webhooks/stripe` handler
- ⏳ Record orders in `orders` table on `checkout.session.completed`
- ⏳ Webhook signature verification

**Phase 4: Digital Delivery (1-2 days)**
- ⏳ Generate secure download links for digital products
- ⏳ Email order confirmation with download link
- ⏳ Set expiration on download URLs

**Acceptance criteria**:
- Checkout flow completes successfully
- Webhook creates order records
- Digital products deliver via email
- Physical products show shipping details

---

### Epic 6: Tools ⏳
**Status**: Not started
**Effort**: 2-3 days
**Dependencies**: None

**Tasks**:
- ⏳ Create `/tools/pace-calculator` route
- ⏳ Build pace calculator form (distance, time inputs)
- ⏳ Implement calculation logic (pace per mile/km)
- ⏳ Add vibe descriptors for pace ranges
- ⏳ Add CTA to AI Coach waitlist
- ⏳ Analytics event on tool completion

**Acceptance criteria**:
- Calculator outputs accurate paces
- Vibe descriptors align with RunExpression brand
- CTA links to waitlist page

---

### Epic 7: AI Coach Waitlist ⏳
**Status**: Not started
**Effort**: 2-3 days
**Dependencies**: Epic 1 (database setup)

**Tasks**:
- ⏳ Create `/coach/waitlist` route
- ⏳ Build waitlist form (name, email, goals)
- ⏳ Add Zod validation
- ⏳ Create `/api/coach/waitlist` endpoint
- ⏳ Insert into `ai_coach_waitlist` with dedupe logic
- ⏳ Return confirmation message
- ⏳ Add waitlist teasers on homepage, Flow, Clubhouse
- ⏳ Analytics events (view, submit)

**Acceptance criteria**:
- Form submits to database successfully
- Duplicate emails handled gracefully
- Confirmation message displays
- Teasers visible across site

---

### Epic 8 (Remainder): Legal & SEO ⏳
**Status**: Not started
**Effort**: 2-3 days
**Dependencies**: None

**Tasks**:
- ⏳ Create `/privacy` page with privacy policy copy
- ⏳ Create `/terms` page with terms of service copy
- ⏳ Add links to footer
- ⏳ Generate `sitemap.xml` with all routes and blog posts
- ⏳ Configure `robots.txt`
- ⏳ Add JSON-LD structured data for Organization
- ⏳ Accessibility audit (WCAG 2.1 AA)

**Acceptance criteria**:
- Legal pages reachable from footer
- Sitemap includes all main routes and blog posts
- Accessibility checklist passes

---

### Epic 9: QA & Launch Prep ⏳
**Status**: Not started
**Effort**: 3-5 days
**Dependencies**: All V1.2 epics

**Phase 1: Performance Audit (1-2 days)**
- ⏳ Lighthouse CI integration
- ⏳ Optimize LCP, FID, CLS targets
- ⏳ Image optimization audit
- ⏳ Bundle size analysis
- ⏳ Dynamic imports for heavy components

**Phase 2: Accessibility Audit (1-2 days)**
- ⏳ WCAG 2.1 AA compliance checklist
- ⏳ Keyboard navigation testing
- ⏳ Screen reader testing
- ⏳ Color contrast verification
- ⏳ Focus state visibility

**Phase 3: Security Review (1 day)**
- ⏳ RLS policy verification
- ⏳ Input validation audit (all forms use Zod)
- ⏳ Upload validation (size, type, content)
- ⏳ Rate limiting on API routes
- ⏳ Environment variable leak check

**Phase 4: Content Moderation Testing (1 day)**
- ⏳ Test OpenAI moderation with edge cases
- ⏳ Verify trust scoring logic
- ⏳ Test admin queue workflows
- ⏳ Rate limiting tests

**Phase 5: Launch Checklist (1 day)**
- ⏳ Environment variables set in production
- ⏳ Supabase production DB ready
- ⏳ Stripe production keys configured
- ⏳ Analytics connected
- ⏳ Error tracking enabled
- ⏳ Domain DNS configured
- ⏳ SSL certificate active
- ⏳ Seed data populated

**Acceptance criteria**:
- All Core Web Vitals meet targets
- WCAG 2.1 AA compliance verified
- Security checklist complete
- Launch checklist signed off

---

## Cross-Epic Dependencies

### Database & Storage
- Epic 2 (Flow) depends on: `expression_events` table, Supabase Storage, RLS policies
- Epic 3 (Clubhouse) depends on: `club_stories`, `club_media`, `club_resources`, `club_contributions`, `club_memberships`, Supabase Storage, RLS policies
- Epic 5 (Shop) depends on: `products`, `orders` tables
- Epic 7 (Waitlist) depends on: `ai_coach_waitlist` table

### Authentication
- Epic 3 (Clubhouse) depends on: Epic 1 (auth middleware, membership checks)
- Epic 2 (Flow admin) depends on: Epic 1 (admin role checks)

### External Services
- Epic 2 (Flow moderation) depends on: OpenAI API key configured
- Epic 5 (Shop) depends on: Stripe account, webhook endpoint configured

### Content
- Epic 2 (Flow) depends on: 50+ seed entries
- Epic 3 (Clubhouse) depends on: Stories, media, resources seed data
- Epic 4 (Blog) depends on: 5+ MDX posts
- Epic 5 (Shop) depends on: 2+ products with images

---

## Effort Summary

| Phase | Total Effort | Status |
|-------|--------------|--------|
| **V1.0 Foundation** | 1-2 weeks | 🔄 80% complete |
| **V1.1 The Flow + Clubhouse** | 2-3 weeks | ⏳ Not started |
| **V1.2 Content & Commerce** | 2-4 weeks | ⏳ Not started |
| **Total V1 Launch** | 5-9 weeks | 🔄 ~20% complete |

---

## Ownership & Skillsets

| Epic | Primary Skills | Secondary Skills |
|------|----------------|------------------|
| Epic 0 | DevOps, Configuration | Backend |
| Epic 1 | Backend (Auth), Data | Frontend |
| Epic 2 | Full-stack, Backend APIs | Frontend, Content |
| Epic 3 | Full-stack, Backend | Content, QA |
| Epic 4 | Frontend, Content | DevOps (MDX setup) |
| Epic 5 | Backend (Stripe), Full-stack | Frontend |
| Epic 6 | Frontend | Backend (analytics) |
| Epic 7 | Backend, Frontend | Marketing |
| Epic 8 | Frontend, Content | Legal |
| Epic 9 | QA, DevOps | Full team |

---

## Risk Mitigation

**High-Risk Items**:
1. **Flow moderation accuracy** - OpenAI API may not catch all inappropriate content
   - *Mitigation*: Manual review queue, user reporting, trust scoring
2. **Realtime performance** - Supabase Realtime may have latency or reliability issues
   - *Mitigation*: Graceful degradation to polling, retry logic
3. **Stripe webhook reliability** - Webhooks may fail or arrive out of order
   - *Mitigation*: Idempotency keys, webhook retry handling, manual order verification
4. **Content seeding effort** - Creating quality seed content may take longer than estimated
   - *Mitigation*: Start content creation early, involve team, use AI assistance for drafts

**Medium-Risk Items**:
1. **Image compression quality** - Client-side compression may degrade images
   - *Mitigation*: Test with various devices, allow quality parameter tuning
2. **RLS policy complexity** - Policies may be hard to debug or have performance issues
   - *Mitigation*: Thorough testing, performance profiling, simplify where possible

---

## Next Actions (Immediate)

**V1.0 Completion** (1-2 weeks):
1. Complete Epic 1 (auth backend integration)
2. Add Sentry and analytics configuration
3. Verify all V1.0 routes and links work
4. Create 404 page
5. V1.0 smoke testing

**V1.1 Prep** (can start in parallel):
1. Begin Flow seed content creation (50+ entries)
2. Begin clubhouse seed content (stories, media, resources)
3. Set up OpenAI API access for moderation
4. Test Supabase Realtime subscriptions
5. Design admin moderation UI mockups
