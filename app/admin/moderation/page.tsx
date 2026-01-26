import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ModerationQueue } from '@/components/admin/moderation-queue'

export default async function ModerationPage() {
  const supabase = createClient()

  // Check authentication and admin status
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=/admin/moderation')
  }

  // Check if user is admin/moderator
  const { data: profile } = await supabase
    .from('profiles')
    .select('expression_data')
    .eq('id', user.id)
    .single()

  const expressionData = profile?.expression_data as Record<string, unknown> | null
  const isAdmin =
    expressionData?.is_admin === true || expressionData?.is_moderator === true

  // Enforce authorization check (bypassed only in development)
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (!isAdmin && !isDevelopment) {
    redirect('/flow')
  }

  // Fetch pending Flow posts
  const { data: pendingFlowPosts } = await supabase
    .from('expression_events')
    .select('*, profiles(username, full_name)')
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50)

  // Fetch pending Clubhouse contributions
  const { data: pendingContributions } = await supabase
    .from('club_contributions')
    .select('*, profiles(username, full_name), clubs(name, slug)')
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Review and moderate pending submissions from the community.
        </p>
      </div>

      <ModerationQueue
        flowPosts={pendingFlowPosts || []}
        contributions={pendingContributions || []}
      />
    </div>
  )
}
