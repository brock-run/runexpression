-- Trust Score System for RunExpression
--
-- Tracks user reputation based on community engagement and content quality.
-- Trust scores determine user privileges and moderation levels.
--
-- Security Model:
-- - Only service role (via API routes) can modify trust scores
-- - Users can only view their own trust events
-- - No authenticated user INSERT policy - prevents score manipulation

-- Add trust_score column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS trust_level TEXT DEFAULT 'newcomer' NOT NULL
  CHECK (trust_level IN ('newcomer', 'regular', 'trusted', 'pillar'));

-- Create index for trust score queries
CREATE INDEX IF NOT EXISTS idx_profiles_trust_score
ON public.profiles(trust_score DESC);

-- Trust score activity log table
CREATE TABLE IF NOT EXISTS public.trust_score_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
      'flow_post_approved',
      'flow_post_rejected',
      'contribution_approved',
      'contribution_rejected',
      'received_like',
      'membership_verified',
      'daily_login',
      'moderation_action'
    )),
    points INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for trust_score_events
ALTER TABLE public.trust_score_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own trust events
CREATE POLICY "Users can view own trust events"
    ON public.trust_score_events FOR SELECT
    USING (auth.uid() = user_id);

-- No INSERT policy for authenticated users - only service role (which bypasses RLS) can insert
-- This ensures trust scores can only be modified through server-side API routes

-- Index for user trust events
CREATE INDEX IF NOT EXISTS idx_trust_score_events_user_id
ON public.trust_score_events(user_id);

-- Function to update user trust level based on score
CREATE OR REPLACE FUNCTION update_trust_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Update trust level based on score thresholds
    UPDATE public.profiles
    SET trust_level = CASE
        WHEN NEW.trust_score >= 500 THEN 'pillar'
        WHEN NEW.trust_score >= 200 THEN 'trusted'
        WHEN NEW.trust_score >= 50 THEN 'regular'
        ELSE 'newcomer'
    END
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update trust level when score changes
DROP TRIGGER IF EXISTS trust_score_level_update ON public.profiles;
CREATE TRIGGER trust_score_level_update
    AFTER UPDATE OF trust_score ON public.profiles
    FOR EACH ROW
    WHEN (OLD.trust_score IS DISTINCT FROM NEW.trust_score)
    EXECUTE FUNCTION update_trust_level();

-- Function to add trust score points
CREATE OR REPLACE FUNCTION add_trust_score(
    p_user_id UUID,
    p_event_type TEXT,
    p_points INTEGER,
    p_description TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Set safe search_path to prevent object-name hijacking
    PERFORM set_config('search_path', 'public, pg_temp', true);

    -- Insert event log
    INSERT INTO public.trust_score_events (user_id, event_type, points, description)
    VALUES (p_user_id, p_event_type, p_points, p_description);

    -- Update user's trust score
    UPDATE public.profiles
    SET trust_score = trust_score + p_points,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only service role can execute this function (no grant to authenticated)
-- Trust scores are managed exclusively through server-side API routes
REVOKE EXECUTE ON FUNCTION add_trust_score FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION add_trust_score FROM authenticated;

-- Comment on trust score system
COMMENT ON COLUMN public.profiles.trust_score IS 'User reputation score based on community engagement';
COMMENT ON COLUMN public.profiles.trust_level IS 'Trust tier: newcomer (<50), regular (50-199), trusted (200-499), pillar (500+)';
COMMENT ON TABLE public.trust_score_events IS 'Log of all trust score changes for transparency';
