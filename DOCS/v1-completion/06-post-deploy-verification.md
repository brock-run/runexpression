# RunExpression V1 Post-Deploy Verification

This document outlines the verification procedures to run immediately after each phase deployment. Each phase has its own smoke test checklist and monitoring plan.

---

## V1.0 Foundation - Post-Deploy Verification

**Deployment**: Homepage, clubhouse UI shells, database, authentication

### Immediate Smoke Checks (First Hour)

**Homepage**:
- [ ] Homepage loads successfully (200 status)
- [ ] Hero message and CTAs display correctly
- [ ] Manifesto chapters render and scroll animations work (or respect `prefers-reduced-motion`)
- [ ] Flow preview strip displays (placeholder/seed data)
- [ ] Clubhouse teaser visible and links to `/club/dwtc`
- [ ] Footer links all route correctly
- [ ] No console errors visible

**Authentication**:
- [ ] Signup form loads at `/signup`
- [ ] Signup submission succeeds (test with real email)
- [ ] Email verification email sent
- [ ] Login form loads at `/login`
- [ ] Login with test credentials succeeds
- [ ] Session persists across page refresh
- [ ] Password reset flow works (request → email → reset)
- [ ] Logout works and clears session

**Clubhouse UI Shells**:
- [ ] `/club/dwtc` overview page loads
- [ ] `/club/dwtc/lore` page loads (mock data okay)
- [ ] `/club/dwtc/media` page loads (mock data okay)
- [ ] `/club/dwtc/resources` page loads (mock data okay)
- [ ] `/club/dwtc/upload` form loads (mock data okay)

**Navigation**:
- [ ] All header links route correctly
- [ ] All footer links route correctly
- [ ] 404 page displays for invalid routes

### Data Integrity Checks

**Database**:
- [ ] Supabase production DB accessible
- [ ] Migrations applied successfully
- [ ] RLS policies enabled on all tables
- [ ] Test user signup creates record in `auth.users`
- [ ] Profile data accessible via API

**Environment**:
- [ ] Environment variables loaded correctly (check Vercel dashboard)
- [ ] No environment variable errors in logs
- [ ] Supabase connection successful

### Observability Checks

**Errors**:
- [ ] Sentry connected and receiving events
- [ ] Send test error to Sentry (verify receipt)
- [ ] No unexpected error spikes in Sentry (first hour)
- [ ] Vercel logs show no 5xx errors

**Analytics**:
- [ ] Analytics provider connected
- [ ] Test event sent (homepage view, CTA click)
- [ ] Events visible in analytics dashboard within 30 minutes

**Performance**:
- [ ] Run Lighthouse audit on homepage (target: LCP <2.5s, >85 score)
- [ ] Check Core Web Vitals in Vercel dashboard
- [ ] No significant performance regressions vs. staging

### Security Checks

**RLS Policies**:
- [ ] Test with non-authenticated user (should see public data only)
- [ ] Test with authenticated user (should see user-scoped data)
- [ ] Verify service role key not exposed in client bundles

**Authentication**:
- [ ] Auth cookies are HttpOnly and Secure
- [ ] Session tokens expire correctly
- [ ] Password reset tokens expire after use

### Post-Deploy Monitoring (First 24 Hours)

**Metrics to Watch**:
- [ ] Homepage uptime and response time
- [ ] Auth success/failure rates
- [ ] Error rates in Sentry
- [ ] Analytics event flow
- [ ] Core Web Vitals (LCP, FID, CLS)

**Expected Baselines** (V1.0):
- Uptime: >99.9%
- Homepage LCP: <2.5s
- Error rate: <0.1%
- Auth success rate: >95%

### Rollback Triggers (V1.0)

Rollback if any of these occur:
- [ ] Site-wide outage (>50% of users affected)
- [ ] Auth completely broken (signup/login failing for all users)
- [ ] Critical security issue (RLS bypass, auth bypass)
- [ ] Performance regression (LCP >5s consistently)
- [ ] Database migration failure (data loss or corruption)

