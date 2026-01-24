# RunExpression V1 - Linear Epics & Stories

## Overview
This document outlines all epics and stories needed to complete RunExpression V1, based on the specifications in `docs/specs/`.

---

## Epic 1: Foundation & Infrastructure

### Story 1.1: Project Setup & Configuration
**Description:** Initialize Next.js 14+ project with App Router, TypeScript, and core dependencies
**Acceptance Criteria:**
- [ ] Next.js 14+ project initialized with App Router
- [ ] TypeScript configured with strict mode
- [ ] Tailwind CSS + shadcn/ui installed and configured
- [ ] ESLint and Prettier configured
- [ ] Git repository initialized with .gitignore
- [ ] Environment variables structure defined (.env.example)
- [ ] Package.json scripts configured (dev, build, lint, type-check)

**Labels:** `foundation`, `setup`
**Priority:** P0 (Critical)

### Story 1.2: Supabase Project Setup
**Description:** Create and configure Supabase project with initial database structure
**Acceptance Criteria:**
- [ ] Supabase project created
- [ ] Database connection established
- [ ] Supabase client utilities created (client.ts, server.ts, admin.ts)
- [ ] Environment variables configured for Supabase
- [ ] Database types generated (`npm run db:types`)
- [ ] Row Level Security (RLS) enabled on all tables

**Labels:** `foundation`, `backend`
**Priority:** P0 (Critical)

### Story 1.3: Design System & Theme Configuration
**Description:** Establish RunExpression brand design system with Tailwind and shadcn/ui
**Acceptance Criteria:**
- [ ] Custom Tailwind theme configured (sage green, purple, cream colors)
- [ ] Typography system configured (DM Mono, Merriweather)
- [ ] shadcn/ui components installed and customized
- [ ] Custom CSS variables for brand colors defined
- [ ] Animation utilities configured (Framer Motion)
- [ ] Accessibility settings (reduced motion support)

**Labels:** `foundation`, `design`
**Priority:** P0 (Critical)

### Story 1.4: Core Database Schema Migration
**Description:** Create initial database migration with core tables
**Acceptance Criteria:**
- [ ] `users`/`profiles` table created
- [ ] `clubs` table created
- [ ] `club_memberships` table created
- [ ] `expression_events` table created (for The Flow)
- [ ] `club_contributions` table created (for Clubhouse)
- [ ] `products` table created (for Shop)
- [ ] All RLS policies defined
- [ ] Indexes created on foreign keys
- [ ] Migration tested on staging

**Labels:** `foundation`, `database`
**Priority:** P0 (Critical)

### Story 1.5: Middleware & Route Protection
**Description:** Set up Next.js middleware for auth and route protection
**Acceptance Criteria:**
- [ ] Supabase auth middleware configured
- [ ] Protected routes identified (clubhouse, admin)
- [ ] Auth callback routes created
- [ ] Session refresh logic implemented
- [ ] Redirect logic for unauthenticated users

**Labels:** `foundation`, `auth`
**Priority:** P0 (Critical)

---

## Epic 2: Homepage & Manifesto Experience

### Story 2.1: Homepage Layout & Structure
**Description:** Create homepage with scroll-driven manifesto structure
**Acceptance Criteria:**
- [ ] Hero section with H1 "Make running mean more"
- [ ] Scroll-driven layout structure implemented
- [ ] Mobile-responsive layout
- [ ] Navigation header with logo and menu
- [ ] Footer with links and social media
- [ ] Smooth scroll behavior configured

**Labels:** `homepage`, `frontend`
**Priority:** P0 (Critical)

### Story 2.2: Hero Section with Primary CTA
**Description:** Implement hero section with strong visual identity and CTAs
**Acceptance Criteria:**
- [ ] H1: "Make running mean more"
- [ ] Sub-headline: "Turn your struggle into art and feed the running community with your story"
- [ ] Primary CTA: "Enter the Flow" (links to canvas)
- [ ] Secondary CTA: "Visit the Clubhouse" (links to DWTC)
- [ ] Background texture/noise effect
- [ ] Typography styling matches brand
- [ ] Mobile-optimized button stacking

**Labels:** `homepage`, `frontend`, `design`
**Priority:** P0 (Critical)

### Story 2.3: Chapter 01 - Motion Creates Emotion
**Description:** Implement first manifesto chapter with scroll reveal
**Acceptance Criteria:**
- [ ] Headline: "Leave heavy. Return light."
- [ ] Body copy implemented
- [ ] Scroll-triggered fade-in animation
- [ ] Background imagery/texture
- [ ] Soft prompt link: "Explore the Mindset"
- [ ] Section visible at correct breakpoint

**Labels:** `homepage`, `frontend`, `animation`
**Priority:** P1 (High)

### Story 2.4: Chapter 02 - Process Over Outcome
**Description:** Implement second manifesto chapter
**Acceptance Criteria:**
- [ ] Headline: "We take our fun very seriously"
- [ ] Body copy implemented
- [ ] Scroll-triggered animation
- [ ] Soft prompt link: "Embrace the Grind"
- [ ] Section spacing and rhythm correct

