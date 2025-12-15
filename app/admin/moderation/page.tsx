import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ModerationQueue } from '@/components/admin/moderation-queue'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moderation Queue - Admin',
  description: 'Review and moderate pending Flow submissions',
}

export default async function AdminModerationPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // TODO: Add proper role-based access control
  // For now, any authenticated user can access (update this with admin role check)
  // Example: Check if user has admin role in profiles table
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', user.id)
  //   .single()
  // if (profile?.role !== 'admin') {
  //   redirect('/')
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Moderation Queue
        </h1>
        <p className="text-muted-foreground">
          Review and approve pending Flow submissions
        </p>
      </div>

      <ModerationQueue />
    </div>
  )
}
