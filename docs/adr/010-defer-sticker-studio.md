# ADR-010: Defer Sticker Studio to V1.1

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** scope, mvp, features, creative-tools

## Context

The original RunExpression vision included a **Sticker Studio** — a creative tool for users to design custom stickers, graphics, and visual elements using a Fabric.js-powered canvas editor.

**Sticker Studio Features (Original Spec):**
- Drag-and-drop canvas editor (similar to Canva or Figma)
- Library of running-themed clipart (shoes, trails, medals, bacon)
- Text overlays with custom fonts
- Layer management (bring to front, send to back)
- Export to PNG/SVG for sharing or printing
- Save designs to user profile
- Gallery of community-created stickers

**Use Cases:**
- Create custom race bib designs
- Design club logos and branding
- Make meme-style running stickers
- Compose visual journal entries for The Flow
- Create shareable quote graphics

**Technical Requirements:**
- Fabric.js (canvas manipulation library)
- Image upload and processing
- Asset library (clipart, fonts)
- Save/load design system (store canvas JSON in database)
- Export functionality (canvas → PNG/SVG)

**Current V1 Timeline:**
- 6-8 weeks to ship Homepage + Flow + Clubhouse + Blog
- Small team (1-2 devs)
- Need to focus on core value propositions

## Decision

We will **defer the Sticker Studio to V1.1** (or later) and focus V1 exclusively on:
1. **Homepage & Manifesto** (establish brand, drive traffic)
2. **The Flow** (core creative expression through text/photos)
3. **DWTC Clubhouse** (community archive and membership)
4. **Blog/Library** (thought leadership content)
5. **Shop Framework** (revenue generation)

**V1 Workaround:**
- Users can still upload images to The Flow (existing photos, screenshots)
- Users can create visual content outside RunExpression (Canva, Photoshop, phone apps) and upload results
- Pre-made sticker packs available in Shop (static graphics, not custom designs)

**V1.1 Implementation Plan:**
- Week 1: Fabric.js canvas setup, basic drawing tools
- Week 2: Asset library (clipart, fonts), layer management
- Week 3: Save/load designs, export to PNG/SVG
- Week 4: Polish, gallery, sharing features

## Consequences

### Positive

- **Faster V1 launch:** 6-8 weeks instead of 10-12 weeks (saves 2-4 weeks)
- **Focused scope:** Team can deliver polished core features instead of spreading thin
- **Reduced risk:** Fabric.js integration is complex (canvas state, performance, mobile compatibility) — defer to when we have more time
- **Better testing:** V1 launches with thoroughly tested features, not rushed creative tools
- **Clearer value prop:** V1 story is "write, share, connect" (not "design stickers")
- **Easier onboarding:** Fewer features to explain in initial launch
- **Revenue prioritization:** Shop framework delivers revenue immediately (stickers are nice-to-have)

### Negative

- **Less creative tooling:** Users who want visual design tools must use external apps (Canva, etc.)
- **Missed differentiation:** Sticker Studio could be unique selling point vs. Strava (competitive disadvantage)
- **User disappointment:** If sticker studio was teased early, users may expect it in V1
- **Two-phase creative tools:** Flow (V1) and Sticker Studio (V1.1) are separate launches instead of cohesive creative suite

### Neutral

- **Future flexibility:** Can pivot to different creative tools (e.g., AI-generated art instead of manual stickers)
- **Market validation:** V1 Flow will show if users want more visual creation tools (data-driven decision)

## Alternatives Considered

### Alternative 1: Include Sticker Studio in V1

**Description:** Ship all features (Homepage + Flow + Clubhouse + Blog + Shop + Sticker Studio) in initial launch.

**Pros:**
- **Complete vision:** V1 is fully-featured creative platform
- **Competitive edge:** Unique feature vs. Strava, Nike Run Club
- **Unified creative suite:** Flow and Sticker Studio work together from day one
- **User delight:** Users can create, design, and share all in one place

**Cons:**
- **10-12 week timeline:** Adds 2-4 weeks to development (misses optimal launch window)
- **Spread too thin:** Team must deliver 6 major features (quality suffers)
- **Fabric.js complexity:** Canvas editor is complex (mobile performance, state management, export bugs)
- **Testing burden:** More features = more QA, more edge cases, more bugs
- **Delayed revenue:** Takes longer to get Shop live (loses potential pre-orders)

**Why rejected:** V1 should be focused on core value (manifesto, community, expression). Sticker Studio is a nice-to-have, not must-have. Shipping a polished V1 in 6-8 weeks is better than a rushed V1 in 12 weeks.

---

### Alternative 2: Third-Party Embed (Canva Button)

**Description:** Embed Canva's "Create Design" button, users design in Canva, upload to RunExpression.

**Pros:**
- **Zero dev time:** Canva handles all design tooling
- **Professional tools:** Canva is better than anything we'd build in V1
- **No maintenance:** Canva maintains the editor, we just embed

**Cons:**
- **Disjointed UX:** Users leave RunExpression, design in Canva, come back (friction)
- **No customization:** Can't add running-specific templates or clipart
- **Branding conflict:** Users see Canva branding, not RunExpression
- **Data loss:** Designs stored in Canva, not our database (no ownership)
- **Dependency:** If Canva changes API or pricing, feature breaks

