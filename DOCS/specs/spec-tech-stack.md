## Tech Approach

1. Core Philosophy & Design Principles
Before defining features, we define the "Soul" of the application based on your notes.
	•	Interdependence over Independence: The site architecture must support "Groups" (Crews) as first-class citizens, not just individual user profiles.
	•	Process over Outcome: Metrics (PRs) are secondary. The "Story" (Journal/Blog) takes visual precedence over the "Stats."
	•	The "Creator" Economy: The E-commerce section is not just a swag shop; it is a gallery. It needs to support high-fidelity visuals for art prints and storytelling for products.
	•	Flexible Identity: We use the Hybrid JSONB model immediately. A runner’s identity isn't just 5k_time; it’s philosophies, injuries, creative_interests.
2. Technical Stack (The "Pragmatic Monolith")
We will use the exact architecture planned for the AI Coach MVP to reduce context switching and build technical equity.
	•	Frontend: Next.js 14 (App Router). Excellent for SEO (critical for your articles/manifesto) and highly interactive for the tools.
	•	UI System: Tailwind CSS + Shadcn/UI. Clean, accessible, and easy to theme. We will create a distinct "Run Expression" theme (likely gritty, artistic, distinct from the sterile "SaaS blue" of competitors).
	•	Backend/Auth: Supabase.
	•	Auth: Handles user logins for Club areas.
	•	Database: PostgreSQL.
	•	Storage: For hosting user-uploaded art or PDF resources.
	•	Commerce: Stripe Checkout. We will build a lightweight product catalog in Supabase but offload all complexity (cart logic, tax, payments) to Stripe.
	•	Content: MDX (Markdown + React Components). This allows you to write articles that include interactive elements (e.g., a pace calculator embedded inside an essay about pacing).
3. V1 Feature Specifications
A. The Public Face (Expression & Resource)
1. The Manifesto (Home)
	•	A visually immersive scrolling narrative explaining "The Expressive Runner" framework.
	•	High-quality imagery (Landon Peacock’s art style).
	•	Call to Action: "Join the Movement" (Newsletter/Auth capture).
2. The Library (Content)
	•	Essays & Stories: Categories for "Philosophy," "The Bacon Ritual" (Community), and "Performance."
	•	Visual Art Gallery: A section to showcase sketches, paintings, and comics.
	•	Tech Implementation: MDX-backed blog. This allows you to treat content as code, version controlling your essays.
3. Interactive Tools (The "Hook")
	•	Purpose: Utility brings traffic; philosophy keeps them.
	•	V1 Tools:
	•	"The Expressive Pace Calculator": Standard VDOT math, but with "Vibe" descriptors (e.g., instead of just "Easy Pace," it adds "Conversational, bacon-cooking pace").
	•	"Race Readiness Check": A simple quiz based on your coaching logic (Are you ready for a marathon?) that leads to a lead capture.
B. The Marketplace (Commerce)
1. The Shop
	•	Products:
	•	Physical: Greeting cards (packs of 5), T-shirts (Print-on-Demand integration or manual fulfillment), Art Prints.
	•	Digital: "The Expressive Runner Handbook" (PDF), "Marathon Block 1" (PDF Plan).
	•	Tech Flow:
	•	Product Catalog stored in Supabase.
	•	"Add to Cart" uses a persistent local state.
	•	Checkout redirects to a Stripe Hosted Page (simplest PCI compliance).
	•	Webhooks listen for checkout.session.completed to unlock digital content in the user's dashboard.
C. The "Clubhouse" (Authenticated Experience)
This is the MVP of the community aspect.
1. User Profiles
	•	Users sign up via Magic Link (Email) or Google.
	•	Onboarding: Users answer 3 questions: "Current Goal," "Why do you run?" (Free text for AI analysis later), "Zip Code."
	•	Data Strategy: This creates the auth.users and public.profiles rows we need for the AI Coach later.
2. Club Areas (e.g., "DWest Track Crew")
	•	Access Control: We use Supabase RLS (Row Level Security). Only users with a club_membership row for "DWest" can access /club/dwest.
	•	Features:
	•	The Bulletin Board: Simple admin-posted updates (next workout, next bacon meetup).
	•	The Archive: Shared PDFs, routes, or workout history.
	•	Member List: A simple directory of who is in the crew.
4. Data Architecture (Schema Strategy)
We will use the Hybrid Relational/JSONB model immediately to support the "Expressive Runner" profile.
-- 1. PROFILES (The Core User) -- Mirrors the AI Coach 'athletes' table structure create table profiles (   id uuid references auth.users on delete cascade,   email text,   full_name text,   avatar_url text,      -- The "Expressive" JSONB column   -- Stores: bio, philosophy_alignment, injury_history, shoe_preferences   expression_data jsonb default '{}'::jsonb,       created_at timestamptz default now(),   primary key (id) );  -- 2. CLUBS (The Community Units) create table clubs (   id uuid default gen_random_uuid() primary key,   name text not null, -- e.g., "DWest Track Crew"   slug text unique not null, -- e.g., "dwest"   description text,      -- JSONB for branding (colors, logos) and specific rituals (bacon_rules)   manifesto jsonb default '{}'::jsonb,       created_at timestamptz default now() );  -- 3. MEMBERSHIPS (The Link) create table club_memberships (   user_id uuid references profiles(id),   club_id uuid references clubs(id),   role text check (role in ('admin', 'coach', 'member')),   joined_at timestamptz default now(),   primary key (user_id, club_id) );  -- 4. PRODUCTS (The Marketplace) create table products (   id uuid default gen_random_uuid() primary key,   stripe_price_id text, -- Link to Stripe   name text,   description text,   type text check (type in ('physical', 'digital', 'service')),   images text[],   active boolean default true ); 
5. Implementation Roadmap (Phased)
Phase 1: The Foundation (Weeks 1-2)
	•	Setup: Next.js repo, Tailwind, Supabase project.
	•	Identity: Implement the "Run Expression" visual theme.
	•	The Manifesto: Build the Home page and "About" page as static content.
	•	Auth: Set up Login/Signup flows.
Phase 2: Content & Tools (Weeks 3-4)
	•	Blog Engine: Build the MDX pipeline for articles.
	•	Tool: Build the "Expressive Pace Calculator" (React component).
	•	SEO: Configure metadata and sitemaps.
Phase 3: The Shop (Weeks 5-6)
	•	Stripe: Setup Stripe account and products.
	•	Integration: Build the Product Grid and Checkout flow.
	•	Digital Fulfillment: Simple logic to email PDFs upon purchase.
Phase 4: The Clubhouse (Weeks 7-8)
	•	Data: Create the "DWest" club row in the DB.
	•	Gated Logic: Build the /club/[slug] dynamic route.
	•	Onboarding: Manually invite your crew members to test the login flow.

## Runexpression Website – Technical Design & Project Plan

Product Overview
The Runexpression website is the expressive home for runners and the launchpad for the AI Coach experience. At its core, three connected journeys anchor V1:
	1	Creative, Experimental Homepage: A visually rich, motion-driven landing page that shapes the brand manifesto into an interactive flow, ending in a clear CTA.
	2	“Why You Run” Interactive Canvas: A living, communal wall (the Flow) encouraging all visitors to express what their run meant—capturing emotion through text, images, or art, instantly woven into a dynamic, ever-shifting collective record.
	3	DWTC Clubhouse Archive: A polished, content-centric digital “home base” for the DWest Track Club—a permanent archive and vibrant club community space where DWTC’s lore, routes, and rituals are treasured, stories and photos are easily contributed, and the rich, evolving history of the club is built together.
V1 also includes a robust library, shop, and foundational scaffolding for future AI and deep club functionality. Every touchpoint strengthens the pillars of creative expression, community identity, and club belonging.

