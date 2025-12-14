# RunExpression V1 - Implementation Plan

**Version:** 1.0
**Last Updated:** December 2025
**Owner:** Engineering Team

---

## Table of Contents

1. [Development Approach](#development-approach)
2. [Phase Overview](#phase-overview)
3. [Detailed Phase Breakdown](#detailed-phase-breakdown)
4. [Task Dependencies](#task-dependencies)
5. [Resource Allocation](#resource-allocation)
6. [Risk Mitigation](#risk-mitigation)
7. [Quality Assurance](#quality-assurance)
8. [Launch Checklist](#launch-checklist)

---

## Development Approach

### Methodology: Agile with Weekly Sprints

**Sprint Duration:** 1 week
**Total Timeline:** 6-8 weeks for V1

**Core Principles:**
- **Ship early, iterate often:** Functional MVP over perfect polish
- **Vertical slices:** Complete features end-to-end before moving to next
- **Continuous deployment:** Merge to staging daily, production weekly
- **User feedback loops:** Test with DWTC members throughout build

### Development Environment

**Local Development:**
- Next.js dev server (`npm run dev`)
- Supabase local instance (optional) or cloud dev project
- Hot reload for instant feedback

**Staging:**
- Vercel preview deployments (auto-generated per PR)
- Supabase staging project (separate from production)
- Seed data for testing

**Production:**
- Vercel production deployment
- Supabase production project
- Real user data, monitored closely

---

## Phase Overview

| Phase | Duration | Key Deliverables | Dependencies |
|-------|----------|------------------|--------------|
| **Phase 0: Setup** | Week 1 | Project initialized, design system, Supabase configured | None |
| **Phase 1: Homepage** | Week 2 | Homepage with manifesto scroll experience live | Phase 0 |
| **Phase 2: The Flow** | Week 3-4 | Canvas submission and wall functional | Phase 0, auth |
| **Phase 3: Clubhouse** | Week 5 | DWTC Clubhouse with upload portal | Phase 0, auth |
| **Phase 4: Polish & Launch** | Week 6 | Blog, shop framework, final QA, content seeding | All phases |

**Total:** 6 weeks (aggressive) to 8 weeks (realistic with buffer)

---

## Detailed Phase Breakdown

---

## Phase 0: Foundation & Setup (Week 1)

**Goal:** Set up development environment, design system, and core infrastructure

### Tasks

#### 0.1 Project Initialization
- [ ] Create Next.js 14+ project with TypeScript (`npx create-next-app@latest`)
- [ ] Configure ESLint, Prettier, Git hooks
- [ ] Set up project structure (see 03-TECHNICAL-DESIGN.md)
- [ ] Initialize Git repository, create `main` and `develop` branches
- [ ] Connect repository to Vercel
- [ ] Configure environment variables (`.env.local`, `.env.example`)

**Acceptance Criteria:**
- [ ] `npm run dev` starts local server successfully
- [ ] `npm run build` completes without errors
- [ ] Vercel auto-deploys on push to `main`

---

#### 0.2 Supabase Setup
- [ ] Create Supabase project (`database.new`)
- [ ] Copy API keys to `.env.local`
- [ ] Install Supabase dependencies (`@supabase/ssr`, `@supabase/supabase-js`)
- [ ] Configure Supabase clients (browser, server, admin)
- [ ] Run initial schema migrations (see 06-DATA-SCHEMA.md)
- [ ] Set up Storage buckets (`uploads`, `products`)
- [ ] Configure Storage policies (RLS)

**Acceptance Criteria:**
- [ ] Can connect to Supabase from Next.js app
- [ ] Tables visible in Supabase dashboard
- [ ] Can upload test file to Storage

---

#### 0.3 Design System & UI Components
- [ ] Install Tailwind CSS (`npx tailwindcss init`)
- [ ] Configure Tailwind theme (colors, fonts per brand guide)
- [ ] Install Shadcn/UI (`npx shadcn-ui@latest init`)
- [ ] Add core components:
  - [ ] Button
  - [ ] Input
  - [ ] Dialog/Modal
  - [ ] Card
  - [ ] Tabs
  - [ ] Form components
- [ ] Create shared components:
  - [ ] Header/Navigation
  - [ ] Footer
  - [ ] Layout wrapper

**Acceptance Criteria:**
- [ ] Tailwind compiles correctly
- [ ] All Shadcn components render without errors
- [ ] Header/Footer visible on test page
- [ ] Brand colors match 04-BRAND-CONTENT-GUIDE.md

---

#### 0.4 Authentication Setup
- [ ] Configure Supabase Auth (email/password)
- [ ] Create middleware for protected routes (`middleware.ts`)
- [ ] Build login page (`/login`)
- [ ] Build signup page (`/signup`)
- [ ] Build password reset flow (`/reset-password`)
- [ ] Implement auth callback route (`/api/auth/callback`)
- [ ] Test signup → email verification → login flow

**Acceptance Criteria:**
- [ ] User can sign up and receive verification email
- [ ] User can log in and session persists
- [ ] Protected routes redirect to login if not authenticated
- [ ] Logout works and clears session

---

#### 0.5 Analytics & Monitoring
- [ ] Install Sentry (`npx @sentry/wizard@latest -i nextjs`)
- [ ] Configure Sentry DSN in environment variables
- [ ] Set up Google Analytics 4 OR Amplitude
- [ ] Create `lib/analytics.ts` with `trackEvent` function
- [ ] Test error tracking (trigger test error, verify in Sentry)
- [ ] Test event tracking (fire test event, verify in analytics platform)

**Acceptance Criteria:**
- [ ] Errors appear in Sentry dashboard
- [ ] Test events appear in analytics platform
- [ ] No console errors in browser

---

**Phase 0 Checkpoint:**
- [ ] All setup tasks completed
- [ ] Dev environment running smoothly
- [ ] Staging deployment accessible
- [ ] Team can start building features

**Estimated Effort:** 20-30 hours (2-3 developers working concurrently)

---

## Phase 1: Homepage & Manifesto (Week 2)

**Goal:** Ship a compelling, scroll-driven homepage that embodies the brand

### Tasks

#### 1.1 Homepage Layout
- [ ] Create root layout (`app/layout.tsx`) with Header/Footer
- [ ] Create homepage route (`app/page.tsx`)
- [ ] Implement responsive grid/flexbox layout
- [ ] Add SEO meta tags (title, description, OG image)
- [ ] Test mobile, tablet, desktop breakpoints

**Acceptance Criteria:**
- [ ] Homepage loads without errors
- [ ] Header and footer render correctly
- [ ] Layout responsive on all devices

---

#### 1.2 Hero Section
- [ ] Implement hero copy (H1, subheadline per brand guide)
- [ ] Add primary CTA button ("Enter the Flow")
- [ ] Add secondary CTA button ("Visit the Clubhouse")
- [ ] Implement background animation (subtle motion)
  - Use Framer Motion or CSS animation
- [ ] Ensure CTAs are prominent on mobile
- [ ] Add analytics tracking for CTA clicks

**Acceptance Criteria:**
- [ ] Hero matches approved copy and design
- [ ] CTAs navigate to correct routes
- [ ] Background animation smooth (60fps)
- [ ] Analytics events fire on CTA clicks

---

#### 1.3 Manifesto Scroll Chapters
- [ ] Install Framer Motion (`npm install framer-motion`)
- [ ] Create `<Chapter>` component with scroll-triggered animations
- [ ] Implement 4 chapters (per 04-BRAND-CONTENT-GUIDE.md):
  - [ ] Chapter 1: Motion Creates Emotion
  - [ ] Chapter 2: Process Over Outcome
  - [ ] Chapter 3: Interdependence
  - [ ] Chapter 4: Living Laboratory
- [ ] Add scroll-triggered fade-in animations (opacity, translateY)
- [ ] Implement "soft prompt" CTAs (optional navigation)
- [ ] Test scroll behavior on mobile (no jank)
- [ ] Respect `prefers-reduced-motion` setting

**Acceptance Criteria:**
- [ ] All 4 chapters render with correct copy
- [ ] Scroll animations smooth and performant
- [ ] Reduced motion mode disables animations
- [ ] Mobile scroll experience is smooth

---

#### 1.4 Flow Preview Strip
- [ ] Create `<FlowPreview>` component
- [ ] Fetch 20-30 most recent approved Flow entries from Supabase
- [ ] Implement horizontal auto-scroll OR swipeable carousel
- [ ] Display text snippets only (images in V1.1)
- [ ] Add "Add Your Voice →" CTA linking to `/flow`
- [ ] Style per brand (hand-drawn edges, organic feel)

**Acceptance Criteria:**
- [ ] Preview strip shows real data from database
- [ ] Auto-scrolls OR is swipeable on mobile
- [ ] No layout shift (CLS)
- [ ] CTA navigates to Flow page

---

#### 1.5 Clubhouse Teaser
- [ ] Create `<ClubhouseTeaser>` component
- [ ] Add copy (H2, body, callout per brand guide)
- [ ] Add high-quality DWTC crew photo (gritty, B&W)
- [ ] Style as distinct visual break (darker bg, different feel)
- [ ] Add "Visit the Clubhouse →" CTA
- [ ] Optimize image (WebP, lazy load)

**Acceptance Criteria:**
- [ ] Teaser section visually distinct
- [ ] Image loads quickly, looks great
- [ ] CTA navigates to `/club/dwtc`

---

#### 1.6 Footer
- [ ] Create `<Footer>` component (if not done in Phase 0)
- [ ] Add headline: "Run for yourself. Run for us. Express yourself."
- [ ] Add navigation links (Manifesto, Flow, Studio, Shop, Login)
- [ ] Add social links (Instagram, placeholder for others)
- [ ] Add legal links (Privacy Policy, Terms placeholders)
- [ ] Add copyright notice

**Acceptance Criteria:**
- [ ] Footer renders on all pages
- [ ] All links navigate correctly (or show "Coming Soon" for placeholders)
- [ ] Footer responsive on mobile

---

#### 1.7 Homepage Polish & QA
- [ ] Run Lighthouse audit (score >90 for Performance, Accessibility)
- [ ] Fix any accessibility issues (alt text, ARIA labels, focus states)
- [ ] Optimize images (compress, WebP format)
- [ ] Test on real devices (iOS Safari, Android Chrome)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Copy review with brand owner

**Acceptance Criteria:**
- [ ] Lighthouse scores meet targets
- [ ] No accessibility errors (axe-core scan)
- [ ] Smooth on real devices
- [ ] Copy approved by brand owner

---

**Phase 1 Deliverable:** Homepage live on staging, ready for user testing

**Estimated Effort:** 25-35 hours

---

## Phase 2: The Flow (Canvas) (Weeks 3-4)

**Goal:** Ship a functional, moderated Flow where users can submit and view expressions

### Tasks

#### 2.1 Flow Entry Page (Submission Interface)
- [ ] Create `/flow` route (`app/flow/page.tsx`)
- [ ] Implement page layout (hero, prompt, input area, wall preview)
- [ ] Add main prompt: "What did your run express today?"
- [ ] Add helper text: "It doesn't have to be pretty. Just honest."
- [ ] Create medium selection UI (Text, Image)
  - Radio buttons or cards
- [ ] Show wall in background (blurred or translucent)

**Acceptance Criteria:**
- [ ] Flow page loads successfully
- [ ] Prompt copy matches brand guide
- [ ] Medium selection UI intuitive

---

#### 2.2 Text Input Mode
- [ ] Create `<TextSubmissionForm>` component
- [ ] Add text area with 500 char limit
  - Placeholder: "Today, I ran for..."
  - Show character count
- [ ] Add optional longer note field (1000 chars)
- [ ] Implement Vibe Tags selector (multi-select, max 3)
  - Tags from constants: Mindset, Context, Feeling
  - Visual: Chips or checkboxes
- [ ] Add attribution field
  - If logged in: "Post as [Name]" with anonymous option
  - If not logged in: "Post anonymously" (collect email)
- [ ] Add "Add to the Flow" submit button
- [ ] Implement client-side validation
- [ ] Show optimistic UI after submit

**Acceptance Criteria:**
- [ ] Form fields validate correctly
- [ ] Character count updates in real-time
- [ ] Vibe tags selectable, max 3 enforced
- [ ] Submit button triggers API call
- [ ] Optimistic UI shows "Your expression is joining the Flow..."

---

#### 2.3 Image Upload Mode
- [ ] Install compressorjs (`npm install compressorjs`)
- [ ] Create `<ImageSubmissionForm>` component
- [ ] Implement drag-and-drop file input (or click to select)
  - Accept: JPG, PNG, HEIC
  - Max size: 5MB (before compression)
- [ ] Add image preview after selection
- [ ] Compress image client-side (target ~400KB)
- [ ] Add caption field (500 chars, required)
- [ ] Add Vibe Tags selector (same as text mode)
- [ ] Add attribution field (same as text mode)
- [ ] Upload to Supabase Storage
  - Show progress bar
  - Generate public URL
- [ ] Submit Flow entry with media_url

**Acceptance Criteria:**
- [ ] Drag-and-drop works
- [ ] Image compresses to ~400KB before upload
- [ ] Progress bar shows during upload
- [ ] Public URL generated correctly
- [ ] Entry created in database with media_url

---

#### 2.4 OpenAI Moderation Integration
- [ ] Sign up for OpenAI API key
- [ ] Install OpenAI SDK (`npm install openai`)
- [ ] Create `/api/flow/submit` route
- [ ] Implement moderation check (see 03-TECHNICAL-DESIGN.md)
  - Call OpenAI Moderation API with text content
  - If flagged: return 400 error with message
  - If clean: proceed to trust scoring
- [ ] Implement trust scoring logic
  - Count user's previous approved submissions
  - If ≥3: auto-approve (`moderation_status: approved`)
  - If <3: pending (`moderation_status: pending`)
- [ ] Create database entry with appropriate status
- [ ] Return success response with moderation_status

**Acceptance Criteria:**
- [ ] OpenAI moderation flags inappropriate content
- [ ] Flagged content rejected with clear error message
- [ ] Clean content proceeds to trust scoring
- [ ] New users' entries marked as pending
- [ ] Trusted users' entries auto-approved

---

#### 2.5 Flow Wall (Public Display)
- [ ] Install react-masonry-css (`npm install react-masonry-css`)
- [ ] Create `<FlowWall>` component
- [ ] Fetch approved Flow entries from Supabase
  - Filter: `moderation_status = approved`, `visibility = public`
  - Sort: `created_at DESC`
  - Limit: 50 initially
- [ ] Implement masonry grid layout
- [ ] Create `<ExpressionCard>` component
  - Text entries: Quote-style display
  - Image entries: Photo with caption overlay
  - Show vibe tags as badges
  - Show timestamp ("2 hours ago")
  - Organic card edges (CSS or SVG)
- [ ] Implement infinite scroll (load more on scroll)
- [ ] Style per brand (hand-drawn edges, subtle shadows)

**Acceptance Criteria:**
- [ ] Wall displays approved entries
- [ ] Masonry grid looks good on all devices
- [ ] Expression cards match brand aesthetic
- [ ] Infinite scroll loads more entries smoothly

---

#### 2.6 Realtime Updates
- [ ] Set up Supabase Realtime subscription in `<FlowWall>`
- [ ] Subscribe to `expression_events` table inserts
  - Filter: `moderation_status = approved`
- [ ] On new entry: prepend to state array
- [ ] Animate new entry (fade-in from top)
- [ ] Enable Realtime on `expression_events` table in Supabase
  - SQL: `ALTER TABLE expression_events REPLICA IDENTITY FULL;`

**Acceptance Criteria:**
- [ ] New approved entries appear without page refresh
- [ ] Animation smooth and non-disruptive
- [ ] No duplicate entries in wall

---

#### 2.7 Admin Moderation Queue
- [ ] Create `/admin/moderation` route (role-gated)
- [ ] Fetch pending entries
  - Filter: `moderation_status = pending`
- [ ] Display pending entries in list
  - Show: thumbnail/icon, title/content, type, contributor, date
- [ ] Add Approve/Reject buttons per entry
- [ ] Implement bulk actions (select multiple → approve all)
- [ ] On approve: set `moderation_status = approved`, `visibility = public`
- [ ] On reject: set `moderation_status = rejected`, `visibility = hidden`
- [ ] Add action logging (optional: separate `moderation_log` table)

**Acceptance Criteria:**
- [ ] Admin can access moderation queue
- [ ] Pending entries listed clearly
- [ ] Approve/reject actions work
- [ ] Approved entries immediately visible on wall (via Realtime)

---

#### 2.8 Flow Seed Content
- [ ] Create 50+ seed Flow entries (diverse, authentic)
  - Mix of text and images
  - Range of vibe tags
  - Some humorous, some deep, some simple
- [ ] Insert into database with `moderation_status = approved`
- [ ] Verify seed entries appear on wall

**Acceptance Criteria:**
- [ ] At least 50 seed entries in database
- [ ] Entries diverse and on-brand
- [ ] Wall looks populated at launch

---

#### 2.9 Flow QA & Polish
- [ ] Test full submission flow (text and image)
- [ ] Test moderation (submit inappropriate content, verify rejection)
- [ ] Test trust scoring (submit 3+ entries, verify auto-approval)
- [ ] Test Realtime updates (submit entry in one tab, see in another)
- [ ] Mobile testing (submission and wall viewing)
- [ ] Accessibility audit (form labels, keyboard navigation)
- [ ] Analytics verification (all events firing)

**Acceptance Criteria:**
- [ ] All flows work end-to-end
- [ ] Moderation catches bad content
- [ ] Realtime updates work
- [ ] Mobile experience smooth
- [ ] No accessibility blockers

---

**Phase 2 Deliverable:** The Flow live and functional, users can submit and view expressions

**Estimated Effort:** 40-50 hours

---

## Phase 3: DWTC Clubhouse (Week 5)

**Goal:** Ship a functional clubhouse with browse and upload capabilities

### Tasks

#### 3.1 Clubhouse Routes & Navigation
- [ ] Create `/club/dwtc` route structure
- [ ] Implement clubhouse layout with navigation
  - Tabs or sidebar: Overview, Lore, Media, Resources
- [ ] Add persistent "Add to Archive" button in header
- [ ] Implement auth gate (middleware or component-level)
  - Check `club_memberships` table for user access
  - Redirect to login if not authenticated
  - Show "Join the club" message if not a member
- [ ] Style navigation per brand (clubhouse-specific feel)

**Acceptance Criteria:**
- [ ] Clubhouse accessible at `/club/dwtc`
- [ ] Navigation works on all devices
- [ ] Non-members see teaser, members see full access
- [ ] "Add to Archive" button visible and functional

---

#### 3.2 Overview Page
- [ ] Create hero section
  - Full-width DWTC crew photo
  - Club tagline: "Where lore lives. Where miles turn into memories."
  - Brief intro text (100-200 words)
- [ ] Implement "Upcoming Events" section
  - Fetch next 3 events from database (if calendar implemented)
  - OR hardcode placeholder events for V1
  - Card format: Date, name, description
- [ ] Implement "Recent Contributions" section
  - Fetch latest 6-10 uploads (stories, photos, docs)
  - Mix of media types
  - Link to full sections ("See all in Lore →")
- [ ] Optional: Featured story (admin-pinned)
- [ ] Make responsive (carousel on mobile)

**Acceptance Criteria:**
- [ ] Overview page welcoming and informative
- [ ] Recent contributions show real data
- [ ] All links navigate correctly

---

#### 3.3 Lore & Stories Section
- [ ] Create `/club/dwtc/lore` route
- [ ] Fetch stories from `club_contributions` table
  - Filter: `type = story`, `club_id = DWTC`, `moderation_status = approved`
- [ ] Implement card-based list view
  - Each card: title, date, author, thumbnail, excerpt, tags, "Read more →"
- [ ] Add filtering UI
  - Filter by: tag, year, author
  - Search bar (full-text search on title/body)
- [ ] Implement story detail view
  - Render markdown body
  - Show author attribution
  - Related stories at bottom (same tags)
- [ ] Style per brand (clubhouse aesthetic)

**Acceptance Criteria:**
- [ ] Lore section displays stories
- [ ] Filtering and search work
- [ ] Story detail pages render markdown correctly
- [ ] Mobile-optimized reading experience

---

#### 3.4 Media Archive Section
- [ ] Create `/club/dwtc/media` route
- [ ] Fetch media from `club_contributions` table
  - Filter: `type = media`, `club_id = DWTC`, `moderation_status = approved`
- [ ] Implement masonry grid (reuse from Flow)
- [ ] Create media tile component
  - Thumbnail with caption overlay on hover/tap
- [ ] Add filtering
  - Filter by: event, year, tag
  - Tag chips above grid
- [ ] Implement lightbox for full-size view
  - Show full image/video
  - Caption, contributor, date
  - Download button
  - Keyboard navigation (arrow keys for prev/next)

**Acceptance Criteria:**
- [ ] Media grid displays photos/videos
- [ ] Lightbox works smoothly
- [ ] Filtering functional
- [ ] Download button works

---

#### 3.5 Resources Section
- [ ] Create `/club/dwtc/resources` route
- [ ] Fetch resources from `club_contributions` table
  - Filter: `type = document`, `club_id = DWTC`
- [ ] Implement list/grid of resource cards
  - File type icon, title, description, file size, date, download button
- [ ] Add categories (if using tags: Training Plans, Routes, Guides)
- [ ] Link download button to Supabase Storage URL

**Acceptance Criteria:**
- [ ] Resources listed clearly
- [ ] Download buttons work
- [ ] Files open/download correctly (PDFs in new tab, GPX downloads)

---

#### 3.6 Upload Portal
- [ ] Create `/club/dwtc/upload` route OR modal component
- [ ] Implement upload form (see 02-PRODUCT-REQUIREMENTS.md F3.6)
  - Step 1: Choose type (Story, Photo/Video, Document)
  - Step 2: Input details (title, body/caption, tags, optional event link)
  - Step 3: Attribution (pre-filled, allow nickname override)
  - Step 4: Review & submit (preview card)
  - Step 5: Confirmation message
- [ ] Implement file upload logic
  - Compress images client-side (compressorjs)
  - Upload to Supabase Storage (`uploads/clubhouse/dwtc/...`)
  - Show progress bar
- [ ] Create database entry in `club_contributions`
  - Default `moderation_status = pending`
- [ ] Show success confirmation

**Acceptance Criteria:**
- [ ] Upload form intuitive and easy to use
- [ ] All three types (story, media, doc) supported
- [ ] Files upload successfully
- [ ] Database entries created
- [ ] Success message displayed

---

#### 3.7 Clubhouse Seed Content
- [ ] Write 10+ lore stories (markdown)
  - "The First Bacon Ritual"
  - "Sub-16 Club Initiation"
  - "The Origin of DWTC"
  - Race reports from key events
- [ ] Upload 50+ photos (diverse events, people, moments)
- [ ] Upload 3-5 resources (training plans, route maps PDFs)
- [ ] Insert into database with `moderation_status = approved`

**Acceptance Criteria:**
- [ ] At least 10 stories, 50 photos, 3 resources seeded
- [ ] Content diverse and on-brand
- [ ] All sections look populated at launch

---

#### 3.8 Clubhouse QA & Polish
- [ ] Test all upload types (story, photo, doc)
- [ ] Test moderation queue (admin approval flow)
- [ ] Test filtering and search across sections
- [ ] Test lightbox (media viewing)
- [ ] Test resource downloads
- [ ] Mobile testing (all sections)
- [ ] Accessibility audit
- [ ] Analytics verification

**Acceptance Criteria:**
- [ ] All clubhouse features functional
- [ ] Mobile experience smooth
- [ ] No accessibility blockers
- [ ] Analytics events firing

---

**Phase 3 Deliverable:** DWTC Clubhouse live with browse and upload features

**Estimated Effort:** 35-45 hours

---

## Phase 4: Polish, Launch Prep & Ancillary Features (Week 6)

**Goal:** Ship blog framework, shop catalog, final polish, content seeding, go-live

### Tasks

#### 4.1 Blog / Library
- [ ] Create `/library` route (blog index)
- [ ] Set up MDX file structure (`/content/blog/*.mdx`)
- [ ] Create blog index page (grid of posts with excerpts)
- [ ] Create blog post detail page (`/library/[slug]`)
- [ ] Install and configure `next-mdx-remote`
- [ ] Style blog posts per brand (typography, spacing)
- [ ] Write 5 seed blog posts
  - "The Expressive Runner's Creed" (manifesto deep dive)
  - "Why the Bacon Ritual Matters"
  - "Motion Creates Emotion: The Science"
  - "How to Build a Running Tribe"
  - "Process Over Outcome in Marathon Training"
- [ ] Add SEO meta tags per post
- [ ] Test on mobile

**Acceptance Criteria:**
- [ ] Blog index displays all posts
- [ ] Post detail pages render MDX correctly
- [ ] At least 5 seed posts published
- [ ] SEO meta tags set

---

#### 4.2 Shop Framework
- [ ] Create `/shop` route (shop index)
- [ ] Create products in Stripe Dashboard
  - 2 physical products (greeting cards, t-shirt)
  - 2 digital products (handbook PDF, training plan PDF)
  - Copy `price_id` values
- [ ] Add products to `products` table in Supabase
  - Store `stripe_price_id`, name, description, images, type
- [ ] Create shop index page (product grid)
- [ ] Create product detail page (`/shop/[slug]`)
- [ ] Create "Buy Now" button component
  - Redirects to Stripe Checkout
- [ ] Create `/api/stripe/create-checkout-session` route
- [ ] Create success/cancel pages (`/shop/success`, `/shop/cancel`)
- [ ] Set up Stripe webhook handler (`/api/webhooks/stripe`)
  - Handle `checkout.session.completed`
  - Create order in database
  - For digital products: email download link (manual for V1)

**Acceptance Criteria:**
- [ ] Shop displays products
- [ ] Product detail pages functional
- [ ] Stripe Checkout works
- [ ] Webhook creates orders in database
- [ ] Success/cancel pages display correctly

---

#### 4.3 Interactive Tools (Pace Calculator)
- [ ] Create `/tools/pace-calculator` route
- [ ] Implement VDOT pace calculator logic
- [ ] Add input fields (recent race time OR easy pace)
- [ ] Display training paces with "vibe descriptors"
  - Easy: "Conversational, bacon-cooking pace"
  - Tempo: "Comfortably hard, finding flow"
  - Interval: "Pain cave exploration"
- [ ] Add "Save results" button (requires login) - V1.1
- [ ] Add "Export to PDF/image" button - V1.1
- [ ] Add CTA: "Track your training with the AI Coach (waitlist)"

**Acceptance Criteria:**
- [ ] Calculator functional and accurate
- [ ] Vibe descriptors match brand voice
- [ ] Works on mobile
- [ ] CTA links to waitlist

---

#### 4.4 AI Coach Waitlist
- [ ] Create `/coach/waitlist` route OR modal
- [ ] Implement waitlist form
  - Email (required)
  - "What are you running for?" (optional, 500 chars)
  - "What kind of guidance?" (optional, 500 chars)
- [ ] Create database entry in `ai_coach_waitlist` table
- [ ] Show success message: "You're in the lab now. We'll be in touch."
- [ ] Optional: Send confirmation email
- [ ] Add waitlist teasers to:
  - [ ] Homepage (after Flow preview)
  - [ ] Flow page (subtle note)
  - [ ] Clubhouse (sidebar or overview)

**Acceptance Criteria:**
- [ ] Waitlist form works
- [ ] Entries stored in database
- [ ] Success message displays
- [ ] Teasers visible on all pages

---

#### 4.5 Legal Pages
- [ ] Create Privacy Policy page (`/privacy`)
- [ ] Create Terms of Service page (`/terms`)
- [ ] Link from footer
- [ ] Use standard templates, customize for RunExpression

**Acceptance Criteria:**
- [ ] Privacy and Terms pages accessible
- [ ] Content legally sound (review with advisor if needed)

---

#### 4.6 Final QA & Testing

**Performance:**
- [ ] Run Lighthouse audits on all key pages
  - Homepage, Flow, Clubhouse, Blog, Shop
  - Target: Performance >90, Accessibility >95
- [ ] Optimize images (WebP, responsive sizes)
- [ ] Check bundle size (`npx @next/bundle-analyzer`)
- [ ] Test on 3G connection (throttle in DevTools)

**Accessibility:**
- [ ] Run axe-core scans on all pages
- [ ] Fix any critical/serious issues
- [ ] Test keyboard navigation (all interactive elements reachable)
- [ ] Test screen reader (spot-check key flows)

**Cross-Browser:**
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS Safari, Android Chrome
- [ ] Fix any browser-specific bugs

**Device Testing:**
- [ ] Test on real iPhone (iOS Safari)
- [ ] Test on real Android phone (Chrome)
- [ ] Test on tablet
- [ ] Test on desktop (various resolutions)

**Security:**
- [ ] Review all API routes for auth checks
- [ ] Verify RLS policies enabled and tested
- [ ] Check for exposed secrets (scan codebase)
- [ ] Test rate limiting (if implemented)

**Analytics:**
- [ ] Verify all analytics events firing correctly
- [ ] Check Sentry error tracking
- [ ] Set up uptime monitoring

---

#### 4.7 Content Seeding & Copywriting
- [ ] Review all copy against brand guide
- [ ] Seed Flow with 50+ entries (if not done in Phase 2)
- [ ] Seed Clubhouse with 10 stories, 50 photos, 3 resources
- [ ] Write all 5 blog posts
- [ ] Add product descriptions and images to shop
- [ ] Review with brand owner, make final edits

**Acceptance Criteria:**
- [ ] All copy approved
- [ ] Seed content in place
- [ ] Site feels populated, not empty

---

#### 4.8 Pre-Launch Checklist
- [ ] All features functional (see Launch Checklist below)
- [ ] All content reviewed and approved
- [ ] All analytics and monitoring configured
- [ ] Performance and accessibility targets met
- [ ] Staging deployment tested by team and beta users
- [ ] Production environment variables set
- [ ] Backup and rollback plan in place
- [ ] Support/contact email set up (optional)
- [ ] Social media accounts ready (Instagram, etc.)

**Acceptance Criteria:**
- [ ] All checklist items complete
- [ ] Stakeholder sign-off received
- [ ] Ready to deploy to production

---

**Phase 4 Deliverable:** RunExpression V1 live in production!

**Estimated Effort:** 30-40 hours

---

## Task Dependencies

### Critical Path

```
Phase 0 (Setup)
    ↓
Phase 1 (Homepage) ← Can start immediately after Phase 0
    ↓
Phase 2 (The Flow) ← Requires auth from Phase 0
    ↓
Phase 3 (Clubhouse) ← Requires auth from Phase 0
    ↓
Phase 4 (Polish & Launch) ← Requires all previous phases
```

### Parallel Work Opportunities

**After Phase 0:**
- Homepage (Phase 1) and Flow backend (Phase 2.4) can be built in parallel
- Blog setup (Phase 4.1) can start early if content is ready

**During Phase 2:**
- Clubhouse backend setup can start while Flow frontend is being built

**During Phase 3:**
- Shop framework can be built in parallel with Clubhouse

---

## Resource Allocation

### Recommended Team Structure

**Minimum Viable Team:**
- 1 Full-Stack Developer (handles all phases)
- 1 Designer (part-time, provides designs and assets)
- 1 Content Creator (writes blog posts, seed content)
- 1 Product Owner (makes decisions, reviews, approves)

**Optimal Team:**
- 2 Full-Stack Developers (parallel work, pair programming)
- 1 Designer (embedded, real-time iteration)
- 1 Content Creator (full-time, seed content and ongoing)
- 1 Product Owner / Founder
- 1 QA Tester (part-time in weeks 5-6)

### Time Allocation by Role

| Role | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|------|---------|---------|---------|---------|---------|-------|
| **Dev (Full-Stack)** | 25h | 30h | 45h | 40h | 35h | 175h |
| **Designer** | 10h | 15h | 10h | 10h | 5h | 50h |
| **Content Creator** | 5h | 5h | 10h | 15h | 25h | 60h |
| **Product Owner** | 5h | 5h | 5h | 5h | 10h | 30h |

**Total Effort:** ~315 person-hours for V1

---

## Risk Mitigation

### Identified Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Scope creep** | High | High | Strict adherence to V1 scope; "V1.1 backlog" for good ideas |
| **Moderation overwhelm** | Medium | Medium | OpenAI API + trusted user system; recruit DWTC members to help moderate |
| **Low engagement at launch** | Medium | High | Seed heavily; recruit DWTC for initial contributions; pre-launch email list |
| **Performance issues** | Low | Medium | Follow optimization best practices; Lighthouse audits at each phase |
| **Supabase free tier limits** | Low | Low | Monitor usage; upgrade plan if needed (~$25/mo) |
| **Third-party API downtime** | Low | Medium | Graceful degradation; retry logic; clear error messages to users |
| **Designer/content delays** | Medium | Medium | Start design and content work early; use placeholders if needed |

### Contingency Plans

**If timeline slips:**
- Descope: Defer blog and shop to V1.1, ship with Homepage + Flow + Clubhouse only
- Extend timeline: Add 1-2 weeks buffer (total 8 weeks)

**If moderation becomes unmanageable:**
- Pause new submissions temporarily
- Recruit volunteer moderators from DWTC
- Implement stricter auto-moderation (more aggressive AI filtering)

**If engagement is low:**
- Double down on content seeding
- Run targeted social media campaign
- Reach out to running influencers for features

---

## Quality Assurance

### Testing Strategy

**Unit Testing:**
- Critical utility functions (e.g., pace calculator logic)
- Use Jest + React Testing Library
- Run tests in CI/CD pipeline

**Integration Testing:**
- Key user flows (signup, Flow submission, clubhouse upload)
- Use Playwright or Cypress
- Run on staging before production deploy

**Manual QA:**
- Complete QA checklist at end of each phase
- Test on real devices (not just browser DevTools)
- Involve beta users (DWTC members) for feedback

**Accessibility Testing:**
- Automated: axe-core scans
- Manual: Keyboard navigation, screen reader spot-checks
- Target: WCAG 2.1 AA compliance

### QA Checklist Template (Per Feature)

- [ ] Feature works as specified in requirements
- [ ] Mobile responsive (320px to 1920px)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Keyboard accessible (all interactive elements)
- [ ] Screen reader friendly (tested with NVDA/JAWS/VoiceOver)
- [ ] No console errors or warnings
- [ ] Analytics events fire correctly
- [ ] Loading states and error states handled
- [ ] Meets performance targets (Lighthouse)
- [ ] Copy reviewed and approved

---

## Launch Checklist

### Pre-Launch (Days Before)

**Technical:**
- [ ] All production environment variables set in Vercel
- [ ] Supabase production project configured and seeded
- [ ] Stripe production mode enabled, webhooks configured
- [ ] Custom domain configured and SSL cert active
- [ ] Analytics and monitoring active (GA4, Sentry)
- [ ] Final production deployment tested end-to-end
- [ ] Backup strategy in place (Supabase auto-backups enabled)

**Content:**
- [ ] All copy reviewed and approved by stakeholders
- [ ] Blog posts published (5 minimum)
- [ ] Flow seeded (50+ entries)
- [ ] Clubhouse seeded (10 stories, 50 photos, 3 resources)
- [ ] Shop products live (2 physical, 2 digital minimum)
- [ ] Legal pages (Privacy, Terms) published

**Marketing:**
- [ ] Social media accounts set up (Instagram, etc.)
- [ ] Launch announcement drafted
- [ ] Email list ready (ConvertKit, Mailchimp)
- [ ] Press kit prepared (if reaching out to media)

**Operations:**
- [ ] Support email set up (hello@runexpression.com)
- [ ] Team briefed on launch plan
- [ ] Monitoring dashboard open and ready
- [ ] Incident response plan documented

---

### Launch Day

**Morning:**
- [ ] Final smoke test on production
- [ ] Monitor Sentry for errors
- [ ] Check analytics setup

**Launch Moment:**
- [ ] Flip DNS to production (if needed)
- [ ] Post launch announcement on social media
- [ ] Send email to waitlist/subscribers
- [ ] Monitor traffic, errors, user feedback in real-time

**Evening:**
- [ ] Review analytics (traffic, events, conversions)
- [ ] Check for any critical bugs
- [ ] Respond to user feedback
- [ ] Celebrate! 🎉

---

### Post-Launch (First Week)

**Daily:**
- [ ] Monitor error logs (Sentry)
- [ ] Review analytics (traffic sources, key events)
- [ ] Moderate Flow submissions
- [ ] Moderate clubhouse uploads
- [ ] Respond to user feedback

**Week 1 End:**
- [ ] Run retrospective with team
- [ ] Document bugs and feature requests
- [ ] Prioritize V1.1 features
- [ ] Plan next sprint

---

## Document Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-14 | 1.0 | Initial implementation plan | Engineering Team |

---

**Next:** Review [06-DATA-SCHEMA.md](./06-DATA-SCHEMA.md) for complete database schema and migrations.
