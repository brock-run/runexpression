Runexpression Website – Technical Design & Project Plan

---

## Product Overview

The Runexpression website is the expressive home for runners and the launchpad for the AI Coach experience. At its core, three connected journeys anchor V1:

1. **Creative, Experimental Homepage:** A visually rich, motion-driven landing page that shapes the brand manifesto into an interactive flow, ending in a clear CTA.

2. **“Why You Run” Interactive Canvas:** A living, communal wall (the Flow) encouraging all visitors to express what their run meant—capturing emotion through text, images, or art, instantly woven into a dynamic, ever-shifting collective record.

3. **DWTC Clubhouse Archive:** A polished, content-centric digital “home base” for the DWest Track Club—a permanent archive and vibrant club community space where DWTC’s lore, routes, and rituals are treasured, stories and photos are easily contributed, and the rich, evolving history of the club is built together.

V1 also includes a robust library, shop, and foundational scaffolding for future AI and deep club functionality. Every touchpoint strengthens the pillars of creative expression, community identity, and club belonging.

---

## Purpose

**Core Purpose:**

* **Expressive Discovery:** Draws runners into the brand with a creative, emotionally resonant homepage and clear, motivating calls to action.

* **Motivational Community Participation:** The Flow and clubhouse foster honest, creative contributions, making every runner feel seen.

* **Lasting Club Belonging:** The DWTC Clubhouse becomes the digital home base and archive—a place where club stories live on, members can easily contribute, and the community’s journey is always visible and accessible.

**DWTC Clubhouse, Specifically:**

* The Clubhouse is the digital archive and gathering place for DWest Track Club (DWTC), where the crew’s lore is preserved—routes, race recaps, rituals, memories, and resources.

* Its main jobs:

  1. Provide DWTC members a clean, inspiring destination to catch up and see what’s happening.

  2. Make it dead simple for any member to add stories, photos, or documents—catalyzing participation.

  3. Create a permanent, browsable living record for the crew’s past, present, and emerging story.

---

## Target Audience

* **Expressive Runners:** Drawn to both community expression and personal reflection via homepage and interactive canvas.

* **DWTC Club Members:** Frequent contributors and consumers of the clubhouse, eager to build collective lore and enjoy club resources.

* **Shoppers:** Enticed by the shop, but often converted by exposure to expressive, community-driven stories.

* **Curious Visitors:** Those who land on the site looking for belonging, motivation, or inspiration.

---

## Expected Outcomes

### Tangible Outcomes

* Strong engagement with homepage narrative and CTAs.

* Active, creative submissions on the “Why You Run” canvas.

* Frequent DWTC Clubhouse uploads—stories, media, and resources—catalyzed by low-friction contribution flows.

* Measurable signups and deepening of club and community engagement.

### Intangible Outcomes

* Runexpression is recognized as a unique, creative hub—distinct from typical running sites.

* The DWTC Clubhouse becomes a source of club pride, inspiring ongoing contribution.

* The foundation for AI Coach and future features is deeply seeded into community and club mechanics.

### Key KPIs

---

## Design Details

### DWTC Clubhouse: Information Architecture

* **Top-Level Route:** `/club/dwtc` (auth-gated)

* **Core Sections:**

* **Navigation:** Clean club-customized nav bar or sidebar, persistent “Add to Archive” button.

### DWTC Clubhouse: UI & Visual Language

* **Visual Style:** Aligns tightly with homepage and canvas (“lab / tribe / lore” energy). Hand-drawn accents, gritty/unique card edges, non-corporate color palette, DWTC-specific color burst and club/crew photography.

* **Motion:** Subtle slide/fade-in for contributions, interactive hover/tap animations, and carousel transitions in overview.

* **Language:** “Sage in the parking lot”—deep but clear, warm, stories-first. Microcopy emphasizes tribe, lore, and inclusion:

  * “This is where the DWTC story lives.”

  * “Miles turn into memories here.”

  * “Add your chapter.”

---

### Clubhouse UX Flows: Member Contributions

Entry Points

* **Primary CTA:** "Add to the Archive" button, visually distinct, always available from core clubhouse pages.

* **Inline Prompts:** E.g., “Have a story from this race? Add yours.” in Lore & Stories, or “Captured a great route shot?” in Media Archive.

Contribution Flow

1. **Step 1 – Choose Type**

  * *Options:* Story, Photo/Video, or Document.

2. **Step 2 – Input Details**

  * *Story:* Title, short body text, optional attachment (image/video), tags (race, location, “vibe”), date.

  * *Photo/Video:* Drag-and-drop or click-to-upload (Supabase Storage), short caption (required), tags, event/date.

  * *Document/PDF:* File upload, title, description, tags (e.g., “Training Plan”, “Route Map”).

3. **Step 3 – Attribution**

  * Default: logged-in user’s club profile. Optional: allow nickname override (never full anonymity in the clubhouse).

