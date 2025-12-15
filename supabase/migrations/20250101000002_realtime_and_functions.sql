-- RunExpression V1 - Realtime and Helper Functions

-- =====================================================
-- Enable Realtime for expression_events
-- =====================================================
ALTER TABLE public.expression_events REPLICA IDENTITY FULL;

-- Enable Realtime publication for new approved entries
ALTER PUBLICATION supabase_realtime ADD TABLE public.expression_events;

-- =====================================================
-- Helper Function: Get User's Trust Score
-- Returns number of approved submissions by a user
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_trust_score(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM public.expression_events
        WHERE user_id = p_user_id
        AND moderation_status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Helper Function: Auto-create profile on signup
-- This runs automatically when a new user signs up
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Helper Function: Get recent Flow entries
-- Optimized query for homepage preview
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_recent_flow_entries(p_limit INTEGER DEFAULT 30)
RETURNS SETOF public.expression_events AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.expression_events
    WHERE moderation_status = 'approved'
    AND visibility = 'public'
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Helper Function: Get club statistics
-- Returns member count, contribution count, etc.
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_club_stats(p_club_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'member_count', (
            SELECT COUNT(*)
            FROM public.club_memberships
            WHERE club_id = p_club_id
        ),
        'contribution_count', (
            SELECT COUNT(*)
            FROM public.club_contributions
            WHERE club_id = p_club_id
            AND moderation_status = 'approved'
        ),
        'story_count', (
            SELECT COUNT(*)
            FROM public.club_contributions
            WHERE club_id = p_club_id
            AND type = 'story'
            AND moderation_status = 'approved'
        ),
        'media_count', (
            SELECT COUNT(*)
            FROM public.club_contributions
            WHERE club_id = p_club_id
            AND type = 'media'
            AND moderation_status = 'approved'
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- View: Moderation Queue
-- Helpful view for admin dashboard
-- =====================================================
CREATE OR REPLACE VIEW public.moderation_queue AS
SELECT
    'flow' AS source,
    e.id,
    e.created_at,
    e.type,
    e.content,
    e.media_url,
    e.user_id,
    p.full_name AS user_name,
    p.email AS user_email,
    e.vibe_tags
FROM public.expression_events e
LEFT JOIN public.profiles p ON e.user_id = p.id
WHERE e.moderation_status = 'pending'

UNION ALL

SELECT
    'clubhouse' AS source,
    c.id,
    c.created_at,
    c.type,
    c.title AS content,
    c.media_url,
    c.user_id,
    p.full_name AS user_name,
    p.email AS user_email,
    c.tags AS vibe_tags
FROM public.club_contributions c
LEFT JOIN public.profiles p ON c.user_id = p.id
WHERE c.moderation_status = 'pending'

ORDER BY created_at ASC;

-- Grant access to authenticated users with admin role
-- Note: You'll need to implement role checking in your app
GRANT SELECT ON public.moderation_queue TO authenticated;
