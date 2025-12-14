
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