### V1.0 Sign-Off

- [ ] **Engineering Lead**: All smoke checks passed, no critical errors
- [ ] **Product Owner**: Homepage and auth flows working as expected
- [ ] **DevOps**: Monitoring and alerts configured, no rollback triggers

**V1.0 Deploy Date**: _________________

**V1.0 Sign-Off Date**: _________________

---

## V1.1 The Flow - Post-Deploy Verification

**Deployment**: Flow submission, moderation, wall + Clubhouse backend

### Immediate Smoke Checks (First Hour)

**The Flow**:
- [ ] Flow page loads at `/flow`
- [ ] Text submission form works (500 char limit, vibe tags)
- [ ] Image submission form works (upload, compress, caption)
- [ ] Anonymous submission succeeds (email optional)
- [ ] Submission creates `expression_events` record with `pending` status
- [ ] Flow wall displays approved entries at `/flow/wall`
- [ ] Infinite scroll pagination works
- [ ] Realtime subscription established (test with browser DevTools)

**Flow Moderation**:
- [ ] Admin can access moderation queue at `/flow/admin`
- [ ] Moderation queue shows pending/flagged entries
- [ ] Approve action publishes entry to wall
- [ ] Reject action hides entry
- [ ] Approved entry appears on wall without refresh (Realtime)

**Flow Moderation Pipeline**:
- [ ] Submit test content (text + image)
- [ ] OpenAI moderation API returns result (check logs)
- [ ] Trust score calculated and stored
- [ ] Entry routed to correct queue (pending, approved, flagged)

**Clubhouse Backend**:
- [ ] Non-member sees overview teaser only
- [ ] Member can access lore, media, resources, upload
- [ ] Lore index displays stories from `club_stories`
- [ ] Lore detail page renders markdown
- [ ] Media archive displays photos from `club_media` + Storage
- [ ] Lightbox works with keyboard navigation (← →, Esc)
- [ ] Resources list displays downloadable files
- [ ] Download links work (signed URLs)
- [ ] Upload portal creates `club_contributions` record with `pending` status
- [ ] Admin moderation dashboard at `/club/dwtc/admin` shows pending contributions

### Data Integrity Checks

**Flow**:
- [ ] `expression_events` entries created with correct fields:
  - `expression_type` (text or image)
  - `expression_data` (JSONB with content, vibe tags, caption)
  - `moderation_status` (pending, approved, flagged, rejected)
  - `trust_score` (float 0-1)
  - `created_at` timestamp
- [ ] Image uploads stored in Supabase Storage with correct RLS
- [ ] Seed data (50+ entries) populated correctly