**Labels:** `homepage`, `frontend`, `animation`
**Priority:** P1 (High)

### Story 2.5: Chapter 03 - Interdependence
**Description:** Implement third manifesto chapter
**Acceptance Criteria:**
- [ ] Headline: "Your squad is your battery pack"
- [ ] Body copy implemented
- [ ] Scroll-triggered animation
- [ ] Soft prompt link: "Find Your Crew"
- [ ] Visual treatment consistent with brand

**Labels:** `homepage`, `frontend`, `animation`
**Priority:** P1 (High)

### Story 2.6: Chapter 04 - Living Laboratory
**Description:** Implement fourth manifesto chapter
**Acceptance Criteria:**
- [ ] Headline: "Enlightenment smells like laundry"
- [ ] Body copy implemented
- [ ] Scroll-triggered animation
- [ ] Soft prompt link: "Bring It to Life"
- [ ] Section closes manifesto flow appropriately

**Labels:** `homepage`, `frontend`, `animation`
**Priority:** P1 (High)

### Story 2.7: The Flow Preview Strip
**Description:** Implement live preview of Flow submissions on homepage
**Acceptance Criteria:**
- [ ] Section title: "What are we running for today?"
- [ ] Live feed of recent expression_events
- [ ] Horizontal auto-scroll or carousel
- [ ] Touch-swipeable on mobile
- [ ] Realtime updates via Supabase Realtime
- [ ] Sample data displayed when no submissions

**Labels:** `homepage`, `frontend`, `realtime`
**Priority:** P1 (High)

### Story 2.8: DWTC Clubhouse Teaser
**Description:** Implement clubhouse teaser section on homepage
**Acceptance Criteria:**
- [ ] Section title: "Welcome to the Laboratory"
- [ ] Body copy about clubhouse
- [ ] CTA button: "Visit the Clubhouse"
- [ ] Visual treatment (black and white, high grain photography)
- [ ] Section feels distinct but cohesive

**Labels:** `homepage`, `frontend`, `design`
**Priority:** P1 (High)

### Story 2.9: Homepage Performance Optimization
**Description:** Optimize homepage for Core Web Vitals
**Acceptance Criteria:**
- [ ] LCP < 2s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized (WebP, next/image)
- [ ] Framer Motion animations optimized
- [ ] Lazy loading for below-the-fold content
- [ ] Lighthouse score > 90

**Labels:** `homepage`, `performance`
**Priority:** P1 (High)

---

## Epic 3: The Flow (Interactive Canvas)

### Story 3.1: Canvas Page Layout & Navigation
**Description:** Create main canvas page with navigation and structure
**Acceptance Criteria:**
- [ ] Route `/flow` or `/canvas` created
- [ ] Page layout with header and footer
- [ ] Main prompt: "What did your run express today?"
- [ ] Helper text: "It doesn't have to be pretty. Just honest."
- [ ] Mobile-responsive layout

**Labels:** `flow`, `frontend`
**Priority:** P0 (Critical)

### Story 3.2: Expression Submission - Text Input
**Description:** Implement text-based expression submission
**Acceptance Criteria:**
- [ ] Multi-line text input (500-1000 char limit)
- [ ] Character counter
- [ ] Vibe tag selection (5 max)
- [ ] Optional: mood, distance metadata
- [ ] Form validation
- [ ] Submit button with loading state

**Labels:** `flow`, `frontend`, `forms`
**Priority:** P0 (Critical)

### Story 3.3: Expression Submission - Image Upload
**Description:** Implement image upload for expressions
**Acceptance Criteria:**
- [ ] Drag-and-drop or click-to-upload
- [ ] Image preview before submission
- [ ] Client-side compression (compressorjs)
- [ ] File size validation (< 5MB)
- [ ] Caption input field
- [ ] Vibe tag selection
- [ ] Upload to Supabase Storage

**Labels:** `flow`, `frontend`, `upload`
**Priority:** P0 (Critical)

### Story 3.4: Sticker Studio with Fabric.js
**Description:** Implement sticker/filter studio for image customization
**Acceptance Criteria:**
- [ ] Fabric.js canvas initialized
- [ ] Base image loaded as background
- [ ] Sticker picker UI (logo, tape, badges)
- [ ] Drag, rotate, resize sticker controls
- [ ] Filter options (B&W, sepia, normal)
- [ ] Delete selected sticker
- [ ] Export composite image to blob
- [ ] Mobile touch support

**Labels:** `flow`, `frontend`, `canvas`
**Priority:** P1 (High)

### Story 3.5: Expression Submission - Backend API
**Description:** Create API endpoint for expression submission
**Acceptance Criteria:**
- [ ] POST `/api/expressions/create` endpoint
- [ ] User authentication check
- [ ] Payload validation (text, media_url, vibe_tags)
- [ ] OpenAI Moderation API integration
- [ ] Insert into `expression_events` table
- [ ] Set `moderation_status` based on trust_score
- [ ] Return success/error response
- [ ] Error handling and logging