4. **Step 4 – Review & Submit**

  * Preview card—shows how the entry will look, check all details.

  * Confirm and submit.

5. **Step 5 – Confirmation**

  * Success message—e.g., “Your story just joined the DWTC archive.”

  * Contextual link to where the contribution will live (“See it in Lore & Stories once approved”).

Moderation & Approval

* All contributions are created with `moderation_status = pending` in metadata.

* Once approved, they are instantly discoverable in their respective sections (Lore, Media, etc.).

---

### Clubhouse: Browsing & Viewing Experience

---

## Data Structures and Algorithms

### Table: `club_contributions`

This is the DWTC-focused parallel to the generic `expression_events`. Core schema for V1:

* **Moderation:** `metadata.moderation_status` tracks pending/approved/rejected.

* **Attribution:** User information (never fully anonymous) tied to member identity. Optionally display nickname, but no “guest/anon” state.

* **AI Coach Future:** Can join with user profiles, training data, and club activity later for holistic AI context.

### Storage & Retrieval

* **Media/Document Uploads:** Files go to Supabase Storage; `media_url` and `doc_url` fields store their public URLs.

* **Contribution Endpoints:**

  * `CreateClubContribution(user, club, payload)`

  * `ListClubContributionsByClub(club, filters)`

  * `ListFeaturedClubContributions(club)`

* **Browsing & Filtering:** Tag- and metadata-based queries, default sorted by `created_at DESC`, with optional spotlight of featured content.

---

## System Interfaces

### Clubhouse Backend/API

* **Media Handling:** Uploads via authenticated endpoints to Supabase Storage. Client receives presigned upload URLs.

* **Contribution Posting:** New contributions POST to `/api/club_contributions/create`, which validates, writes reference to DB, and returns for moderation.

* **Moderation:** Uses `metadata.moderation_status`. Default “pending”; review and approve via admin/club lead dashboard.

* **Browsing APIs:** `/api/club_contributions/list?club=...&type=...&tag=...` for various archive tabs and filters.

* **Identity Linking:** All posts associated to a verified club member; no truly anonymous Clubhouse submissions.

### Homepage + Canvas Alignment

* Homepage teaser block features a direct, branded link to `/club/dwtc`, referencing lore, rituals, and the energy of the crew. The Clubhouse visually and experientially delivers on this promise by being highly browsable, motion-rich, and easily navigable.

* Core visual and card/audio patterns are reused and adapted; only club-specific accents/colors/photography differentiate DWTC from core Runexpression sections.

* **Future:** V2 may surface a club-specific canvas Flow (filtered subset of `expression_events` relevant to DWTC members/events).

---

## User Interfaces

### Clubhouse UI & Flows

Core Layout

Contribution UX

1. **Launch Contribution:** Via all-sections CTA or direct "Contribute" page.

2. **Choose Card:** Select Story, Photo/Video, or Document.

3. **Input Form:**

  * Story: Title, body, optional media, tags, event/date.

  * Media: Upload, caption, tags, event/date.

  * Document: Upload, title, description, tags.

4. **Attribution:** Pre-fills logged-in member; optional nickname override; no full anonymity allowed.

5. **Preview & Confirm:** Shows card as it will appear; facility to edit or confirm.

6. **Submit & Feedback:** Delightful, on-brand confirmation (“Your story just joined the archive”), animated feedback, and direct link to contribution location.

Browsing UX

* **Tiles/Cards:** Gritty, hand-embellished edges, team color highlights, photos or thumbnails, contributor attribution, subtle microinteractions (fade/slide-in, hover pop).

* **Overview Carousel:** Motion mirrors homepage/canvas—tiles gently animate and invite deeper dive.

* **Filter & Search:** Lore & Media easily filtered by tag, year, event—quick access to major club themes, traditions, and moments.

Design Language & Motion

* **Unified Visual Grammar:** Core components and motion borrowed from homepage/canvas—expressive, artistic, energetic.

* **Color & Photography:** DWTC colors and candid/crew images distinguish the Clubhouse while using shared global frames, hand-drawn overlays, “imperfect” cards.

* **Language:** Celebratory, accessible, deep but grounded—mirroring “Sage in the parking lot” energy.

---

## AI Coach Hooks

* All `club_contributions` have structured links to user profiles, events, and tags, enabling the future AI Coach to contextualize a runner’s community connection, event history, and qualitative memories.

* The `metadata` JSONB supports future extensions (structured performance data, narrative “highlights,” links to sessions), so AI can reference club lore, event recaps, and resources.

* Clubhouse flows and community archives double as ground truth and memory bank for deep, personalized AI engagement.

---

This technical specification details how the DWTC Clubhouse aligns deeply with homepage and canvas experiences, balancing community expression, ease of contribution, powerful browsing, and lasting, richly storied digital belonging. All core flows, data models, interface guidelines, and brand cues are structured for seamless end-to-end build and future expansion.