# RunExpression V1 - Product Requirements Document

**Version:** 1.0
**Last Updated:** December 2025
**Owner:** Product Team

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [User Personas](#user-personas)
3. [Feature Specifications](#feature-specifications)
4. [User Stories & Acceptance Criteria](#user-stories--acceptance-criteria)
5. [User Flows](#user-flows)
6. [Content Requirements](#content-requirements)
7. [Non-Functional Requirements](#non-functional-requirements)

---

## Product Overview

RunExpression V1 delivers three interconnected experiences that embody the "Expressive Runner" philosophy. Each feature reinforces the brand pillars: Motion Creates Emotion, Process Over Outcome, Interdependence, and The Living Laboratory.

**Core Product Principles:**
- **Belonging First:** Every feature should reduce loneliness and increase connection
- **Low Friction, High Delight:** Simple inputs, meaningful outputs
- **Co-Creation:** Users build the platform through their contributions
- **Authentic Expression:** Favor raw, honest content over polished perfection

---

## User Personas

### Primary: The Expressive Runner (Sarah)

**Demographics:**
- Age: 28-45
- Running level: Recreational to competitive (not elite)
- Values: Community, meaning, balance

**Behaviors:**
- Runs 3-5x per week
- Uses Strava but frustrated by pure metrics focus
- Participates in local running groups or clubs
- Interested in running as life practice, not just fitness
- Shares run photos on Instagram

**Goals:**
- Find deeper meaning in running beyond PRs
- Connect with like-minded runners
- Express creativity through running
- Balance discipline with joy

**Pain Points:**
- Existing running platforms feel cold and metric-obsessed
- Hard to find community that values process over outcome
- Running club communication scattered (WhatsApp, email, etc.)
- No good place to preserve memories and stories

**RunExpression Solutions:**
- The Flow provides instant emotional outlet after runs
- Manifesto validates their holistic approach to running
- Interactive tools blend data with philosophy

---

### Secondary: The Club Member (Marcus)

**Demographics:**
- Age: 25-55
- Active member of DWTC or similar club
- Mix of competitive and social motivation

**Behaviors:**
- Attends weekly group runs
- Races 3-6 times per year
- Takes photos at events
- Wants to stay connected to club history and culture

**Goals:**
- Access club information (workouts, races, lore)
- Contribute to club archive (photos, stories)
- Feel pride in club identity
- Onboard new members smoothly

**Pain Points:**
- No centralized home for club content
- Hard to find old race reports or photos
- Can't easily share their race experiences
- Club history exists in fragments

**RunExpression Solutions:**
- DWTC Clubhouse is permanent digital home
- Easy upload portal for contributions
- Searchable, browsable archive
- Visual storytelling reinforces club identity

---

### Tertiary: The Curious Visitor (Alex)

**Demographics:**
- Age: 22-50
- New to running or exploring running philosophy
- Landed via Google, social media, or referral

**Behaviors:**
- Browses running content online
- Follows running influencers
- Interested in personal development
- May or may not be training for something

**Goals:**
- Understand what RunExpression is about
- Decide if this community is "for them"
- Low-commitment ways to engage
- Learn something useful or inspiring

**Pain Points:**
- Overwhelmed by fitness industry noise
- Skeptical of "running communities" (too serious or too casual)
- Doesn't want to commit before exploring

**RunExpression Solutions:**
- Homepage manifesto immediately sets clear tone
- The Flow allows anonymous participation
- Free tools provide immediate value
- Clear, non-pushy CTAs

---

## Feature Specifications

---

## F1: Homepage & Manifesto Experience

### Overview
A scroll-driven, motion-enhanced landing page that weaves the "Expressive Runner's Creed" into an interactive narrative. This is the brand's front door and primary conversion surface.

### Key Components

#### F1.1: Hero Section
**Purpose:** Immediate brand positioning and CTA

**Elements:**
- **H1:** "Make running mean more."
- **Subheadline:** "Turn your struggle into art and feed the running community with your story."
- **Primary CTA:** "Enter the Flow" (links to canvas)
- **Secondary CTA:** "Visit the Clubhouse" (links to DWTC)
- **Visual:** Subtle motion (slow-shutter run scene or flowing abstract lines)

**Behavior:**
- CTAs sticky or prominently positioned throughout scroll
- Mobile: Stack CTAs vertically, ensure thumb-reachable
- Desktop: Side-by-side CTAs

#### F1.2: Manifesto Chapters (Scroll Sections)
**Purpose:** Educate visitors on the four brand pillars through progressive revelation

**Chapters:**

**Chapter 1: Motion Creates Emotion**
- Headline: "Leave heavy. Return light."
- Body: "We've all felt it. You lace up with a head full of noise, stress, and unfinished arguments. Three miles later, the noise settles..."
- Soft CTA: "Explore the Mindset →"

**Chapter 2: Process Over Outcome**
- Headline: "We take our fun very seriously."
- Body: "Let's be honest: in the grand scheme of the universe, running in circles is ridiculous. We pay to wake up at 4 AM..."
- Soft CTA: "Embrace the Grind →"

**Chapter 3: Interdependence**
- Headline: "Your squad is your battery pack."
- Body: "Science confirms what the gut already knows: We go farther when we go together..."
- Soft CTA: "Find Your Crew →"

**Chapter 4: Living Laboratory**
- Headline: "Enlightenment smells like laundry."
- Body: "We run to find clarity, patience, and creativity that we can bring back to our 'real lives'..."
- Soft CTA: "Bring It to Life →"

**Interaction Pattern:**
- Scroll-triggered reveals (Framer Motion)
- Fade-in headline first, then body text
- Subtle parallax on background images
- Each chapter occupies ~60-80% of viewport height

#### F1.3: Flow Preview Strip
**Purpose:** Show live community activity; tease The Flow experience

**Elements:**
- **H2:** "What are we running for today?"
- **Subheadline:** "You are not alone on the road."
- **Live feed:** Horizontal auto-scroll of recent Flow submissions (text snippets)
- **CTA:** "Add Your Voice →" (links to full canvas)

**Behavior:**
- Shows most recent 20-30 approved submissions
- Auto-scrolls or swipeable on mobile
- Clicking a snippet could expand it (V1.1 feature)

#### F1.4: Clubhouse Teaser
**Purpose:** Drive DWTC members to clubhouse; introduce concept to others

**Elements:**
- **H2:** "Welcome to the Laboratory."
- **Body:** "The Clubhouse is where the 'Sage in the Parking Lot' lives. It's where we swap stories, dissect the process..."
- **Callout:** "This is an invitation. Not to run faster, but to run deeper."
- **CTA:** "Visit the Clubhouse →"
- **Visual:** Gritty, high-grain photography (black & white DWTC crew photo)

#### F1.5: Footer
**Elements:**
- **Headline:** "Run for yourself. Run for us. Express yourself."
- **Navigation:** The Manifesto, The Flow, The Studio, The Shop, Login/Join
- **Social links:** Instagram, Strava(?), Email
- **Legal:** Privacy Policy, Terms of Service
- **Copyright:** © 2025 Run Expression

### Acceptance Criteria

- [ ] Homepage loads in <2s (LCP)
- [ ] All four manifesto chapters render with scroll-triggered animations
- [ ] Animations respect `prefers-reduced-motion` setting
- [ ] CTAs functional on all devices
- [ ] Flow preview strip shows real data from database
- [ ] Mobile responsive (320px to 1920px widths)
- [ ] Copy matches approved brand voice
- [ ] All links navigate correctly
- [ ] Footer social links open in new tabs
- [ ] Analytics events fire: `homepage_view`, `cta_click`, `scroll_depth`

---

## F2: The Flow - "Why You Run" Interactive Canvas

### Overview
A living, communal wall where runners express what their run meant today. This is the co-creation engine and primary engagement driver.

### Key Components

#### F2.1: Canvas Entry Page
**Purpose:** Invite contribution with clear, motivating prompt

**Elements:**
- **Main prompt:** "What did your run express today?"
- **Helper text:** "It doesn't have to be pretty. Just honest."
- **Medium selection:** Radio buttons or cards
  - Text (short phrase or longer reflection)
  - Image Upload (with optional caption)
  - (V1.1: Sticker Studio, Drawing Pad)
- **Visual:** Live wall preview in background (blurred or translucent)

#### F2.2: Text Input Mode
**Purpose:** Capture quick, honest reflections

**Form Fields:**
- **Primary input:** Text area (500 char limit)
  - Placeholder: "Today, I ran for..."
  - Examples below: "Sanity", "My Mom", "The Bacon", "Silence"
- **Caption/Note (optional):** Longer context (1000 char limit)
- **Vibe Tags (required):** Select 1-3 from taxonomy
  - **Mindset:** Meditative, Aggressive, Playful, Dark, Grateful, Pain Cave
  - **Context:** Race Day, Morning Miles, Night Run, Social, Solo, Commute
  - **Feeling:** Float, Grind, Flow, Heavy, Fast, Recovery
- **Attribution:**
  - If logged in: "Post as [Name]" with option for nickname/anonymous
  - If not logged in: "Post anonymously" (requires email for moderation follow-up)

**Submit button:** "Add to the Flow"

**Behavior:**
- Real-time character count
- Tag selection updates visual preview
- Immediate optimistic UI feedback on submit
- Toast notification: "Your expression is joining the Flow..."

#### F2.3: Image Upload Mode
**Purpose:** Visual storytelling (shoes, trail, post-run moment)

**Form Fields:**
- **Image upload:** Drag-and-drop or click to select
  - Accepted formats: JPG, PNG, HEIC
  - Max size: 5MB (compressed client-side via compressorjs to ~400KB)
  - Preview with crop/rotate tools (simple)
- **Caption (required):** Short description (500 char limit)
- **Vibe Tags (required):** Same taxonomy as text mode
- **Attribution:** Same as text mode

**Submit button:** "Add to the Flow"

**Behavior:**
- Image preview shown immediately after selection
- Client-side compression before upload
- Progress bar during upload
- Upload to Supabase Storage, URL stored in DB

#### F2.4: Sticker Composition Studio (V1.1 - NOT V1)
*Deferred to V1.1 for scope management*

**Concept:** Fabric.js-based editor where users layer branded stickers, text, and filters over uploaded photos

**Deferred features:**
- Drag-and-drop stickers
- Image filters (grayscale, sepia, high contrast)
- Text overlay with brand fonts
- Export composite image

#### F2.5: The Wall - Public Display
**Purpose:** Show communal flow; prove "you're not alone"

**Layout:**
- **Masonry grid** (react-masonry-css) for varied heights
- **Tile design:** Hand-drawn edges, subtle shadows, organic feel
- **Tile contents:**
  - Text entries: Quote-style display with attribution
  - Image entries: Photo with caption overlay
  - Vibe tags displayed as small badges
  - Timestamp ("2 hours ago")

**Filtering (V1.1):** By vibe tag, date range, media type

**Behavior:**
- **Initial load:** Show most recent 50 approved entries
- **Infinite scroll:** Load more as user scrolls
- **Real-time updates:** New approved entries appear via Supabase Realtime
  - Gentle animation (fade-in, slide from top)
- **Hover/tap:** Slight scale-up, show full text if truncated
- **Click:** Expand entry to full view (V1.1)

#### F2.6: Moderation Workflow
**Purpose:** Protect community quality; prevent abuse

**Process:**

1. **User submits:** Entry created with `moderation_status: pending`
2. **AI Check (OpenAI Moderation API):**
   - Text content scanned for hate speech, harassment, self-harm
   - If flagged: Auto-reject, user sees error message
   - If clean: Proceed to step 3
3. **Trust Scoring:**
   - **New users:** Status remains `pending`, added to admin queue
   - **Trusted users** (>3 approved posts): Auto-approve, `moderation_status: approved`
4. **Admin Queue:**
   - Admins see pending entries in dashboard
   - Quick approve/reject buttons
   - Bulk actions available
5. **Publication:**
   - Approved entries become `visibility: public`
   - Pushed to wall via Realtime subscription

**User Experience:**
- **Optimistic UI:** User sees their entry immediately in their own view
- **Pending state:** Subtle indicator: "Your expression is being reviewed"
- **Approval:** No notification needed (just appears publicly)
- **Rejection:** Email notification with reason (if email provided)

### User Stories

**US-F2-01:** As a runner, I want to quickly capture why I ran today so I can feel connected to the community.
**Acceptance Criteria:**
- [ ] Can submit text entry in <30 seconds from page load
- [ ] Entry appears in my personal view immediately
- [ ] Entry appears on public wall after approval

**US-F2-02:** As a first-time visitor, I want to see what others are running for so I understand the community vibe.
**Acceptance Criteria:**
- [ ] Wall shows diverse, authentic entries
- [ ] At least 30 seed entries visible at launch
- [ ] Entries update in real-time without page refresh

**US-F2-03:** As a repeat contributor, I want to be trusted so my entries appear immediately.
**Acceptance Criteria:**
- [ ] After 3 approved posts, my entries auto-approve
- [ ] System displays "Trusted Contributor" badge (V1.1)

**US-F2-04:** As an admin, I need to moderate submissions efficiently to maintain community quality.
**Acceptance Criteria:**
- [ ] Can see all pending entries in dashboard
- [ ] Can approve/reject with one click
- [ ] Can bulk-approve safe entries
- [ ] AI flags obvious violations automatically

### Acceptance Criteria (Overall)

- [ ] All input modes (text, image) functional
- [ ] Vibe tag taxonomy implemented and selectable
- [ ] OpenAI Moderation API integrated and working
- [ ] Wall displays masonry grid correctly on all devices
- [ ] Real-time updates via Supabase Realtime
- [ ] Anonymous and authenticated submissions both work
- [ ] Image compression reduces upload sizes to ~400KB
- [ ] Moderation queue accessible to admins
- [ ] At least 50 seed entries present at launch
- [ ] Analytics events: `flow_view`, `flow_submit`, `flow_approve`
- [ ] Mobile-optimized for portrait and landscape

---

## F3: DWTC Clubhouse

### Overview
A member-focused digital archive and community hub for the DWest Track Club. This establishes the replicable model for future clubs.

### Access Control
- **Public visitors:** Can view Overview page (teaser only)
- **Authenticated club members:** Full access to all sections
- **Admins:** Can moderate, feature, and manage content

### Key Components

#### F3.1: Clubhouse Navigation
**Purpose:** Clear wayfinding across club sections

**Structure:**
- Top-level route: `/club/dwtc`
- Tabs or sidebar navigation:
  - Overview
  - Lore & Stories
  - Media Archive
  - Resources
  - (Upload button persistent in header)

**Behavior:**
- Active tab highlighted
- Mobile: Hamburger or bottom tab bar
- Desktop: Sidebar or horizontal tabs

#### F3.2: Overview Page
**Purpose:** Welcome members; highlight recent activity and upcoming events

**Sections:**

**Hero Band:**
- Full-width image (DWTC crew photo, candid moment)
- Club tagline: "Where lore lives. Where miles turn into memories."
- Brief intro text (100-200 words on club identity)

**Upcoming Events Carousel:**
- Next 3 upcoming runs/races from calendar
- Card format: Date, event name, description
- CTA: "View full calendar" or "Add to calendar"

**Recent Contributions:**
- Latest 6-10 uploads (stories, photos, docs)
- Mix of media types for visual variety
- "See all in [Lore/Media/Resources] →" links

**Featured Story (optional):**
- Admin-pinned highlight (race report, tradition explainer)
- Large card with image and excerpt

**Behavior:**
- Responsive grid layout
- Carousel auto-plays slowly or swipeable
- All cards link to full content

#### F3.3: Lore & Stories
**Purpose:** Searchable archive of club history, race reports, traditions

**Layout:**
- Card-based list view
- Each card:
  - Title
  - Date
  - Author (club member)
  - Thumbnail image (if available)
  - Excerpt (first 100 chars)
  - Tags (race name, year, category)
  - CTA: "Read more →"

**Filtering & Search:**
- Filter by: Tag, year, author, story type
- Search bar: Full-text search on titles and body
- Sort by: Newest, oldest, most viewed (V1.1)

**Story Detail View:**
- Full markdown content rendered
- Author attribution with avatar (if available)
- Related stories at bottom (same tags)
- Social share buttons (V1.1)
- Comment system (V1.1)

**Behavior:**
- Stories render from MDX or database markdown field
- Embedded images load lazily
- Deep links shareable (e.g., `/club/dwtc/lore/first-bacon-ritual`)

#### F3.4: Media Archive
**Purpose:** Photo/video gallery with tagging and filtering

**Layout:**
- Masonry grid or structured photo grid
- Tile design: "Gritty, hand-embellished edges" per brand
- Each tile:
  - Thumbnail image/video
  - Hover/tap: Caption overlay, contributor name
  - Click: Lightbox or full-page view

**Filtering:**
- Filter by: Event, year, tag (race, workout, social, etc.)
- Tag chips above grid

**Media Detail View (Lightbox):**
- Full-size image/video
- Caption
- Contributor
- Date uploaded
- Event context (if linked)
- Download button (high-res, for members)
- Navigation arrows (prev/next in set)

**Behavior:**
- Lazy load images as user scrolls
- Video thumbnails show play button
- Videos play inline or in lightbox
- Keyboard navigation supported (arrow keys)

#### F3.5: Resources
**Purpose:** Training plans, route maps, PDFs, useful docs

**Layout:**
- List or grid of resource cards
- Each card:
  - File type icon (PDF, GPX, etc.)
  - Title
  - Description (1-2 sentences)
  - File size
  - Date added
  - Download button

**Categories:**
- Training Plans
- Route Maps
- Playbooks / Guides
- Historical Documents

**Behavior:**
- Files stored in Supabase Storage
- Download button triggers direct download or opens in new tab (PDFs)
- GPX files could integrate with Strava (V1.1)

#### F3.6: Upload Portal
**Purpose:** Low-friction member contribution flow

**Access:**
- Persistent "Add to Archive" button in clubhouse header
- OR dedicated `/club/dwtc/upload` route

**Upload Form:**

**Step 1: Choose Type**
- Radio cards: Story, Photo/Video, Document
- Visual icons for each

**Step 2: Input Details**

**If Story:**
- Title (required)
- Body text (markdown editor, 5000 char limit)
- Tags (race, year, tradition, etc.)
- Optional: Cover image upload
- Optional: Link to event

**If Photo/Video:**
- Drag-and-drop upload (multiple files supported)
- Caption per file (required, 500 chars)
- Tags (event, year, category)
- Optional: Link to event

**If Document:**
- File upload (PDF, GPX, etc., max 10MB)
- Title (required)
- Description (required, 500 chars)
- Category (Training Plan, Route, Guide, etc.)
- Tags

**Step 3: Attribution**
- Pre-filled with logged-in member name
- Optional: Use nickname instead
- No anonymous uploads in clubhouse (different from The Flow)

**Step 4: Review & Submit**
- Preview card showing how it will appear
- Edit button to go back
- Submit button: "Add to Archive"

**Step 5: Confirmation**
- Success message: "Your story just joined the DWTC archive."
- Link to where it will appear after moderation
- Option: "Add another" or "Go to Lore/Media"

**Behavior:**
- Client-side validation before submit
- Image compression via compressorjs
- Upload progress bar
- All uploads go to moderation queue (`pending` status)
- Admins notified via email (optional)

#### F3.7: Admin Moderation Tools
**Purpose:** Curate and feature clubhouse content

**Admin Dashboard:**
- Accessible at `/club/dwtc/admin` (role-gated)
- Tabs: Pending, Approved, Rejected, Featured

**Pending Queue:**
- List of all pending contributions
- Each row:
  - Thumbnail/icon
  - Title
  - Type (story/media/doc)
  - Contributor
  - Date submitted
  - Actions: Approve, Reject, View
- Bulk actions: Select multiple → Approve all

**Approve Action:**
- Sets `moderation_status: approved`, `visibility: public`
- Optional: Add to "Featured" (appears in Overview carousel)
- Content immediately visible in relevant section

**Reject Action:**
- Sets `moderation_status: rejected`, `visibility: hidden`
- Optional: Add rejection reason (sent to contributor)

**Featured Management:**
- Drag-to-reorder featured items
- Pin/unpin stories or media for Overview carousel

**Behavior:**
- Real-time update count of pending items
- Email notifications for new submissions (configurable)
- Action logging (who approved/rejected what, when)

### User Stories

**US-F3-01:** As a DWTC member, I want to quickly find the next group run so I don't miss workouts.
**Acceptance Criteria:**
- [ ] Overview page shows next 3 events prominently
- [ ] Can view full calendar (link or separate page)

**US-F3-02:** As a DWTC member, I want to upload race photos so the club archive grows.
**Acceptance Criteria:**
- [ ] Can upload multiple photos in one session
- [ ] Can add captions and tags to each photo
- [ ] See confirmation that my upload succeeded

**US-F3-03:** As a DWTC member, I want to search for "bacon" and find all related lore.
**Acceptance Criteria:**
- [ ] Search bar in Lore section
- [ ] Full-text search returns relevant stories
- [ ] Can filter by tags like "bacon" or "time-trial"

**US-F3-04:** As a club admin, I need to review member uploads before they go live.
**Acceptance Criteria:**
- [ ] All uploads start as `pending`
- [ ] Admin dashboard shows pending queue
- [ ] Can approve/reject with one click
- [ ] Approved content appears in archive immediately

**US-F3-05:** As a new DWTC member, I want to browse club history so I feel part of the tradition.
**Acceptance Criteria:**
- [ ] Lore section has at least 10 seed stories at launch
- [ ] Media archive has at least 50 seed photos
- [ ] Can browse by year and event
- [ ] Stories render beautifully with images

### Acceptance Criteria (Overall)

- [ ] All sections (Overview, Lore, Media, Resources, Upload) functional
- [ ] Authentication required for full access (Overview teaser public)
- [ ] Upload portal works for stories, photos, and documents
- [ ] Moderation queue accessible to admins only
- [ ] Search and filtering work across Lore and Media
- [ ] Lightbox works for media viewing
- [ ] Files download correctly from Resources
- [ ] Mobile-responsive across all sections
- [ ] At least 10 stories, 50 photos, 3 resources seeded at launch
- [ ] Analytics events: `clubhouse_view`, `clubhouse_upload`, `clubhouse_download`

---

## F4: Blog / Library (Content Hub)

### Overview
A simple, SEO-optimized blog for long-form content, essays, and philosophical pieces. Uses MDX for flexibility.

### Key Components

#### F4.1: Blog Index Page
**Route:** `/library` or `/blog`

**Layout:**
- Hero: "The Studio - Where ideas run long"
- Featured post (most recent or admin-selected)
- Grid of recent posts (thumbnails, titles, excerpts)
- Categories/tags filter
- Search bar

**Post Card:**
- Cover image
- Title
- Excerpt (first 150 chars)
- Author (Brock or guest)
- Date published
- Read time estimate
- Tags
- CTA: "Read more →"

#### F4.2: Post Detail Page
**Route:** `/library/[slug]`

**Elements:**
- Cover image (full-width or hero)
- Title (H1)
- Author, date, read time
- Body content (rendered from MDX)
  - Supports: Images, videos, embedded components (e.g., pace calculator)
  - Styled per brand (typography, colors)
- Tags at bottom
- Social share buttons
- Related posts (same tags)
- Comment system (V1.1 - maybe Disqus or native)

**Behavior:**
- MDX rendered with `next-mdx-remote`
- Code syntax highlighting (if sharing training code/scripts)
- Images lazy-loaded
- Deep links to headings (anchor links)

#### F4.3: Category/Tag Pages
**Route:** `/library/category/[slug]` or `/library/tag/[slug]`

**Layout:**
- Same as Blog Index, filtered by category/tag
- Heading: "Posts tagged: [Tag Name]"

#### F4.4: Author Page (V1.1 - Optional for V1)
**Route:** `/library/author/[name]`

**Layout:**
- Author bio
- All posts by that author

### Content Categories (Suggested)

- **Philosophy:** Deep dives on expressive running, flow states
- **The Bacon Ritual:** Stories about DWTC traditions and community
- **Training Wisdom:** Practical guidance blended with philosophy
- **Creative Expression:** Art, comics, playlists related to running

### Acceptance Criteria

- [ ] Blog index page renders with at least 5 seed posts
- [ ] Post detail pages render MDX correctly
- [ ] Images and videos display properly
- [ ] Tag/category filtering works
- [ ] Search returns relevant results (V1.1)
- [ ] Related posts appear at bottom of each post
- [ ] SEO meta tags (title, description, OG image) set per post
- [ ] Mobile-responsive reading experience
- [ ] Analytics events: `blog_view`, `blog_read_time`

---

## F5: Shop Framework

### Overview
Basic e-commerce setup for physical and digital products via Stripe. Full inventory and print-on-demand integration deferred to V1.1.

### V1 Scope
- Product catalog browsable
- Product detail pages functional
- Stripe Checkout integration
- Order confirmation
- Digital product delivery (email PDF)

### Key Components

#### F5.1: Shop Index Page
**Route:** `/shop`

**Layout:**
- Hero: "The Marketplace of Expression"
- Product grid (cards)
- Filter by: Type (physical, digital), category

**Product Card:**
- Image
- Name
- Price
- "View Details" button

#### F5.2: Product Detail Page
**Route:** `/shop/[slug]`

**Elements:**
- Image gallery (multiple angles)
- Product name
- Price
- Description (markdown)
- Variants (size, color) - dropdown selects
- Quantity selector
- "Add to Cart" button (redirects to Stripe Checkout for V1)
- Product details (shipping, materials, etc.)

**For Digital Products:**
- No variants or quantity
- "Purchase & Download" button

#### F5.3: Checkout (Stripe-Hosted)
**Flow:**
1. User clicks "Add to Cart" or "Buy Now"
2. Redirect to Stripe Checkout (hosted page)
3. User completes payment
4. Stripe redirects back to `/shop/success?session_id=xxx`

**Success Page:**
- Thank you message
- Order summary
- For digital products: Download link
- Email confirmation sent

**Cancel/Error Page:**
- If user cancels or payment fails
- Redirect to `/shop/cancel`
- Friendly message, link back to shop

#### F5.4: Order Management (V1 - Admin Only)
- View orders in Stripe Dashboard (no custom admin needed for V1)
- Webhook listener for `checkout.session.completed` to unlock digital products

### Products for V1 (Suggested)

**Physical:**
- Runner greeting cards (packs of 5) - $15
- DWTC T-shirts (TBD print-on-demand) - $25-30

**Digital:**
- "The Expressive Runner Handbook" PDF - $10
- Marathon training plan PDF - $15

### Acceptance Criteria

- [ ] Shop index page displays products
- [ ] Product detail pages render with images and descriptions
- [ ] Stripe Checkout integration works
- [ ] Successful payments redirect to success page
- [ ] Digital products sent via email after purchase
- [ ] At least 2 products (1 physical, 1 digital) available at launch
- [ ] Mobile-optimized shopping experience
- [ ] Analytics events: `shop_view`, `product_view`, `checkout_start`, `purchase_complete`

---

## F6: Interactive Tools

### Overview
Simple, useful calculators and tools that provide immediate value and demonstrate the "process over outcome" philosophy.

### V1 Scope: Build 1-2 Tools

#### F6.1: Expressive Pace Calculator
**Purpose:** Standard VDOT pace calculator with philosophical overlay

**Inputs:**
- Recent race result (distance, time)
- OR current easy pace

**Outputs:**
- Training paces (easy, tempo, interval, etc.)
- **Unique twist:** Each pace gets a "vibe descriptor"
  - Easy pace: "Conversational, bacon-cooking pace"
  - Tempo pace: "Comfortably hard, finding flow"
  - Interval pace: "Pain cave exploration"

**Features:**
- Save results (requires login/signup) - V1.1
- Export to PDF or image for sharing
- CTA: "Track your training with the AI Coach (coming soon)"

#### F6.2: Race Readiness Check (V1.1 - Optional for V1)
**Purpose:** Simple quiz assessing marathon readiness

**Flow:**
- 5-10 questions (weekly mileage, long run distance, injury status, etc.)
- Results: Not a score, but a reflection
  - "You're ready to race"
  - "You're ready to start, not finish" (process over outcome)
  - "You're ready to DNS wisely" (injury prevention)

**CTA:** "Build your plan with the AI Coach (waitlist)"

### Acceptance Criteria

- [ ] Pace calculator functional and accurate
- [ ] "Vibe descriptors" match brand voice
- [ ] Tool works on mobile and desktop
- [ ] Option to save results (if logged in)
- [ ] Clear CTA to AI Coach waitlist
- [ ] Analytics events: `tool_use`, `tool_result_save`

---

## F7: Authentication & User Profiles

### Overview
Simple auth via Supabase (email/password and OAuth)

### V1 Scope

#### F7.1: Sign Up
**Routes:** `/signup`

**Form Fields:**
- Email (required)
- Password (required, min 8 chars)
- Full name (required)
- Optional: Why do you run? (pre-fill for profile)

**OAuth Options (V1.1):**
- Google
- Strava (future integration)

**Submit:** Create account → Verify email → Redirect to dashboard or homepage

#### F7.2: Log In
**Route:** `/login`

**Form Fields:**
- Email
- Password
- "Forgot password?" link

**Submit:** Authenticate → Redirect to previous page or dashboard

#### F7.3: Password Reset
**Route:** `/reset-password`

**Flow:**
- Enter email
- Receive reset link via email
- Click link → Set new password → Redirect to login

#### F7.4: User Profile (V1.1 - Basic for V1)
**Route:** `/profile` or `/dashboard`

**Elements:**
- Avatar (upload or default)
- Name, email
- Bio / "Why I run" statement
- My Flow submissions (list)
- My Clubhouse uploads (if club member)
- Settings: Email preferences, password change

### Acceptance Criteria

- [ ] Signup works with email/password
- [ ] Email verification required before full access
- [ ] Login works, session persists across pages
- [ ] Password reset flow functional
- [ ] User profile accessible and editable (basic fields)
- [ ] Logout works and clears session
- [ ] Protected routes redirect to login if not authenticated
- [ ] Analytics events: `signup`, `login`, `logout`

---

## F8: AI Coach Teasers & Waitlist

### Overview
Embed "coach is coming" messaging throughout site; capture waitlist emails

### Locations

#### F8.1: Homepage Section
**Placement:** After Flow preview, before footer

**Elements:**
- **H2:** "The Coach That Knows Your Miles and Your Stories"
- **Body:** 2-3 lines explaining AI Coach vision (personalization, community-aware, expressive)
- **CTA:** "Join the Waitlist"

#### F8.2: Canvas/Flow Page
**Placement:** Subtle note near input

**Elements:**
- Small text: "These stories will help shape the future RunExpression AI coach."
- Info icon with tooltip (more context)

#### F8.3: Clubhouse
**Placement:** Overview page or sidebar

**Elements:**
- Callout box: "Eventually, the coach will read this wall to understand our team's lore and training patterns."
- **CTA:** "Join the coach waitlist"

### Waitlist Form

**Route:** `/coach/waitlist` or modal on homepage

**Form Fields:**
- Email (required)
- "What are you running for?" (optional, 500 chars)
- "What kind of guidance would you want from a coach?" (optional, 500 chars)

**Submit:**
- Store in `ai_coach_waitlist` table
- Show success message: "You're in the lab now. We'll email you when the coach wakes up."
- Optional: Send confirmation email

### Acceptance Criteria

- [ ] AI Coach teaser appears on homepage, Flow, and Clubhouse
- [ ] Waitlist form accessible from all teasers
- [ ] Form captures email and optional context
- [ ] Success message displayed after submit
- [ ] Duplicate emails handled gracefully
- [ ] Admin can export waitlist emails (CSV from Supabase)
- [ ] Analytics events: `waitlist_view`, `waitlist_submit`

---

## User Flows

### Flow 1: First-Time Visitor → Flow Contributor

1. User lands on homepage via Google search ("running philosophy")
2. Scrolls through manifesto chapters (Motion Creates Emotion, etc.)
3. Sees Flow preview strip with other runners' words
4. Clicks "Enter the Flow"
5. Prompted: "What did your run express today?"
6. Types: "Clarity" (doesn't log in, stays anonymous)
7. Selects vibe tags: "Meditative", "Morning Miles", "Float"
8. Clicks "Add to the Flow"
9. Sees optimistic UI: "Your expression is joining the Flow..."
10. OpenAI moderation check passes
11. Entry added to admin queue (new user, not auto-approved)
12. User sees: "Your expression is being reviewed. It'll appear soon."
13. Admin approves within 1 hour
14. Entry appears on public wall
15. User returns next day, sees their entry, feels connected
16. Creates account to save future entries

**Success Metric:** 30% of first-time visitors submit to Flow within session

---

### Flow 2: DWTC Member → Clubhouse Upload

1. DWTC member receives email: "The Clubhouse is live!"
2. Clicks link, lands on `/club/dwtc`
3. Prompted to log in (or signs up if new)
4. Browses Overview, sees recent uploads from other members
5. Clicks "Lore & Stories", reads "The First Bacon Ritual" story
6. Inspired, clicks "Add to Archive" button in header
7. Selects "Photo/Video"
8. Uploads 5 photos from last Saturday's track workout
9. Adds caption to each: "8x800m. We suffered together. #bacon"
10. Tags: "DWTC", "2025", "Track", "Social"
11. Clicks "Submit"
12. Confirmation: "Your photos just joined the DWTC archive."
13. Photos go to moderation queue
14. Admin (Brock) approves that evening
15. Photos appear in Media Archive
16. Member shares link with crew via WhatsApp: "Check out the new Clubhouse!"

**Success Metric:** 50% of DWTC members upload at least 1 item within first month

---

### Flow 3: Runner → Pace Calculator → Waitlist

1. Runner Googles "marathon pace calculator"
2. Lands on `/tools/pace-calculator`
3. Enters recent half-marathon time: 1:35:00
4. Calculator shows training paces with "vibe descriptors"
   - Easy: "7:45/mi - Conversational, bacon-cooking pace"
   - Tempo: "6:50/mi - Comfortably hard, finding flow"
5. Runner smiles at "bacon-cooking pace", saves screenshot
6. Sees CTA: "Get personalized training with the AI Coach (coming soon)"
7. Clicks "Join Waitlist"
8. Enters email and note: "I want a coach who gets that running is about more than times"
9. Submits
10. Confirmation: "You're in the lab now. We'll be in touch."
11. Browses site, reads manifesto, follows on Instagram

**Success Metric:** 20% of tool users join AI Coach waitlist

---

## Content Requirements

### Homepage
- [x] Hero copy written and approved
- [x] 4 manifesto chapters (copy finalized)
- [ ] Flow preview strip design
- [ ] Clubhouse teaser copy and image

### The Flow
- [ ] 50+ seed submissions (diverse, authentic)
  - Mix of text and images
  - Range of vibe tags represented
  - Include some humorous, some deep
- [ ] Input placeholder examples
- [ ] Helper text for each field
- [ ] Moderation rejection message templates

### DWTC Clubhouse
- [ ] 10+ lore stories written (markdown)
  - "The First Bacon Ritual"
  - "Sub-16 Club Initiation"
  - "The Origin of DWTC"
  - Race reports from key events
- [ ] 50+ photos uploaded (diverse events, people, moments)
- [ ] 3-5 resources (training plans, route maps)
- [ ] Overview page welcome copy
- [ ] Section descriptions and microcopy

### Blog / Library
- [ ] 5+ initial blog posts
  - "The Expressive Runner's Creed" (manifesto deep dive)
  - "Why the Bacon Ritual Matters" (DWTC tradition)
  - "Motion Creates Emotion: The Science" (philosophical + data)
  - "How to Build a Running Tribe" (practical guide)
  - "Process Over Outcome in Marathon Training" (training philosophy)

### Shop
- [ ] Product descriptions (2 physical, 2 digital)
- [ ] Product images (multiple angles, lifestyle shots)
- [ ] Shop hero copy

### AI Coach Waitlist
- [ ] Teaser copy for each location (homepage, Flow, Clubhouse)
- [ ] Waitlist form helper text
- [ ] Success/confirmation message

---

## Non-Functional Requirements

### Performance
- **Page Load:** LCP < 2s on 3G connection
- **Interactivity:** FID < 100ms
- **Visual Stability:** CLS < 0.1
- **Image Optimization:** All images served as WebP with fallbacks
- **Code Splitting:** Dynamic imports for heavy components (Fabric.js, etc.)

### Accessibility
- **Standard:** WCAG 2.1 AA compliance
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Screen Readers:** ARIA labels on all non-text content
- **Color Contrast:** Minimum 4.5:1 for body text, 3:1 for large text
- **Motion:** Respect `prefers-reduced-motion` setting
- **Alt Text:** All meaningful images have descriptive alt text
- **Focus States:** Visible focus indicators on all interactive elements

### Security
- **Authentication:** Supabase-managed, industry-standard
- **Data Storage:** User passwords hashed (bcrypt via Supabase)
- **File Uploads:** Validated (type, size) client and server-side
- **XSS Protection:** All user input sanitized before display
- **CSRF Protection:** Supabase handles token management
- **Content Moderation:** OpenAI Moderation API for text, admin review for images
- **Rate Limiting:** Prevent spam submissions (Supabase or Vercel middleware)

### Privacy
- **GDPR Compliance:** Privacy policy, cookie consent, data export/deletion (V1.1)
- **Email Collection:** Clear opt-in, unsubscribe link in all emails
- **Anonymous Contributions:** No tracking beyond IP (for abuse prevention)
- **Data Retention:** Define policies for Flow entries, clubhouse content

### Browser Support
- **Modern Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS Safari, Chrome Android
- **Progressive Enhancement:** Core content accessible without JS

### SEO
- **Meta Tags:** Title, description, OG tags on all pages
- **Sitemap:** Auto-generated, submitted to Google
- **Structured Data:** Schema.org markup for articles, events
- **URL Structure:** Semantic, readable slugs
- **Image Alt Text:** Descriptive for accessibility and search

### Analytics
**Events to Track:**
- Page views (all pages)
- CTA clicks (homepage, Flow, Clubhouse)
- Form submissions (Flow, waitlist, signup, upload)
- Scroll depth (homepage manifesto)
- Flow entry approvals/rejections
- Clubhouse uploads
- Shop product views and purchases
- Tool usage
- Authentication events (signup, login, logout)
- Error events (404s, failed uploads)

**Tools:**
- Google Analytics 4 OR
- Amplitude OR
- Mixpanel (to be decided)

---

## Appendix: Open Questions for Product Owner

1. **Flow Anonymity:** Should anonymous submissions be allowed, or require signup?
   - **Recommendation:** Allow anonymous for V1 to reduce friction; add "Sign up to save your contributions" CTA

2. **Clubhouse Access:** Is Overview page fully public, or gated teaser?
   - **Recommendation:** Public teaser (hero + 3 recent items) to attract new members

3. **Shop Launch Timing:** Should products be live at V1 launch, or "Coming Soon"?
   - **Recommendation:** At least 2 products live (1 physical, 1 digital) for validation

4. **Comment System:** On blog posts, should users be able to comment?
   - **Recommendation:** Defer to V1.1; use social media for engagement initially

5. **Email Platform:** ConvertKit, Mailchimp, or native?
   - **Recommendation:** ConvertKit for creator-focused email marketing

6. **Strava Integration:** V1 or V1.1?
   - **Recommendation:** V1.1; focus on core experiences first

---

## Document Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-12-14 | 1.0 | Initial PRD creation | Product Team |

---

**Next:** Review [03-TECHNICAL-DESIGN.md](./03-TECHNICAL-DESIGN.md) for architecture and implementation details.