**Labels:** `flow`, `backend`, `api`
**Priority:** P0 (Critical)

### Story 3.6: The Flow Wall - Masonry Layout
**Description:** Display all approved expressions in masonry grid
**Acceptance Criteria:**
- [ ] Masonry grid layout (react-masonry-css)
- [ ] Load approved `expression_events` from Supabase
- [ ] Display text and/or image
- [ ] Show first name/handle and timestamp
- [ ] Hover/tap effects on tiles
- [ ] Empty state with sample expressions
- [ ] Pagination or infinite scroll

**Labels:** `flow`, `frontend`, `layout`
**Priority:** P0 (Critical)

### Story 3.7: Realtime Flow Updates
**Description:** Implement realtime updates when new expressions are added
**Acceptance Criteria:**
- [ ] Supabase Realtime subscription to `expression_events`
- [ ] New tiles animate into the wall
- [ ] Smooth transition animation
- [ ] No page refresh required
- [ ] Handle connection errors gracefully

**Labels:** `flow`, `frontend`, `realtime`
**Priority:** P1 (High)

### Story 3.8: Submission Confirmation & Feedback
**Description:** Show user feedback after submission
**Acceptance Criteria:**
- [ ] Success message: "Your run just joined the Flow"
- [ ] Animation of new tile drifting into wall
- [ ] Options: "See the wall", "Share", "Sign up/log in"
- [ ] Optimistic UI for logged-in users
- [ ] Pending state message for new users

**Labels:** `flow`, `frontend`, `ux`
**Priority:** P1 (High)

### Story 3.9: Vibe Tag Taxonomy & Selection
**Description:** Implement vibe tag system for expression categorization
**Acceptance Criteria:**
- [ ] Vibe tags defined in `lib/constants.ts`
- [ ] Categories: Mindset, Context, Feeling
- [ ] Tag picker UI component
- [ ] Max 5 tags per expression
- [ ] Tags stored in `expression_events.vibe_tags` array
- [ ] Tags displayed on expression tiles

**Labels:** `flow`, `frontend`, `taxonomy`
**Priority:** P1 (High)

---

## Epic 4: DWTC Clubhouse

### Story 4.1: Clubhouse Route & Auth Gating
**Description:** Create clubhouse route with member-only access
**Acceptance Criteria:**
- [ ] Route `/club/dwtc` created
- [ ] Auth middleware protects route
- [ ] Redirect to login if not authenticated
- [ ] Check `club_memberships` table for access
- [ ] "Access Denied" page for non-members

**Labels:** `clubhouse`, `auth`
**Priority:** P0 (Critical)

### Story 4.2: Clubhouse Navigation & Layout
**Description:** Build clubhouse layout with navigation
**Acceptance Criteria:**
- [ ] Top-level navigation: Overview, Lore, Media, Resources
- [ ] Persistent "Add to Archive" button
- [ ] Club-specific branding (DWTC colors, logo)
- [ ] Mobile-responsive sidebar or tabs
- [ ] Footer consistent with main site

**Labels:** `clubhouse`, `frontend`
**Priority:** P0 (Critical)

### Story 4.3: Overview Page
**Description:** Create clubhouse overview/dashboard
**Acceptance Criteria:**
- [ ] Hero band with club photo
- [ ] Brief "who we are" story
- [ ] Carousel of recent contributions
- [ ] Featured/pinned content
- [ ] Upcoming events/highlights
- [ ] Navigation to all sections

**Labels:** `clubhouse`, `frontend`
**Priority:** P0 (Critical)

### Story 4.4: Lore & Stories Section
**Description:** Display club lore, race recaps, and stories
**Acceptance Criteria:**
- [ ] Card-based layout for stories
- [ ] Filter by tag, year, event
- [ ] Load from `club_contributions` where `type='story'`
- [ ] Story detail view (title, body, media, author)
- [ ] Inline "Add yours" prompt
- [ ] Empty state with invitation to contribute

**Labels:** `clubhouse`, `frontend`
**Priority:** P1 (High)

### Story 4.5: Media Archive Gallery
**Description:** Display photos and videos in browsable gallery
**Acceptance Criteria:**
- [ ] Masonry/grid layout for media
- [ ] Load from `club_contributions` where `type='media'`
- [ ] Filter by tag, event, date
- [ ] Lightbox view on click
- [ ] Captions and contributor attribution
- [ ] Hover/tap states
- [ ] Inline "Captured a shot?" prompt

**Labels:** `clubhouse`, `frontend`
**Priority:** P1 (High)

### Story 4.6: Resources Section
**Description:** Display club resources (PDFs, training plans, routes)
**Acceptance Criteria:**
- [ ] Grid/list of documents
- [ ] Load from `club_contributions` where `type='document'`
- [ ] File type icons (PDF, JPG, etc.)
- [ ] Title and description
- [ ] Download functionality
- [ ] Filter/search capability

