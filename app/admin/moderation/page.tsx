import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ModerationQueue } from '@/components/admin/moderation-queue'

export default async function ModerationPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // TODO: Add proper admin role check
  // For now, any authenticated user can access moderation
  // In production, check user role from profiles table

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">
            Moderation Queue
          </h1>
          <p className="text-neutral-600">
            Review and approve Flow expressions waiting for moderation
          </p>
        </div>

        <ModerationQueue />
      </div>
    </div>
  )
}
