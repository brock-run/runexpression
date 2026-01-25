'use client'

/**
 * Hook and utilities for fetching and managing club contributions.
 * Provides pagination, filtering by type/tags, and real-time refresh capabilities.
 * @module hooks/use-club-contributions
 */

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database.types'
import { PAGINATION } from '@/lib/constants'

/** Club contribution record from the database */
export type ClubContribution = Tables<'club_contributions'>

export type ContributionType = 'story' | 'media' | 'document'

interface UseClubContributionsOptions {
  clubId: string
  type?: ContributionType
  tags?: string[]
  featured?: boolean
  initialLimit?: number
}

interface UseClubContributionsReturn {
  contributions: ClubContribution[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

/**
 * React hook for fetching club contributions with pagination and filtering.
 * Handles loading states, error handling, and infinite scroll support.
 * @param options - Configuration options for the query
 * @returns Object containing contributions, loading state, error, and control functions
 */
export function useClubContributions(
  options: UseClubContributionsOptions
): UseClubContributionsReturn {
  const {
    clubId,
    type,
    tags,
    featured,
    initialLimit = PAGINATION.CLUBHOUSE_INITIAL,
  } = options

  const [contributions, setContributions] = useState<ClubContribution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const offsetRef = useRef(0)

  const supabase = useMemo(() => createClient(), [])

  const fetchContributions = useCallback(
    async (reset = false) => {
      try {
        setIsLoading(true)
        setError(null)

        const currentOffset = reset ? 0 : offsetRef.current
        const limit = reset
          ? initialLimit
          : PAGINATION.CLUBHOUSE_LOAD_MORE || initialLimit

        let query = supabase
          .from('club_contributions')
          .select('*')
          .eq('club_id', clubId)
          .eq('moderation_status', 'approved')
          .in('visibility', ['public', 'club_only'])
          .order('created_at', { ascending: false })
          .range(currentOffset, currentOffset + limit - 1)

        // Filter by type if specified
        if (type) {
          query = query.eq('type', type)
        }

        // Filter by featured if specified
        if (featured !== undefined) {
          query = query.eq('is_featured', featured)
        }

        // Filter by tags if specified
        if (tags && tags.length > 0) {
          query = query.overlaps('tags', tags)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
          throw fetchError
        }

        if (reset) {
          setContributions(data || [])
          offsetRef.current = limit
        } else {
          setContributions(prev => [...prev, ...(data || [])])
          offsetRef.current += limit
        }

        setHasMore((data?.length || 0) >= limit)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch contributions')
        )
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, clubId, type, tags, featured, initialLimit]
  )

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return
    await fetchContributions(false)
  }, [fetchContributions, hasMore, isLoading])

  const refresh = useCallback(async () => {
    offsetRef.current = 0
    await fetchContributions(true)
  }, [fetchContributions])

  useEffect(() => {
    fetchContributions(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId, type, JSON.stringify(tags), featured, initialLimit])

  return {
    contributions,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}

/**
 * Fetches a single club by its URL slug.
 * @param slug - The URL-friendly identifier for the club
 * @returns The club record or null if not found
 */
export async function getClubBySlug(
  slug: string
): Promise<Tables<'clubs'> | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    return null
  }

  return data
}
