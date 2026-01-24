# RunExpression V1 Design

## System architecture

### High-level
- Next.js 14 App Router as a pragmatic monolith (SSR + RSC).
- Supabase for auth, Postgres, Storage, and Realtime.
- Stripe for Checkout and webhooks.
- OpenAI Moderation API for Flow content checks.

### Route groups
- Public: `/`, `/library`, `/shop`, `/tools`, `/coach/waitlist`, `/privacy`, `/terms`
- Flow: `/flow` (canvas + wall)
- App (authenticated): `/club/[slug]/*`, `/profile`, `/dashboard`
- API: `/api/auth/callback`, `/api/flow/submit`, `/api/clubhouse/upload`, `/api/webhooks/stripe`

## Data model highlights
- `expression_events` stores Flow submissions; `vibe_tags` as text array.
- `club_contributions` stores clubhouse items; `type` in (`story`, `media`, `document`).
- `products` and `orders` power shop; Stripe IDs referenced in DB.
- `ai_coach_waitlist` captures email and context.

## Core data flows

### Flow submission and moderation
```mermaid
flowchart TD
  UserSubmit["User submits Flow entry"] --> ApiFlow["POST /api/flow/submit"]
  ApiFlow --> OpenAIMod["OpenAI moderation"]
  OpenAIMod -->| "flagged" | Reject["Return error"]
  OpenAIMod -->| "clean" | TrustScore["Trust scoring check"]
  TrustScore -->| "trusted_user" | AutoApprove["Set approved + public"]
  TrustScore -->| "new_user" | PendingQueue["Set pending + queue"]
  PendingQueue --> AdminReview["Admin approves/rejects"]
  AdminReview --> Publish["Publish to public wall"]
  AutoApprove --> Publish
  Publish --> Realtime["Realtime insert event"]
  Realtime --> WallUpdate["Flow wall updates live"]
```

### Clubhouse upload and moderation
```mermaid
flowchart TD
  Member["Member starts upload"] --> UploadForm["Upload portal form"]
  UploadForm --> StorageUpload["Supabase Storage upload"]
  StorageUpload --> ApiClub["POST /api/clubhouse/upload"]
  ApiClub --> CreateRecord["Create club_contributions (pending)"]
  CreateRecord --> AdminQueue["Admin moderation queue"]
  AdminQueue -->| "approve" | PublishClub["Set visibility + approved"]
  AdminQueue -->| "reject" | RejectClub["Set rejected + hidden"]
  PublishClub --> SectionView["Visible in Lore/Media/Resources"]
```

## API route map
- `GET /api/auth/callback`: Supabase auth exchange and redirect.
- `POST /api/flow/submit`: validate input, moderation, trust scoring, insert.
- `POST /api/clubhouse/upload`: verify membership, create record, return upload path.
- `POST /api/webhooks/stripe`: validate webhook, record order, trigger delivery.

## Authorization and RLS
- RLS enabled on all tables.
- Public read: approved Flow entries and active products.
- Member-only read: DWTC clubhouse contributions.
- Admin-only update: moderation actions.
- Insert: authenticated users; anonymous Flow allowed with `user_id = null`.

## Storage design
- Buckets: `uploads` (Flow + Clubhouse), `products` (shop images).
- Path conventions:
  - `uploads/flow/YYYY/MM/{timestamp}-{filename}`
  - `uploads/clubhouse/dwtc/{media|documents}/{timestamp}-{filename}`
- Client-side compression for images (Flow + Clubhouse).

## Realtime strategy
- Supabase Realtime subscription on `expression_events` inserts where `approved` + `public`.
- Wall updates use optimistic UI and realtime inserts.

## UX patterns
- Default to Server Components; client only for forms, realtime, and animations.
- Consistent form patterns with Zod validation and clear error messaging.
- Motion is subtle, respects `prefers-reduced-motion`.
- Use monospace for UI labels, serif for body text.

## Analytics baseline
- Track events across homepage, Flow, Clubhouse, Shop, Tools, Waitlist.
- Use consistent event naming and context properties (type, tags, source).
