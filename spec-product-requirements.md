## RunExpression v1 website

This is a smart strategic move. By building Runexpression now, you accomplish two critical goals: you start building domain authority and SEO equity for your brand immediately, and you create a "sandbox" to test the technology stack that will eventually power the AI Coach platform.
Based on the architectural decisions already made for the AI Coach, we can design Runexpression to share the same DNA. This ensures that when the AI Coach is ready, it can either be a subdomain (https://www.google.com/search?q=app.runexpression.com) or a direct integration without a painful migration.
Here is the Runexpression V1 Specification & Architecture Plan.
1. High-Level Strategy & Tech Alignment
To maintain synergy with the AI Coach plans, we will use the "Pragmatic Monolith" approach.
	•	Framework: Next.js (React). This handles your marketing pages (SEO), your interactive tools (client-side React), and your club dashboard.
	•	Styling: Tailwind CSS + Shadcn/UI. This ensures your brand website and the future AI app look like part of the same family.
	•	Database & Auth: Supabase. This provides the PostgreSQL database and Authentication. Critical Strategy: If users create an account on Runexpression now for premium content, that same account credentials will work for the AI Coach later.
	•	E-Commerce: Stripe Checkout. Instead of a heavy Shopify integration, we will use Stripe directly. It integrates easily with Next.js, handles tax/shipping, and is developer-friendly.
	•	CMS: MDX (Markdown + JSX) or Payload CMS. Given the AI Coach documents mention Payload CMS for admin interfaces, using it here allows you to test it as a content management tool. However, for pure speed, MDX is faster to start.
2. Detailed Requirements (V1 Scope)
A. Public Marketing & Content (The "Hook")
	•	Home Page: Brand manifesto, latest articles, featured shop items.
	•	Blog/Articles: A section for SEO-rich content on running, training, and community.
	•	Interactive Tools (Free): Simple React calculators to drive traffic.
	•	Examples: Pace Converter, Race Time Predictor, Heart Rate Zone Calculator.
	•	Lead Capture: "Join the Club" / Newsletter signup (integrated with Supabase or a tool like ConvertKit).
B. E-Commerce (The "Shop")
	•	Product Types: Physical goods (Greeting cards, T-shirts) and Digital goods (PDF guides, Training Plans).
	•	Functionality:
	•	Product listing page.
	•	Product detail page.
	•	Cart (Persistent).
	•	Checkout (Redirect to Stripe Hosted Checkout for security and simplicity).
	•	Order Management: Basic dashboard to see orders (via Stripe Dashboard initially to save dev time).
C. Membership Layers (The "Moat")
We will implement Role-Based Access Control (RBAC) using Supabase.
	1	Public/Guest: Can view articles, shop, and use basic tools.
	2	Registered User (Free): Can save tool results (e.g., "Save my race paces") and comment on articles.
	3	Premium Member: Access to exclusive "Deep Dive" content or advanced tools.
	4	Club Member (e.g., "Runexpression Club"): Access to a specific /club/[clubName] dashboard.
D. The "Club Hub" (Private Area)
	•	Club Dashboard: A landing page specific to a running club.
	•	Announcements: Admin-posted updates.
	•	Resource Library: Downloadable routes, PDF guides specific to that club.
	•	Member Directory: Simple list of other members in that club (opt-in).
3. User Flows
Flow 1: The Shopper
Visitor lands on Home -> Clicks "Shop" -> Adds "Runner Greeting Card" to Cart -> Clicks Checkout -> Redirects to Stripe -> Pays -> Redirects back to "Thank You" page -> Receives Email Receipt.
Flow 2: The Club Member
Visitor lands on Home -> Clicks "Login" -> Enters Email/Password (Supabase Auth) -> System detects "Club Member" role -> Redirects to "/dashboard/club" -> User sees next week's group run schedule.
Flow 3: The Tool User (Future Lead)
Visitor Googles "Marathon Pace Calculator" -> Lands on Runexpression Tool Page -> Uses Tool -> CTA: "Save these paces to your profile?" -> Clicks "Save" -> Prompted to Sign Up -> Account Created.
4. Data Model (Supabase/PostgreSQL)
We will stick to the Hybrid Relational/JSONB approach outlined in the AI Coach architecture to maintain flexibility.
Core Tables:
	1	profiles: Extends the basic Supabase Auth user.
	•	id (UUID, PK)
	•	email
	•	full_name
	•	membership_tier (Enum: free, premium)
	•	metadata (JSONB: preferences, shoe size, etc.)
	2	clubs: Represents the running clubs (starting with yours).
	•	id (UUID)
	•	name
	•	slug (e.g., "run-expression-club")
	•	branding (JSONB: logo_url, primary_color)
	3	club_memberships: Links users to clubs.
	•	user_id (FK)
	•	club_id (FK)
	•	role (member, admin, coach)
	4	products: Your e-commerce items.
	•	id (UUID)
	•	stripe_price_id (The link to Stripe)
	•	name
	•	description
	•	images (Array)
	•	stock_status
5. Implementation Roadmap
Phase 1: Foundation (Weeks 1-2)
	•	Initialize Next.js 14 (App Router) project with TypeScript.
	•	Setup Tailwind CSS and Shadcn/UI.
	•	Setup Supabase project (Auth + Database).
	•	Build "Coming Soon" landing page with email capture.
Phase 2: Content & Marketing (Weeks 3-4)
	•	Build the Blog architecture (using MDX for easy writing).
	•	Create the "Interactive Tools" layout.
	•	Build 1 Calculator Tool (e.g., Pace Calculator) to test interactivity.
Phase 3: The Shop (Weeks 5-6)
	•	Setup Stripe account.
	•	Create products table in Supabase.
	•	Build Product Listing and Detail pages.
	•	Implement Stripe Checkout integration.
Phase 4: Accounts & Club Hub (Weeks 7-8)
	•	Build Login/Signup pages (Supabase Auth UI).
	•	Create the dashboard layout.
	•	Implement Row Level Security (RLS) policies so only club members can see their club data.
6. Why This approach?
	1	Reusability: The profiles table and Auth setup you build here will literally be the same database users for the AI Coach later. You won't have to migrate users; you will just turn on new features for them.
	2	Cost: Vercel (Hosting), Supabase (DB), and Stripe (Payments) all have generous free tiers or pay-as-you-go models. This fits the budget constraints mentioned in the POC plan.
	3	Flexibility: By using JSONB for metadata and branding, we can change what a "Club" looks like without rewriting the database schema, adhering to the "Flexible Monolith" concept.


## Run Expression V1: Project Specification
1. Updated Functional Requirements
A. The "Shop" (Automated Fulfillment)
	•	Strategy: Use Stripe Checkout for the payment UI, but trigger a Printful (or similar) API call via webhook to fulfill the order automatically.
	•	Requirements:
	•	Product variants (Size/Color) stored in Supabase (matching the POD provider's SKUs).
	•	Automated shipping calculation (passed from POD provider to Stripe if possible, or flat rate for V1).
	•	"Order Received" email (System transactional) + "Shipped" email (Triggered by POD webhook).
B. The "Club Hub" (DWest Lore Archive)
	•	Access: Private (Club Members Only).
	•	Content Types:
	•	The Timeline: A visual history of the club (Key dates, "The First Bacon," etc.).
	•	Race Reports: Long-form essays with embedded photos.
	•	The Record Board: A structured data table (PRs, Club Records) that is filterable (e.g., "Show me all Sub-16 5Ks").
	•	Gallery: A photo/video grid hosted in Supabase Storage.
2. Updated Data Architecture (Schema)
We need to add specific tables for the "Lore" and the "Shop Variants."
-- ... (Previous Profiles & Clubs tables remain the same) ...  -- 5. CLUB CONTENT (The Lore) -- Polymorphic table to handle Articles, History, and Media create table club_content (   id uuid default gen_random_uuid() primary key,   club_id uuid references clubs(id),   author_id uuid references profiles(id),      title text not null,   slug text not null, -- e.g., "2020-time-trial-bacon"   content_type text check (content_type in ('history', 'race_report', 'news')),      -- The actual content (MDX string or JSON)   body_content text,    cover_image_url text,      published_at timestamptz default now(),   tags text[] -- ['time-trial', 'bacon', 'pr'] );  -- 6. CLUB RECORDS (The Data Lore) -- Structured data for the "Record Board" create table club_records (   id uuid default gen_random_uuid() primary key,   club_id uuid references clubs(id),   athlete_id uuid references profiles(id),      event_name text, -- "5k", "Marathon"   result_value text, -- "15:59"   result_date date,   location text,      -- Link to a story about this record if it exists   race_report_id uuid references club_content(id),      verified boolean default false );  -- 7. PRODUCT VARIANTS (For POD Integration) create table product_variants (   id uuid default gen_random_uuid() primary key,   product_id uuid references products(id),      -- The ID used by Printful/Printify   external_variant_id text,       size text,   color text,   price_amount integer, -- Stored in cents (e.g., 2500 = $25.00)   stock_status boolean default true ); 
3. Implementation Guide: Phase 1 (The Skeleton)
We are going to initialize the project structure. This setup assumes you are comfortable with the command line.
Step 1: Project Initialization
Open your terminal and run these commands to scaffold the "Pragmatic Monolith."
# 1. Create the Next.js app (using the latest stable version) npx create-next-app@latest run-expression --typescript --tailwind --eslint  # 2. Enter the directory cd run-expression  # 3. Install the Core "Vibe" UI libraries (Shadcn/UI) npx shadcn-ui@latest init # (Select Default, Slate, and 'Yes' to CSS variables)  # 4. Install Core Dependencies npm install @supabase/ssr @supabase/supabase-js stripe lucide-react date-fns npm install next-mdx-remote --save # For the blog/lore content 
Step 2: Directory Structure
We will organize the code to separate the "Marketing" (Public) from the "App" (Club/Shop).
run-expression/ ├── app/ │   ├── (public)/           # Marketing Routes (Home, About, Blog) │   │   ├── page.tsx        # The Manifesto (Home) │   │   ├── about/ │   │   └── lore/           # Public philosophical articles │   ├── (shop)/             # E-commerce Routes │   │   ├── shop/ │   │   └── checkout/ │   ├── (app)/              # Authenticated Routes (The Club Hub) │   │   ├── login/ │   │   └── club/ │   │       └── [slug]/     # e.g., /club/dwest │   │           ├── page.tsx (Dashboard) │   │           ├── history/ (The Timeline) │   │           └── records/ (The Record Board) │   ├── api/ │   │   ├── webhooks/ │   │   │   └── stripe/     # Trigger POD fulfillment here │   │   └── auth/           # Supabase Auth callback │   └── layout.tsx ├── components/ │   ├── ui/                 # Shadcn Atoms (Buttons, Inputs) │   ├── marketing/          # Hero sections, Manifesto scrollers │   ├── club/               # Record tables, Member lists │   └── shop/               # Product cards, Cart drawers ├── lib/ │   ├── supabase/           # DB Clients (Server/Client) │   ├── stripe.ts           # Payment Logic │   └── utils.ts └── content/                # Local MDX files for V1 articles 
Step 3: First Code Artifact (The Manifesto Page)
Let's establish the visual tone immediately. Here is a starting point for app/(public)/page.tsx that captures the "Run Expression" philosophy.
// app/(public)/page.tsx import Link from 'next/link' import { Button } from '@/components/ui/button'  export default function Home() {   return (     <main className="flex flex-col min-h-screen bg-stone-950 text-stone-100">       {/* Hero Section */}       <section className="relative h-screen flex items-center justify-center overflow-hidden">         {/* Placeholder for a gritty texture or Landon Peacock art background */}         <div className="absolute inset-0 bg-[url('/texture-noise.png')] opacity-10 z-0"></div>                  <div className="z-10 max-w-4xl px-6 text-center space-y-8">           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight font-serif">             Interdependence over <span className="italic text-orange-500">Independence</span>.           </h1>           <p className="text-xl md:text-2xl text-stone-400 max-w-2xl mx-auto leading-relaxed">             Athletic expression is how we convert the universal flow into goodness.              Join the movement to reimagine competitive running as a communal act.           </p>           <div className="flex gap-4 justify-center pt-8">             <Link href="/about">               <Button variant="outline" size="lg" className="border-stone-600 hover:bg-stone-800 text-stone-100">                 Read the Manifesto               </Button>             </Link>             <Link href="/shop">               <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white border-none">                 Visit the Shop               </Button>             </Link>           </div>         </div>       </section>        {/* The "Bacon Ritual" Teaser */}       <section className="py-24 px-6 bg-stone-900 border-t border-stone-800">         <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">           <div className="aspect-square bg-stone-800 rounded-lg flex items-center justify-center">             <span className="text-stone-600">[Placeholder: Image of Bacon/Track]</span>           </div>           <div className="space-y-6">             <h2 className="text-3xl font-bold font-serif">Process over Outcome.</h2>             <p className="text-lg text-stone-400">               When the DWest Track Crew stopped obsessing over splits and started                cooking bacon in the parking lot, the PRs followed.              </p>             <p className="text-lg text-stone-400">               We are building tools and spaces for the <strong>Expressive Runner</strong>.             </p>           </div>         </div>       </section>     </main>   ) } 
4. Next Actions (The Checklist)
Here is your "Founder Mode" checklist for this week:
	1	Repo Setup: Run the commands in Step 3 above to get the code live on your local machine.
	2	Supabase Init: Go to database.new (Supabase), create a project called "Run Expression," and save the API keys.
	3	Asset Gathering: Create a folder in the new code repo called /public/assets and drop your Landon Peacock art and article images there.
	4	Content Prep: Since you have the digital assets, convert your "Bringing Home The Bacon" article into a simple Markdown file (bacon.md).

## Good call—this is exactly the right moment to consolidate.

Given everything we’ve laid out (homepage, Why You Run Canvas, DWTC Clubhouse, phases A–D, and brand/manifesto), the “single final spec” your team needs is essentially:

> **“RunExpression Website V1 – Product & Implementation Spec”**  
> that combines UX, content, IA, and build checklists into one source of truth. fileciteturn1file8turn1file9  

To keep this usable in Linear, I’ll structure it so you can either:
- keep it as one doc, or  
- slice each major section into its own Linear project/label (Homepage, Canvas, Clubhouse, AI Coach hooks).

Below is a concise but complete spec you can copy as-is into a doc and link from Linear.

---

# RunExpression Website V1 – Product & Implementation Spec

## 1. Scope & Goals

- **In-scope for V1**
  - Expressive homepage with manifesto-driven scroll experience and CTA into the Canvas and Clubhouse.
  - “Why You Run” Interactive Canvas V1 (simple but magical, captures text + metadata, shows communal wall).
  - DWTC Clubhouse V1 (content hub + simple member uploads).
  - Light **AI Coach integration hooks**: copy + UI stubs; no full backend coach yet.    

- **Out-of-scope for V1**
  - Full AI coach engine, personalization, auth-gated programs.
  - Complex analytics beyond basic tracking events.

Success for V1 = a coherent brand experience that feels like: **lab for human potential + tribe + lore**, and a clear “this is going somewhere” hint toward the AI coach.

---

## 2. Architecture & Tech Overview (High-Level)

- **Front-end:** React / Next.js single codebase, responsive, with design tokens reflecting brand guide (typography, color, motion).    
- **Data & APIs:**
  - Simple backend or BaaS (Supabase/Firebase) for:
    - Canvas submissions (text + optional tags + basic telemetry).
    - DWTC content objects + member uploads.
- **Integrations (planned, light):**
  - Event tracking (e.g., PostHog / GA) for key interactions.
  - Placeholder endpoints/SDK hooks for future AI coach.

---

## 3. Homepage Spec (Summary)

You already have a deep homepage spec; V1 build should cover:    

- Hero with agreed headline (Option A) and clear CTA buttons:
  - “Add your story →” (to Canvas)
  - “Visit the Clubhouse →” (DWTC)
- Scroll-driven manifesto layers:
  - Short opening lines (“Make running mean more…”) then sliding deeper into the Expressive Runner’s Creed.
- Visual treatment:
  - “Lab / tribe / lore” energy via:
    - Subtle motion (parallax, scroll fades).
    - Real or stylized run imagery.
    - Typography echoing the creed’s seriousness + playfulness.
- Implementation detail:
  - All copy and sections explicitly named in code (ids) so tracking and deep-linking is easy later.

Since you didn’t ask to rewrite that here, I’ll focus the rest on B, C, and D.

---

## 4. “Why You Run” Interactive Canvas – Build Checklist

### 4.1 Front-end Experience

**Tasks**
- Implement Canvas page route (`/why-you-run`).
- Build layout: manifesto snippet + instructions + central interactive area.
- Input module:
  - Rich but simple text input (multi-line, 500–1000 char limit).
  - Optional quick prompts/chips: “Community”, “Pain”, “Art”, “Reinvention” etc (aligned with pillars).    
- “Wall” visualization:
  - Masonry grid or clustered nodes that:
    - Show recent/featured submissions.
    - Animate gently on hover/scroll to feel alive.
- CTA / navigation:
  - Clear link back to homepage and over to DWTC Clubhouse.

**Definition of Done**
- Page matches brand typography/colors.
- Works on mobile, tablet, desktop with no broken layouts.
- User can submit a story and instantly see it reflected in the wall.
- Error and empty states are styled (no generic browser alerts).

### 4.2 Data Model & Storage

**Tasks**
- Create `why_you_run_entries` table/collection with fields like:
  - `id`, `created_at`
  - `text`
  - `tags` (array or string)
  - `source` (anon, clubhouse member, etc. for later)
  - `moderation_status` (pending/approved/hidden)
- Implement basic write API or BaaS rules:
  - Rate limiting or lightweight protection against spam.
  - Public read of approved entries.

**Definition of Done**
- New submissions are persisted and reloaded on refresh.
- Wall only uses `approved` entries.
- Basic volume test with ~100–500 entries doesn’t break layout.

### 4.3 Brand & Motion Layer

**Tasks**
- Implement animations that map to **“motion creates emotion”**:
  - Submissions gently move, pulse, or fade in.
  - On hover, expanded card shows more text and subtle highlighting.
- Copy touchpoints:
  - Microcopy in input area sounds like “Sage in the Parking Lot” (inviting, a bit wry, not preachy).    

**Definition of Done**
- Motion is smooth at 60fps on modern laptop and acceptable on mid-range mobile.
- Animations are subtle enough not to distract from reading.

---

## 5. DWTC Clubhouse V1 – Build Checklist (Combined A–D)

### 5.1 Structure, Navigation & IA

**Tasks**
- Implement `/clubhouse` route, with sub-anchors or subroutes:
  - Overview / Lore
  - Training & Races
  - Media (photos, videos)
  - Member Archive (uploads)
- Top-level layout:
  - Hero banner with DWTC identity.
  - Secondary nav within the page (tabs or sticky sidebar).
- Breadcrumbs / back-links to homepage and Canvas.

**Definition of Done**
- A new visitor can tell in <10 seconds:
  - What DWTC is.
  - How serious vs playful the culture is.
- All sections reachable within 1–2 clicks from `/clubhouse`.

### 5.2 Static Content & Lore

**Tasks**
- Content types:
  - Text posts: stories, recaps, lore pieces.
  - PDFs: training plans, playbooks.
  - Embedded videos (YouTube/Vimeo or file-based).
  - Image galleries.
- Implement content components:
  - “Story” card layout.
  - Simple “download / view PDF” widget.
  - Responsive gallery grid for photos.

**Definition of Done**
- At least:
  - 3–5 lore stories seeded.
  - 1–2 PDFs linked and downloadable.
  - 1–2 galleries populated.
- All media loads quickly and is legible on mobile.

### 5.3 Member Upload Flows (Images, Stories, Docs, Video Links)

**Tasks**
- Build “Contribute to the Clubhouse” panel or page:
  - Form fields:
    - Name (optional or required; your call).
    - Category (Story, Photo(s), Training Doc, Race Recap, Video Link).
    - Description / narrative text area.
    - Attachments uploader (files) and/or URL field for video.
  - Style the form so it feels like an **invitation to add to the lore**, not a bureaucratic upload.
- Backend:
  - Define `clubhouse_contributions` entity with:
    - `id`, `created_at`, `type`, `title`, `body`, `media_urls`, `submitted_by`, `moderation_status`.
  - Storage:
    - S3/Bucket or BaaS storage for user files; store URLs in DB.
  - Simple moderation interface (even if manual via admin flag or DB editing for now).

**Definition of Done**
- A user can:
  - Fill the form, attach at least 1 file or link.
  - Submit and see a confirmation message.
- Submissions appear in an **“Incoming / Recently Added”** section after approval.
- If upload fails, user sees a clear, on-brand error and can retry.

### 5.4 Visual System: Lab / Tribe / Lore

**Tasks**
- Apply consistent visual language from homepage & Canvas: fileciteturn1file6turn1file8  
  - Same base typography and palette.
  - Reuse or echo manifesto phrases as section headers.
- Design touches:
  - “Lab” → small UI hints: timestamps, “Version 1.0”, “Experiment Log”.
  - “Tribe” → pull quotes from member submissions surfaced in the UI.
  - “Lore” → timeline or “Campfire” section where key DWTC moments live.

**Definition of Done**
- Clubhouse doesn’t feel like a separate site.
- At least 3 visual micro-touches explicitly nod to lab/tribe/lore (e.g., labels, badges, copy).

### 5.5 Performance, Accessibility, and Analytics

**Tasks**
- Performance:
  - Optimize media (compressed images, lazy loading).
- Accessibility:
  - Proper heading structure.
  - Alt text for meaningful images.
  - Form fields labeled and keyboard-accessible.
- Analytics events:
  - `clubhouse_visit`
  - `clubhouse_contribute_opened`
  - `clubhouse_contribution_submitted`
  - `clubhouse_media_viewed` (optional but useful).

**Definition of Done**
- Core Web Vitals acceptable on test (no obvious red flags).
- Lighthouse accessibility score in “green” band for the Clubhouse route.
- Key events visible in your analytics tool.

---

## 6. Light AI Coach Hooks (D)

**Tasks**
- Add consistent “Coach is Coming” touchpoints:
  - Homepage: small slice explaining the AI coach idea and linking to waitlist.
  - Canvas: note that your story may shape future coach prompts.
  - Clubhouse: mention future “Coach view” of your training & lore.
- Implement:
  - Simple waitlist form (email + optional goals).
  - Event hooks: `ai_coach_waitlist_submitted`, `ai_coach_teaser_viewed`.
  - Code-level abstraction (e.g., `trackEvent('ai_coach_...')`) so you can plug in real analytics later.

**Definition of Done**
- AI coach is clearly “in the air” but not confusingly promised as ready.
- There is at least one concrete action (“Join the waitlist”) related to the coach.

---

If you’d like, next step I can:  
- turn this into a proper document in your workspace using the doc tools, or  
- help you map each bullet into actual Linear issues (project name, labels, assignees TBD). Nice, this is exactly the right moment to tighten things up.

I’ll turn **D – Light AI Coach Integration Hooks** into a Linear-ready checklist, similar to the Clubhouse one: one parent, then child tasks you can paste directly.

You can treat each top-level bullet as an issue, and indent the subtasks under it.

---

**Project: AI Coach – V1 Hooks (D)**

**1) Define AI Coach Narrative & Touchpoints (Product/Content)**  
- [ ] Clarify V1 AI coach scope (what it is / isn’t yet)  
  - [ ] Write 2–3 sentence internal description of V1 coach vision  
  - [ ] Decide: no live coach features in V1, just narrative + waitlist  
- [ ] Identify all touchpoints:
  - [ ] Homepage hero/section
  - [ ] “Why You Run” Canvas page
  - [ ] DWTC Clubhouse page
- [ ] Draft short, on-brand copy for each location  
  - DoD: Copy reviewed once against brand voice (“Sage in the Parking Lot”), no over-promising, clearly future-facing.

---

**2) Homepage – “Coach is Coming” Slice**  
- [ ] Add AI coach teaser section to homepage  
  - [ ] Title (e.g., “The Coach That Knows Your Miles and Your Stories”)  
  - [ ] 2–3 lines explaining *why* this coach fits RunExpression (lab / tribe / lore)  
  - [ ] “Join the coach waitlist” CTA button  
