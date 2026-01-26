# Follow-Up Issues for Epic Gaps

Generated: 2026-01-25
Based on validation of RUN-6, RUN-7, RUN-8, RUN-9

---

## RUN-6: Homepage & Manifesto Experience - Follow-Up Issues

### Issue 1: Create /library route stub
**Parent Epic:** RUN-6
**Priority:** P1 (High)
**Labels:** `homepage`, `frontend`, `bug`
**Estimate:** 1 point

**Description:**
The Chapter 04 CTA "Bring It to Life" links to `/library` which doesn't exist, causing a 404 error.

**Acceptance Criteria:**
- [ ] Create `/app/(public)/library/page.tsx` route
- [ ] Add placeholder content indicating "Content Library coming soon"
- [ ] Maintain brand styling consistency
- [ ] Update navigation links if needed

---

### Issue 2: Create /shop route stub
**Parent Epic:** RUN-6 (or RUN-11 Shop)
**Priority:** P1 (High)
**Labels:** `homepage`, `shop`, `frontend`, `bug`
**Estimate:** 1 point

**Description:**
Header and footer navigation link to `/shop` which doesn't exist, causing a 404 error.

**Acceptance Criteria:**
- [ ] Create `/app/(public)/shop/page.tsx` route
- [ ] Add placeholder content indicating "Shop coming soon"
- [ ] Maintain brand styling consistency
- [ ] Include email signup for shop launch notification (optional)

---

### Issue 3: Implement homepage analytics tracking
**Parent Epic:** RUN-6
**Priority:** P2 (Medium)
**Labels:** `homepage`, `analytics`
**Estimate:** 2 points

**Description:**
No analytics events are tracked on the homepage per the acceptance criteria.

**Acceptance Criteria:**
- [ ] Implement `homepage_view` event on page load
- [ ] Track `cta_click` events for all CTAs (Enter the Flow, Visit Clubhouse, etc.)
- [ ] Track `scroll_depth` milestones (25%, 50%, 75%, 100%)
- [ ] Track `manifesto_chapter_viewed` events using Intersection Observer
- [ ] Verify events fire correctly in analytics dashboard

---

### Issue 4: Connect Flow Preview to database
**Parent Epic:** RUN-6
**Priority:** P2 (Medium)
**Labels:** `homepage`, `frontend`, `database`
**Estimate:** 3 points

**Description:**
Flow Preview strip on homepage uses hardcoded seed data instead of real expressions from the database.

**Acceptance Criteria:**
- [ ] Query `expression_events` for recent approved public posts
- [ ] Fall back to seed data if no posts exist
- [ ] Limit to 20 most recent expressions
- [ ] Add Supabase Realtime subscription for live updates
- [ ] Handle loading and error states gracefully

---

## RUN-7: The Flow - Follow-Up Issues

### Issue 5: Implement OpenAI Moderation API integration
**Parent Epic:** RUN-7
**Priority:** P0 (Critical)
**Labels:** `flow`, `backend`, `moderation`, `security`
**Estimate:** 5 points

**Description:**
Per ADR-007, all text content should be checked against OpenAI Moderation API before saving to database. Currently, submissions bypass content filtering entirely.

**Acceptance Criteria:**
- [ ] Create `/app/api/flow/submit/route.ts` API endpoint
- [ ] Integrate OpenAI Moderation API in `lib/moderation.ts`
- [ ] Check text content before database insert
- [ ] Hard reject content flagged for hate speech, harassment, self-harm
- [ ] Log moderation results for audit
- [ ] Return user-friendly error messages for rejected content
- [ ] Move submission logic from client to server-side API

**Reference:** `DOCS/adr/007-openai-moderation.md`, `.claude/skills/content-moderation-trust-systems/SKILL.md`

---

### Issue 6: Implement trust score auto-approve logic
**Parent Epic:** RUN-7
**Priority:** P1 (High)
**Labels:** `flow`, `backend`, `moderation`
**Estimate:** 3 points

**Description:**
Database has trust_score infrastructure but no application logic uses it. Users with 3+ approved posts should have content auto-approved.

**Acceptance Criteria:**
- [ ] Query user's trust_score before submission
- [ ] Auto-approve if trust_level is 'regular' or higher (score >= 50)
- [ ] Set `moderation_status: 'approved'` for trusted users
- [ ] Set `moderation_status: 'pending'` for newcomers
- [ ] Call `add_trust_score()` function when posts are approved
- [ ] Update TypeScript types to include trust_score fields

---