Purpose
Core Purpose:
	•	Expressive Discovery: Draws runners into the brand with a creative, emotionally resonant homepage and clear, motivating calls to action.
	•	Motivational Community Participation: The Flow and clubhouse foster honest, creative contributions, making every runner feel seen.
	•	Lasting Club Belonging: The DWTC Clubhouse becomes the digital home base and archive—a place where club stories live on, members can easily contribute, and the community’s journey is always visible and accessible.
DWTC Clubhouse, Specifically:
	•	The Clubhouse is the digital archive and gathering place for DWest Track Club (DWTC), where the crew’s lore is preserved—routes, race recaps, rituals, memories, and resources.
	•	Its main jobs:
	1	Provide DWTC members a clean, inspiring destination to catch up and see what’s happening.
	2	Make it dead simple for any member to add stories, photos, or documents—catalyzing participation.
	3	Create a permanent, browsable living record for the crew’s past, present, and emerging story.

Target Audience
	•	Expressive Runners: Drawn to both community expression and personal reflection via homepage and interactive canvas.
	•	DWTC Club Members: Frequent contributors and consumers of the clubhouse, eager to build collective lore and enjoy club resources.
	•	Shoppers: Enticed by the shop, but often converted by exposure to expressive, community-driven stories.
	•	Curious Visitors: Those who land on the site looking for belonging, motivation, or inspiration.

Expected Outcomes
Tangible Outcomes
	•	Strong engagement with homepage narrative and CTAs.
	•	Active, creative submissions on the “Why You Run” canvas.
	•	Frequent DWTC Clubhouse uploads—stories, media, and resources—catalyzed by low-friction contribution flows.
	•	Measurable signups and deepening of club and community engagement.
Intangible Outcomes
	•	Runexpression is recognized as a unique, creative hub—distinct from typical running sites.
	•	The DWTC Clubhouse becomes a source of club pride, inspiring ongoing contribution.
	•	The foundation for AI Coach and future features is deeply seeded into community and club mechanics.
Key KPIs
Metric
Short-Term Goal (V1)
Long-Term Target
Homepage CTA Engagement
>35% scrolls/clicks
>50% (personalized offers)
Canvas Submissions
300+ in 6 months
1,500+ unique entries
Clubhouse Uploads
200 member uploads
1,000+ in archive
Other (Shop, etc.)
As previously defined
As previously defined

Design Details
DWTC Clubhouse: Information Architecture
	•	Top-Level Route: /club/dwtc (auth-gated)
	•	Core Sections:
Section
Description
Overview
Hero band with visual energy (club photo), a brief, celebratory story about DWTC, and carousel of newest/featured contributions.
Lore & Stories
Club archives: stories, race/workout recaps, rituals. Card-based, curated, easily browsable and filterable.
Media Archive
Tile/masonry gallery of photos and videos. Tag filters (race, workout, social, road, etc.), with hover/tap states for captions.
Resources
Grid/list of club docs (training plans, maps, PDFs). Clearly labeled, with file-type icons and summary descs.
Contribute
Unified “Add to the Archive” interface. Major CTA (e.g., top-right and/or persistent), plus inline prompts in Lore, Media, etc.
	•	Navigation: Clean club-customized nav bar or sidebar, persistent “Add to Archive” button.
DWTC Clubhouse: UI & Visual Language
	•	Visual Style: Aligns tightly with homepage and canvas (“lab / tribe / lore” energy). Hand-drawn accents, gritty/unique card edges, non-corporate color palette, DWTC-specific color burst and club/crew photography.
	•	Motion: Subtle slide/fade-in for contributions, interactive hover/tap animations, and carousel transitions in overview.
	•	Language: “Sage in the parking lot”—deep but clear, warm, stories-first. Microcopy emphasizes tribe, lore, and inclusion:
	•	“This is where the DWTC story lives.”
	•	“Miles turn into memories here.”
	•	“Add your chapter.”

Clubhouse UX Flows: Member Contributions
Entry Points
	•	Primary CTA: "Add to the Archive" button, visually distinct, always available from core clubhouse pages.
	•	Inline Prompts: E.g., “Have a story from this race? Add yours.” in Lore & Stories, or “Captured a great route shot?” in Media Archive.
Contribution Flow
	1	Step 1 – Choose Type
	•	Options: Story, Photo/Video, or Document.
	2	Step 2 – Input Details
	•	Story: Title, short body text, optional attachment (image/video), tags (race, location, “vibe”), date.
	•	Photo/Video: Drag-and-drop or click-to-upload (Supabase Storage), short caption (required), tags, event/date.
	•	Document/PDF: File upload, title, description, tags (e.g., “Training Plan”, “Route Map”).
	3	Step 3 – Attribution
	•	Default: logged-in user’s club profile. Optional: allow nickname override (never full anonymity in the clubhouse).
	4	Step 4 – Review & Submit
	•	Preview card—shows how the entry will look, check all details.
	•	Confirm and submit.
	5	Step 5 – Confirmation
	•	Success message—e.g., “Your story just joined the DWTC archive.”
	•	Contextual link to where the contribution will live (“See it in Lore & Stories once approved”).
Moderation & Approval
	•	All contributions are created with moderation_status = pending in metadata.
	•	Once approved, they are instantly discoverable in their respective sections (Lore, Media, etc.).

Clubhouse: Browsing & Viewing Experience
Section
Layout & Details
Overview
Full-width hero band (club photo, candid moment, or collage), brief club intro/copy, carousel of recent contributions (story thumbnails/media cards).
Lore & Stories
Card-based layout, text-focused entries with small media thumbnails. By default, sort by newest; filters for tag, event, year.
Media Archive
Structured grid/masonry, with the brand’s “artistic, imperfect” tiles, subtle shadow/hand-drawn edge effects. Hover/tap displays captions and contributor. Tag and event filters up top.
Resources
List/grid—compact, clear icons for PDFs/images, short descriptions. Highly scannable, focus on utility.
Contribution Surfaces
Any section may feature context-aware prompts and buttons to drive new member contributions, reinforcing the living nature of the archive.

Data Structures and Algorithms
Table: club_contributions
This is the DWTC-focused parallel to the generic expression_events. Core schema for V1:
Field
Type
Description
id
UUID, PK
Primary key
club_id
UUID, FK
Reference to DWTC in clubs table
user_id
UUID, FK
Linked to user or member profile
type
ENUM
'story', 'media', 'document'
title
TEXT
Title (required for stories/docs, optional for media)
body
TEXT
Story text or description (nullable for media entries)
media_url
TEXT
Supabase Storage URL (images/videos)
doc_url
TEXT
Supabase Storage URL (documents/PDFs)
tags
ARRAY/TEXT or JSONB
Tags (race, workout, vibe, event, custom)
metadata
JSONB
{ event_name, event_date, location, moderation_status, featured_flag }
created_at
TIMESTAMP
Timestamp
is_public
BOOLEAN
Visibility status
	•	Moderation: metadata.moderation_status tracks pending/approved/rejected.
	•	Attribution: User information (never fully anonymous) tied to member identity. Optionally display nickname, but no “guest/anon” state.
	•	AI Coach Future: Can join with user profiles, training data, and club activity later for holistic AI context.
Storage & Retrieval
	•	Media/Document Uploads: Files go to Supabase Storage; media_url and doc_url fields store their public URLs.
	•	Contribution Endpoints:
	•	CreateClubContribution(user, club, payload)
	•	ListClubContributionsByClub(club, filters)
	•	ListFeaturedClubContributions(club)
	•	Browsing & Filtering: Tag- and metadata-based queries, default sorted by created_at DESC, with optional spotlight of featured content.