- [ ] Wire section into homepage scroll flow (not the main hero; lower on page)  
- [ ] Add anchor id for tracking (e.g., `#ai-coach`)  
- **DoD:** Section visible on all breakpoints, copy finalized, CTA scrolls or links to waitlist form.

---

**3) Canvas – Story-to-Coach Link**  
- [ ] Add inline note near “Why You Run” input:  
  - [ ] Short line like “These stories will help shape the future RunExpression AI coach.”  
  - [ ] Tooltip or small info icon if needed  
- [ ] Ensure note appears in both desktop + mobile layouts  
- [ ] Add analytics event hook when user views this note for first time (e.g., `ai_coach_teaser_viewed_canvas`)  
- **DoD:** Canvas page deployed with clear, non-intrusive mention of coach; event fires and is visible in analytics.

---

**4) Clubhouse – Future Coach View Callout**  
- [ ] Add short copy block in DWTC Clubhouse explaining future coach tie-in  
  - [ ] E.g., “Eventually, the coach will read this wall to understand our team’s lore and training patterns.”  
- [ ] Place the block near:
  - [ ] Member archive or training/lore section  
- [ ] Add optional, subtle CTA: “Join the coach waitlist” (same endpoint as homepage)  
- **DoD:** Clubhouse contains at least one clearly identified “future coach” mention, visually consistent with the page and not overwhelming the core DWTC content.