### Issue 7: Implement image compression before upload
**Parent Epic:** RUN-7
**Priority:** P1 (High)
**Labels:** `flow`, `frontend`, `performance`
**Estimate:** 3 points

**Description:**
Per ADR-008, images should be compressed client-side before upload. Constant `COMPRESSED_IMAGE_TARGET: 400KB` is defined but not used.

**Acceptance Criteria:**
- [ ] Integrate client-side image compression (canvas API or library)
- [ ] Compress images to target size (400KB) before upload
- [ ] Maintain reasonable quality (80% JPEG quality)
- [ ] Handle HEIC conversion to JPEG
- [ ] Show compression progress indicator
- [ ] Skip compression for images already under target size

**Reference:** `DOCS/adr/008-client-side-compression.md`

---

### Issue 8: Improve submission success confirmation UX
**Parent Epic:** RUN-7
**Priority:** P2 (Medium)
**Labels:** `flow`, `frontend`, `ux`
**Estimate:** 2 points

**Description:**
After submitting an expression, the dialog simply closes with no feedback. Users don't know if submission succeeded or what happens next.

**Acceptance Criteria:**
- [ ] Show success toast/notification: "Your expression has been submitted!"
- [ ] Indicate moderation status: "Pending review" or "Published to the Flow"
- [ ] Add animation showing post drifting to the wall (optional)
- [ ] Provide options: "View the Flow", "Submit Another", "Share"
- [ ] Clear indication that content may be moderated before appearing

---

### Issue 9: Create admin moderation dashboard for Flow
**Parent Epic:** RUN-7 (or RUN-10)
**Priority:** P1 (High)
**Labels:** `flow`, `admin`, `moderation`, `frontend`
**Estimate:** 5 points

**Description:**
No admin interface exists to approve/reject pending Flow submissions. Database has moderation_queue view but no UI.

**Acceptance Criteria:**
- [ ] Create `/app/(admin)/moderation/page.tsx` route
- [ ] List all pending expressions with preview
- [ ] Display text content, images, vibe tags, submitter info
- [ ] Add Approve/Reject/Flag action buttons
- [ ] Support batch actions for multiple items
- [ ] Filter by type (text, image), date range
- [ ] Pagination for large queues
- [ ] Log admin actions to `admin_actions` table

---

## RUN-8: DWTC Clubhouse - Follow-Up Issues

### Issue 10: Replace mock data with database queries in Clubhouse
**Parent Epic:** RUN-8
**Priority:** P0 (Critical)
**Labels:** `clubhouse`, `frontend`, `database`
**Estimate:** 5 points

**Description:**
All Clubhouse pages (Overview, Lore, Media, Resources) display hardcoded mock data instead of querying the database.

**Acceptance Criteria:**
- [ ] Update Overview page to fetch real recent contributions
- [ ] Update Lore page to query `club_contributions` where `type='story'`
- [ ] Update Media page to query `club_contributions` where `type='media'`
- [ ] Update Resources page to query `club_contributions` where `type='document'`
- [ ] Update story detail page to fetch by ID
- [ ] Use `useClubContributions()` hook consistently
- [ ] Handle empty states when no contributions exist
- [ ] Add loading skeletons during data fetch

---

### Issue 11: Wire tag filtering to backend in Clubhouse
**Parent Epic:** RUN-8
**Priority:** P1 (High)
**Labels:** `clubhouse`, `frontend`, `backend`
**Estimate:** 3 points

**Description:**
Tag filter buttons on Lore and Media pages are visual only - clicking them doesn't filter the content.

**Acceptance Criteria:**
- [ ] Add state management for selected tags
- [ ] Update `useClubContributions()` to accept tags filter parameter
- [ ] Re-fetch data when tag selection changes
- [ ] Support multiple tag selection (AND/OR logic)
- [ ] Show active tag state in UI
- [ ] Add "Clear filters" button
- [ ] Update URL params for shareable filtered views

---

### Issue 12: Implement lightbox for Media gallery
**Parent Epic:** RUN-8
**Priority:** P2 (Medium)
**Labels:** `clubhouse`, `frontend`, `ux`
**Estimate:** 2 points

**Description:**
Media archive grid shows thumbnails but clicking doesn't open a full-size view.

**Acceptance Criteria:**
- [ ] Add click handler to media items
- [ ] Implement lightbox/modal using Shadcn Dialog
- [ ] Display full-size image with caption
- [ ] Show contributor name and date
- [ ] Add previous/next navigation
- [ ] Support keyboard navigation (arrow keys, Escape)
- [ ] Handle video content appropriately

---