**Labels:** `clubhouse`, `frontend`
**Priority:** P1 (High)

### Story 4.7: Contribution Upload - Choose Type
**Description:** Multi-step contribution flow - step 1
**Acceptance Criteria:**
- [ ] "Add to Archive" button launches modal/page
- [ ] Three cards: Story, Photo/Video, Document
- [ ] Visual distinction between types
- [ ] Next step on selection

**Labels:** `clubhouse`, `frontend`, `upload`
**Priority:** P0 (Critical)

### Story 4.8: Contribution Upload - Story Input
**Description:** Story contribution form
**Acceptance Criteria:**
- [ ] Title input (required)
- [ ] Body text area (required, rich text optional)
- [ ] Optional media attachment
- [ ] Tag selection
- [ ] Event/date picker
- [ ] Preview before submit

**Labels:** `clubhouse`, `frontend`, `forms`
**Priority:** P0 (Critical)

### Story 4.9: Contribution Upload - Photo/Video Input
**Description:** Media contribution form
**Acceptance Criteria:**
- [ ] Drag-and-drop or click-to-upload
- [ ] Multiple files supported
- [ ] Client-side compression
- [ ] Caption input (required)
- [ ] Tag selection
- [ ] Event/date picker
- [ ] Preview thumbnails

**Labels:** `clubhouse`, `frontend`, `upload`
**Priority:** P0 (Critical)

### Story 4.10: Contribution Upload - Document Input
**Description:** Document contribution form
**Acceptance Criteria:**
- [ ] File upload (PDF, DOC, etc.)
- [ ] File size validation (< 50MB)
- [ ] Title input (required)
- [ ] Description textarea
- [ ] Tag selection
- [ ] Preview file name and size

**Labels:** `clubhouse`, `frontend`, `upload`
**Priority:** P1 (High)

### Story 4.11: Contribution Upload - Backend API
**Description:** Create API endpoint for clubhouse contributions
**Acceptance Criteria:**
- [ ] POST `/api/club_contributions/create` endpoint
- [ ] Verify club membership
- [ ] Upload media to Supabase Storage
- [ ] Insert into `club_contributions` table
- [ ] Set `moderation_status = pending`
- [ ] Return success with contribution ID
- [ ] Error handling

**Labels:** `clubhouse`, `backend`, `api`
**Priority:** P0 (Critical)

### Story 4.12: Contribution Confirmation & Feedback
**Description:** Post-upload user feedback
**Acceptance Criteria:**
- [ ] Success message: "Your story just joined the DWTC archive"
- [ ] Link to where it will appear
- [ ] Note about approval process
- [ ] Options to add another or view archive

**Labels:** `clubhouse`, `frontend`, `ux`
**Priority:** P1 (High)

---

## Epic 5: Authentication & User Management

### Story 5.1: Auth Pages - Login
**Description:** Create login page with Supabase Auth
**Acceptance Criteria:**
- [ ] Route `/login` created
- [ ] Email/password login form
- [ ] Magic link option
- [ ] Social auth (Google optional)
- [ ] "Forgot password" link
- [ ] Error handling and validation
- [ ] Redirect to origin page after login

**Labels:** `auth`, `frontend`
**Priority:** P0 (Critical)

### Story 5.2: Auth Pages - Signup
**Description:** Create signup page
**Acceptance Criteria:**
- [ ] Route `/signup` created
- [ ] Email, password, full_name fields
- [ ] Password strength indicator
- [ ] Terms of service checkbox
- [ ] Email verification flow
- [ ] Redirect to onboarding after signup

**Labels:** `auth`, `frontend`
**Priority:** P0 (Critical)

### Story 5.3: User Onboarding Flow
**Description:** Onboarding after first signup
**Acceptance Criteria:**
- [ ] Welcome screen
- [ ] Profile setup (full_name, avatar optional)
- [ ] 3 questions: "Current Goal", "Why do you run?", "Zip Code"
- [ ] Save to `profiles.expression_data` JSONB
- [ ] Complete onboarding and redirect to homepage

**Labels:** `auth`, `frontend`, `onboarding`
**Priority:** P1 (High)

### Story 5.4: User Profile Page
**Description:** User profile view and edit
**Acceptance Criteria:**
- [ ] Route `/profile` or `/settings`
- [ ] Display user info from `profiles`
- [ ] Edit full_name, avatar
- [ ] View expression history
- [ ] View clubhouse contributions
- [ ] Update profile API endpoint

**Labels:** `auth`, `frontend`
**Priority:** P2 (Medium)

### Story 5.5: Password Reset Flow
**Description:** Implement password reset
**Acceptance Criteria:**
- [ ] "Forgot password" link on login
- [ ] Email input for reset request
- [ ] Send magic link via Supabase
- [ ] Reset password page
- [ ] Confirmation message

**Labels:** `auth`, `frontend`
**Priority:** P2 (Medium)