**Clubhouse**:
- [ ] `club_stories` entries seeded (10+)
- [ ] `club_media` entries seeded (50+)
- [ ] `club_resources` entries seeded (3+)
- [ ] `club_contributions` entries created on upload with `pending` status
- [ ] Membership check enforced (non-members can't access content)

### Observability Checks

**Realtime**:
- [ ] Supabase Realtime connected (check browser DevTools)
- [ ] Realtime subscription receives updates on approval
- [ ] No Realtime connection errors in logs
- [ ] Realtime latency <2s

**API Performance**:
- [ ] Flow submission API (`/api/flow/submit`) responds in <2s (p95)
- [ ] OpenAI moderation API success rate >98%
- [ ] Clubhouse upload API responds in <3s (p95)

**Errors**:
- [ ] No unexpected error spikes in Sentry
- [ ] No 5xx errors in Vercel logs
- [ ] OpenAI API errors logged but handled gracefully

**Analytics**:
- [ ] `flow_submit` events firing on submission
- [ ] `flow_approve` events firing on admin approval
- [ ] `clubhouse_upload` events firing on upload
- [ ] Event payloads include context (vibe tags, file type, etc.)

### Security Checks

**RLS Policies**:
- [ ] Non-authenticated user can only see approved Flow entries
- [ ] Authenticated user can see own pending submissions
- [ ] Admin can see all submissions
- [ ] Non-member can't access clubhouse content
- [ ] Member can access clubhouse content
- [ ] Storage RLS prevents unauthorized reads

**Rate Limiting**:
- [ ] Flow submission rate limiting works (10/hour per IP)
- [ ] Clubhouse upload rate limiting works
- [ ] Rate limit exceeded returns 429 status

**Input Validation**:
- [ ] Form validation works (500 char limit, vibe tags required)
- [ ] Image upload validation works (5MB max, file type)
- [ ] Malicious content blocked by OpenAI moderation

### Content Quality Checks

**Flow Seed Data**:
- [ ] 50+ Flow entries visible on wall
- [ ] Mix of text and image posts
- [ ] All vibe tags represented
- [ ] Content reflects RunExpression brand voice
- [ ] `is_featured` flags set for homepage preview

**Clubhouse Seed Data**:
- [ ] 10+ stories visible in lore index
- [ ] 50+ photos visible in media archive
- [ ] 3+ resources downloadable
- [ ] Markdown rendering works correctly
- [ ] Content reflects DWTC culture

### Post-Deploy Monitoring (First Week)

**Metrics to Watch**:
- [ ] Flow submission rate and approval rate
- [ ] Moderation queue size and processing time
- [ ] Realtime uptime and latency
- [ ] OpenAI API success rate
- [ ] Clubhouse upload rate
- [ ] Storage usage and costs
- [ ] Core Web Vitals (Flow wall, clubhouse pages)

**Expected Baselines** (V1.1):
- Flow submission rate: 10-20/day (early days)
- Approval rate: >60%
- Moderation response time: <24 hours
- Realtime uptime: >99%
- Flow wall LCP: <3s
- OpenAI API success rate: >98%

**Conversion Funnels**:
- [ ] Homepage → Flow submit (target: >10%)
- [ ] Clubhouse login → upload (target: >20%)

### Rollback Triggers (V1.1)

Rollback if any of these occur:
- [ ] OpenAI moderation API completely down (>50% error rate for >1 hour)
- [ ] Realtime subscription not working (wall not updating)
- [ ] Flow submission API failing (>20% error rate)
- [ ] RLS policy misconfiguration (unauthorized access)
- [ ] Moderation pipeline allowing clearly unsafe content
- [ ] Critical performance regression (Flow wall LCP >5s)

### V1.1 Sign-Off

- [ ] **Engineering Lead**: All smoke checks passed, Realtime working, no critical errors
- [ ] **Product Owner**: Flow and clubhouse features working as expected
- [ ] **Content Lead**: Seed content quality approved
- [ ] **Security**: RLS policies verified, moderation tested

**V1.1 Deploy Date**: _________________

**V1.1 Sign-Off Date**: _________________

---

## V1.2 Content & Commerce - Post-Deploy Verification

**Deployment**: Blog, Shop, Tools, Waitlist, Legal pages

### Immediate Smoke Checks (First Hour)

**Blog / Library**:
- [ ] Blog index loads at `/library`
- [ ] 5+ seed posts visible
- [ ] Post grid layout works
- [ ] Featured post section displays
- [ ] Tag/category filtering works
- [ ] Post detail page loads at `/library/[slug]`
- [ ] Markdown renders correctly (images, code, headings)
- [ ] Custom MDX components work (Callout, etc.)
- [ ] SEO meta tags present (check with browser inspector)
- [ ] OG images generate correctly (test with social media debugger)

**Shop**:
- [ ] Shop index loads at `/shop`
- [ ] Products display from `products` table
- [ ] Product images load from Storage
- [ ] Product detail page loads at `/shop/[slug]`
- [ ] "Buy Now" CTA redirects to Stripe Checkout
- [ ] Stripe Checkout displays correct product and price
- [ ] Complete test purchase in Stripe test mode
- [ ] Success page loads at `/shop/success`
- [ ] Webhook creates order record in `orders` table
- [ ] Cancel page allows retry

**Tools**:
- [ ] Pace calculator loads at `/tools/pace-calculator`
- [ ] Calculator accepts distance and time inputs
- [ ] Calculator outputs accurate pace per mile/km
- [ ] Vibe descriptors display correctly
- [ ] CTA links to AI Coach waitlist

**AI Coach Waitlist**:
- [ ] Waitlist form loads at `/coach/waitlist`
- [ ] Form submission succeeds
- [ ] Confirmation message displays
- [ ] Duplicate email submission handled gracefully
- [ ] Waitlist teasers visible on homepage, Flow, Clubhouse

**Legal & SEO**:
- [ ] Privacy policy loads at `/privacy`
- [ ] Terms of service loads at `/terms`
- [ ] Footer links to legal pages work
- [ ] `sitemap.xml` accessible and includes all routes
- [ ] `robots.txt` accessible
- [ ] JSON-LD structured data present (check with inspector)

### Data Integrity Checks

**Blog**:
- [ ] 5+ posts seeded and accessible
- [ ] Frontmatter parsed correctly (title, date, tags, etc.)
- [ ] Images optimized and loading

**Shop**:
- [ ] 2+ products seeded (1 physical, 1 digital)
- [ ] Product data complete (price, description, images, type)
- [ ] Order records created on webhook with correct fields:
  - `stripe_session_id`
  - `stripe_customer_id`
  - `product_id`
  - `amount_total`
  - `status` (completed)
  - `created_at`

**Waitlist**:
- [ ] `ai_coach_waitlist` entries created with correct fields:
  - `email`
  - `full_name`
  - `goals` (optional)
  - `source` (homepage, flow, clubhouse)
  - `created_at`
- [ ] Duplicate emails handled correctly (unique constraint or dedupe logic)

**SEO**:
- [ ] Sitemap includes all routes (homepage, flow, clubhouse, blog posts, shop, tools, waitlist, legal)
- [ ] RSS feed includes all blog posts
- [ ] Robots.txt allows indexing

### Observability Checks

**Stripe Integration**:
- [ ] Stripe Checkout session creation successful
- [ ] Webhook signature verification working
- [ ] Webhook events received and processed
- [ ] No Stripe webhook errors in logs
- [ ] Order confirmation email sent (if configured)

**Performance**:
- [ ] Blog post LCP <2s
- [ ] Shop page LCP <2.5s
- [ ] Tools page interactive in <1.5s
- [ ] Lighthouse audit >90 on all major routes

**Errors**:
- [ ] No unexpected error spikes in Sentry
- [ ] No 5xx errors in Vercel logs
- [ ] Stripe webhook failures logged and handled

**Analytics**:
- [ ] `cta_click` events firing on homepage CTAs
- [ ] `checkout_start` events firing on shop checkout
- [ ] `purchase_complete` events firing on successful order
- [ ] `waitlist_submit` events firing on waitlist submission
- [ ] `tool_complete` events firing on pace calculator usage
- [ ] All event payloads include context

### Security Checks

**Stripe**:
- [ ] Webhook signature verification prevents spoofing
- [ ] Stripe secret key not exposed in client bundles
- [ ] Payment processing secure (HTTPS, no sensitive data logged)
- [ ] Idempotency prevents duplicate orders

**Forms**:
- [ ] All forms use Zod validation
- [ ] XSS protection on user inputs
- [ ] CSRF protection enabled
- [ ] Rate limiting on submission endpoints

**RLS & Access Control**:
- [ ] Products table RLS allows public reads
- [ ] Orders table RLS restricts to user's own orders
- [ ] Waitlist table RLS restricts to admins
- [ ] No unauthorized data access

**General**:
- [ ] HTTPS enforced on all routes
- [ ] No sensitive data in client bundles
- [ ] Environment variables not leaked
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)

