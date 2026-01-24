'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { FlowPost } from './use-flow-posts'

interface UseRealtimeFlowOptions {
  onNewPost?: (post: FlowPost) => void
  onPostUpdated?: (post: FlowPost) => void
  onPostDeleted?: (postId: string) => void
}

export function useRealtimeFlow(options: UseRealtimeFlowOptions = {}) {
  const { onNewPost, onPostUpdated, onPostDeleted } = options
  const supabase = useMemo(() => createClient(), [])

  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<FlowPost>) => {
      if (payload.eventType === 'INSERT') {
        const post = payload.new as FlowPost
        // Only notify for approved public posts
        if (
          post.moderation_status === 'approved' &&
          post.visibility === 'public'
        ) {
          onNewPost?.(post)
        }
      } else if (payload.eventType === 'UPDATE') {
        const post = payload.new as FlowPost
        // Notify if post becomes approved
        if (
          post.moderation_status === 'approved' &&
          post.visibility === 'public'
        ) {
          onPostUpdated?.(post)
        }
      } else if (payload.eventType === 'DELETE') {
        const oldPost = payload.old as { id?: string }
        if (oldPost.id) {
          onPostDeleted?.(oldPost.id)
        }
      }
    },
    [onNewPost, onPostUpdated, onPostDeleted]
  )

  useEffect(() => {
    const channel = supabase
      .channel('flow_realtime')
      .on(
        'postgres_changes' as const,
        {
          event: '*',
          schema: 'public',
          table: 'expression_events',
        },
        handleChange
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, handleChange])
}
