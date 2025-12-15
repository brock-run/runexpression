'use client'

import { useEffect, useState, useCallback } from 'react'
import Masonry from 'react-masonry-css'
import { ExpressionCard } from './expression-card'
import { createClient } from '@/lib/supabase/client'
import { PAGINATION } from '@/lib/constants'
import { Button } from '@/components/ui/button'

interface Expression {
  id: string
  type: 'text' | 'image'
  content: string | null
  media_url: string | null
  vibe_tags: string[]
  created_at: string
  user_id: string | null
}

export function FlowWall() {
  const [expressions, setExpressions] = useState<Expression[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const supabase = createClient()

  const fetchExpressions = useCallback(
    async (loadMore = false) => {
      try {
        const { data, error } = await supabase
          .from('expression_events')
          .select('*')
          .eq('moderation_status', 'approved')
          .eq('visibility', 'public')
          .order('created_at', { ascending: false })
          .range(
            loadMore ? expressions.length : 0,
            loadMore
              ? expressions.length + PAGINATION.FLOW_WALL_LOAD_MORE - 1
              : PAGINATION.FLOW_WALL_INITIAL - 1
          )

        if (error) throw error

        if (loadMore) {
          setExpressions(prev => [...prev, ...(data || [])])
        } else {
          setExpressions(data || [])
        }

        // Check if there are more expressions to load
        if (!data || data.length < PAGINATION.FLOW_WALL_LOAD_MORE) {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Error fetching expressions:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, expressions.length]
  )

  // Fetch initial expressions
  useEffect(() => {
    fetchExpressions()
  }, [fetchExpressions])

  // Set up Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('flow-expressions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expression_events',
          filter: 'visibility=eq.public',
        },
        payload => {
          // Prepend new expression to the wall
          setExpressions(prev => [payload.new as Expression, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleLoadMore = () => {
    fetchExpressions(true)
  }

  const breakpointColumns = {
    default: 4,
    1280: 3,
    768: 2,
    640: 1,
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground">Loading expressions...</p>
        </div>
      </div>
    )
  }

  if (expressions.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-center">
        <div className="max-w-md">
          <p className="mb-4 text-lg font-medium">No expressions yet.</p>
          <p className="text-muted-foreground">
            Be the first to share what your run expressed today.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto gap-6"
        columnClassName="space-y-6"
      >
        {expressions.map(expression => (
          <ExpressionCard key={expression.id} expression={expression} />
        ))}
      </Masonry>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
