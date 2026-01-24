# RunExpression V1 Validation Plan

This document outlines the testing and validation strategy for each phase of V1 development. Each phase has its own validation checklist that must be completed before proceeding to the next phase.

---

## V1.0 Foundation - Validation

**Goal**: Verify infrastructure, homepage, authentication, and database foundation

### Automated Tests

**Unit Tests**:
- [ ] Environment variable validation (`env.ts` Zod schemas)
- [ ] Supabase client initialization (browser, server, admin)
- [ ] TypeScript type generation from schema
- [ ] Utility helpers (date formatting, text truncation)

**Integration Tests**:
- [ ] Auth flows: signup, login, session creation
- [ ] Password reset token generation and validation
- [ ] Middleware for protected routes (redirect to login)
- [ ] RLS policy enforcement (read-only tests)

**E2E Tests (Playwright)**:
- [ ] Homepage loads and displays manifesto sections
- [ ] Scroll animations trigger (or are skipped with `prefers-reduced-motion`)
- [ ] All header/footer links route correctly
- [ ] Signup form submits (test email confirmation flow)
- [ ] Login form authenticates and redirects to homepage
- [ ] Protected route redirects to login when unauthenticated
- [ ] Clubhouse UI shells load (even with mock data)

### Manual QA Checklist

**Functional**:
- [ ] Homepage hero message and CTAs display correctly
- [ ] Manifesto chapters animate on scroll (test both normal and reduced motion)
- [ ] Flow preview strip shows placeholder/seed data
- [ ] Clubhouse teaser visible and links to `/club/dwtc`
- [ ] Signup flow: form → email verification → login works
- [ ] Login flow: form → redirect to previous page works
- [ ] Password reset: request → email → reset password works
- [ ] Profile route accessible (even if minimal)
- [ ] 404 page displays for invalid routes

**Performance**:
- [ ] Lighthouse audit on homepage: LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Lighthouse score >85 (Performance, Accessibility)
- [ ] Images use Next/Image with proper optimization
- [ ] Bundle size <300KB for homepage

**Accessibility**:
- [ ] Keyboard navigation works on homepage (Tab, Enter, Space)
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast meets 4.5:1 for body text
- [ ] `prefers-reduced-motion` disables animations
- [ ] Alt text present on all images

**Security**:
- [ ] RLS policies enabled on all tables
- [ ] Service role key not exposed in client bundles
- [ ] Auth cookies HttpOnly and Secure
- [ ] Environment variables validated on startup

**Brand & Content**:
- [ ] Manifesto copy reflects "Sage in the Parking Lot" voice
- [ ] Visual system consistent (sage green, purple glows, monospace fonts)
- [ ] Clubhouse teaser reflects DWTC identity

### Acceptance Gates

- [ ] All V1.0 must-pass criteria from `04-success-criteria.md` met
- [ ] No P0 bugs open
- [ ] Auth flows tested end-to-end
- [ ] Homepage performance targets met

---

## V1.1 The Flow - Validation

**Goal**: Verify Flow submission, moderation, wall, and Clubhouse backend integration

### Automated Tests

**Unit Tests**:
- [ ] Flow form validation schemas (text mode: 500 char, 1-3 vibe tags)
- [ ] Flow form validation schemas (image mode: 5MB max, caption required)
- [ ] Vibe tag validation (valid tags from constants)
- [ ] Image compression utility (reduces file size to ~400KB)
- [ ] Trust scoring logic (assigns confidence levels)
- [ ] Clubhouse upload validation (file types, sizes)

**Integration Tests**:
- [ ] Flow submission API (`/api/flow/submit`): validation, moderation, storage
- [ ] OpenAI moderation API integration (mocked in tests)
- [ ] Supabase Storage upload (mocked in tests)
- [ ] `expression_events` insert with RLS
- [ ] Flow wall query (approved entries only)
- [ ] Clubhouse membership check middleware
- [ ] Clubhouse upload API (`/api/club/upload`)
- [ ] Admin moderation actions (approve/reject)

