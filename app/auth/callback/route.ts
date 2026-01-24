import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * OAuth callback handler for Supabase authentication
 *
 * Validates the authorization code and exchanges it for a session.
 * Includes protection against open redirect vulnerabilities by validating
 * the redirect URL is internal.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  // Validate redirect URL to prevent open redirect vulnerability
  const isValidRedirect = (url: string): boolean => {
    // Allow only relative URLs starting with /
    if (url.startsWith('/') && !url.startsWith('//')) {
      return true
    }
    return false
  }

  const safeNext = isValidRedirect(next) ? next : '/'

  if (code) {
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        Sentry.captureException(error, {
          tags: { component: 'auth-callback' },
          extra: { code_present: true }
        })

        // Redirect to login with error message
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('error', 'auth_callback_failed')
        return NextResponse.redirect(loginUrl)
      }
    } catch (err) {
      Sentry.captureException(err, {
        tags: { component: 'auth-callback' },
        extra: { code_present: true }
      })

      // Redirect to login on unexpected errors
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'unexpected_error')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect to the validated page they were trying to access
  return NextResponse.redirect(new URL(safeNext, request.url))
}
