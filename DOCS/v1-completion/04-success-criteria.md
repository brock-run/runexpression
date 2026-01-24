# RunExpression V1 Success Criteria

This document defines the success criteria for each phase of V1 development. Each phase builds on the previous, with clear must-pass criteria before proceeding.

---

## V1.0 Foundation - Launch Readiness

**Target**: Production-ready foundation with homepage, clubhouse UI shells, database, and authentication framework

### Must-Pass Criteria

**Functional**:
- ✅ Homepage manifesto experience live with scroll animations
- ✅ Clubhouse route structure (`/club/dwtc/*`) accessible
- ✅ Database schema deployed with RLS policies
- 🔄 Auth signup and login forms work end-to-end
- 🔄 Protected routes redirect to login when unauthenticated
- 🔄 Password reset flow functional
- 🔄 Basic profile route (`/profile`) accessible
- 🔄 All header/footer links route correctly
- ⏳ 404 page exists
- ⏳ Environment variables validated on startup

**Technical**:
- ✅ Next.js 14 App Router configured
- ✅ Supabase clients (browser, server, admin) working
- ✅ TypeScript strict mode enabled, types generated from schema
- ✅ Tailwind CSS and Shadcn/UI components integrated
- 🔄 RLS policies tested and verified
- 🔄 Sentry error tracking configured
- 🔄 Analytics provider connected (event schema defined)

**Performance** (Homepage):
- LCP < 2.5s on 3G throttling
- FID < 100ms
- CLS < 0.1
- Lighthouse score >85 (Performance, Accessibility)

**Accessibility**:
- Keyboard navigation works on homepage and auth flows
- Focus states visible
- Color contrast meets 4.5:1 for body text
- `prefers-reduced-motion` respected

**Brand**:
- ✅ Manifesto copy implemented with "Sage in the Parking Lot" voice
- ✅ Visual system (sage green, purple glows, monospace fonts) consistent
- ✅ Clubhouse teaser reflects DWTC identity

### Success Metrics (V1.0 Launch)

**Not measured** - V1.0 is infrastructure foundation only. User engagement metrics begin with V1.1 (Flow feature).

---

## V1.1 The Flow - Feature Success

**Target**: Complete Flow submission, moderation, wall + Clubhouse backend integration

### Must-Pass Criteria

**Functional - The Flow**:
- Users can submit text expressions (500 char limit, 1-3 vibe tags)
- Users can submit image expressions (5MB max, compressed to ~400KB, caption required)
- Anonymous submissions supported (email optional)
- OpenAI moderation pipeline blocks flagged content
- Trust scoring assigns confidence levels to submissions
- Approved Flow entries appear on public wall (`/flow/wall`)
- Realtime updates work (new approved entries appear without refresh)
- Admin moderation queue (`/flow/admin`) functional
- Approve/reject actions work with audit trail
- 50+ diverse Flow entries seeded at launch

**Functional - Clubhouse**:
- Membership check middleware enforces access control
- Non-members see overview teaser, members see full content
- Lore index displays stories from `club_stories` table
- Lore detail page renders markdown content
- Media archive displays photos/videos from `club_media` + Supabase Storage
- Lightbox supports keyboard navigation (← →, Esc)
- Resources list displays downloadable files with signed URLs
- Upload portal (`/club/dwtc/upload`) stores contributions with `pending` status
- Admin moderation dashboard (`/club/dwtc/admin`) functional
- 10+ stories, 50+ photos, 3+ resources seeded

**Technical**:
- Flow submission API (`/api/flow/submit`) handles validation, moderation, storage
- Supabase Storage configured for images with RLS policies
- Supabase Realtime subscriptions working reliably
- Rate limiting on submission endpoints (10 submissions/hour per IP)
- Image compression reduces file size without major quality loss
- OpenAI API integration working with fallback for API failures
- Database queries optimized (indexed foreign keys, efficient joins)

**Performance**:
- Flow wall loads in <3s on 3G
- Infinite scroll pagination works smoothly
- Images lazy load
- Realtime updates don't cause UI jank

**Accessibility**:
- Flow submission form keyboard-navigable
- Error messages announced to screen readers
- Vibe tag selection accessible (keyboard + screen reader)
- Admin moderation queue keyboard-navigable

**Brand**:
- Flow copy aligns with "expressive running" philosophy
- Vibe tag names feel authentic to RunExpression voice
- Clubhouse content reflects DWTC culture and values

### Success Metrics (30 days post-V1.1)