**E2E Tests (Playwright)**:
- [ ] Flow text submission: form → validation → submit → pending state
- [ ] Flow image submission: upload → compress → caption → submit → pending
- [ ] Vibe tag selection (1-3 tags required)
- [ ] Anonymous submission works (email optional)
- [ ] Flow wall displays approved entries
- [ ] Flow wall infinite scroll pagination
- [ ] Realtime updates: new approved entry appears without refresh
- [ ] Admin login → moderation queue → approve entry → entry appears on wall
- [ ] Clubhouse login → lore page → displays stories
- [ ] Clubhouse media archive → lightbox → keyboard navigation (← →, Esc)
- [ ] Clubhouse upload → form → pending confirmation

### Manual QA Checklist

**Functional - The Flow**:
- [ ] Text mode submission works (500 char limit enforced)
- [ ] Image mode submission works (5MB max, compression to ~400KB)
- [ ] Vibe tag selection requires 1-3 tags
- [ ] Anonymous submission works (email optional)
- [ ] OpenAI moderation blocks clearly unsafe content
- [ ] Trust scoring assigns confidence levels
- [ ] Approved entries appear on wall without refresh (Realtime)
- [ ] Flow wall masonry grid layout works on mobile and desktop
- [ ] Infinite scroll loads more entries
- [ ] Admin moderation queue shows pending/flagged entries
- [ ] Approve action publishes entry immediately
- [ ] Reject action hides entry
- [ ] Bulk moderation actions work

**Functional - Clubhouse**:
- [ ] Non-members see overview teaser only
- [ ] Members see full content (lore, media, resources, upload)
- [ ] Lore index displays stories from `club_stories`
- [ ] Lore detail page renders markdown content
- [ ] Lore search returns relevant results
- [ ] Media archive displays photos from `club_media` + Storage
- [ ] Lightbox supports keyboard navigation (← →, Esc)
- [ ] Resources list displays downloadable files
- [ ] Download links work (signed URLs)
- [ ] Upload portal stores contributions with `pending` status
- [ ] Admin moderation dashboard shows pending contributions
- [ ] Approve action publishes content to respective tables

**Performance**:
- [ ] Flow wall loads in <3s on 3G throttling
- [ ] Infinite scroll pagination works smoothly
- [ ] Images lazy load
- [ ] Realtime updates don't cause UI jank
- [ ] Image compression doesn't degrade quality noticeably

**Accessibility**:
- [ ] Flow submission form keyboard-navigable
- [ ] Error messages announced to screen readers
- [ ] Vibe tag selection accessible (keyboard + screen reader)
- [ ] Admin moderation queue keyboard-navigable
- [ ] Lightbox keyboard navigation works

**Security**:
- [ ] RLS policies on `expression_events` enforce moderation status
- [ ] RLS policies on clubhouse tables enforce membership
- [ ] Supabase Storage RLS prevents unauthorized reads
- [ ] Rate limiting on Flow submission (10/hour per IP)
- [ ] Rate limiting on clubhouse upload
- [ ] Image upload validation (file type, size)
- [ ] OpenAI moderation API key not exposed

**Content Quality**:
- [ ] 50+ Flow seed entries populated (diverse vibe tags, text + images)
- [ ] 10+ clubhouse stories seeded with markdown
- [ ] 50+ clubhouse photos seeded
- [ ] 3+ clubhouse resources seeded
- [ ] Seed content reflects RunExpression brand voice

**Analytics**:
- [ ] `flow_submit` event fires on submission
- [ ] `flow_approve` event fires on admin approval
- [ ] `clubhouse_upload` event fires on upload
- [ ] Event payloads include context (vibe tags, file type, etc.)

### Acceptance Gates

- [ ] All V1.1 must-pass criteria from `04-success-criteria.md` met
- [ ] No P0 or P1 bugs open
- [ ] Flow moderation workflow tested end-to-end
- [ ] Realtime updates work reliably (tested under load)
- [ ] Clubhouse membership gating enforced

---

## V1.2 Content & Commerce - Validation