System Interfaces
Clubhouse Backend/API
	•	Media Handling: Uploads via authenticated endpoints to Supabase Storage. Client receives presigned upload URLs.
	•	Contribution Posting: New contributions POST to /api/club_contributions/create, which validates, writes reference to DB, and returns for moderation.
	•	Moderation: Uses metadata.moderation_status. Default “pending”; review and approve via admin/club lead dashboard.
	•	Browsing APIs: /api/club_contributions/list?club=...&type=...&tag=... for various archive tabs and filters.
	•	Identity Linking: All posts associated to a verified club member; no truly anonymous Clubhouse submissions.
Homepage + Canvas Alignment
	•	Homepage teaser block features a direct, branded link to /club/dwtc, referencing lore, rituals, and the energy of the crew. The Clubhouse visually and experientially delivers on this promise by being highly browsable, motion-rich, and easily navigable.
	•	Core visual and card/audio patterns are reused and adapted; only club-specific accents/colors/photography differentiate DWTC from core Runexpression sections.
	•	Future: V2 may surface a club-specific canvas Flow (filtered subset of expression_events relevant to DWTC members/events).

User Interfaces
Clubhouse UI & Flows
Core Layout
Section
Key Features
Overview
Hero image, club intro, new contributions carousel, and key event teaser.
Lore & Stories
Editor-curated cards (story-focused, text+media), filters for tags/events, “Add a Story” calls to action.
Media Archive
Gallery grid (structured, “gritty” brand card styles), filter bar for tags/events, hover/caption details.
Resources
File-type grid/list, clear download and details, visible “Add Resource” button for trusted/upload-enabled users.
Contribution Surfaces
Persistent “Add to Archive” CTA and inline inviting prompts.
Contribution UX
	1	Launch Contribution: Via all-sections CTA or direct "Contribute" page.
	2	Choose Card: Select Story, Photo/Video, or Document.
	3	Input Form:
	•	Story: Title, body, optional media, tags, event/date.
	•	Media: Upload, caption, tags, event/date.
	•	Document: Upload, title, description, tags.
	4	Attribution: Pre-fills logged-in member; optional nickname override; no full anonymity allowed.
	5	Preview & Confirm: Shows card as it will appear; facility to edit or confirm.
	6	Submit & Feedback: Delightful, on-brand confirmation (“Your story just joined the archive”), animated feedback, and direct link to contribution location.
Browsing UX
	•	Tiles/Cards: Gritty, hand-embellished edges, team color highlights, photos or thumbnails, contributor attribution, subtle microinteractions (fade/slide-in, hover pop).
	•	Overview Carousel: Motion mirrors homepage/canvas—tiles gently animate and invite deeper dive.
	•	Filter & Search: Lore & Media easily filtered by tag, year, event—quick access to major club themes, traditions, and moments.
Design Language & Motion
	•	Unified Visual Grammar: Core components and motion borrowed from homepage/canvas—expressive, artistic, energetic.
	•	Color & Photography: DWTC colors and candid/crew images distinguish the Clubhouse while using shared global frames, hand-drawn overlays, “imperfect” cards.
	•	Language: Celebratory, accessible, deep but grounded—mirroring “Sage in the parking lot” energy.

AI Coach Hooks
	•	All club_contributions have structured links to user profiles, events, and tags, enabling the future AI Coach to contextualize a runner’s community connection, event history, and qualitative memories.
	•	The metadata JSONB supports future extensions (structured performance data, narrative “highlights,” links to sessions), so AI can reference club lore, event recaps, and resources.
	•	Clubhouse flows and community archives double as ground truth and memory bank for deep, personalized AI engagement.


This technical specification details how the DWTC Clubhouse aligns deeply with homepage and canvas experiences, balancing community expression, ease of contribution, powerful browsing, and lasting, richly storied digital belonging. All core flows, data models, interface guidelines, and brand cues are structured for seamless end-to-end build and future expansion.


—-

Appendix

—-

Homepage 
Hero: Make running mean more.
Sub-line: Turn your struggle into art and feed the running community with your story.
How this plays out on the homepage:
	•	First viewport is almost all about these two lines. Clean, high-contrast typography, subtle background motion that hints at the Flow, and one clear primary CTA: “Enter the Flow.”
	•	As the user scrolls, we start layering in chunks of the Expressive Runner’s Creed with imagery/interaction, each section tying back to a pillar: motion creates emotion, process over outcome, tribe as performance enhancer, interdependence over independence.
	•	Midway down, we surface a small live strip of recent canvas entries (“the flow”) to make that sub-line literal.
	•	Further down, we tease the DWTC Clubhouse with copy that echoes “we vs the struggle” and the tribe energy.
Page Details
	•	The hero copy:
	◦	H1: “Make running mean more.”
	◦	Sub: “Turn your struggle into art and feed the running community with your story.”
	◦	Primary CTA: “Enter the Flow” → canvas
	◦	Secondary CTA: “Visit the Clubhouse” → DWTC hub
	•	A clear section-by-section homepage structure:
	◦	Hero (text-first, minimal motion, CTA focus)
	◦	Manifesto “chapters” tied to your pillars (Interdependence, Process over Outcome, Motion Creates Emotion, Tribe as Performance Enhancer), each with short copy + imagery + a soft prompt.
	◦	Flow preview strip/mosaic powered by expression events.
	◦	DWTC Clubhouse teaser block (image + small story + CTA).
	◦	Footer invite with “Run for yourself. Run for us. Express yourself.” plus key links.
	•	Concrete implementation notes for you/dev: layout behavior on desktop vs mobile, where to use scroll-triggered reveals, how the Flow strip behaves (scrollable/auto-scrolling tiles sourced from expression_events), and how the Clubhouse teaser should visually stand out but still feel part of the same “lab.”
	•	Explicit callouts that all of this is derived from:
	◦	The Expressive Runner’s Creed
	◦	Brand pillars (motion creates emotion, process over outcome, tribe)
	◦	“Living laboratory” idea → via Flow preview and contribution invitations
	◦	Voice = “Sage in the parking lot” (deep but accessible, serious but light, invitational)
You can now hand that doc to a designer/dev and they’ll know: section order, copy anchors, interaction level, and where data/UGC ties in.