### Story 5.6: Trust Score System
**Description:** Implement user trust scoring for moderation
**Acceptance Criteria:**
- [ ] `trust_score` field on `users` table
- [ ] Increment on approved expression
- [ ] Auto-approve logic for trust_score > threshold
- [ ] Admin ability to adjust trust_score

**Labels:** `auth`, `backend`, `moderation`
**Priority:** P1 (High)

---

## Epic 6: Content Moderation

### Story 6.1: OpenAI Moderation API Integration
**Description:** Integrate OpenAI Moderation API for content safety
**Acceptance Criteria:**
- [ ] OpenAI API key configured
- [ ] API wrapper function in `lib/moderation.ts`
- [ ] Check text content before saving
- [ ] Handle hate speech, harassment, self-harm flags
- [ ] Hard reject if flagged
- [ ] Log moderation results

**Labels:** `moderation`, `backend`, `api`
**Priority:** P0 (Critical)

### Story 6.2: Moderation Queue - Backend
**Description:** Create moderation status system in database
**Acceptance Criteria:**
- [ ] `moderation_status` enum: pending, approved, rejected, flagged
- [ ] `visibility_score` field (0=hidden, 10=public, 100=featured)
- [ ] Default new submissions to `pending`
- [ ] Auto-approve for trusted users
- [ ] API endpoint to update moderation status

**Labels:** `moderation`, `backend`
**Priority:** P0 (Critical)

### Story 6.3: Admin Moderation Dashboard
**Description:** Build admin UI for content moderation
**Acceptance Criteria:**
- [ ] Route `/admin/moderation` (admin-only)
- [ ] List pending expressions and contributions
- [ ] Preview content (text, image, metadata)
- [ ] Approve, Reject, Flag buttons
- [ ] Batch actions support
- [ ] Filter by type, date
- [ ] Pagination

**Labels:** `moderation`, `frontend`, `admin`
**Priority:** P1 (High)

### Story 6.4: Admin Action Logging
**Description:** Log all admin moderation actions
**Acceptance Criteria:**
- [ ] Create `admin_actions` table
- [ ] Log approve/reject/flag actions
- [ ] Include admin_id, target_id, action, timestamp
- [ ] Admin view of action history

**Labels:** `moderation`, `backend`, `admin`
**Priority:** P2 (Medium)

---

## Epic 7: Shop & Commerce

### Story 7.1: Stripe Account Setup
**Description:** Set up Stripe account and webhook endpoints
**Acceptance Criteria:**
- [ ] Stripe account created
- [ ] API keys configured (test and live)
- [ ] Webhook endpoint created `/api/webhooks/stripe`
- [ ] Webhook signature verification
- [ ] Handle `checkout.session.completed` event

**Labels:** `shop`, `backend`, `payments`
**Priority:** P1 (High)

### Story 7.2: Products Database & Seeding
**Description:** Create products table and seed initial products
**Acceptance Criteria:**
- [ ] `products` table with fields: name, description, price, images, stripe_price_id
- [ ] Seed data: greeting cards, t-shirts, digital products
- [ ] API endpoint to list products
- [ ] Product images stored in Supabase Storage

**Labels:** `shop`, `backend`, `database`
**Priority:** P1 (High)

### Story 7.3: Shop Product Listing Page
**Description:** Display products in grid layout
**Acceptance Criteria:**
- [ ] Route `/shop` created
- [ ] Product cards with image, name, price
- [ ] Filter by type (physical, digital)
- [ ] Click to product detail page

**Labels:** `shop`, `frontend`
**Priority:** P1 (High)

### Story 7.4: Product Detail Page
**Description:** Individual product detail view
**Acceptance Criteria:**
- [ ] Route `/shop/[slug]` or `/shop/[id]`
- [ ] Product image gallery
- [ ] Name, description, price
- [ ] Add to cart button
- [ ] Variant selection (size, color) if applicable

**Labels:** `shop`, `frontend`
**Priority:** P1 (High)

### Story 7.5: Shopping Cart Functionality
**Description:** Client-side cart management
**Acceptance Criteria:**
- [ ] Cart state management (Context or Zustand)
- [ ] Add/remove items
- [ ] Persistent cart (localStorage)
- [ ] Cart icon with item count in header
- [ ] Cart drawer/modal to view items

**Labels:** `shop`, `frontend`
**Priority:** P1 (High)

### Story 7.6: Stripe Checkout Integration
**Description:** Redirect to Stripe hosted checkout
**Acceptance Criteria:**
- [ ] API endpoint `/api/checkout/create-session`
- [ ] Create Stripe checkout session with cart items
- [ ] Redirect to Stripe hosted page
- [ ] Success and cancel URLs configured
- [ ] Order record created in database

**Labels:** `shop`, `backend`, `payments`
**Priority:** P1 (High)

### Story 7.7: Order Confirmation & Thank You Page
**Description:** Post-purchase confirmation
**Acceptance Criteria:**
- [ ] Route `/shop/thank-you` or `/order/[id]`
- [ ] Display order details
- [ ] Confirmation message
- [ ] Email receipt sent
- [ ] Digital product delivery link (if applicable)