**Goal**: Verify Blog, Shop, Tools, Waitlist, Legal pages, and full V1 launch readiness

### Automated Tests

**Unit Tests**:
- [ ] MDX frontmatter parsing and validation
- [ ] Pace calculator logic (pace per mile/km)
- [ ] Waitlist form validation (name, email, goals)
- [ ] Stripe webhook signature verification
- [ ] Sitemap generation includes all routes
- [ ] RSS feed generation includes all posts

**Integration Tests**:
- [ ] Blog post query and rendering
- [ ] MDX component registry (Image, Code, Callout)
- [ ] Shop product query from `products` table
- [ ] Stripe Checkout session creation
- [ ] Stripe webhook handler (`/api/webhooks/stripe`)
- [ ] Order record insertion on `checkout.session.completed`
- [ ] Digital download link generation (signed URLs with expiration)
- [ ] Waitlist submission API (`/api/coach/waitlist`)
- [ ] Duplicate email handling (waitlist dedupe)

**E2E Tests (Playwright)**:
- [ ] Blog index loads and displays posts
- [ ] Blog post detail renders markdown with images
- [ ] Blog tag filtering works
- [ ] Shop index displays products
- [ ] Shop product detail shows images, description, pricing
- [ ] Shop checkout redirects to Stripe
- [ ] Shop success page displays after checkout
- [ ] Pace calculator: input distance + time → outputs pace
- [ ] Waitlist form: submit → confirmation message
- [ ] Waitlist form: duplicate email → graceful error
- [ ] Privacy policy page loads
- [ ] Terms of service page loads

### Manual QA Checklist

**Functional - Blog / Library**:
- [ ] Blog index (`/library`) displays 5+ seed posts
- [ ] Post grid layout works on mobile and desktop
- [ ] Featured post section displays
- [ ] Tag/category filtering works
- [ ] Post detail page renders markdown correctly
- [ ] Images render with proper optimization
- [ ] Code blocks render with syntax highlighting
- [ ] Custom MDX components (Callout, etc.) work
- [ ] SEO meta tags present on each post
- [ ] OG images generate correctly
- [ ] RSS feed validates and includes all posts
- [ ] Reading time calculation accurate

**Functional - Shop**:
- [ ] Shop index (`/shop`) displays products from `products` table
- [ ] Product images load from Supabase Storage
- [ ] Product detail page shows full description
- [ ] "Buy Now" CTA redirects to Stripe Checkout
- [ ] Stripe Checkout displays correct product and price
- [ ] Checkout success page confirms order
- [ ] Checkout cancel page allows retry
- [ ] Webhook creates order record in `orders` table
- [ ] Digital product download link sent via email
- [ ] Digital download link expires after 24 hours
- [ ] Physical product order shows shipping details

**Functional - Tools**:
- [ ] Pace calculator (`/tools/pace-calculator`) loads
- [ ] Calculator accepts distance and time inputs
- [ ] Calculator outputs accurate pace per mile/km
- [ ] Vibe descriptors align with RunExpression brand
- [ ] CTA links to AI Coach waitlist
- [ ] Analytics event fires on tool completion

**Functional - AI Coach Waitlist**:
- [ ] Waitlist form (`/coach/waitlist`) loads
- [ ] Form validation works (required fields)
- [ ] Form submission inserts into `ai_coach_waitlist`
- [ ] Duplicate email handling works (no error, graceful message)
- [ ] Confirmation message displays on submit
- [ ] Waitlist teasers visible on homepage, Flow, Clubhouse

**Functional - Legal & SEO**:
- [ ] Privacy policy page (`/privacy`) loads
- [ ] Terms of service page (`/terms`) loads
- [ ] Footer links to legal pages work
- [ ] `sitemap.xml` includes all routes and blog posts
- [ ] `robots.txt` configured for search engines
- [ ] JSON-LD structured data for Organization present