**Why rejected:** Embedding third-party tools breaks immersion and adds friction. If users are already using Canva, they can just upload images to Flow (same outcome, simpler implementation).

---

### Alternative 3: Simple Text-on-Image Tool (Minimal Stickers)

**Description:** Lightweight tool — users upload photo, add text overlay, export. No Fabric.js, just HTML5 canvas.

**Pros:**
- **Fast to build:** 3-5 days (vs. 2-4 weeks for full Sticker Studio)
- **Covers 80% use case:** Most stickers are just "quote on image"
- **Mobile-friendly:** Simpler canvas = better mobile performance
- **V1-appropriate:** Enough to differentiate without scope bloat

**Cons:**
- **Limited creativity:** No clipart, layers, or advanced design tools
- **Still adds scope:** Even simple tool adds 1 week to V1 timeline
- **Half-baked feature:** Might feel incomplete if users expect Canva-level tools
- **Technical debt:** If we want full Sticker Studio later, might rebuild from scratch

**Why rejected:** Even a simple sticker tool adds a week to V1. Better to launch without it and build the full version in V1.1 when we can do it right.

---

### Alternative 4: Pre-Made Sticker Packs Only

**Description:** Skip custom design, just sell pre-made sticker packs in Shop (static designs by illustrator).

**Pros:**
- **Zero dev time:** Just upload PNG images to Shop
- **Revenue-focused:** Stickers are product, not feature
- **Professional quality:** Hire illustrator for beautiful designs (better than user-generated)
- **V1-ready:** Can launch sticker packs day one

**Cons:**
- **No creativity:** Users can't make their own designs (defeats "expressive runner" mission)
- **One-way transaction:** Users buy, don't create (less engagement)
- **No viral loop:** Custom stickers create shareable moments (pre-made don't)

**Why rejected:** Pre-made stickers don't enable creative expression. They're a product, not a platform feature. This alternative misses the point of Sticker Studio (user creativity).

---

### Alternative 5: AI-Generated Stickers (OpenAI DALL-E)

**Description:** Users type prompt ("bacon on a trail"), AI generates custom sticker.

**Pros:**
- **No design skills needed:** Anyone can create (accessibility)
- **Unique results:** Every sticker is one-of-a-kind
- **Fast implementation:** OpenAI API handles generation (1-2 weeks)
- **On-brand:** AI Coach + AI Stickers = cohesive AI theme

**Cons:**
- **Cost:** DALL-E costs $0.02-0.08 per image (unsustainable at scale without paywall)
- **Quality inconsistent:** AI sometimes misses the mark (bacon looks weird)
- **No manual control:** Users can't fine-tune (frustrating if 90% right but 10% wrong)
- **Scope creep:** Still adds 1-2 weeks to V1

**Why rejected:** AI-generated stickers are interesting for V2+, but V1 should focus on proven creative tools (text, photos). Defer until AI Coach proves AI value first.

## References

- [Fabric.js Documentation](http://fabricjs.com/)
- [Canva Embed Documentation](https://www.canva.com/developers/)
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- RunExpression Docs: `DOCS/01-OVERVIEW.md` (V1 Scope: IN vs. OUT)
- RunExpression Docs: `DOCS/05-IMPLEMENTATION-PLAN.md` (6-Week Timeline)

## Notes

- **V1 messaging:** Homepage and marketing should NOT mention Sticker Studio (avoid creating expectation)
- **V1.1 teaser:** Can include "Creative Tools Coming Soon" on roadmap page to signal future plans
- **User research:** During V1, survey users: "Would you use a sticker design tool?" to validate demand
- **Competitive analysis:** Monitor if Strava or Runna launch visual creation tools (adjust priority if needed)

**V1.1 Implementation Details (when ready):**
- **Library:** Fabric.js (battle-tested, 14k stars, active maintenance)
- **Asset storage:** Supabase Storage (clipart, fonts, user uploads)
- **Design save format:** Store Fabric canvas JSON in `sticker_designs` table
- **Export:** Server-side rendering (Puppeteer or node-canvas) for high-quality PNG/SVG export
- **Mobile:** Touch-friendly canvas controls, simplified mobile UI

**When to revisit this decision:**
- If V1 user feedback strongly requests visual design tools (top 3 feature request)
- If competitor launches sticker studio and gains traction (competitive pressure)
- If Flow usage is low and we need more creative hooks (engagement strategy)
- If AI-generated art becomes cheaper/better (consider AI stickers instead of manual Fabric.js)

**Success Metrics for V1 (to validate deferral):**
- If **Flow posts/week > 50** without Sticker Studio → core expression is working (deferral correct)
- If **Shop revenue > $500/month** in V1 → monetization working (Sticker Studio can wait)
- If **user feedback mentions missing design tools < 10% of surveys** → not a priority

If these metrics hold, Sticker Studio stays V1.1+. If they don't, we accelerate.

---

**Related ADRs:**
- [ADR-001: Next.js App Router](./001-nextjs-app-router.md) - V1.1 Sticker Studio will use Next.js
- [ADR-003: Pragmatic Monolith](./003-pragmatic-monolith.md) - Sticker Studio will be new route group when added
