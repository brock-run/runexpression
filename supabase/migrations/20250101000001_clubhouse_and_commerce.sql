-- RunExpression V1 - Clubhouse and Commerce Tables

-- =====================================================
-- CLUB_CONTRIBUTIONS TABLE
-- Clubhouse uploads (lore, media, resources)
-- =====================================================
CREATE TABLE public.club_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Content type
    type TEXT CHECK (type IN ('story', 'media', 'document')) NOT NULL,

    -- Content
    title TEXT NOT NULL,
    body TEXT, -- Markdown for stories, caption for media
    media_url TEXT, -- URL to uploaded file
    file_size BIGINT, -- File size in bytes
    file_type TEXT, -- MIME type

    -- Categorization
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    event_reference TEXT, -- Optional link to specific event/run

    -- Attribution
    contributor_name TEXT, -- Display name (may differ from profile name)

    -- Moderation
    moderation_status TEXT CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending' NOT NULL,
    moderation_reason TEXT,
    moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    moderated_at TIMESTAMPTZ,

    -- Visibility
    visibility TEXT CHECK (visibility IN ('public', 'club_only', 'hidden')) DEFAULT 'club_only' NOT NULL,

    -- Featured flag (set by admins)
    is_featured BOOLEAN DEFAULT false NOT NULL,

    -- Flexible metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS Policies for club_contributions
ALTER TABLE public.club_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Club members can view contributions"
    ON public.club_contributions FOR SELECT
    USING (
        club_id IN (
            SELECT club_id FROM public.club_memberships
            WHERE user_id = auth.uid()
        )
        OR visibility = 'public'
    );

CREATE POLICY "Club members can create contributions"
    ON public.club_contributions FOR INSERT
    WITH CHECK (
        club_id IN (
            SELECT club_id FROM public.club_memberships
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own pending contributions"
    ON public.club_contributions FOR UPDATE
    USING (
        auth.uid() = user_id
        AND moderation_status = 'pending'
    );

CREATE POLICY "Admins can moderate contributions"
    ON public.club_contributions FOR UPDATE
    USING (
        club_id IN (
            SELECT club_id FROM public.club_memberships
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Indexes
CREATE INDEX idx_club_contributions_club_id ON public.club_contributions(club_id);
CREATE INDEX idx_club_contributions_user_id ON public.club_contributions(user_id);
CREATE INDEX idx_club_contributions_type ON public.club_contributions(type);
CREATE INDEX idx_club_contributions_created_at ON public.club_contributions(created_at DESC);
CREATE INDEX idx_club_contributions_moderation_status ON public.club_contributions(moderation_status);

-- =====================================================
-- PRODUCTS TABLE
-- Shop items (physical and digital)
-- =====================================================
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Product info
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('physical', 'digital')) NOT NULL,

    -- Pricing (stored in cents)
    price_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,

    -- Stripe integration
    stripe_price_id TEXT,
    stripe_product_id TEXT,

    -- Media
    images TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Inventory (for physical products)
    stock_quantity INTEGER,
    low_stock_threshold INTEGER,

    -- Flags
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS Policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are viewable by everyone"
    ON public.products FOR SELECT
    USING (is_active = true);

-- Indexes
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_is_active ON public.products(is_active);

-- =====================================================
-- ORDERS TABLE
-- Purchase records
-- =====================================================
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Stripe integration
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,

    -- Order details
    status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending' NOT NULL,
    total_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,

    -- Line items (JSONB for flexibility)
    items JSONB NOT NULL,
    -- Example: [{"product_id": "...", "quantity": 1, "price_cents": 2500}]

    -- Shipping (for physical products)
    shipping_address JSONB,
    tracking_number TEXT,
    shipped_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS Policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- =====================================================
-- AI_COACH_WAITLIST TABLE
-- Email capture for AI Coach feature
-- =====================================================
CREATE TABLE public.ai_coach_waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Contact info
    email TEXT UNIQUE NOT NULL,

    -- Context questions
    why_running TEXT,
    coach_expectations TEXT,

    -- Source tracking
    source TEXT, -- e.g., "homepage", "flow", "clubhouse"

    -- Follow-up
    contacted_at TIMESTAMPTZ,
    notes TEXT
);

-- RLS Policies for ai_coach_waitlist
ALTER TABLE public.ai_coach_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
    ON public.ai_coach_waitlist FOR INSERT
    WITH CHECK (true);

-- Indexes
CREATE INDEX idx_ai_coach_waitlist_email ON public.ai_coach_waitlist(email);
CREATE INDEX idx_ai_coach_waitlist_created_at ON public.ai_coach_waitlist(created_at DESC);

-- =====================================================
-- Add updated_at triggers
-- =====================================================
CREATE TRIGGER handle_club_contributions_updated_at
    BEFORE UPDATE ON public.club_contributions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