**Performance**:
- [ ] All Core Web Vitals meet targets across all routes
- [ ] Blog post LCP <2s
- [ ] Shop page LCP <2.5s
- [ ] Tools page interactive in <1.5s
- [ ] Lighthouse audit >90 on all major routes

**Accessibility**:
- [ ] WCAG 2.1 AA compliance checklist 100% pass
- [ ] Keyboard navigation works on all routes
- [ ] Screen reader testing on shop checkout flow
- [ ] Screen reader testing on waitlist form
- [ ] Color contrast meets 4.5:1 minimum on all pages
- [ ] Focus states visible on all interactive elements

**Security**:
- [ ] RLS policies verified on all tables
- [ ] All forms use Zod validation
- [ ] Upload validation on all file uploads (size, type, content)
- [ ] Rate limiting on API routes (shop, waitlist)
- [ ] Environment variable leak check passes
- [ ] Stripe webhook signature verification prevents spoofing
- [ ] No sensitive data in client bundles
- [ ] HTTPS enforced on all routes

**Content Quality**:
- [ ] 5+ blog posts written and formatted
- [ ] Blog copy aligns with "Sage in the Parking Lot" voice
- [ ] 2+ shop products created (1 physical, 1 digital)
- [ ] Shop product descriptions reflect RunExpression values
- [ ] Legal pages written in accessible, non-corporate language
- [ ] Pace calculator vibe descriptors feel authentic

**Analytics**:
- [ ] `cta_click` events fire on homepage CTAs
- [ ] `flow_submit` event fires on Flow submission
- [ ] `clubhouse_upload` event fires on clubhouse upload
- [ ] `checkout_start` event fires on shop checkout
- [ ] `purchase_complete` event fires on successful order
- [ ] `waitlist_submit` event fires on waitlist submission
- [ ] `tool_complete` event fires on pace calculator usage
- [ ] Event payloads include context (source, type, etc.)

### Acceptance Gates

- [ ] All V1.2 must-pass criteria from `04-success-criteria.md` met
- [ ] No P0, P1, or P2 bugs open
- [ ] Security audit complete (RLS, input validation, rate limiting)
- [ ] Accessibility audit complete (WCAG 2.1 AA)
- [ ] Performance audit complete (CWV targets met)
- [ ] Legal pages approved
- [ ] Launch checklist complete (see `04-success-criteria.md`)

---

## Cross-Phase Validation

### Regression Testing

After each phase, run regression tests on previous phase features:

**Post-V1.1** (test V1.0 features):
- [ ] Homepage still loads and performs well
- [ ] Auth flows still work
- [ ] Clubhouse UI shells still accessible

**Post-V1.2** (test V1.0 and V1.1 features):
- [ ] Homepage still loads and performs well
- [ ] Auth flows still work
- [ ] Flow submission and wall still work
- [ ] Clubhouse backend integration still works
- [ ] Realtime updates still work

### Compatibility Testing

**Browsers**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Android (latest)

**Devices**:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad, 768x1024)
- [ ] Mobile (iPhone 12, 390x844)
- [ ] Mobile (Android, 360x640)

**Network Conditions**:
- [ ] Fast 4G
- [ ] Slow 3G (simulated)
- [ ] Offline (service worker if applicable)

### Load Testing (V1.1+)

**Flow Submission**:
- [ ] 10 concurrent submissions (test rate limiting)
- [ ] 100 submissions/hour (test moderation queue)
- [ ] Realtime updates with 50+ connected clients

**Clubhouse**:
- [ ] 20 concurrent uploads (test rate limiting)
- [ ] Lightbox with 100+ images (test lazy loading)

**Shop**:
- [ ] 10 concurrent checkouts (test Stripe rate limits)
- [ ] Webhook handler with 100+ events (test idempotency)

---

## Bug Severity Guidelines

**P0 (Critical - Immediate Fix)**:
- Security vulnerability (RLS bypass, auth bypass, data leak)
- Site-wide outage or error affecting >50% of users
- Payment processing failure causing duplicate charges
- Moderation pipeline failure allowing unsafe content