**Labels:** `shop`, `frontend`
**Priority:** P1 (High)

---

## Epic 8: AI Coach Hooks & Waitlist

### Story 8.1: Define AI Coach Narrative & Copy
**Description:** Write copy for AI coach touchpoints across site
**Acceptance Criteria:**
- [ ] 2-3 sentence description of AI coach vision
- [ ] Homepage section copy
- [ ] Canvas page note copy
- [ ] Clubhouse mention copy
- [ ] Brand voice review completed

**Labels:** `ai-coach`, `content`
**Priority:** P2 (Medium)

### Story 8.2: Homepage AI Coach Teaser Section
**Description:** Add AI coach section to homepage
**Acceptance Criteria:**
- [ ] Section title: "The Coach That Knows Your Miles and Your Stories"
- [ ] 2-3 lines of copy
- [ ] CTA: "Join the coach waitlist"
- [ ] Scroll anchor ID for tracking
- [ ] Mobile-responsive

**Labels:** `ai-coach`, `frontend`, `homepage`
**Priority:** P2 (Medium)

### Story 8.3: Canvas AI Coach Note
**Description:** Add AI coach mention on canvas page
**Acceptance Criteria:**
- [ ] Inline note near input: "These stories will help shape the future RunExpression AI coach"
- [ ] Tooltip or info icon optional
- [ ] Visible on all breakpoints
- [ ] Analytics event on view

**Labels:** `ai-coach`, `frontend`, `flow`
**Priority:** P2 (Medium)

### Story 8.4: Clubhouse AI Coach Callout
**Description:** Add AI coach mention in clubhouse
**Acceptance Criteria:**
- [ ] Copy block explaining future coach tie-in
- [ ] Placed near lore or training section
- [ ] Optional CTA to waitlist
- [ ] Consistent visual design

**Labels:** `ai-coach`, `frontend`, `clubhouse`
**Priority:** P2 (Medium)

### Story 8.5: Waitlist Form UI
**Description:** Create waitlist signup form
**Acceptance Criteria:**
- [ ] Route `/coach` or `/waitlist`
- [ ] Email input (required)
- [ ] "What are you running for?" textarea (optional)
- [ ] "What guidance do you want?" textarea (optional)
- [ ] Submit button
- [ ] Success message: "You're in the lab now..."
- [ ] Error handling

**Labels:** `ai-coach`, `frontend`, `forms`
**Priority:** P2 (Medium)

### Story 8.6: Waitlist Backend & Storage
**Description:** Create waitlist API and database
**Acceptance Criteria:**
- [ ] `ai_coach_waitlist` table: email, why_running, coach_expectations, source, created_at
- [ ] POST `/api/waitlist/create` endpoint
- [ ] Rate limiting
- [ ] Duplicate email handling
- [ ] Admin view to export waitlist

**Labels:** `ai-coach`, `backend`
**Priority:** P2 (Medium)

### Story 8.7: AI Coach Analytics Events
**Description:** Track AI coach touchpoint engagement
**Acceptance Criteria:**
- [ ] Events defined: teaser_viewed_homepage, teaser_viewed_canvas, teaser_viewed_clubhouse, waitlist_opened, waitlist_submitted
- [ ] Event tracking helper function
- [ ] Events fire on viewport visibility or click
- [ ] Verify events in analytics tool

**Labels:** `ai-coach`, `analytics`
**Priority:** P2 (Medium)

---

## Epic 9: Blog & Content Library

### Story 9.1: MDX Setup & Configuration
**Description:** Configure MDX for blog content
**Acceptance Criteria:**
- [ ] `next-mdx-remote` installed
- [ ] MDX components configured
- [ ] `content/` directory structure
- [ ] Frontmatter parsing (title, date, author, tags)
- [ ] Syntax highlighting configured

**Labels:** `blog`, `content`
**Priority:** P2 (Medium)

### Story 9.2: Blog Listing Page
**Description:** Display all blog posts
**Acceptance Criteria:**
- [ ] Route `/blog` or `/library`
- [ ] List all posts from `content/`
- [ ] Post card: title, excerpt, date, author
- [ ] Filter by tag/category
- [ ] Pagination or load more

**Labels:** `blog`, `frontend`
**Priority:** P2 (Medium)

### Story 9.3: Blog Post Detail Page
**Description:** Individual blog post view
**Acceptance Criteria:**
- [ ] Route `/blog/[slug]`
- [ ] Render MDX content
- [ ] Post metadata (title, date, author)
- [ ] Table of contents (optional)
- [ ] Share buttons
- [ ] Related posts

**Labels:** `blog`, `frontend`
**Priority:** P2 (Medium)

### Story 9.4: Seed Blog Content
**Description:** Create initial blog posts
**Acceptance Criteria:**
- [ ] 3-5 initial blog posts written
- [ ] Content matches brand voice
- [ ] Images optimized and included
- [ ] SEO metadata for each post

