-- RunExpression V1 - Initial Database Schema
-- This migration creates the core tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional user data
-- =====================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- User preferences and context (JSONB for flexibility)
    expression_data JSONB DEFAULT '{}'::jsonb,
    -- Example structure:
    -- {
    --   "favorite_vibes": ["Meditative", "Flow State"],
    --   "running_stats": {"weekly_miles": 30},
    --   "privacy_settings": {"show_full_name": true}
    -- }

    -- Soft delete flag
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (is_active = true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- CLUBS TABLE
-- Running clubs (DWTC, etc.)
-- =====================================================
CREATE TABLE public.clubs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Club identity and culture (JSONB for flexibility)
    manifesto JSONB DEFAULT '{}'::jsonb,
    -- Example structure:
    -- {
    --   "tagline": "Where lore lives",
    --   "values": ["Community", "Process", "Bacon"],
    --   "traditions": [...]
    -- }

    -- Settings
    is_public BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- RLS Policies for clubs
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public clubs are viewable by everyone"
    ON public.clubs FOR SELECT
    USING (is_public = true AND is_active = true);

-- =====================================================
-- CLUB_MEMBERSHIPS TABLE
-- Links users to clubs with roles
-- =====================================================
CREATE TABLE public.club_memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'coach', 'member')) DEFAULT 'member' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Prevent duplicate memberships
    UNIQUE(user_id, club_id)
);

-- RLS Policies for club_memberships
ALTER TABLE public.club_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Club memberships viewable by club members"
    ON public.club_memberships FOR SELECT
    USING (
        club_id IN (
            SELECT club_id FROM public.club_memberships
            WHERE user_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX idx_club_memberships_user_id ON public.club_memberships(user_id);
CREATE INDEX idx_club_memberships_club_id ON public.club_memberships(club_id);

-- =====================================================
-- EXPRESSION_EVENTS TABLE
-- The Flow - where runners express themselves
-- =====================================================
CREATE TABLE public.expression_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Content
    type TEXT CHECK (type IN ('text', 'image', 'photo_text')) NOT NULL,
    content TEXT, -- Main expression text
    content_long TEXT, -- Optional longer note
    media_url TEXT, -- URL to uploaded image

    -- Categorization
    vibe_tags TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Moderation
    moderation_status TEXT CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending' NOT NULL,
    moderation_reason TEXT,
    moderated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    moderated_at TIMESTAMPTZ,

    -- Visibility
    visibility TEXT CHECK (visibility IN ('public', 'private', 'pending')) DEFAULT 'pending' NOT NULL,

    -- Flexible metadata (JSONB)
    metadata JSONB DEFAULT '{}'::jsonb
    -- Example: {"run_distance": 5, "run_date": "2025-01-15", "location": "..."}
);

-- RLS Policies for expression_events
ALTER TABLE public.expression_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved expressions"
    ON public.expression_events FOR SELECT
    USING (visibility = 'public' AND moderation_status = 'approved');

CREATE POLICY "Users can view their own expressions"
    ON public.expression_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create expressions"
    ON public.expression_events FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own pending expressions"
    ON public.expression_events FOR UPDATE
    USING (auth.uid() = user_id AND moderation_status = 'pending');

-- Indexes
CREATE INDEX idx_expression_events_user_id ON public.expression_events(user_id);
CREATE INDEX idx_expression_events_created_at ON public.expression_events(created_at DESC);
CREATE INDEX idx_expression_events_moderation_status ON public.expression_events(moderation_status);
CREATE INDEX idx_expression_events_visibility ON public.expression_events(visibility);

-- =====================================================
-- Function to update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_clubs_updated_at
    BEFORE UPDATE ON public.clubs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_expression_events_updated_at
    BEFORE UPDATE ON public.expression_events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