**P1 (High - Fix within 24 hours)**:
- Feature broken for significant user segment (>20%)
- Performance regression (LCP >5s)
- Accessibility regression (keyboard nav broken)
- Data integrity issue (user data lost or corrupted)

**P2 (Medium - Fix within 1 week)**:
- Feature broken for small user segment (<20%)
- Minor performance issue (LCP 3-5s)
- Minor accessibility issue (color contrast slightly off)
- UI bug affecting UX but not blocking

**P3 (Low - Fix when convenient)**:
- Cosmetic issue (spacing, alignment)
- Nice-to-have feature missing
- Minor text/copy issue

---

## Pre-Launch Validation Checklist

### V1.0 Pre-Launch
- [ ] All V1.0 automated tests passing
- [ ] All V1.0 manual QA complete
- [ ] No P0 bugs open
- [ ] Environment variables set in production
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Sentry receiving test errors
- [ ] Analytics receiving test events

### V1.1 Pre-Launch
- [ ] All V1.1 automated tests passing
- [ ] All V1.1 manual QA complete
- [ ] All V1.0 regression tests passing
- [ ] No P0 or P1 bugs open
- [ ] OpenAI API key configured (production)
- [ ] Supabase Storage buckets created with RLS
- [ ] Supabase Realtime enabled and tested
- [ ] Flow seed content (50+) populated
- [ ] Clubhouse seed content populated
- [ ] Admin accounts created for moderation

### V1.2 Pre-Launch
- [ ] All V1.2 automated tests passing
- [ ] All V1.2 manual QA complete
- [ ] All V1.0 and V1.1 regression tests passing
- [ ] No P0, P1, or P2 bugs open
- [ ] Stripe production account configured
- [ ] Stripe webhook endpoint verified
- [ ] Blog posts (5+) published
- [ ] Shop products (2+) created
- [ ] Legal pages approved
- [ ] WCAG 2.1 AA audit complete
- [ ] Performance audit complete
- [ ] Security audit complete
- [ ] Load testing complete

---

## Post-Launch Monitoring

### V1.0 Monitoring
- [ ] Homepage uptime monitoring
- [ ] Auth success/failure rate tracking
- [ ] Error tracking (Sentry)
- [ ] Analytics events flowing

### V1.1 Monitoring
- [ ] Flow submission rate and approval rate
- [ ] Moderation queue size and processing time
- [ ] Realtime uptime and latency
- [ ] OpenAI API success rate
- [ ] Clubhouse upload rate
- [ ] Storage usage and costs

### V1.2 Monitoring
- [ ] Shop transaction success rate
- [ ] Stripe webhook success rate
- [ ] Waitlist submission rate
- [ ] Blog post views and engagement
- [ ] Tool usage (pace calculator)
- [ ] Overall site performance (CWV)
- [ ] Error rates across all routes

---

## Rollback Plan

If critical issues are detected post-launch, follow rollback procedures:

1. **Identify severity**: Use bug severity guidelines above
2. **Decide**: Rollback vs. fix forward
3. **Execute**:
   - Rollback: Revert to previous deployment
   - Fix forward: Deploy hotfix with minimal changes
4. **Validate**: Re-run relevant validation tests
5. **Monitor**: Watch error rates and user impact
6. **Communicate**: Notify team and users (if applicable)

**Rollback triggers** (see `04-success-criteria.md` for full list):
- RLS policy misconfiguration
- Authentication bypass
- Payment processing errors
- Moderation pipeline failure
- Site-wide outage

---

## Validation Sign-Off

Each phase requires sign-off from:

- [ ] **Engineering Lead**: All automated tests passing, no P0/P1 bugs
- [ ] **QA Lead**: All manual QA complete, acceptance gates met
- [ ] **Product Owner**: Feature requirements met, content approved
- [ ] **Security**: Security audit complete (V1.2 only)
- [ ] **Accessibility**: WCAG audit complete (V1.2 only)

**V1.0 Sign-Off Date**: _________________

**V1.1 Sign-Off Date**: _________________

**V1.2 Sign-Off Date**: _________________
