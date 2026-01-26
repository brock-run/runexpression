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
    tag?: string
    limit?: number
    offset?: number
  } = {}
): Promise<ClubContribution[]> {
  const supabase = createClient()
  const { type, featured, tag, limit = 20, offset = 0 } = options

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

  // Filter by tag using Postgres array contains operator
  if (tag) {
    query = query.contains('tags', [tag])
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

/**
 * Get all unique tags used in a club's contributions
 */
export async function getClubTags(
  clubId: string,
  type?: 'story' | 'media' | 'document'
): Promise<string[]> {
  const supabase = createClient()

  let query = supabase
    .from('club_contributions')
    .select('tags')
    .eq('club_id', clubId)
    .eq('moderation_status', 'approved')
    .not('tags', 'is', null)

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  // Flatten and dedupe all tags
  const allTags = new Set<string>()
  data?.forEach(row => {
    if (row.tags && Array.isArray(row.tags)) {
      row.tags.forEach(tag => allTags.add(tag as string))
    }
  })

  return Array.from(allTags).sort()
}
