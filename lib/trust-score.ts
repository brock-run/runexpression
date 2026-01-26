import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Trust score event types and their default point values
 */
export const TRUST_EVENTS = {
  flow_post_approved: { points: 10, description: 'Flow post approved' },
  flow_post_rejected: { points: -5, description: 'Flow post rejected' },
  contribution_approved: { points: 15, description: 'Club contribution approved' },
  contribution_rejected: { points: -10, description: 'Club contribution rejected' },
  received_like: { points: 1, description: 'Received a like' },
  membership_verified: { points: 25, description: 'Club membership verified' },
  daily_login: { points: 1, description: 'Daily login bonus' },
  moderation_action: { points: 0, description: 'Moderation action taken' },
} as const

export type TrustEventType = keyof typeof TRUST_EVENTS

/**
 * Trust level thresholds
 */
export const TRUST_THRESHOLDS = {
  newcomer: { min: 0, max: 49 },
  regular: { min: 50, max: 199 },
  trusted: { min: 200, max: 499 },
  pillar: { min: 500, max: Infinity },
} as const

export type TrustLevel = keyof typeof TRUST_THRESHOLDS

/**
 * Award trust points to a user
 *
 * Uses the admin client (service role) to bypass RLS and call the
 * add_trust_score database function.
 *
 * @param userId - The user's profile ID
 * @param eventType - The type of trust event
 * @param customPoints - Optional custom points (overrides default)
 * @param customDescription - Optional custom description
 */
export async function awardTrustPoints(
  userId: string,
  eventType: TrustEventType,
  customPoints?: number,
  customDescription?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const eventConfig = TRUST_EVENTS[eventType]
  const points = customPoints ?? eventConfig.points
  const description = customDescription ?? eventConfig.description

  try {
    // Call the database function to add trust score
    const { error } = await supabase.rpc('add_trust_score', {
      p_user_id: userId,
      p_event_type: eventType,
      p_points: points,
      p_description: description,
    })

    if (error) {
      console.error('Error awarding trust points:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Trust score award error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Get a user's current trust score and level
 */
export async function getUserTrustInfo(
  userId: string
): Promise<{ score: number; level: TrustLevel } | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('trust_score, trust_level')
    .eq('id', userId)
    .single()

  if (error || !data) {
    console.error('Error fetching trust info:', error)
    return null
  }

  return {
    score: data.trust_score,
    level: data.trust_level as TrustLevel,
  }
}

/**
 * Check if a user has auto-approve privileges
 * Users with 'regular' trust level or higher can have content auto-approved
 */
export async function canAutoApprove(userId: string): Promise<boolean> {
  const trustInfo = await getUserTrustInfo(userId)
  if (!trustInfo) return false

  return trustInfo.level !== 'newcomer'
}
