import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { awardTrustPoints, TRUST_EVENTS, TrustEventType } from '@/lib/trust-score'
import * as Sentry from '@sentry/nextjs'

/**
 * Request schema for awarding trust points
 */
const AwardTrustSchema = z.object({
  user_id: z.string().uuid(),
  event_type: z.enum([
    'flow_post_approved',
    'flow_post_rejected',
    'contribution_approved',
    'contribution_rejected',
    'received_like',
    'membership_verified',
    'daily_login',
    'moderation_action',
  ] as const),
  custom_points: z.number().optional(),
  custom_description: z.string().optional(),
})

/**
 * POST /api/trust/award
 *
 * Awards trust points to a user. Requires admin privileges.
 * Used by the moderation dashboard when approving/rejecting content.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    // 1. Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      )
    }

    // 2. Check if user is admin/moderator
    const { data: profile } = await supabase
      .from('profiles')
      .select('expression_data')
      .eq('id', user.id)
      .single()

    const expressionData = profile?.expression_data as Record<string, unknown> | null
    const isAdmin = expressionData?.is_admin === true || expressionData?.is_moderator === true

    // Enforce authorization check (bypassed only in development)
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isAdmin && !isDevelopment) {
      return NextResponse.json(
        { error: 'Admin privileges required.' },
        { status: 403 }
      )
    }

    // 3. Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      // Handle malformed JSON separately from validation errors
      if (parseError instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Invalid JSON in request body.' },
          { status: 400 }
        )
      }
      // Re-throw unexpected errors to be caught by outer handler
      throw parseError
    }

    const validationResult = AwardTrustSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data.',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { user_id, event_type, custom_points, custom_description } =
      validationResult.data

    // 4. Award trust points
    const result = await awardTrustPoints(
      user_id,
      event_type as TrustEventType,
      custom_points,
      custom_description
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to award trust points.' },
        { status: 500 }
      )
    }

    // 5. Return success
    const eventConfig = TRUST_EVENTS[event_type as TrustEventType]
    const pointsAwarded = custom_points ?? eventConfig.points

    return NextResponse.json({
      success: true,
      message: `Awarded ${pointsAwarded} trust points for ${event_type}`,
      points_awarded: pointsAwarded,
    })
  } catch (error) {
    console.error('Trust award error:', error)
    Sentry.captureException(error, {
      tags: { api: 'trust-award' },
    })

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
