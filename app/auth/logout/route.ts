import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { env } from '@/env'
import * as Sentry from '@sentry/nextjs'

/**
 * Logout route handler
 *
 * Signs out the current user and redirects to the homepage.
 */
export async function POST(): Promise<Response> {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      Sentry.captureException(error, {
        tags: { component: 'logout-route' }
      })
    }
  } catch (err) {
    Sentry.captureException(err, {
      tags: { component: 'logout-route' }
    })
  }

  return NextResponse.redirect(new URL('/', env.NEXT_PUBLIC_APP_URL))
}