### Issue 13: Create admin moderation dashboard for Clubhouse
**Parent Epic:** RUN-8 (or RUN-10)
**Priority:** P1 (High)
**Labels:** `clubhouse`, `admin`, `moderation`, `frontend`
**Estimate:** 5 points

**Description:**
No admin interface to approve/reject pending Clubhouse contributions. All uploads go to `pending` status with no review path.

**Acceptance Criteria:**
- [ ] Add Clubhouse section to moderation dashboard
- [ ] List pending stories, media, and documents
- [ ] Preview content with full details
- [ ] Approve/Reject actions per item
- [ ] Support featuring content (`is_featured` flag)
- [ ] Filter by club, type, date
- [ ] Send notification to contributor on approval/rejection (optional)

---

### Issue 14: Implement membership verification UI
**Parent Epic:** RUN-8
**Priority:** P2 (Medium)
**Labels:** `clubhouse`, `frontend`, `auth`
**Estimate:** 2 points

**Description:**
While RLS handles access control, there's no frontend feedback when a non-member tries to access clubhouse features.

**Acceptance Criteria:**
- [ ] Check membership status on page load
- [ ] Show "Not a member" message for non-members
- [ ] Provide path to request membership
- [ ] Differentiate between public and member-only clubs
- [ ] Handle gracefully when club doesn't exist

---

## RUN-9: Authentication & User Management - Follow-Up Issues

### Issue 15: Add magic link authentication option
**Parent Epic:** RUN-9
**Priority:** P2 (Medium)
**Labels:** `auth`, `frontend`, `ux`
**Estimate:** 3 points

**Description:**
Login only supports email/password. Magic link (passwordless) authentication is not available.

**Acceptance Criteria:**
- [ ] Add "Sign in with magic link" option to login form
- [ ] Implement `supabase.auth.signInWithOtp()` for magic link
- [ ] Show confirmation message after magic link sent
- [ ] Handle magic link callback route
- [ ] Support switching between password and magic link modes

---

### Issue 16: Add forgot password link to login form
**Parent Epic:** RUN-9
**Priority:** P1 (High)
**Labels:** `auth`, `frontend`, `ux`
**Estimate:** 1 point

**Description:**
The forgot password flow exists but there's no visible link in the login form. Users must manually navigate to `/auth/forgot-password`.

**Acceptance Criteria:**
- [ ] Add "Forgot password?" link below password field in login form
- [ ] Link to `/auth/forgot-password`
- [ ] Style consistently with form design
- [ ] Ensure link is accessible (proper focus state)

---

### Issue 17: Implement trust score application layer
**Parent Epic:** RUN-9
**Priority:** P1 (High)
**Labels:** `auth`, `backend`, `moderation`
**Estimate:** 5 points

**Description:**
Trust score database schema exists but no application code uses it. Need API endpoints and integration points.

**Acceptance Criteria:**
- [ ] Regenerate TypeScript types to include `trust_score`, `trust_level`
- [ ] Create API route to award trust points: `/api/trust/award`
- [ ] Call `add_trust_score()` when:
  - Flow post approved → `flow_post_approved` (+10 points)
  - Clubhouse contribution approved → `contribution_approved` (+15 points)
  - Daily login → `daily_login` (+1 point)
- [ ] Display trust level badge on profile page
- [ ] Show trust score in user's expression history
- [ ] Implement trust-based auto-approve in submission flows

---

### Issue 18: Collect full_name during signup (optional)
**Parent Epic:** RUN-9
**Priority:** P3 (Low)
**Labels:** `auth`, `frontend`, `ux`
**Estimate:** 1 point

**Description:**
Currently `full_name` is collected during onboarding, not signup. Consider adding optional name field to signup form.

**Acceptance Criteria:**
- [ ] Add optional "Display name" field to signup form
- [ ] Pre-populate onboarding if provided at signup
- [ ] Keep field optional to reduce signup friction
- [ ] Update profile creation to include name if provided

---

### Issue 19: Implement 3-question onboarding format
**Parent Epic:** RUN-9
**Priority:** P3 (Low)
**Labels:** `auth`, `frontend`, `onboarding`
**Estimate:** 2 points

**Description:**
Original spec mentioned "3 questions" during onboarding. Current flow has 4 steps but only collects name + vibes.

**Acceptance Criteria:**
- [ ] Review product requirements for specific questions
- [ ] Potential questions: "Current Goal", "Why do you run?", "Zip Code"
- [ ] Add question steps to onboarding flow
- [ ] Store responses in `profiles.expression_data` JSONB
- [ ] Use responses for personalization (optional)