—-
“Why You Run” interactive canvas 
Purpose and role The doc calls out the canvas as the main embodiment of the Expressive Runner’s Creed: a living wall where people answer “What did your run express today?” in different mediums, and their pieces immediately join the Flow that’s previewed on the homepage and fully visible on the canvas page.
	1	UX flow (end to end) The updated spec walks through:
	•	Entry points: hero CTA “Enter the Flow,” the Flow preview strip on the homepage, and main nav.
	•	Prompt screen: repeats the question plus a reassuring helper line like “It doesn’t have to be pretty. Just honest.”
	•	Medium selection: V1 explicitly supports Text and Image Upload; a simple drawing pad is noted as V1.1/V2.
	•	Input UIs:
	◦	Text = short phrase focus with optional longer note.
	◦	Image = drag/drop or click upload + caption.
	•	Identity behavior: anonymous/pseudonymous allowed, but expressions are attached to profile when logged in.
	•	Submission feedback: confirmation like “Your run just joined the Flow,” plus animation of the new tile drifting into the wall and clear options to: see the wall, share, or sign up/log in (future AI Coach hook).
	3	Canvas viewing experience The document defines the main canvas page as:
	•	A full-screen or near-full-screen mosaic/stream (not a rigid grid) of tiles that gently move/shift to feel like “flow.”
	•	Minimal, readable metadata on each tile: snippet/image + optional first name/handle.
	•	Optional “All vs. Just mine” toggle for logged-in users; media filters are noted as a later enhancement.
	4	Data model and storage Under Data Structures and Algorithms, you now have a concrete expression_events table:
	•	id, user_id (nullable), medium (text/image/drawing), content_text, media_url, metadata (JSONB with mood, tags, run_distance, moderation_status, etc.), created_at, is_public.
	•	Notes on using Supabase Storage for media, and tying expression_events back to future AI Coach context (user_id + timestamps + run context).
	5	System interfaces and moderation The System Interfaces section now covers:
	•	How the front end talks to Supabase for create/read of expression events.
	•	Using Supabase Realtime (or polling) so new tiles appear without reload.
	•	A simple moderation flag in metadata (pending/approved/rejected) and the expectation of a light admin review surface (or using the Supabase dashboard initially).
	6	UI and brand alignment In User Interfaces, the canvas is now described visually:
	•	Gritty, artistic tiles with slightly imperfect edges, hand-drawn accents, non-corporate colors.
	•	Constant but subtle motion (drift, fade-in, tiny jitter) so it feels like a living organism, not a static gallery.
	•	Empty state seeded with clearly-labeled sample expressions from Runexpression plus a bold invite to “be the first to add yours.”
	7	Homepage connection and AI hooks The spec makes explicit that:
	•	The homepage Flow preview strip is just “latest N approved expression_events,” so implementation is one data source, two views.
	•	Phrases like “Make running mean more” and “Run for yourself. Run for us. Express yourself.” are reused in key spots on the canvas page for continuity.
	•	expression_events is deliberately AI-ready: JSONB can later hold run_context, perceived_effort, mood, etc., without needing a breaking schema change.
Practically, you can now:
	•	Hand this doc to your dev as the single source of truth for building the canvas backend, API usage, and front-end UX.
	•	Share the Design Details + User Interfaces sections with a designer so they know section layout, motion level, and brand constraints.
—-
DWTC Clubhouse 
Information architecture (inside Design Details / User Interfaces) The clubhouse is now defined as the digital home base for DWTC at something like /club/dwtc, behind auth. Inside it, the doc spells out:
	•	Overview: hero band with a big DWTC image, a short “who we are” story, and one highlighted upcoming thing (race, workout, ritual).
	•	Lore & Stories: cards for race recaps, workout writeups, traditions; text-forward with supporting media and filters by tag/year/event.
	•	Media Archive: a gallery of photos and videos in that same gritty / artistic card style you’re using for the Flow, but a bit more structured.
	•	Resources: grid/list of PDFs and docs (training plans, routes, guides) with clear titles and descriptions.
	•	Contribute: a unified “Upload your story” surface, plus inline prompts that invite people to add to specific sections.
Member upload flows The UX for contributions is now fully laid out:
	•	Entry points: a visible “Add to the Archive” button across clubhouse pages, plus inline “Add yours” prompts under stories/media sections.
	•	Flow:
	◦	Choose type: Story, Photo/Video, or Document.
	◦	Fill details:
	▪	Story = title, short body, optional media, tags, date.
	▪	Photo/Video = upload + caption + tags/date.
	▪	Document = upload + title + description + tags.
	◦	Attribution: always tied to the logged-in member profile (no anonymous in the clubhouse), with optional nickname override.
	◦	Review & submit: preview card, then confirmation like “Your story just joined the DWTC archive,” with a link to where it’ll appear after approval.
Data + system side Under Data Structures / System Interfaces, you now have:
	•	A club_contributions table spec with fields for club_id, user_id, type (story/media/document), title/body, media/doc URLs, tags, metadata (event info, moderation_status, featured_flag), created_at, is_public.
	•	Notes that club_contributions parallels expression_events but is club-scoped and non-anonymous.
	•	Supabase Storage for media/docs; basic service methods sketched (create/list/list-featured).
	•	Moderation via metadata.moderation_status with only approved content surfacing by default.
Visual and voice alignment For the UI:
	•	The clubhouse reuses the “lab / tribe / lore” aesthetic: hand-drawn accents, imperfect cards, non-SaaS colors. DWTC gets its own personality via photos and color accents, but it still feels like part of the same world as the homepage and Flow.
	•	Motion is subtle: fade/slide-in for cards, small hover/tap animations.
	•	Microcopy stays “Sage in the parking lot”: lines like “This is where the DWTC story lives,” “Miles turn into memories here,” “Add your chapter.”
Connections to homepage and canvas The doc also calls out:
	•	The homepage Clubhouse teaser promises lore/rituals/crew energy; the clubhouse design is explicitly built to deliver that (visually rich, easy to browse, full of member contributions).
	•	Future option to show a mini Flow subset inside the clubhouse, filtered by DWTC-related expression_events.
	•	AI Coach hooks via club_contributions + metadata for later training/context.
From here, you can hand this same doc to design and dev and they’ll have:
	•	Homepage spec
	•	Flow/canvas spec
	•	DWTC Clubhouse spec
All wired to the same brand, stack, and future AI Coach needs.


## Runexpression Website (V1) – Technical Specification & Project Plan Addendum
1. Product Overview
The Runexpression website is the expressive home for runners and the launchpad for the AI Coach product. V1 focuses on capturing user identity and data through three anchor experiences, optimized for high engagement and future AI utility.
The Three Core Experiences
	1	The Manifesto Flow (Homepage): A motion-driven, scroll-based narrative that weaves the brand philosophy into an interactive experience, culminating in a persistent "Join the Expression" call to action (CTA).
	2	“Why You Run” Interactive Canvas: A communal digital wall where users contribute text and images. Updated Scope: To ensure brand consistency and reduce technical friction, freehand drawing is replaced by a "Sticker & Filter Studio" allowing users to layer branded assets over their photos.
	3	DWTC Clubhouse Archive: A member-gated repository for club lore and resources. Members can upload permanent artifacts (stories, images), which are structured to feed future AI personalization.
2. Updated Data & AI Strategy
V1 is not just about display; it is about structured data capture. We are moving from "blob storage" to "labeled storage" to train the future AI Coach.
2.1 The "Vibe Tags" Taxonomy
To seed the AI personality, every contribution to the Canvas or Clubhouse will require the user to select 1-3 tags. These map to the emotional and physical context of the run.
Taxonomy Structure (v1 Draft):
	•	The Mindset (Internal): Meditative, Aggressive, Playful, Dark, Grateful, Pain Cave.
	•	The Context (External): Race Day, Morning Miles, Night Run, Social, Solo, Commute.
	•	The Feeling (Physical): Float, Grind, Flow, Heavy, Fast, Recovery.
Why this matters: Future AI Coach can query this: "User X posts 80% 'Grind' content; adjust tone to be supportive/stoic."
2.2 The "AI Sentinel" Moderation Workflow
To protect the brand on a public canvas, we will implement a multi-stage defensive workflow.
The Flow:
	1	User Submits: User hits "Post" on the Canvas.
	2	Stage 1: Automated AI Check (Synchronous):
	•	Text: Payload sent to OpenAI Moderation API (Free tier). Checks for hate speech, harassment, self-harm.
	•	Result: If flagged → Immediate hard reject (User sees error). If clean → Proceed.
	3	Stage 2: Trust Scoring:
	•	New User: Content creates a DB row with visibility: pending and moderation_status: review_queue.
	•	Optimistic UI: The user sees their post immediately (local state), but the public does not.
	•	Trusted User (Whitelisted): If user has >3 approved posts, visibility: public.
	4	Stage 3: Admin Queue: Admin dashboard (Retool/Supabase) lists "Pending" items. Admin clicks "Approve" or "Ban."
	5	Stage 4: Public Wall: Approved items are pushed to the public Supabase Realtime stream.