### Accessibility Checks

**WCAG 2.1 AA Compliance**:
- [ ] Keyboard navigation works on all routes
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast meets 4.5:1 minimum
- [ ] Screen reader testing on shop checkout flow
- [ ] Screen reader testing on waitlist form
- [ ] Alt text on all images
- [ ] Form labels and error messages accessible

**Testing Tools**:
- [ ] Run axe DevTools on all major routes (0 critical violations)
- [ ] Run Lighthouse accessibility audit (>95 score)
- [ ] Test with screen reader (VoiceOver/NVDA)

### Content Quality Checks

**Blog**:
- [ ] 5+ posts published
- [ ] Copy aligns with "Sage in the Parking Lot" voice
- [ ] Images optimized and relevant
- [ ] Code blocks render with syntax highlighting
- [ ] Links work and open in new tab where appropriate

**Shop**:
- [ ] Product descriptions reflect RunExpression values
- [ ] Images high quality and properly sized
- [ ] Pricing clear and accurate
- [ ] Digital product delivery instructions clear

**Legal**:
- [ ] Privacy policy complete and accurate
- [ ] Terms of service complete and accurate
- [ ] Language accessible and non-corporate
- [ ] Legal pages approved by legal review (if required)

**Tools**:
- [ ] Pace calculator vibe descriptors feel authentic
- [ ] Instructions clear and helpful
- [ ] Calculator UI intuitive

