-- RunExpression V1 - Moderation Queue RLS
-- Description: Restrict moderation queue access to privileged roles

-- Remove broad access granted earlier
REVOKE ALL ON public.moderation_queue FROM authenticated;

-- Enable and enforce RLS on the moderation queue view
ALTER VIEW public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.moderation_queue FORCE ROW LEVEL SECURITY;

-- Allow only moderators/admins to read from the moderation queue
CREATE POLICY "Moderators can view moderation queue"
ON public.moderation_queue
FOR SELECT
TO authenticated
USING (
  COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('moderator', 'admin')
);

-- Ensure authenticated users cannot write to the view
REVOKE INSERT, UPDATE, DELETE ON public.moderation_queue FROM authenticated;

-- Grant select so RLS can scope access
GRANT SELECT ON public.moderation_queue TO authenticated;