**Engagement**:
- 100+ Flow submissions
- 20+ clubhouse member uploads
- >60% Flow submission approval rate (indicates moderation working well)
- <5% flagged content (indicates trust scoring effective)

**Quality**:
- <3 false positives in moderation (good content blocked)
- <1 false negative in moderation (bad content approved)
- Admin moderation response time <24 hours

**Technical**:
- Realtime uptime >99%
- Flow submission API p95 latency <2s
- OpenAI moderation API success rate >98%

---

## V1.2 Content & Commerce - Full V1 Success

**Target**: Complete content ecosystem (Blog, Shop, Tools, Waitlist, Legal)

### Must-Pass Criteria

**Functional - Blog / Library**:
- MDX pipeline renders 5+ seed posts
- Blog index (`/library`) displays posts with filtering
- Post detail pages (`/library/[slug]`) render markdown with images
- SEO meta tags and OG images present per post
- RSS feed validates and includes all posts
- Tag/category filtering works

**Functional - Shop**:
- Shop index (`/shop`) displays products from `products` table
- Product detail pages (`/shop/[slug]`) show images, descriptions, pricing
- Stripe Checkout flow completes in live mode
- Success page (`/shop/success`) confirms order
- Webhook handler (`/api/webhooks/stripe`) records orders
- Digital product delivery sends download link via email
- Physical product orders show shipping details
- 2+ products active (1 physical, 1 digital)

**Functional - Tools**:
- Pace calculator (`/tools/pace-calculator`) outputs accurate paces
- Vibe descriptors align with RunExpression brand
- CTA links to AI Coach waitlist
- Analytics event fires on tool completion

**Functional - AI Coach Waitlist**:
- Waitlist form (`/coach/waitlist`) submits to `ai_coach_waitlist` table
- Duplicate email handling works (no errors, graceful message)
- Confirmation message displays on successful submit
- Waitlist teasers visible on homepage, Flow, Clubhouse

**Functional - Legal & SEO**:
- Privacy policy page (`/privacy`) live and linked from footer
- Terms of service page (`/terms`) live and linked from footer
- `sitemap.xml` includes all routes and blog posts
- `robots.txt` configured for search engines
- JSON-LD structured data for Organization
- WCAG 2.1 AA compliance verified across all routes

**Technical**:
- Stripe webhook signature verification working
- Stripe idempotency prevents duplicate orders
- Digital download URLs expire after 24 hours
- MDX component registry supports custom Image, Code, Callout
- RSS feed auto-updates when new posts added
- Sitemap auto-updates with new blog posts and routes

**Performance**:
- All Core Web Vitals meet targets across all routes
- Blog posts LCP <2s
- Shop pages LCP <2.5s
- Tools page interactive in <1.5s

**Accessibility**:
- WCAG 2.1 AA compliance checklist 100% pass
- Keyboard navigation works on all routes
- Screen reader testing on critical flows (shop checkout, waitlist form)
- Color contrast meets 4.5:1 minimum

**Security**:
- RLS policies verified on all tables
- All forms use Zod validation
- Upload validation (size, type, content) on all file uploads
- Rate limiting on API routes
- Environment variable leak check passes
- Stripe webhook signature verification prevents spoofing

**Brand**:
- Blog copy aligns with "Sage in the Parking Lot" voice
- Shop product descriptions reflect RunExpression values
- Legal pages written in accessible, non-corporate language
- Visual system consistent across all new routes

### Success Metrics (30 days post-V1.2)

**Engagement**:
- 50+ AI Coach waitlist signups
- 10+ shop transactions (combined physical + digital)
- 1,000+ tool uses (pace calculator)
- >35% homepage scroll-to-CTA engagement
- Average session duration >2 minutes

**Revenue** (if applicable):
- $500+ in shop revenue (validates commerce framework)
- >50% digital product delivery success rate

**Content**:
- 5+ blog posts live
- >100 blog post views
- >20% blog post engagement (scroll depth >50%)

**Quality**:
- Zero security incidents
- Zero payment processing failures
- <1% form submission errors
- >95% uptime

---

## Cross-Phase Success Indicators

### Product-Market Fit Signals

**Early Validation** (V1.1):
- Organic Flow submissions (not just from team/friends)
- Repeat contributors (>20% of submitters post 2+ times)
- Clubhouse members actively uploading content
- Social sharing of Flow entries

**Momentum** (V1.2):
- Waitlist signups without paid marketing
- Blog posts shared on social media
- Shop purchases from non-team members
- Returning visitors (>30% of traffic)