---

**5) Waitlist Form – UI & Flow**  
- [ ] Decide waitlist location(s):
  - [ ] Dedicated `"/coach"` or `"/waitlist"` route  
  - [ ] Inline modal or drawer from homepage CTA  
- [ ] Implement form fields:
  - [ ] Email (required)  
  - [ ] “What are you running for?” free text (optional, aligned with brand)  
  - [ ] “What kind of guidance would you want from a coach?” (short optional text)  
- [ ] Submission behavior:
  - [ ] On success: show thank-you message aligned with voice (“You’re in the lab now…”)  
  - [ ] On error: clear, friendly error message; no raw system text  
- [ ] Basic validation:
  - [ ] Email format check  
  - [ ] Graceful handling of duplicate submissions  
- **DoD:** Form works on all devices, stores entries, shows proper success/error states.

---

**6) Waitlist Data & Storage**  
- [ ] Create `ai_coach_waitlist` table/collection with fields:  
  - [ ] `id`, `created_at`  
  - [ ] `email`  
  - [ ] `why_running` (text, optional)  
  - [ ] `coach_expectations` (text, optional)  
  - [ ] `source` (homepage, canvas, clubhouse)  
- [ ] Implement secure API endpoint or BaaS rule to accept submissions  
  - [ ] Prevent obvious spam (rate-limit, basic checks)  
