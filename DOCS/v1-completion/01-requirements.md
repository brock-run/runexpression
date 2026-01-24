# RunExpression V1 Requirements

## Scope boundaries

### V1.0 - Foundation Launch (Current Target) ✅
**Status: ~80% Complete - Homepage & Clubhouse UI Ready**

- ✅ **Homepage manifesto experience** with scroll animations and clubhouse teaser
- ✅ **Database schema** with RLS policies and realtime enabled
- ✅ **Clubhouse route structure** (UI shells for overview, lore, media, resources, upload)
- ✅ **Authentication UI** (signup, login forms)
- 🔄 **Flow preview** (homepage widget with seed data - needs backend integration)

**V1.0 Remaining Work:**
- 🚧 Wire clubhouse pages to Supabase queries (replace mock data)
- 🚧 Implement upload portal backend (storage + API)
- 🚧 Complete authentication flows (password reset, session management)
- 🚧 Add basic profile route

### V1.1 - The Flow (Next Priority) 🎯
**Estimated: 2-3 weeks**

- The Flow submission page (`/flow` route with text + image modes)
- Vibe tag selection and validation
- Image compression and Supabase Storage upload
- Moderation workflow (OpenAI API + trust scoring)
- Public Flow wall with masonry grid
- Realtime updates via Supabase Realtime
- Admin moderation queue
- Content seeding (50+ Flow entries)

### V1.2 - Content & Commerce 📚
**Estimated: 2-4 weeks**

- Blog/Library: MDX-based content hub with index and detail pages
- Shop framework: Stripe Checkout, product pages, webhook handler
- Tools: Expressive Pace Calculator
- AI Coach waitlist form and database integration
- Legal pages (privacy policy, terms of service)
- Analytics baseline events

### Out of scope (V2.0+)
- Sticker studio / drawing pad
- Full AI coach experience (beyond waitlist)
- Multi-club support beyond DWTC
- Advanced gamification (The Long Run)
- Print-on-demand automation
- Blog comments system
- Advanced Flow filtering and search

## Functional requirements by feature

### F1: Homepage & Manifesto [V1.0 ✅]
**Requirements**
- Hero message and CTAs reflect manifesto positioning.
- Four manifesto chapters with scroll-triggered animation.
- Flow preview strip uses approved Flow entries from database.
- Clubhouse teaser reflects DWTC identity and links to clubhouse.
- Footer includes navigation, social, and legal links.

**Acceptance criteria**
- LCP < 2s on 3G emulation for homepage.
- All CTAs route to valid pages.
- Animations respect `prefers-reduced-motion`.
- Flow preview shows real data (latest 20-30 approved entries).
- Responsive layout from 320px to 1920px.

### F2: The Flow (Canvas + Wall) [V1.1 🎯]
**Requirements**
- Entry page with text and image modes.
- Text mode: 500 char limit, 1-3 vibe tags required.
- Image mode: 5MB max, client compression to ~400KB, caption required.
- Anonymous submissions supported (email optional for moderation follow-up).
- Moderation workflow: OpenAI moderation, trust scoring, admin queue.
- Public wall: masonry grid, realtime updates, infinite scroll.

**Acceptance criteria**
- Submissions create `expression_events` records with moderation status.
- Moderation pipeline blocks flagged content.
- Approved items appear on public wall without refresh.
- Realtime updates implemented via Supabase Realtime.
- Seed data: 50+ diverse Flow entries at launch.

### F3: DWTC Clubhouse [V1.0 🔄 UI Complete, V1.1 🎯 Backend]
**Requirements**
- Public overview teaser; full access for authenticated members.
- Sections: Overview, Lore, Media, Resources, Upload.
- Upload portal supports stories, media, documents.
- Admin moderation at `/club/dwtc/admin` with approve/reject.
- Lore supports markdown rendering and search.
- Media archive supports lightbox view.
- Resources downloads stored in Supabase Storage.

**Acceptance criteria**
- Membership gating enforced by middleware + RLS.
- Uploads stored in `club_contributions` with `pending` status.
- Admin approvals publish content immediately.
- Lore search returns relevant results.
- Media lightbox supports keyboard navigation.
- Seed data: 10+ stories, 50+ photos, 3+ resources.

### F4: Blog / Library [V1.2 📚]
**Requirements**
- Index page with categories and featured post.
- Post detail pages rendered from MDX with SEO meta.
- Tag or category filtering.

**Acceptance criteria**
- 5+ seed posts live at launch.
- MDX renders images, code, and embedded components.
- OpenGraph and structured data on each post.

### F5: Shop Framework [V1.2 📚]
**Requirements**
- Shop index and product detail pages.
- Stripe Checkout integration with success and cancel pages.
- Digital delivery workflow (email link or secure download).

**Acceptance criteria**
- Product data displayed from `products` table.
- Stripe Checkout completes and redirects to success page.
- Webhook records `orders` entries on `checkout.session.completed`.
- At least 2 products active (1 physical, 1 digital).

### F6: Tools [V1.2 📚]
**Requirements**
- Expressive Pace Calculator with vibe descriptors.
- CTA to AI Coach waitlist.

**Acceptance criteria**
- Calculator outputs accurate paces and descriptors.
- Analytics event on tool completion.

### F7: Authentication [V1.0 🔄 UI Complete, V1.1 🎯 Backend]
**Requirements**
- Email/password signup with verification.
- Login with session persistence.
- Password reset flow.
- Basic profile page (minimal fields).

**Acceptance criteria**
- Signup and login routes succeed end-to-end.
- Password reset email flow works.
- Protected routes redirect to login when unauthenticated.

### F8: AI Coach Waitlist [V1.2 📚]
**Requirements**
- Teaser placements on homepage, Flow, Clubhouse.
- Waitlist form at `/coach/waitlist`.
- Store entries in `ai_coach_waitlist`.

**Acceptance criteria**
- Form submits to database and returns confirmation.
- Duplicate emails handled gracefully.
- Analytics events for view and submit.

### F9: Legal & SEO [V1.2 📚]
**Requirements**
- `/privacy` and `/terms` pages with approved copy.
- Site metadata and sitemap.
- Accessible semantics and alt text coverage.

**Acceptance criteria**
- Legal pages reachable from footer.
- Sitemap includes main routes and blog posts.
- WCAG 2.1 AA compliance checklist met.

## Non-functional requirements

### Performance
- LCP < 2s, FID < 100ms, CLS < 0.1.
- Next/Image for all media.
- Dynamic imports for heavy components.

### Accessibility
- WCAG 2.1 AA, keyboard navigation, visible focus states.
- Respect `prefers-reduced-motion`.
- Color contrast 4.5:1 for body text.

### Security & privacy
- RLS enabled for all tables.
- Input validation (Zod) on all forms.
- Upload validation on size, type, and content.
- Rate limiting on submission endpoints.

### Analytics
- Track homepage scroll depth, CTA clicks, form submissions.
- Track Flow submit, approval, and moderation outcomes.
- Track clubhouse views and uploads.
- Track shop view, checkout start, purchase complete.

## Content requirements (V1)
- Manifesto copy finalized and implemented.
- Flow seed entries (50+).
- Clubhouse seed content: 10 stories, 50 photos, 3 resources.
- Blog seed posts (5+).
- Shop product descriptions and imagery (2+).
