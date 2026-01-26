import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { moderateFlowContent } from '@/lib/moderation'
import { TEXT_LIMITS } from '@/lib/constants'
import * as Sentry from '@sentry/nextjs'

/**
 * Request schema for Flow submission
 */
const FlowSubmissionSchema = z.object({
  type: z.enum(['text', 'image', 'photo_text']),
  content: z.string().max(TEXT_LIMITS.FLOW_SHORT).nullable().optional(),
  content_long: z.string().max(TEXT_LIMITS.FLOW_LONG).nullable().optional(),
  media_url: z.string().url().nullable().optional(),
  vibe_tags: z.array(z.string()).max(3).nullable().optional(),
})

type FlowSubmission = z.infer<typeof FlowSubmissionSchema>

/**
 * Trust score thresholds for auto-approval
 * Based on trust_score_system migration
 */
const TRUST_THRESHOLDS = {
  AUTO_APPROVE: 50, // 'regular' level and above
}

/**
 * POST /api/flow/submit
 *
 * Server-side API for Flow submissions with:
 * - Authentication verification
 * - OpenAI content moderation (per ADR-007)
 * - Trust-based auto-approval
 * - Audit logging in metadata
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
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      )
    }

    // 2. Parse and validate request body
    const body = await request.json()
    const validationResult = FlowSubmissionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid submission data.',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const submission: FlowSubmission = validationResult.data

    // 3. Validate that submission has content
    const hasTextContent = submission.content || submission.content_long
    const hasMediaContent = submission.media_url

    if (!hasTextContent && !hasMediaContent) {
      return NextResponse.json(
        { error: 'Submission must include text or an image.' },
        { status: 400 }
      )
    }

    // 4. Run content moderation on text (per ADR-007)
    let moderationResult = null
    if (hasTextContent) {
      moderationResult = await moderateFlowContent(
        submission.content ?? null,
        submission.content_long ?? null
      )

      if (!moderationResult.allowed) {
        // Content was flagged by moderation
        return NextResponse.json(
          {
            error:
              moderationResult.reason ||
              "Your submission couldn't be posted. Please ensure your content is respectful and appropriate.",
            moderation_flagged: true,
          },
          { status: 422 }
        )
      }
    }

    // 5. Get user's trust score for auto-approval decision
    const { data: profile } = await supabase
      .from('profiles')
      .select('trust_score')
      .eq('id', user.id)
      .single()

    const trustScore = profile?.trust_score ?? 0
    const shouldAutoApprove = trustScore >= TRUST_THRESHOLDS.AUTO_APPROVE

    // 6. Determine moderation status
    // - Auto-approve for trusted users
    // - Images always go to pending (manual review per ADR-007)
    // - Text from new users goes to pending
    let moderationStatus: 'pending' | 'approved' = 'pending'
    let visibility: 'pending' | 'public' = 'pending'

    if (shouldAutoApprove && !hasMediaContent) {
      // Trusted user with text-only submission: auto-approve
      moderationStatus = 'approved'
      visibility = 'public'
    } else if (shouldAutoApprove && hasMediaContent) {
      // Trusted user with image: still needs manual review
      moderationStatus = 'pending'
      visibility = 'pending'
    }
    // New users: default pending status

    // 7. Build metadata for audit trail
    const metadata = {
      submitted_at: new Date().toISOString(),
      submission_source: 'web',
      trust_score_at_submission: trustScore,
      auto_approved: moderationStatus === 'approved',
      ai_moderation_result: moderationResult?.result
        ? {
            flagged: moderationResult.result.flagged,
            categories: moderationResult.result.categories,
          }
        : null,
    }

    // 8. Insert expression event
    const { data: expression, error: insertError } = await supabase
      .from('expression_events')
      .insert({
        user_id: user.id,
        type: submission.type,
        content: submission.content || null,
        content_long: submission.content_long || null,
        media_url: submission.media_url || null,
        vibe_tags:
          submission.vibe_tags && submission.vibe_tags.length > 0
            ? submission.vibe_tags
            : null,
        moderation_status: moderationStatus,
        visibility: visibility,
        metadata: metadata,
      })
      .select('id, moderation_status, visibility')
      .single()

    if (insertError) {
      console.error('Failed to insert expression:', insertError)
      Sentry.captureException(insertError, {
        tags: { api: 'flow-submit' },
        extra: { user_id: user.id, submission_type: submission.type },
      })

      return NextResponse.json(
        { error: 'Failed to submit. Please try again.' },
        { status: 500 }
      )
    }

    // 9. Return success response
    return NextResponse.json({
      success: true,
      expression_id: expression.id,
      moderation_status: expression.moderation_status,
      visibility: expression.visibility,
      message:
        moderationStatus === 'approved'
          ? 'Your expression has been published to the Flow!'
          : 'Your expression has been submitted for review.',
    })
  } catch (error) {
    console.error('Flow submission error:', error)
    Sentry.captureException(error, {
      tags: { api: 'flow-submit' },
    })

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