3. Technical Architecture & Stack
Core Stack
	•	Frontend: Next.js (React) deployed on Vercel.
	•	Backend/Data: Supabase (Postgres + Auth + Realtime).
	•	Media: Supabase Storage with strict file-size policies (Images <5MB, Videos <50MB/30s).
	•	Payments: Stripe.
3.1 The Sticker/Filter Tech Stack (Replacing Drawing)
To allow users to create expressive visual content without the complexity of a drawing engine, we will use image composition libraries.
Selected Library: fabric.js or react-konva
	•	Why: These libraries allow us to create a "Canvas" layer over a user's uploaded photo. We can programmatically add PNG "Stickers" (logos, slogans, tape, shapes) that the user can drag, rotate, and resize.
	•	Filter Implementation: CSS Filters (grayscale, high contrast, sepia) applied to the base image.
	•	Export: When the user hits submit, the client generates a single composite JPG/PNG to upload to storage. This ensures the output always looks "designed" and high-quality.
3.2 Database Schema (Key Adjustments)
Table: expression_events (The Canvas) | Field | Type | Purpose | | :--- | :--- | :--- | | id | UUID | PK | | user_id | UUID | Link to profile (AI readiness) | | type | Enum | text_only, image_composite | | vibe_tags | Array(Text) | New: Stores the taxonomy tags (e.g., ['Pain Cave', 'Night Run']) | | content | Text | The user's story | | media_url | Text | URL to the composite image in Storage | | moderation_status | Enum | pending, approved, rejected, flagged_by_ai | | visibility_score | Int | 0 (Hidden), 1 (User Only), 10 (Public), 100 (Featured) | | ai_embedding | Vector | Future: Reserved for semantic search embeddings |
Table: users (Profile)
	•	Added field: trust_score (Int) - Increments with every approved post. Used to auto-approve future content.
4. User Interface Specifications
Homepage (The Manifesto)
	•	Experience: Scroll-driven reveal.
	•	Tech: Framer Motion for text staggers and opacity reveals.
	•	Key KPI: Scroll depth to the "Join the Expression" CTA.
Interactive Canvas (Sticker Studio)
	•	Input Flow:
	1	Upload: User selects photo.
	2	Express: User selects a filter (CSS) and drags 1-3 branded stickers onto the image.
	3	Context: User types a caption and selects Vibe Tags.
	4	Submit: Image processed client-side -> Uploaded -> Optimistic UI feedback.
	•	The Wall: A masonry grid layout (CSS Grid) populated by Supabase Realtime subscription.
DWTC Clubhouse (Archive)
	•	Uploads: Member-gated upload zone.
	•	Optimization: Implement compressorjs on the client side to resize/compress images before upload to save bandwidth costs.
	•	Browsing: Filter by "Vibe Tag" (e.g., "Show me all 'Race Day' stories").
5. Development Phases
Phase 1: Foundation (Weeks 1-2)
	•	Setup Next.js + Supabase.
	•	Implement Auth and Database Schema (including new expression_events structure).
	•	Task: Build the "Vibe Tag" selector component.
Phase 2: The Canvas & Sticker Engine (Weeks 3-4)
	•	Integrate fabric.js or react-konva.
	•	Build the "Sticker Studio" UI (Upload -> Overlay -> Export).
	•	Task: Implement Client-side image compression.
Phase 3: Intelligence & Defense (Week 5)
	•	Task: Connect OpenAI Moderation API to the submission endpoint.
	•	Task: Build the simple "Admin Queue" page (list pending posts -> Approve/Reject buttons).
Phase 4: Polish & Launch (Week 6)
	•	Homepage Manifesto animations.
	•	End-to-End testing of the "New User" vs. "Trusted User" flow.
	•	Load testing the Realtime subscription for the Wall.

## Runexpression Website – Technical Design & Project Plan

Product Overview
The Runexpression website is conceived as the expressive home for runners and the initial platform for launching the AI Coach product. At its core, the V1 experience is anchored around three critical user journeys:
	1	Creative, Experimental Homepage: A visually engaging, slightly experimental landing page that weaves the brand's manifesto into an interactive or motion-driven flow, culminating in a strong primary call to action (CTA).
	2	“Why You Run” Interactive Canvas: An inspiring, communal canvas allowing users to express themselves richly—submitting text, images, and possibly simple drawings—directly onto a digital wall. The experience is designed to be easy and motivating, going beyond simple input forms.
	3	DWTC Clubhouse Archive: A polished, content-forward clubhouse for members, featuring intuitive navigation of rich club resources (images, videos, lore, PDFs), and a key interactive capability for members to upload and permanently archive their own stories and media.
Beyond these, V1 retains a robust library, shop, and tooling, with clear technical scaffolding for progressive, AI-powered features and deeper club management. The aim is to activate key engagement around these three brand-defining touchpoints, and establish strong foundations for seamless future AI integration.

Purpose
Core Purpose:
The site brings the Runexpression philosophy to life through three main brand and community experiences:
	•	Expressive Discovery: The homepage invites users into the brand, delivering the manifesto through creative storytelling mechanisms and a compelling CTA.
	•	Motivational Community Participation: The interactive canvas motivates runners to be seen and heard, lowering friction for adding meaningful, creative contributions to a growing communal wall.
	•	Lasting Club Belonging: The DWTC Clubhouse archives the evolving story of the club, enabling rich browsing of lore and resources, and empowering members to permanently contribute their own artifacts.
Purposeful Solutions:
	•	An identity-driven alternative to standard running sites, made tangible through the manifesto experience.
	•	Immediate digital belonging for club members via uploads and archival features.
	•	Laying technical/persona groundwork for the AI Coach: shared profiles and data, ready to surface personal and communal content.

Target Audience
	•	Expressive Runners: Motivated by creative self-expression and community affirmation, core users of both the homepage and interactive canvas.
	•	Club Members: Frequent contributors and consumers of clubhouse resources, engaged in story-building and resource sharing.
	•	Shoppers: Attracted by shop and exclusive releases, but also drawn into the brand narrative via the homepage experience.
	•	Curious Visitors: Invited to deepen engagement through the signature homepage CTA and welcoming community experiences.
The site’s core experiences—homepage, canvas, and clubhouse—are designed to speak directly to these audiences, whether they arrive out of curiosity, intent to belong, or desire for creative participation.

Expected Outcomes
Tangible Outcomes
	•	High interaction with the manifesto flow and homepage CTA (click-through, scroll depth).
	•	Active contributions to the “Why You Run” canvas (submissions, time spent, revisits).
	•	Member engagement with clubhouse content and peer-uploaded media.
	•	Growth in signups, subscriptions, and club memberships, especially among expressive runners.
Intangible Outcomes
	•	Strong, distinctive brand identification around creativity and inclusion.
	•	Cultural credibility and momentum for the communal archive/wall.
	•	Smooth route for onboarding users into AI Coach through content and identity hooks.
Key KPIs
Metric
Short-Term Goal (V1)
Long-Term/AI Coach-Ready
Homepage CTA Engagement
>35% scrolls/clicks
>50% (personalized offers)
Canvas Submissions
300+ in 6 months
1,500+ unique stories
Clubhouse Uploads
200 member uploads
1,000+ in media archive
Shop/Newsletter
As previously defined
As previously defined
Activation and retention along the three core flows are the main evaluation criteria for launch.

Design Details
Information Architecture
	•	Homepage: Features the creative, motion-enhanced expression of the manifesto, tightly coupled with a clear, prominent CTA (“Join the Expression,” “Contribute Your Story,” etc.).
	•	Interactive Canvas (“Why You Run” Wall): Standalone, immersive section accessible from homepage and main nav; wall displays a flowing mosaic of contributions (text, image, drawn), updated in real time or near real time.
	•	DWTC Clubhouse: Member-authenticated area with structured navigation and visual storytelling—clearly organized resource cards (images, videos, lore, PDFs), and a permanent media upload feature.