---

## Summary Table

| Issue # | Title | Epic | Priority | Estimate |
|---------|-------|------|----------|----------|
| 1 | Create /library route stub | RUN-6 | P1 | 1 pt |
| 2 | Create /shop route stub | RUN-6 | P1 | 1 pt |
| 3 | Implement homepage analytics | RUN-6 | P2 | 2 pts |
| 4 | Connect Flow Preview to database | RUN-6 | P2 | 3 pts |
| 5 | OpenAI Moderation API integration | RUN-7 | P0 | 5 pts |
| 6 | Trust score auto-approve logic | RUN-7 | P1 | 3 pts |
| 7 | Image compression before upload | RUN-7 | P1 | 3 pts |
| 8 | Submission success confirmation UX | RUN-7 | P2 | 2 pts |
| 9 | Admin moderation dashboard (Flow) | RUN-7 | P1 | 5 pts |
| 10 | Replace mock data in Clubhouse | RUN-8 | P0 | 5 pts |
| 11 | Wire tag filtering to backend | RUN-8 | P1 | 3 pts |
| 12 | Lightbox for Media gallery | RUN-8 | P2 | 2 pts |
| 13 | Admin moderation dashboard (Clubhouse) | RUN-8 | P1 | 5 pts |
| 14 | Membership verification UI | RUN-8 | P2 | 2 pts |
| 15 | Magic link authentication | RUN-9 | P2 | 3 pts |
| 16 | Forgot password link in login | RUN-9 | P1 | 1 pt |
| 17 | Trust score application layer | RUN-9 | P1 | 5 pts |
| 18 | Collect full_name during signup | RUN-9 | P3 | 1 pt |
| 19 | 3-question onboarding format | RUN-9 | P3 | 2 pts |

**Total: 19 issues, ~54 story points**

---

## Priority Breakdown

### P0 (Critical) - Must fix before launch
- Issue 5: OpenAI Moderation API integration (5 pts)
- Issue 10: Replace mock data in Clubhouse (5 pts)

### P1 (High) - Should fix before launch
- Issue 1: Create /library route stub (1 pt)
- Issue 2: Create /shop route stub (1 pt)
- Issue 6: Trust score auto-approve logic (3 pts)
- Issue 7: Image compression before upload (3 pts)
- Issue 9: Admin moderation dashboard (Flow) (5 pts)
- Issue 11: Wire tag filtering to backend (3 pts)
- Issue 13: Admin moderation dashboard (Clubhouse) (5 pts)
- Issue 16: Forgot password link in login (1 pt)
- Issue 17: Trust score application layer (5 pts)

### P2 (Medium) - Nice to have for launch
- Issue 3: Implement homepage analytics (2 pts)
- Issue 4: Connect Flow Preview to database (3 pts)
- Issue 8: Submission success confirmation UX (2 pts)
- Issue 12: Lightbox for Media gallery (2 pts)
- Issue 14: Membership verification UI (2 pts)
- Issue 15: Magic link authentication (3 pts)

### P3 (Low) - Post-launch enhancements
- Issue 18: Collect full_name during signup (1 pt)
- Issue 19: 3-question onboarding format (2 pts)

---

## Recommended Sprint Planning

**Sprint 1 (Critical Path):**
- Issue 5: OpenAI Moderation API (5 pts)
- Issue 10: Replace mock data in Clubhouse (5 pts)
- Issue 1: /library route stub (1 pt)
- Issue 2: /shop route stub (1 pt)
- Issue 16: Forgot password link (1 pt)
**Total: 13 pts**

**Sprint 2 (Moderation & Trust):**
- Issue 9: Admin moderation dashboard - Flow (5 pts)
- Issue 13: Admin moderation dashboard - Clubhouse (5 pts)
- Issue 6: Trust score auto-approve (3 pts)
**Total: 13 pts**

**Sprint 3 (Polish & UX):**
- Issue 7: Image compression (3 pts)
- Issue 11: Tag filtering backend (3 pts)
- Issue 17: Trust score app layer (5 pts)
- Issue 8: Submission confirmation UX (2 pts)
**Total: 13 pts**

---

## Linear Import Instructions

To import these issues into Linear:

1. Go to Linear workspace: https://linear.app/run-expression-website
2. For each issue, click "Create Issue" (Cmd+I)
3. Copy title, description, and acceptance criteria
4. Set parent epic (RUN-6, RUN-7, RUN-8, or RUN-9)
5. Add labels, priority, and estimate
6. Link related issues as needed

Alternatively, use Linear's CSV import or API for bulk creation.
