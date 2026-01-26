'use client'

/**
 * Hook and utilities for fetching and managing club contributions.
 * Provides pagination, filtering by type/tags, and real-time refresh capabilities.
 * @module hooks/use-club-contributions
 */

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database.types'
import { PAGINATION } from '@/lib/constants'
import * as Sentry from '@sentry/nextjs'

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
 *
 * @param slug - The URL-friendly identifier for the club (e.g., 'dwtc')
 * @returns The club record if found, or null if not found or on error
 * @throws Does not throw - returns null on validation or query errors after logging to Sentry
 *
 * @example
 * ```typescript
 * const club = await getClubBySlug('dwtc')
 * if (club) {
 *   console.log(club.name)
 * }
 * ```
 */
export async function getClubBySlug(
  slug: string
): Promise<Tables<'clubs'> | null> {
  // Validate slug format (alphanumeric, hyphens, underscores, 1-50 chars)
  const slugSchema = z.string().min(1).max(50).regex(/^[a-z0-9_-]+$/i)
  const validationResult = slugSchema.safeParse(slug)

  if (!validationResult.success) {
    const validationError = new Error(`Invalid club slug format: ${slug}`)
    Sentry.captureException(validationError, {
      tags: { function: 'getClubBySlug', error_type: 'validation' },
      extra: {
        slug,
        validationErrors: validationResult.error.errors,
      },
    })
    console.error(
      '[getClubBySlug] Validation failed:',
      validationResult.error.errors
    )
    return null
  }

  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      // Log the error but don't expose internal details to the caller
      Sentry.captureException(error, {
        tags: { function: 'getClubBySlug', error_type: 'supabase_query' },
        extra: { slug },
      })
      console.error(
        `[getClubBySlug] Failed to fetch club with slug ${slug}:`,
        error.message
      )
      return null
    }

    // Only return data if it exists (single() can return null for no matches)
    return data ?? null
  } catch (err) {
    // Catch any unexpected errors (network issues, etc.)
    const error = err instanceof Error ? err : new Error(String(err))
    Sentry.captureException(error, {
      tags: { function: 'getClubBySlug', error_type: 'unexpected' },
      extra: { slug },
    })
    console.error(
      `[getClubBySlug] Unexpected error fetching club with slug ${slug}:`,
      error.message
    )
    return null
  }
}

/**
 * Fetches a single club contribution by its ID.
 *
 * **Security Note**: This function filters by `moderation_status: 'approved'` and
 * `visibility: ['public', 'club_only']` to prevent exposing unapproved or private
 * contributions to non-admin users. If you need to fetch contributions regardless
 * of moderation status (e.g., for admin/moderation dashboards), use the server-side
 * `getContributionById` from `@/lib/clubhouse/queries` with appropriate RLS policies.
 *
 * @param contributionId - The UUID of the contribution to fetch
 * @returns The contribution record if found and approved, or null if not found, invalid, or unapproved
 * @throws Does not throw - returns null on validation or query errors after logging to Sentry
 *
 * @example
 * ```typescript
 * const contribution = await getContributionById('123e4567-e89b-12d3-a456-426614174000')
 * if (contribution) {
 *   console.log(contribution.title)
 * }
 * ```
 */
export async function getContributionById(
  contributionId: string
): Promise<ClubContribution | null> {
  // Validate contributionId is a valid UUID before making any database calls
  const uuidSchema = z.string().uuid()
  const validationResult = uuidSchema.safeParse(contributionId)

  if (!validationResult.success) {
    const validationError = new Error(
      `Invalid contribution ID format: ${contributionId}`
    )
    Sentry.captureException(validationError, {
      tags: { function: 'getContributionById', error_type: 'validation' },
      extra: {
        contributionId,
        validationErrors: validationResult.error.errors,
      },
    })
    console.error(
      '[getContributionById] Validation failed:',
      validationResult.error.errors
    )
    return null
  }

  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('club_contributions')
      .select('*')
      .eq('id', contributionId)
      .eq('moderation_status', 'approved')
      .in('visibility', ['public', 'club_only'])
      .single()

    if (error) {
      // Log the error but don't expose internal details to the caller
      Sentry.captureException(error, {
        tags: { function: 'getContributionById', error_type: 'supabase_query' },
        extra: { contributionId },
      })
      console.error(
        `[getContributionById] Failed to fetch contribution ${contributionId}:`,
        error.message
      )
      return null
    }

    // Only return data if it exists (single() can return null for no matches)
    return data ?? null
  } catch (err) {
    // Catch any unexpected errors (network issues, etc.)
    const error = err instanceof Error ? err : new Error(String(err))
    Sentry.captureException(error, {
      tags: { function: 'getContributionById', error_type: 'unexpected' },
      extra: { contributionId },
    })
    console.error(
      `[getContributionById] Unexpected error fetching contribution ${contributionId}:`,
      error.message
    )
    return null
  }
}