**Labels:** `blog`, `content`
**Priority:** P2 (Medium)

---

## Epic 10: Testing & QA

### Story 10.1: Unit Tests - Core Utilities
**Description:** Write unit tests for utility functions
**Acceptance Criteria:**
- [ ] Test Supabase client utilities
- [ ] Test form validation functions
- [ ] Test data transformation utilities
- [ ] Test coverage > 80% for utils

**Labels:** `testing`, `unit-tests`
**Priority:** P2 (Medium)

### Story 10.2: Integration Tests - API Routes
**Description:** Test all API endpoints
**Acceptance Criteria:**
- [ ] Test expression submission API
- [ ] Test club contribution API
- [ ] Test moderation API
- [ ] Test checkout API
- [ ] Test error handling

**Labels:** `testing`, `integration-tests`
**Priority:** P1 (High)

### Story 10.3: E2E Tests - Critical User Flows
**Description:** Playwright tests for main user journeys
**Acceptance Criteria:**
- [ ] Homepage → Canvas submission flow
- [ ] Login → Clubhouse → Upload flow
- [ ] Shop → Checkout flow
- [ ] AI Coach waitlist flow
- [ ] Tests run in CI/CD

**Labels:** `testing`, `e2e`
**Priority:** P1 (High)

### Story 10.4: Accessibility Testing
**Description:** Ensure WCAG 2.1 AA compliance
**Acceptance Criteria:**
- [ ] Axe-core automated scans
- [ ] Manual keyboard navigation testing
- [ ] Screen reader testing (NVDA/VoiceOver)
- [ ] Color contrast verification
- [ ] Focus states visible
- [ ] Alt text on all images

**Labels:** `testing`, `accessibility`
**Priority:** P1 (High)

### Story 10.5: Performance Testing
**Description:** Optimize and test performance
**Acceptance Criteria:**
- [ ] Lighthouse scores > 90 on all pages
- [ ] Core Web Vitals passing (LCP, FID, CLS)
- [ ] Bundle size analysis
- [ ] Image optimization verification
- [ ] Load testing for 100+ concurrent users

**Labels:** `testing`, `performance`
**Priority:** P1 (High)

### Story 10.6: Cross-browser & Device Testing
**Description:** Test on multiple browsers and devices
**Acceptance Criteria:**
- [ ] Chrome, Firefox, Safari, Edge tested
- [ ] Mobile: iOS Safari, Chrome Android
- [ ] Tablet: iPad, Android tablet
- [ ] Responsive breakpoints verified
- [ ] Touch interactions working

**Labels:** `testing`, `cross-browser`
**Priority:** P1 (High)

---

## Epic 11: Deployment & DevOps

### Story 11.1: Vercel Project Setup
**Description:** Configure Vercel deployment
**Acceptance Criteria:**
- [ ] Vercel project created
- [ ] GitHub repo connected
- [ ] Environment variables configured
- [ ] Preview deployments enabled
- [ ] Production domain configured

**Labels:** `devops`, `deployment`
**Priority:** P0 (Critical)

### Story 11.2: CI/CD Pipeline
**Description:** Set up automated build and test pipeline
**Acceptance Criteria:**
- [ ] GitHub Actions workflow created
- [ ] Run linting on PR
- [ ] Run type checking on PR
- [ ] Run tests on PR
- [ ] Auto-deploy to preview on PR
- [ ] Auto-deploy to production on merge to main

**Labels:** `devops`, `ci-cd`
**Priority:** P0 (Critical)

### Story 11.3: Environment Configuration
**Description:** Set up staging and production environments
**Acceptance Criteria:**
- [ ] Staging environment on Vercel
- [ ] Production environment on Vercel
- [ ] Separate Supabase projects for staging/prod
- [ ] Environment variables documented
- [ ] Secrets management configured

**Labels:** `devops`, `configuration`
**Priority:** P0 (Critical)

### Story 11.4: Error Monitoring Setup
**Description:** Configure Sentry for error tracking
**Acceptance Criteria:**
- [ ] Sentry project created
- [ ] Sentry SDK installed and configured
- [ ] Client-side error tracking
- [ ] Server-side error tracking
- [ ] Source maps uploaded
- [ ] Alert notifications configured

**Labels:** `devops`, `monitoring`
**Priority:** P1 (High)

### Story 11.5: Analytics Setup
**Description:** Configure analytics tracking
**Acceptance Criteria:**
- [ ] Analytics tool selected (GA4, Amplitude, PostHog)
- [ ] Tracking code installed
- [ ] Key events defined and tracked
- [ ] Custom dimensions configured
- [ ] Dashboard created

**Labels:** `devops`, `analytics`
**Priority:** P1 (High)

### Story 11.6: Database Backup Strategy
**Description:** Set up automated database backups
**Acceptance Criteria:**
- [ ] Supabase automatic backups enabled
- [ ] Backup retention policy defined
- [ ] Restore procedure documented
- [ ] Test backup restoration