### Post-Deploy Monitoring (First Week)

**Metrics to Watch**:
- [ ] Shop transaction success rate
- [ ] Stripe webhook success rate
- [ ] Waitlist submission rate
- [ ] Blog post views and engagement
- [ ] Tool usage (pace calculator)
- [ ] Overall site performance (CWV)
- [ ] Error rates across all routes
- [ ] Conversion rates (checkout, waitlist)

**Expected Baselines** (V1.2):
- Shop conversion rate: 5-10% (early days)
- Stripe webhook success rate: >99%
- Waitlist submission rate: 5-10/day
- Blog post views: 50-100/week
- Tool usage: 20-50/week
- Overall uptime: >99.9%

**Conversion Funnels**:
- [ ] Homepage → Waitlist submit (target: >5%)
- [ ] Shop view → Checkout (target: >5%)
- [ ] Tools usage → Waitlist submit (target: >10%)

### Rollback Triggers (V1.2)

Rollback if any of these occur:
- [ ] Stripe webhook failures preventing order recording (>20% failure rate)
- [ ] Payment processing errors causing duplicate charges
- [ ] Critical accessibility regression (keyboard nav broken site-wide)
- [ ] Security vulnerability (XSS, CSRF, data leak)
- [ ] Legal page errors (wrong content, missing pages)
- [ ] Site-wide performance regression (LCP >5s on multiple routes)

### V1.2 Sign-Off

- [ ] **Engineering Lead**: All smoke checks passed, no critical errors
- [ ] **Product Owner**: All features working as expected, content approved
- [ ] **Legal**: Legal pages approved
- [ ] **Security**: Security audit complete, no vulnerabilities
- [ ] **Accessibility**: WCAG 2.1 AA compliance verified

**V1.2 Deploy Date**: _________________

**V1.2 Sign-Off Date**: _________________

---

## Cross-Phase Regression Verification

After each phase deployment, verify that previous phase features still work:

### Post-V1.1 Regression Checks
- [ ] V1.0 homepage still loads and performs well
- [ ] V1.0 auth flows still work
- [ ] V1.0 clubhouse UI shells still accessible

### Post-V1.2 Regression Checks
- [ ] V1.0 homepage still loads and performs well
- [ ] V1.0 auth flows still work
- [ ] V1.1 Flow submission and wall still work
- [ ] V1.1 Clubhouse backend still works
- [ ] V1.1 Realtime updates still work

---

## Post-Launch Monitoring Dashboard

### Key Metrics to Track (Ongoing)

