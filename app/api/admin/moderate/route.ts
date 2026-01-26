import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { awardTrustPoints } from '@/lib/trust-score'
import * as Sentry from '@sentry/nextjs'

/**
 * Request schema for moderation actions
 */
const ModerateSchema = z.object({
  type: z.enum(['flow', 'contribution']),
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
})

/**
 * POST /api/admin/moderate
 *
 * Approve or reject pending content. Requires admin privileges.
 * Awards or deducts trust points based on the action.
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
    const isAdmin =
      expressionData?.is_admin === true || expressionData?.is_moderator === true

    // Enforce authorization check (bypassed only in development)
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isAdmin && !isDevelopment) {
      return NextResponse.json(
        { error: 'Admin privileges required.' },
        { status: 403 }
      )
    }

    // 3. Parse and validate request body
    const body = await request.json()
    const validationResult = ModerateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data.',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { type, id, user_id, action } = validationResult.data
    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // 4. Update the content status using admin client (bypass RLS)
    const adminClient = createAdminClient()
    let trustPointsAwarded = false
    let trustPointsError: string | null = null

    if (type === 'flow') {
      const { error: updateError } = await adminClient
        .from('expression_events')
        .update({
          moderation_status: newStatus,
          moderated_at: new Date().toISOString(),
          moderated_by: user.id,
        })
        .eq('id', id)

      if (updateError) {
        throw new Error(`Failed to update Flow post: ${updateError.message}`)
      }

      // Award trust points (non-blocking failure)
      const eventType =
        action === 'approve' ? 'flow_post_approved' : 'flow_post_rejected'
      try {
        await awardTrustPoints(user_id, eventType)
        trustPointsAwarded = true
      } catch (trustError) {
        console.error('Failed to award trust points:', trustError)
        Sentry.captureException(trustError, {
          tags: { api: 'admin-moderate', operation: 'award-trust-points' },
          extra: { user_id, eventType, contentType: type, contentId: id },
        })
        trustPointsError =
          trustError instanceof Error ? trustError.message : 'Unknown error'
      }
    } else {
      // Clubhouse contribution
      const { error: updateError } = await adminClient
        .from('club_contributions')
        .update({
          moderation_status: newStatus,
          moderated_at: new Date().toISOString(),
          moderated_by: user.id,
        })
        .eq('id', id)

      if (updateError) {
        throw new Error(
          `Failed to update contribution: ${updateError.message}`
        )
      }

      // Award trust points (non-blocking failure)
      const eventType =
        action === 'approve'
          ? 'contribution_approved'
          : 'contribution_rejected'
      try {
        await awardTrustPoints(user_id, eventType)
        trustPointsAwarded = true
      } catch (trustError) {
        console.error('Failed to award trust points:', trustError)
        Sentry.captureException(trustError, {
          tags: { api: 'admin-moderate', operation: 'award-trust-points' },
          extra: { user_id, eventType, contentType: type, contentId: id },
        })
        trustPointsError =
          trustError instanceof Error ? trustError.message : 'Unknown error'
      }
    }

    // 5. Return success (with partial success indicator if trust points failed)
    const actionPastTense = action === 'approve' ? 'approved' : 'rejected'

    if (!trustPointsAwarded) {
      return NextResponse.json(
        {
          success: true,
          message: `Content ${actionPastTense} successfully.`,
          warning: 'Trust points could not be awarded.',
          trustPointsError,
        },
        { status: 207 } // 207 Multi-Status indicates partial success
      )
    }

    return NextResponse.json({
      success: true,
      message: `Content ${actionPastTense} successfully.`,
    })
  } catch (error) {
    console.error('Moderation error:', error)
    Sentry.captureException(error, {
      tags: { api: 'admin-moderate' },
    })

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