**Labels:** `devops`, `database`
**Priority:** P1 (High)

### Story 11.7: Monitoring & Alerting
**Description:** Set up uptime and performance monitoring
**Acceptance Criteria:**
- [ ] Uptime monitoring configured (Vercel or external)
- [ ] Alert notifications for downtime
- [ ] Performance monitoring
- [ ] Database query performance monitoring
- [ ] Disk space and resource alerts

**Labels:** `devops`, `monitoring`
**Priority:** P1 (High)

---

## Epic 12: Content & Brand

### Story 12.1: Copy Review & Brand Voice Alignment
**Description:** Review all site copy for brand voice consistency
**Acceptance Criteria:**
- [ ] All user-facing text reviewed
- [ ] "Sage in the Parking Lot" voice maintained
- [ ] Error messages humanized
- [ ] Success messages celebrate authentically
- [ ] Content review completed by stakeholder

**Labels:** `content`, `brand`
**Priority:** P1 (High)

### Story 12.2: Visual Assets & Photography
**Description:** Gather and optimize all visual assets
**Acceptance Criteria:**
- [ ] Homepage hero image/texture
- [ ] Clubhouse photography
- [ ] Sticker assets for canvas
- [ ] Logo variants (light, dark)
- [ ] All images optimized (WebP)
- [ ] Alt text written

**Labels:** `content`, `design`
**Priority:** P1 (High)

### Story 12.3: SEO Optimization
**Description:** Optimize site for search engines
**Acceptance Criteria:**
- [ ] Meta titles and descriptions for all pages
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Schema.org markup (Organization, Article)

**Labels:** `content`, `seo`
**Priority:** P1 (High)

### Story 12.4: Legal Pages
**Description:** Create required legal pages
**Acceptance Criteria:**
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Cookie Policy (if using cookies)
- [ ] Content linked in footer
- [ ] Legal review completed

**Labels:** `content`, `legal`
**Priority:** P1 (High)

---

## Priority Summary

### P0 (Critical) - Must Have for V1 Launch
- Foundation & infrastructure setup
- Database schema & migrations
- Homepage hero & structure
- The Flow canvas (text & image)
- Clubhouse basic structure & upload
- Authentication system
- Content moderation integration
- Deployment pipeline

### P1 (High) - Core V1 Features
- All manifesto chapters
- Sticker studio for canvas
- Full clubhouse sections (lore, media, resources)
- Shop with Stripe integration
- Admin moderation dashboard
- Testing suite (E2E, accessibility, performance)
- Error monitoring & analytics

### P2 (Medium) - Enhanced Features
- AI Coach waitlist & hooks
- Blog/library functionality
- User profile management
- Advanced analytics events
- Additional moderation features

---

## Suggested Linear Projects

Organize these into Linear projects:

1. **Foundation** (Epic 1)
2. **Homepage** (Epic 2)
3. **The Flow** (Epic 3)
4. **DWTC Clubhouse** (Epic 4)
5. **Auth & Users** (Epic 5)
6. **Moderation** (Epic 6)
7. **Shop** (Epic 7)
8. **AI Coach Hooks** (Epic 8)
9. **Content** (Epic 9, 12)
10. **Testing & QA** (Epic 10)
11. **DevOps** (Epic 11)

---

## Estimation Guidelines

**Story Points:**
- **1 point:** Simple UI component, config change (~2-4 hours)
- **2 points:** Standard page/feature (~1 day)
- **3 points:** Complex page with backend (~2-3 days)
- **5 points:** Multi-component feature (~1 week)
- **8 points:** Major integration (Stripe, Fabric.js) (~2 weeks)

---

## Sprint Planning Suggestion

**Sprint 1-2 (Weeks 1-4):** Foundation + Homepage
- Complete Epic 1
- Complete Epic 2

**Sprint 3-4 (Weeks 5-8):** The Flow + Auth
- Complete Epic 3
- Complete Epic 5
- Start Epic 6

**Sprint 5-6 (Weeks 9-12):** Clubhouse
- Complete Epic 4
- Complete Epic 6

**Sprint 7-8 (Weeks 13-16):** Shop + AI Coach Hooks
- Complete Epic 7
- Complete Epic 8

**Sprint 9-10 (Weeks 17-20):** Testing, Content & Launch
- Complete Epic 9, 10, 11, 12
- Final QA and polish
- Production launch

---

## Next Steps

1. **Import this structure into Linear:**
   - Create projects for each epic
   - Create issues for each story
   - Assign story points and priorities
   - Set up sprint cycles

2. **Customize as needed:**
   - Adjust priorities based on your timeline
   - Break down large stories further
   - Add team-specific labels
   - Set dependencies between stories

3. **Start with Sprint 1:**
   - Pick P0 stories from Epic 1 & 2
   - Assign to team members
   - Begin development

---

*This document represents the full scope of work for RunExpression V1. Update as scope changes or new requirements emerge.*
