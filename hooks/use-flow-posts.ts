'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database.types'
import { PAGINATION } from '@/lib/constants'

export type FlowPost = Tables<'expression_events'>

interface UseFlowPostsOptions {
  initialLimit?: number
  vibeTags?: string[]
}

interface UseFlowPostsReturn {
  posts: FlowPost[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export function useFlowPosts(
  options: UseFlowPostsOptions = {}
): UseFlowPostsReturn {
  const { initialLimit = PAGINATION.FLOW_WALL_INITIAL, vibeTags } = options
  const [posts, setPosts] = useState<FlowPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const supabase = useMemo(() => createClient(), [])

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        setIsLoading(true)
        setError(null)

        const currentOffset = reset ? 0 : offset
        const limit = reset ? initialLimit : PAGINATION.FLOW_WALL_LOAD_MORE

        let query = supabase
          .from('expression_events')
          .select('*')
          .eq('moderation_status', 'approved')
          .eq('visibility', 'public')
          .order('created_at', { ascending: false })
          .range(currentOffset, currentOffset + limit - 1)

        // Filter by vibe tags if provided
        if (vibeTags && vibeTags.length > 0) {
          query = query.overlaps('vibe_tags', vibeTags)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
          throw fetchError
        }

        if (reset) {
          setPosts(data || [])
          setOffset(limit)
        } else {
          setPosts(prev => [...prev, ...(data || [])])
          setOffset(prev => prev + limit)
        }

        setHasMore((data?.length || 0) >= limit)
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch posts')
        )
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, offset, initialLimit, vibeTags]
  )

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return
    await fetchPosts(false)
  }, [fetchPosts, hasMore, isLoading])

  const refresh = useCallback(async () => {
    setOffset(0)
    await fetchPosts(true)
  }, [fetchPosts])

  useEffect(() => {
    fetchPosts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibeTags?.join(',')])

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}
