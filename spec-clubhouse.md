Runexpression Website – DWTC Clubhouse v1 Spec

## Product Overview

The DWTC Clubhouse v1 is a dedicated digital hub within the Runexpression website, designed to serve athletes of the Dubai Water Tribe Collective (DWTC) and interested visitors. It centralizes essential information, community lore, event documentation, and multimedia, reinforcing the Runexpression brand’s ethos of "lab / tribe / lore." The Clubhouse provides seamless access to race reports, calendars, media archives, and member-generated content, fostering both engagement and club spirit inside the broader Runexpression ecosystem.

## Purpose

The DWTC Clubhouse aims to centralize, preserve, and celebrate the tribe’s stories, achievements, and events in a way that feels authentic to the club ethos. It addresses the lack of a unified, easily navigable digital home for club members and fans, enabling efficient knowledge sharing and content curation.

**Scenarios:**

* A new member explores club lore and event history before their first race.

* A long-time member uploads recent race photos and reports.

* An admin curates, tags, and pins standout content to the Clubhouse wall post-event.

The Clubhouse captures and amplifies the living mythology of DWTC, transforming fragmented communications into a living archive and community touchstone.

## Target Audience

**Primary Personas:**

* **DWTC Athletes:** Seeking to contribute content, access up-to-date event info, and revisit club highlights.

* **DWTC Visitors/Fans:** Browsing lore, past achievements, and media to connect with the club culture.

* **Club Admins (e.g., Brock):** Responsible for curating, moderating, and organizing all member-generated content.

**Needs & Pain Points:**

* Easy access to relevant information and media (calendar, race recaps)

* Authentic reflection of club history and vibe

* User-friendly upload and moderation pathways

* Clean separation from the main Runexpression public-facing content, but still under the brand umbrella.

**Relevant Market Segments:** Regional athletic and social clubs, event-driven community groups, member-driven organizations seeking digital cohesion.

## Expected Outcomes

**Tangible:**

* Unified, visually branded Clubhouse microsite

* Functional, low-friction content upload and moderation system

* Intuitive navigation between calendar, lore, reports, and media

**Intangible:**

* Stronger sense of club identity and community

* Improved onboarding and retention via lore and event documentation

**Key Metrics:**

* Number of uploads (photos, reports, etc.) per month

* Unique members participating/uploading

* User dwell time within the Clubhouse section

* Engagements with curated content (views, likes, pins)

* Reduction in off-platform event info requests

**Short-term:** Full v1 content set live, regular usage by members and admins  

**Long-term:** Established institutional knowledge base, consistent engagement by new and veteran athletes

## Design Details

The Clubhouse is structured around seven core sections, each with dedicated navigation and clear user journeys:

* **Overview:** Snapshot of recent activity, featured lore, and calendar highlights.

* **Calendar:** List of upcoming events, linked to related reports and media.

* **Media Archive:** Browsable, filterable collection of photos, videos, and galleries.

* **Race Reports:** Structured archive of past event writeups and analyses.

* **Lore:** Mythology, in-jokes, and history—editable content blocks, stories, and quotes.

* **Member Wall:** Community feed of latest uploads, with curation and pinning.

* **Upload Portal:** Secure form for member contributions (reports, stories, images).

**Key Interactions:**

* Members can browse, filter, and search by tags (event, year, athlete).

* Admins can moderate, pin, and tag content.

* Upload portal validates members via invite code or login.

**Data Structures:**

* Entities include User, Media Item, Event, Report, Lore Entry, Tag, and AdminAction.

* Media stored in cloud storage (S3), metadata in a relational DB.

* Content items linked by tags, events, and relationships for flexible querying and display.

## Architectural Overview

### System Architecture Diagram

**Communication:**

* Frontend interacts with API server for all data/content.

* API server talks to DB & S3 (using presigned URLs for upload/download).

* Admin and user roles enforced via middleware.

**Design Patterns:**

* Model-View-Controller (MVC) for back end

* Atomic, composable UI components (React)

* RESTful resources; possible GraphQL for v2

## Data Structures and Algorithms

**Key Data Structures:**

**Algorithmic Considerations:**

* Content retrieval optimized via indexed tag and event relations.

* Filtering & searching performed at DB layer for efficiency, paginated responses.

* Batch moderation actions for efficient admin curation.

## System Interfaces

* **API Endpoints:** RESTful endpoints for all CRUD operations on media, events, reports, and lore entries leveraging JWT auth.

* **Upload Interface:** Secure multipart upload using presigned S3 URLs.

* **Tagging System:** API endpoints for creating, assigning, and querying by tags.

* **Third-party Integrations:** Potential webhook for media processing (image resizing, moderation).

* **Internal Admin Module:** Dedicated endpoints and UI components for moderation and curation operations.

## User Interfaces

**Core UI Components:**

* **Top-Level Nav:** Segmented tabs – Overview, Calendar, Media, Reports, Lore, Wall, Upload.

* **Browse & Filter Sidebar:** Persistent controls for tagging/filtering across archives.

* **Gallery Views:** Responsive grids for media and reports.

* **Lore Section:** Custom layouts for quotes and stories.

* **Upload Portal:** Simple, stepwise contribution form with authentication.

* **Admin Tools:** Inline moderation tools (approve, pin, tag) within feeds.

*Wireframes will depict clear, non-cluttered layouts focused on readability, Runexpression visual brand, and intuitive interaction pathways.*

## Hardware Interfaces

* **User Devices:** Supports desktop/mobile browsers (no custom hardware).

