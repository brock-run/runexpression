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