- [ ] Confirm you can export or query waitlist easily (for email tools later)  
- **DoD:** New submissions persist and can be inspected in DB; required fields always present; no PII leaks in logs.

---

**7) Analytics Events & Telemetry**  
- [ ] Define events:
  - [ ] `ai_coach_teaser_viewed_homepage`  
  - [ ] `ai_coach_teaser_viewed_canvas`  
  - [ ] `ai_coach_teaser_viewed_clubhouse`  
  - [ ] `ai_coach_waitlist_opened`  
  - [ ] `ai_coach_waitlist_submitted`  
- [ ] Implement common `trackEvent` helper (if not already)  
- [ ] Fire events from:
  - [ ] On-view of each teaser section (visible in viewport)  
  - [ ] On click of waitlist CTAs  
  - [ ] On successful waitlist submit  
- [ ] Verify events appear in analytics tool with basic properties (e.g., `source_page`)  
- **DoD:** All listed events exist, generate data in your tool, and are named consistently.

---

**8) Visual & Interaction Consistency Check**  
- [ ] Ensure coach-related components match global design system:
  - [ ] Typography, buttons, spacing  
  - [ ] Motion (same level as homepage/canvas, no extra chaos)  
- [ ] Cross-page review:
  - [ ] Coach teaser on homepage, Canvas, and Clubhouse feel like one coherent story  
- **DoD:** Quick visual QA pass confirms no “off-brand” section; screenshots captured for future reference.