* **Server Infrastructure:** Standard virtualized or managed hardware—cloud instances, S3 storage; no club-specific HW integrations.

* **Protocols:** HTTPS for all comms, S3 for file storage (REST).

## Testing Plan

### Test Strategies

* **Unit Tests:** All critical APIs, database models, and utility functions.

* **Integration Tests:** Content flows (upload, browse, approve), media handling, tagging.

* **UI/UX Tests:** Core user journeys, responsiveness, and accessibility.

* **Edge/Negative Testing:** Invalid uploads, missing metadata, unauthorized actions.

* **Regression Testing:** Automated on each deploy via CI.

### Testing Tools

* **Backend:** Jest + Supertest for APIs.

* **Frontend:** React Testing Library, Cypress for end-to-end flows.

* **CI:** GitHub Actions/Travis for automation.

* **Accessibility:** axe-core plugin for compliance checks.

### Testing Environments

* **Staging:** Replicas of production env with anonymized content for validating integration.

* **Local Dev:** Mock S3/local storage, seed data for rapid iteration.

* **Performance:** Load testing tools (e.g., k6) on stochastic usage patterns.

### Test Cases

### Reporting and Metrics

* **Tracked Metrics:** API error rate, upload success rate, moderation turnaround time, unique active users per section.

* **Reporting:** Automated test results via CI dashboard, weekly rollups.

* **Stakeholder Dashboards:** Read-only dashboards for admin KPIs (could leverage Metabase, Grafana, or built-in admin UI).

## Deployment Plan

### Deployment Environment

* **Production:** Managed cloud environment (e.g., AWS EC2/Lightsail), S3 bucket for media, managed PostgreSQL DB.

* **Staging:** Isolated, scalable, matches production setup as closely as possible.

* **Considerations:** Daily backups, redundancy in DB and storage, health check endpoints, basic auto-scaling.

### Deployment Tools

* **CI/CD:** GitHub Actions for build/test, Docker for containerization.

* **Infrastructure Provisioning:** Terraform or AWS CloudFormation.

* **Monitoring:** CloudWatch + StatusCake for uptime and error reporting.

### Deployment Steps

1. Merge approved code to main branch

2. CI/CD pipeline builds Docker images and runs tests

3. Deploy to staging for validation

4. Manual verification & stakeholder sign-off

5. Deploy to production via CI/CD push

6. Run post-deploy data migrations/scripts if required

7. Monitor logs, perform smoke test

8. If issues, rollback via previous Docker image and restore DB snapshot

### Post-Deployment Verification

* Confirm key user flows (browse, upload, moderate) are functioning

* Verify data integrity in DB and media storage

* Monitor error logs and alerting systems for anomalies

### Continuous Deployment

* On green CI builds from main, auto-deploy to production (optional after initial manual releases)

* Automated rollback triggers on failed healthchecks or critical errors

* Frequent, iterative updates keep content, moderation rules, and UX components safely evolving

---

## DWTC Clubhouse v1 Task Checklist

### A. Content & IA Setup

* Build Clubhouse main navigation & top-level routes

* Implement Overview page with recent & featured content

* Structure Calendar page linked to Events DB

* Build Media Archive with filterable gallery

* Create Race Reports section (sortable/archive view)

* Develop Lore page with editable content blocks

* Configure Member Wall feed for curated posts

### B. Member Upload MVP

* Design & build Upload Portal with member validation

* Implement file upload handling (S3 presigned URLs)

* Connect uploads to pending/moderation queue

* Attach metadata (tags, event link, author) to each upload

### C. Browsing & Filters

* Implement tag & year-based filtering across archives

* Add search bar for quick info access

* Ensure deep linking and shareable URLs for content

### D. Admin Curation

* Build admin moderation dashboard/tools within UI

* Allow approve/reject/feature (pin) actions on content

* Implement batch actions (approve/reject multiple)

* Set up email/notification triggers for new submissions

* Log all admin actions for accountability

---

## Appendix A – Detailed Implementation Notes

* **Tagging Model:** Tags are polymorphic and can be assigned to reports, events, media, or lore for granular filtering.

* **Upload Validation:** Only authenticated members (invite code or SSO login) can submit. All uploads go to a moderation queue until approved by admin.

* **Media Storage:** Images and video files stored under /clubhouse/{event}/{year}/ in S3 for clean organization.

* **Race Reports:** Reports support markdown input for flexible formatting, all links validated/whitelisted.

* **Lore Section:** Editable only by admins through dedicated editor, supports embeds and stylized quote blocks.

* **Performance:** All archive and gallery endpoints paginated and cacheable; media optimized on ingest.

* **Permissions:** Tiered access (visitor -\> member -\> admin) enforced at API level; all writes require authentication.

---

## Appendix B – UX Flow References

**Major User Paths:**

*Browsing Lore as Visitor:*

* Enter Clubhouse → Select Lore tab → Read stories → Click tags/related events → Deep link to relevant race reports or media

*Current Member Finding Key Info:*

* Enter Clubhouse → Use Calendar to view upcoming events → Drill into recent Race Reports/media → Follow tags to specific years/athletes

*Member Uploading Content:*

* Log in or use invite code → Access Upload Portal → Enter report/image, select tags & event → Submit → See success confirmation → Admin moderation queue

*Admin/Brock Curating Content:*

* Enter Admin dashboard → Review new uploads → Approve/reject/pin as needed → Feature standout story/media on Overview or Wall → All actions logged

*All flows feature clear progress/state, branded feedback, and error handling per Runexpression’s approachable voice and tone.*