Additional
	•	Library and Shop remain, but as supporting rather than primary V1 experiences.
Content Strategy
	•	Manifesto woven into creative UI elements (scroll-driven reveal, overlays, or subtle animation).
	•	Inspirational copy and visual storytelling in all three core experiences.
	•	All member-submitted media stored and surfaced with attribution, with moderation controls.
	•	Modular, extensible content (MDX, dynamic wall “tiles,” etc.).
UX Flows
	•	Homepage: Interactive scroll or motion cues draw users through the manifesto; a sticky or creatively surfaced CTA remains persistent and visible.
	•	Canvas Submission: Low friction, high delight—clear input, instant feedback, community affirmation (e.g., see your contribution instantly on the wall).
	•	Clubhouse Browsing/Uploading: Easy-to-navigate, visually rich; single upload interface for member media with confirmation and archival feedback.
Integration with Brand Philosophy
	•	All three experiences reflect “radically expressive running”: motion, color, participatory UI.
	•	Community affirmation is prioritized—user expressions and uploads are persistent, celebrated, and easily browsable.

Architectural Overview
Stack (remains as previously outlined):
	•	Frontend: Next.js (React)
	•	Backend: Supabase (Postgres + Auth + Storage)
	•	Content: MDX + user-generated content (UGC)
	•	Payments: Stripe
New/Expanded V1 Patterns:
	•	Home/manifesto UI uses modular animation (e.g., Framer Motion or CSS transitions) for progressive reveal without high complexity.
	•	Canvas and clubhouse uploads via Supabase Storage, with JSONB-rich metadata for extensibility.
	•	Real-time (or near real-time) content reflectivity using Supabase Realtime subscriptions or polling.
	•	All user-generated expressions and uploads linked to unified user IDs for AI Coach future compatibility.
Component Communication:
	•	Manifesto, canvas, and clubhouse all leverage shared user profile/auth data.
	•	Clubhouse and canvas both use similar interfaces for upload, rendering, and moderation, ensuring maintainability and reusability.
Architecture Diagram (update):
Layer
Key Services
Notes
Presentation
Next.js (SSR, static)
Shared surfaces for manifesto, canvas, clubhouse
Content/API
Supabase REST, Realtime
MDX, canvas events, club member uploads, moderation
Data Storage
Supabase Postgres
users, expression_events, club_contributions
Media Storage
Supabase Storage
Uploads for images, PDFs, videos

Data Structures and Algorithms
Key Tables & Relationships
Table
Purpose
Key Fields
users
Auth, identity, role, profile
auth_id (PK), email, profile, club, archetype, settings (JSONB)
content_library
Editorial/curated content
id (PK), title, slug, mdx_body, tags, author, published_at
expression_events
“Why You Run” canvas submissions
id (PK), user_id (FK), content (JSONB), media_urls (ARRAY), created_at, status (moderation), metadata
club_contributions
Clubhouse member uploads (archive)
id (PK), user_id (FK), type (image, video, PDF, story), media_url, metadata (JSONB), created_at, status
products
Shop
id (PK), name, description, price, images, active
orders
E-commerce
id, user_id, product_ids, status, stripe_session_id
clubs
Club hub, membership
id, name, description, member_ids, resources (ARRAY), exclusives
Additional Details
	•	expression_events: JSONB stores text, drawing data (SVG?), image URLs; moderation fields for curation and flagging.
	•	club_contributions: Flexible type and JSONB allow for club-member uploads of any media, attributed and queryable by member, event, or type.
	•	Both tie directly to user_id for personalization and future AI/analytics readiness.
Notable Algorithms & Patterns
	•	Canvas Stream: New events pushed onto wall mosaic in real time. Simple pub/sub or polling pattern; future: enhanced clustering or AI-driven surfacing.
	•	Moderation/Review: Admin view flags new “expressions” or “contributions” for quick approve/decline; supports future semi-automated moderation.
	•	Upload Deduplication: Basic hash check to prevent spam/duplicate content in club and canvas submissions.

System Interfaces
User and Admin Flows
	•	Homepage: Hybrid static/SSR page; motion modules fetch manifesto content at build, animations via Framer Motion/CSS.
	•	Canvas Submission: Authenticated (optionally anonymous) input (text, rich image upload, simple SVG/Canvas drawing); entry immediately reflected on wall. All media handled by Supabase Storage with metadata in expression_events.
	•	Clubhouse Upload: Authenticated club member submits images, docs, or stories; upload flow writes to club_contributions and storage; instant confirmation and appearance in archive.
	•	Moderation: Admin panel lists unreviewed events/contributions with quick approve, reject, or flag; status field in both main tables.
	•	Realtime Presentation: Wall/canvas and club archives auto-refresh via Supabase Realtime or timed polling for seamless multi-user updates.
Third-party/Backoffice
	•	Supabase SDK for storage, CRUD, and Realtime subscriptions.
	•	Stripe webhooks for shop/club commerce.
	•	Shared user IDs across all core tables for cross-surface personalization (and AI Coach hooks).
AI Coach Integration Readiness
	•	User auth and profile IDs unify all touchpoints.
	•	All community/club expressions (canvas, clubhouse) captured in extensible, AI-compatible data tables with JSONB metadata.
	•	Feature flags in system allow progressive activation of AI-driven features.

User Interfaces
Homepage (Creative/Experimental Manifesto)
	•	Design: Non-traditional, visually expressive grid or vertical scroll revealing the manifesto, mixing static, animated, and staggered text/image with scroll-activated cues. Lightweight but creative effects (e.g., parallax, fade, highlight) enhance but do not block performance or accessibility.
	•	CTA: One strong, visually anchored button (“Share Why You Run” / “Join the Archive” / “Become Expressed”) appears as a sticky or transitioning element, guiding users into key engagement surfaces.
“Why You Run” Interactive Canvas
	•	Design: Wall or flow-mosaic showing community contributions as cards/tiles; new posts appear in real/near real time. Submission interface supports:
	•	Text input (with light formatting)
	•	Image upload (drag/drop, mobile camera)
	•	Optional: Simple browser drawing (SVG/Canvas, colored ink, touch)
	•	Experience: Motivational copy, instant reflection of new submission, animation to highlight new/featured expressions, supportive prompts.
	•	Moderation: Subtle status feedback (“pending approval” for new users, instant for trusted).
DWTC Clubhouse (Content Archive)
	•	Design: Content-heavy but polished resource hub. Clear side/top nav to club lore, guides, videos, and member stories.
	•	Interactive Feature: Upload modal or dedicated section allows authenticated members to contribute images, stories, PDFs, or videos; uploads persist in the club archive.
	•	Browsing: Visual storytelling; member uploads displayed alongside “official” club content, with filters and attribution.
General Principles
	•	All interfaces are responsive, accessible, and optimized for delight and immediacy through motion, surfaces, and color.

Hardware Interfaces
	•	Web-mobile/desktop first.
	•	Responsive grid and gestures for canvas and clubhouse interfaces.
	•	Touch support for drawing (if included on canvas), optimized image capture on mobile.
	•	No native hardware integrations V1; future readiness for device hooks.

Testing Plan
Priority: Ensure smooth, delightful, and reliable flows across the three V1 anchor experiences.

Test Strategies
	•	Homepage: Test for animation/motion smoothness, correct manifesto sequencing, CTA stickiness/click-through, cross-device scroll behavior.
	•	Canvas: Validate submission of all input types (text/image/drawing), instant wall update/reflection, moderation states, mobile image and drawing UX, and spam prevention.
	•	Clubhouse: Test content navigation, upload and archival flows for all accepted media, member-only gating, upload status feedback; ensure uploads appear in archive promptly and accurately.
	•	Accessibility: Motion/animation supports WCAG guidance (reduced motion support).
	•	Robustness: Regression on critical library/shop/member flows.

