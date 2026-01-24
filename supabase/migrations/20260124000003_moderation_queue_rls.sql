-- RunExpression V1 - Moderation Queue RLS
-- Description: Restrict moderation queue access to privileged roles

-- Remove broad access granted earlier
REVOKE ALL ON public.moderation_queue FROM authenticated;

-- Views do not support RLS; enforce access via view predicate instead.
CREATE OR REPLACE VIEW public.moderation_queue WITH (security_barrier = true) AS
SELECT
  queue.source,
  queue.id,
  queue.created_at,
  queue.type,
  queue.content,
  queue.media_url,
  queue.user_id,
  queue.user_name,
  queue.user_email,
  queue.vibe_tags
FROM (
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
) AS queue
WHERE COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('moderator', 'admin')
ORDER BY queue.created_at ASC;

-- Ensure authenticated users cannot write to the view
REVOKE INSERT, UPDATE, DELETE ON public.moderation_queue FROM authenticated;

-- Grant select so the view can be queried by authenticated users
GRANT SELECT ON public.moderation_queue TO authenticated;