**Performance**:
- Homepage LCP, FID, CLS
- Flow wall LCP, FID, CLS
- Shop checkout LCP
- Overall page load times

**Engagement**:
- Flow submission rate
- Clubhouse upload rate
- Shop transaction rate
- Waitlist signup rate
- Blog post views
- Tool usage

**Technical Health**:
- Error rates (Sentry)
- API response times
- Realtime uptime
- Stripe webhook success rate
- OpenAI API success rate
- Storage usage and costs

**Business Metrics**:
- User signups
- Active users (DAU, WAU, MAU)
- Conversion rates (Flow, Shop, Waitlist)
- Revenue (if applicable)
- Community health (moderation queue size, approval rates)

### Alert Thresholds

**Critical Alerts** (immediate notification):
- Uptime <99% for >5 minutes
- Error rate >5% for >10 minutes
- LCP >5s consistently for >15 minutes
- Stripe webhook failure rate >20% for >10 minutes
- OpenAI moderation API down for >30 minutes

**Warning Alerts** (notification within 1 hour):
- Error rate 1-5%
- LCP 3-5s
- Conversion rate drop >50% (day-over-day)
- Moderation queue >100 items

---

## 7-Day, 30-Day, 90-Day Reviews

### 7-Day Review (Post-V1.1)
- [ ] Review Flow submission volume and approval rates
- [ ] Check moderation queue health (size, processing time)
- [ ] Verify Realtime uptime and reliability
- [ ] Review error rates and fix critical bugs
- [ ] Gather early user feedback
- [ ] Identify quick wins for improvements

### 30-Day Review (Post-V1.2)
- [ ] Assess engagement metrics against targets
- [ ] Review revenue (shop) and waitlist signups
- [ ] Identify top-performing content (blog, Flow)
- [ ] Analyze user behavior patterns (funnels, drop-offs)
- [ ] Plan V2 features based on learnings
- [ ] Review technical performance and costs

### 90-Day Review (Full V1)
- [ ] Evaluate product-market fit signals
- [ ] Assess community health indicators
- [ ] Review technical performance and costs
- [ ] Identify scaling bottlenecks
- [ ] Define V2 roadmap priorities
- [ ] Celebrate successes and learnings

---

## Emergency Runbook

### Critical Issues and Response

**Issue: Site Down (>50% users affected)**
1. Check Vercel status page
2. Check Supabase status page
3. Review recent deployments (rollback if needed)
4. Check error logs (Sentry, Vercel)
5. Communicate status to team
6. Implement fix or rollback
7. Post-mortem after resolution

**Issue: Auth Broken**
1. Check Supabase Auth logs
2. Verify environment variables
3. Test signup/login flows
4. Check RLS policies
5. Rollback if critical
6. Fix and redeploy

**Issue: Payment Processing Errors**
1. Check Stripe dashboard for errors
2. Verify webhook signature
3. Check Stripe API status
4. Review webhook logs
5. Contact Stripe support if needed
6. Implement fix or disable shop temporarily

**Issue: Moderation Pipeline Down**
1. Check OpenAI API status
2. Verify API key and configuration
3. Review error logs
4. Implement fallback (manual moderation)
5. Fix and redeploy

**Issue: Realtime Not Working**
1. Check Supabase Realtime status
2. Verify Realtime configuration
3. Test Realtime subscription in browser DevTools
4. Implement fallback (polling or manual refresh)
5. Fix and redeploy

---

## Success Criteria Summary

Each phase is considered successfully deployed when:

**V1.0**: ✅ All smoke checks passed, auth working, homepage performant, no P0 bugs

**V1.1**: ✅ All V1.0 still working + Flow and clubhouse functional, Realtime working, moderation operational, no P0/P1 bugs

**V1.2**: ✅ All V1.0 and V1.1 still working + Blog, Shop, Tools, Waitlist functional, security/accessibility audits passed, no P0/P1/P2 bugs

---

**Document Revision**: 2026-01-23
**Maintained By**: Engineering Team