Testing Tools
	•	Unit/Integration: Jest, React Testing Library.
	•	E2E Automation: Playwright or Cypress, emphasizing homepage → CTA → canvas and clubhouse flows.
	•	Accessibility: axe-core, focus on creative surfaces.
	•	Performance monitoring: Vercel Analytics, Sentry.

Testing Environments
	•	Local: Full dev parity; motion/animation debugging support.
	•	Staging: Vercel + Supabase preview with member/test accounts and sandboxed media uploads.
	•	Production: Live environment, error logging, and alerting especially for content submission and moderation anomalies.

Test Cases
Critical User Journeys:
	•	Homepage load/scroll → Manifesto fully revealed → CTA engaged → Canvas or Clubhouse entry.
	•	Canvas: Submit text/image/drawing → See on wall (all devices) → Moderate new user submission.
	•	Clubhouse: Member uploads media → Content appears in archive → Browsing/filtering by type and contributor.
Functional Cases:
Area
Scenario
Expected Outcome
Homepage
Animations trigger on scroll
Manifesto smoothly revealed, CTA persistent
Canvas
Submit rich input
Contribution appears on wall, feedback visible
Canvas
Upload inappropriate content
Flagged for moderation, not auto-displayed
Clubhouse
Upload story/image/PDF
Item visible in archive, proper metadata
Clubhouse
Archive browsing/filtering
Navigation is clear, recent items surfaced
Auth
Member entry into Clubhouse
Gated interface, upload possible

Reporting and Metrics
	•	Monitoring: Track engagement along homepage manifest/CTA, canvas wall additions, clubhouse archive uploads.
	•	Error/Bug Tracking: Proactively surface issues in submission, moderation, and animation flows.
	•	Weekly Reporting: Dashboard for creative experience engagement, new expressions, and member archive growth.

Deployment Plan
	•	Content, media, and feature gating for homepage, canvas, and clubhouse launches.
	•	Critical readiness checks: homepage motion/animation, wall/club archive population, media upload functioning smoothly.

Deployment Environment
	•	As previously defined, with media storage and CDN performance validated on image/drawing-heavy flows.

Deployment Tools
	•	As previously defined; extra focus on Supabase Storage configuration, moderation/admin toggles for canvas and clubhouse features.

Deployment Steps
	1	CI Verification: Checks on rich interaction flows, moderation interfaces, upload & storage.
	2	PR/Merge Workflows: All new features validated against core anchor experiences.
	3	Smoke Test: Validate homepage experience/CTA, rapid upload/browse on both canvas and clubhouse.
	4	Go-Live: All critical flows “green,” content seeded for wall/club archive.

Post-Deployment Verification
	•	Homepage, canvas, and clubhouse features functional and delightful across devices.
	•	Media/media-rich flows (uploads, wall, archive) robust and performant.
	•	Immediate bug triage and hotfix for moderation/upload edge cases.

Continuous Deployment
	•	Feature Flags: V1 core experiences easily toggled; AI Coach hooks separate via config.
	•	Futureproofing: New user/content data flows ready to extend for AI-based personalization, without disruptively rebuilding core V1 surfaces.
	•	Routine Validation: Focused QA and liveness checks on creative, wall, and archival flows per release.


This document captures an updated, V1-focused technical design, with all key development, testing, and deployment activities orbiting the homepage, interactive canvas, and DWTC Clubhouse—ensuring both an expressive launch and a robust foundation for future AI-powered expansion.



## Runexpression Website v1 Tech Stack Refinement
1. The "Must Haves"
These recommendations from your research are spot-on. Adopt them immediately.

	•	UI Components: shadcn/ui
	•	Why: It is the industry standard for Next.js right now. It gives you accessible, beautiful components (Dialogs, Tabs, Inputs) that you fully own and can style to match the "RunExpression" vibe.
	•	Verdict: YES.
	•	Animation: Framer Motion
	•	Why: It is the only library that handles "Scroll Reveal" (for the Manifesto) effortlessly while playing nice with React's rendering cycle.
	•	Verdict: YES.
	•	Backend/Storage: Supabase (Storage & Realtime)
	•	Why: You are already using Supabase for Auth/DB. Using their Storage and Realtime features prevents you from needing AWS S3 or a separate WebSocket server.
	•	Verdict: YES.
2. The "Modifications"
A. Interactive Canvas (Sticker Studio)
	•	V1 Spec says: "Sticker & Filter Studio (Composite Images)."
	•	Tool Selection: Use Fabric.js.
	•	Why: Fabric.js has built-in support for "Object Controls." When a user drops a sticker, Fabric automatically gives them the handles to resize, rotate, and drag it. Building those handles from scratch in raw Canvas is a nightmare.
	•	Implementation: Use Fabric to layer the User Photo (background) + Stickers (objects). On submit, use canvas.toDataURL() to generate the final JPG for Supabase.
B. Content Moderation
	•	V1 Spec says: "AI Sentinel (OpenAI) -> Admin Queue."
	•	Implementation: Use OpenAI Moderation API.
	•	Why: It is free (for most tiers) and incredibly fast. It prevents your database from ever storing illegal or hate-speech content. Relying only on a human admin means you might wake up to a defaced website that stayed up all night.
	•	Cost: Negligible.
	•	Effort: One API call in your Next.js Route Handler.
C. The Grid Layout (The Wall)
	•	Be careful. True "Masonry" (packing items vertically with uneven heights) is not supported in standard CSS Grid yet (only Firefox has experimental support). Standard CSS Grid leaves ugly gaps if items are different heights.
	•	Implementation: Use react-masonry-css.
	•	Why: It’s a lightweight component that calculates columns correctly based on screen width. It ensures your "Wall" looks like a tight mosaic, not a broken table.
3. The "Missing Piece".
	•	Image Compression: compressorjs
	•	Problem: Users will upload 5MB - 10MB photos from their iPhones to the Canvas/Clubhouse. If you store these raw, your bandwidth costs will explode, and the Wall will load slowly.
	•	Solution: Use compressorjs on the client side (browser) before the upload starts.
	•	Workflow: User selects file -> compressorjs resizes to max-width 1920px & JPEG quality 0.8 -> Result is ~400KB -> Upload to Supabase.
"Golden Stack" for Runexpression V1
Feature
Tool Selection
Notes
Framework
Next.js 14+ (App Router)
The spine of the app.
UI Kit
shadcn/ui + Tailwind CSS
Fast styling, accessible primitives.
Animation
Framer Motion
For the Manifesto scroll effects.
Sticker Engine
Fabric.js
Handles the "Sticker Studio" compositing.
The Wall Grid
react-masonry-css
Ensures the mosaic looks good on mobile/desktop.
Backend
Supabase
DB, Auth, Realtime, Storage.
Safety
OpenAI Moderation API
The "AI Sentinel" for text inputs.
Performance
compressorjs
Client-side image shrinking before upload.
Content
next-mdx-remote
For managing the Clubhouse Lore/Resources.

Updated project structure and implementation guide.

1. Project Scaffolding (Next.js 14+ App Router)

This tree highlights exactly where your Fabric.js logic and Supabase connections should live to keep the "Pragmatic Monolith" clean and scalable.

