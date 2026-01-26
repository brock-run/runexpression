import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database.types'

export type ClubContribution = Tables<'club_contributions'>
export type Club = Tables<'clubs'>

/**
 * Fetch a club by its URL slug
 */
export async function getClubBySlug(slug: string): Promise<Club | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching club:', error)
    return null
  }

  return data
}

/**
 * Fetch approved contributions for a club
 */
export async function getClubContributions(
  clubId: string,
  options: {
    type?: 'story' | 'media' | 'document'
    featured?: boolean
    limit?: number
    offset?: number
  } = {}
): Promise<ClubContribution[]> {
  const supabase = createClient()
  const { type, featured, limit = 20, offset = 0 } = options

  let query = supabase
    .from('club_contributions')
    .select('*')
    .eq('club_id', clubId)
    .eq('moderation_status', 'approved')
    .in('visibility', ['public', 'club_only'])
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) {
    query = query.eq('type', type)
  }

  if (featured !== undefined) {
    query = query.eq('is_featured', featured)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching contributions:', error)
    return []
  }

  return data || []
}

/**
 * Fetch a single contribution by ID
 */
export async function getContributionById(
  contributionId: string
): Promise<ClubContribution | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('club_contributions')
    .select('*')
    .eq('id', contributionId)
    .eq('moderation_status', 'approved')
    .single()

  if (error) {
    console.error('Error fetching contribution:', error)
    return null
  }

  return data
}

/**
 * Get contribution counts for a club
 */
export async function getClubContributionCounts(
  clubId: string
): Promise<{ stories: number; media: number; documents: number }> {
  const supabase = createClient()

  const [storiesResult, mediaResult, documentsResult] = await Promise.all([
    supabase
      .from('club_contributions')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('type', 'story')
      .eq('moderation_status', 'approved'),
    supabase
      .from('club_contributions')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('type', 'media')
      .eq('moderation_status', 'approved'),
    supabase
      .from('club_contributions')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('type', 'document')
      .eq('moderation_status', 'approved'),
  ])

  return {
    stories: storiesResult.count || 0,
    media: mediaResult.count || 0,
    documents: documentsResult.count || 0,
  }
}

/**
 * Get member count for a club
 */
export async function getClubMemberCount(clubId: string): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('club_memberships')
    .select('id', { count: 'exact', head: true })
    .eq('club_id', clubId)
    .eq('status', 'active')

  if (error) {
    console.error('Error fetching member count:', error)
    return 0
  }

  return count || 0
}