### Community Health

**Positive Signals**:
- Flow moderation queue stays manageable (<50 pending items)
- Clubhouse uploads diverse (not dominated by 1-2 members)
- Low abuse/spam rates (<2% of submissions)
- Positive sentiment in user feedback

**Risk Signals** (require intervention):
- >10% of Flow submissions flagged by moderation
- Admin moderation backlog >100 items
- High bounce rate on homepage (>70%)
- Low conversion on CTAs (<5%)

---

## Launch Readiness Checklist

### Pre-V1.0 Launch
- [ ] Environment variables set in production
- [ ] Supabase production DB ready
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] Sentry configured and receiving test errors
- [ ] Analytics connected and receiving test events
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Seed data for clubhouse UI populated
- [ ] All header/footer links verified
- [ ] 404 page live
- [ ] Password reset emails sending

### Pre-V1.1 Launch
- [ ] OpenAI API key configured (production)
- [ ] Supabase Storage buckets created with RLS
- [ ] Supabase Realtime enabled on `expression_events`
- [ ] Rate limiting configured on submission endpoints
- [ ] Flow seed entries (50+) populated
- [ ] Clubhouse seed content (stories, media, resources) populated
- [ ] Admin accounts created for moderation
- [ ] Moderation workflow tested end-to-end
- [ ] Realtime subscriptions tested under load

### Pre-V1.2 Launch
- [ ] Stripe production account configured
- [ ] Stripe webhook endpoint registered and verified
- [ ] Shop products (2+) created with images
- [ ] Blog posts (5+) written and formatted
- [ ] MDX rendering tested with all custom components
- [ ] Digital product download workflow tested
- [ ] Privacy policy and terms approved by legal
- [ ] Sitemap generating correctly
- [ ] RSS feed validated
- [ ] WCAG 2.1 AA audit complete
- [ ] Performance audit complete (all routes)
- [ ] Security audit complete

---

## Definition of "Done" for Each Phase

### V1.0 Done When:
1. Homepage live and performant
2. Auth flows work end-to-end (signup, login, password reset)
3. Clubhouse UI shells accessible (with mock data)
4. Database schema deployed with RLS
5. Environment and analytics configured
6. All V1.0 must-pass criteria met

### V1.1 Done When:
1. Users can submit and view Flow entries
2. Moderation pipeline blocks unsafe content
3. Realtime wall updates work
4. Clubhouse pages display real Supabase data
5. Admin can moderate Flow and clubhouse submissions
6. All V1.1 must-pass criteria met
7. Seed content populated (Flow + Clubhouse)

### V1.2 Done When:
1. Blog posts readable and SEO-optimized
2. Shop checkout completes successfully
3. Tools functional (pace calculator)
4. Waitlist collecting signups
5. Legal pages live
6. All V1.2 must-pass criteria met
7. Security, accessibility, performance audits pass
8. Launch checklist complete

---

## Rollback Criteria

If any of these conditions occur, consider rolling back deployment:

**Critical (Immediate Rollback)**:
- RLS policy misconfiguration exposing user data
- Authentication bypass allowing unauthorized access
- Payment processing errors causing duplicate charges
- Moderation pipeline failing to block clearly unsafe content
- Site-wide outage or critical error affecting >50% of users

**High Priority (Fix Forward or Rollback within 1 hour)**:
- OpenAI moderation API failures (>50% error rate)
- Supabase Realtime not working (wall not updating)
- Stripe webhook failures preventing order recording
- Email delivery failures (password reset, order confirmations)

**Medium Priority (Fix Forward within 24 hours)**:
- Performance degradation (LCP >5s)
- Accessibility regression (keyboard nav broken)
- Admin moderation queue inaccessible
- Analytics not tracking events
- Minor UI bugs affecting UX

---

## Post-Launch Success Review

### 7-Day Review (V1.1)
- Review Flow submission volume and approval rates
- Check moderation queue health
- Verify Realtime uptime and reliability
- Review error rates and fix critical bugs
- Gather early user feedback

### 30-Day Review (V1.2)
- Assess engagement metrics against targets
- Review revenue (shop) and waitlist signups
- Identify top-performing content (blog, Flow)
- Analyze user behavior patterns
- Plan V2 features based on learnings

### 90-Day Review (Full V1)
- Evaluate product-market fit signals
- Assess community health indicators
- Review technical performance and costs
- Identify scaling bottlenecks
- Define V2 roadmap priorities