runexpression-v1/
├── app/
│   ├── (auth)/                 # Route Group for Auth pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/            # Protected routes (Clubhouse, etc.)
│   ├── api/                    # API Route Handlers
│   │   ├── moderation/         # OpenAI Moderation endpoint
│   │   │   └── route.ts
│   │   └── webhooks/           # Stripe webhooks
│   ├── canvas/                 # The Sticker Studio Page
│   │   └── page.tsx            # Server Component (Layout/SEO)
│   ├── globals.css             # Tailwind imports
│   ├── layout.tsx              # Root Layout (Providers)
│   └── page.tsx                # Homepage (Manifesto)
│
├── components/
│   ├── ui/                     # shadcn/ui components (Button, Dialog, etc.)
│   │   ├── button.tsx
│   │   └── ...
│   ├── manifesto/              # Homepage specific motion components
│   └── sticker-studio/         # 🎨 THE STICKER STUDIO MODULE
│       ├── CanvasEditor.tsx    # Main Fabric.js Logic ("use client")
│       ├── Toolbar.tsx         # Filter/Sticker buttons
│       ├── StickerPicker.tsx   # Grid of available stickers
│       └── useCanvas.ts        # (Optional) Custom hook for Fabric logic
│
├── lib/
│   ├── supabase/               # ⚡ SUPABASE UTILS
│   │   ├── client.ts           # Client-side (Browser) client
│   │   ├── server.ts           # Server-side (App Router) client
│   │   └── admin.ts            # Service Role client (Admin/Cron jobs)
│   ├── utils.ts                # shadcn utility (clsx/tailwind-merge)
│   └── constants.ts            # Vibe Tags, Sticker URLs, Config
│
├── public/
│   └── stickers/               # Static sticker assets (png/svg)
│       ├── logo-white.png
│       ├── tape-strip.png
│       └── slogan-fast.png
│
├── types/
│   └── database.types.ts       # Generated Supabase TypeScript definitions
│
├── middleware.ts               # Supabase Auth Middleware protection
├── next.config.mjs
└── package.json

2. Implementation Guidance: The "Sticker Studio"

This is the most complex frontend component in V1. Since Fabric.js interacts directly with the browser's <canvas> DOM element, it must be a Client Component.

Key Challenges & Solutions

	•	Hydration Errors: Fabric tries to access window immediately. We must strictly load it inside a useEffect.
	•	Responsiveness: HTML5 Canvas does not resize automatically like a div. We need a container observer to resize the canvas dynamically.
	•	Export Quality: Users want high-res downloads, but the screen might be small. We use toDataURL with a multiplier for high-quality export.

The Code: components/sticker-studio/CanvasEditor.tsx

Prerequisite: npm install fabric (Note: Fabric v5 is stable; v6 is beta but recommended for TS. This example uses v5 syntax which is most common).

"use client";

import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric"; // Ensure you are using fabric v5+
import { Button } from "@/components/ui/button";
import { Download, Layers, Eraser } from "lucide-react";

// Types for props (e.g., the user's uploaded image URL)
interface CanvasEditorProps {
  baseImageUrl: string | null;
  onExport: (blob: Blob) => void;
}

export default function CanvasEditor({ baseImageUrl, onExport }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  // 1. Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create the canvas instance
    const canvas = new fabric.Canvas(canvasRef.current, {
      height: 600, // Default height, will scale to image
      width: 400,  // Default width
      backgroundColor: "#f3f4f6",
      preserveObjectStacking: true, // Selected object stays in place (doesn't jump to front)
    });

    // Handle selection events for UI updates
    canvas.on("selection:created", (e) => setActiveObject(e.selected?.[0] || null));
    canvas.on("selection:cleared", () => setActiveObject(null));

    setFabricCanvas(canvas);

    // Cleanup on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  // 2. Load the User's Base Image (Background)
  useEffect(() => {
    if (!fabricCanvas || !baseImageUrl) return;

    fabric.Image.fromURL(baseImageUrl, (img) => {
      // Scale image to fit within a max width (e.g., mobile screen width)
      const maxWidth = window.innerWidth < 600 ? window.innerWidth - 32 : 600;
      const scaleFactor = maxWidth / (img.width || 1);
      
      img.set({
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        originX: 'left',
        originY: 'top'
      });

      // Resize canvas to match the scaled image
      fabricCanvas.setWidth((img.width || 0) * scaleFactor);
      fabricCanvas.setHeight((img.height || 0) * scaleFactor);
      
      // Set as un-selectable background
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
    }, { crossOrigin: "anonymous" }); // Crucial for exporting CORS images
  }, [fabricCanvas, baseImageUrl]);

  // 3. Helper: Add a Sticker
  const addSticker = (url: string) => {
    if (!fabricCanvas) return;

    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(100); // Initial sticker size
      img.set({
        left: fabricCanvas.getWidth() / 2,
        top: fabricCanvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        borderColor: "#FF4500", // Brand Color (RunExpression Orange?)
        cornerColor: "#FFFFFF",
        cornerSize: 10,
        transparentCorners: false,
      });
      
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
    });
  };

  // 4. Helper: Apply Filter (Simple CSS-like filter on Background)
  const applyFilter = (filterType: "grayscale" | "sepia" | "none") => {
    if (!fabricCanvas || !fabricCanvas.backgroundImage) return;

    const bgImage = fabricCanvas.backgroundImage as fabric.Image;
    bgImage.filters = []; // Clear existing

    if (filterType === "grayscale") {
      bgImage.filters.push(new fabric.Image.filters.Grayscale());
    } else if (filterType === "sepia") {
      bgImage.filters.push(new fabric.Image.filters.Sepia());
    }

    bgImage.applyFilters();
    fabricCanvas.renderAll();
  };

  // 5. Helper: Export Final Composite
  const handleExport = () => {
    if (!fabricCanvas) return;

    // Deselect everything first so selection handles don't show in export
    fabricCanvas.discardActiveObject(); 
    fabricCanvas.renderAll();

    // Export to blob
    fabricCanvas.getElement().toBlob((blob) => {
      if (blob) onExport(blob);
    }, "image/jpeg", 0.8);
  };

  // 6. Helper: Delete Selected Sticker
  const deleteSelected = () => {
    if (fabricCanvas && activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto p-4">
      {/* Canvas Wrapper */}
      <div className="border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <canvas ref={canvasRef} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 justify-center bg-white p-4 rounded-xl shadow-lg border w-full">
        <div className="space-x-2 border-r pr-4 mr-2">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Filters</span>
          <Button variant="outline" size="sm" onClick={() => applyFilter("none")}>Normal</Button>
          <Button variant="outline" size="sm" onClick={() => applyFilter("grayscale")}>B&W</Button>
          <Button variant="outline" size="sm" onClick={() => applyFilter("sepia")}>Vintage</Button>
        </div>

        <div className="space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Stickers</span>
          <Button variant="ghost" size="sm" onClick={() => addSticker("/stickers/logo-white.png")}>
            + Logo
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addSticker("/stickers/tape-strip.png")}>
            + Tape
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-4 w-full justify-between">
        <Button 
          variant="destructive" 
          onClick={deleteSelected} 
          disabled={!activeObject}
        >
          <Eraser className="w-4 h-4 mr-2" /> Delete
        </Button>
        
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white w-full max-w-[200px]" 
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" /> Save & Next
        </Button>
      </div>
    </div>
  );
}

3. Critical Supabase Utils (lib/supabase/)

You need two distinct clients: one for the browser (interacting with the Canvas) and one for your API routes (handling Moderation).

lib/supabase/client.ts (Browser Client)

Use this inside your Components (like CanvasEditor) to upload files.

import { createBrowserClient } from '@supabase/ssr'

// Use this for client-side operations (Uploads, Auth, Realtime subscriptions)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

lib/supabase/server.ts (Server Client)

Use this in your Next.js Server Actions or API Routes to check permissions or write to the database securely.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  )
}


