'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExpressionCard } from './expression-card'
import { Loader2 } from 'lucide-react'
import Masonry from 'react-masonry-css'
import './flow-wall.css'

type Expression = {
  id: string
  user_id: string | null
  type: 'text' | 'image' | 'photo_text'
  content: string | null
  content_long: string | null
  media_url: string | null
  vibe_tags: string[]
  created_at: string
  metadata: Record<string, unknown>
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export function FlowWall() {
  const [expressions, setExpressions] = useState<Expression[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadExpressions()
    subscribeToNewExpressions()
  }, [])

  const loadExpressions = async () => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('expression_events')
        .select(
          `
          id,
          user_id,
          type,
          content,
          content_long,
          media_url,
          vibe_tags,
          created_at,
          metadata,
          profiles (
            full_name,
            avatar_url
          )
        `
        )
        .eq('visibility', 'public')
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      // Type assertion since Supabase returns proper types
      setExpressions((data as any) || [])
    } catch (err) {
      console.error('Error loading expressions:', err)
      setError('Failed to load expressions')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNewExpressions = () => {
    const supabase = createClient()

    const channel = supabase
      .channel('expression_events_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expression_events',
          filter: 'visibility=eq.public',
        },
        async (payload) => {
          // Fetch the full expression with profile data
          const { data, error } = await supabase
            .from('expression_events')
            .select(
              `
              id,
              user_id,
              type,
              content,
              content_long,
              media_url,
              vibe_tags,
              created_at,
              metadata,
              profiles (
                full_name,
                avatar_url
              )
            `
            )
            .eq('id', payload.new.id)
            .single()

          if (!error && data) {
            setExpressions((prev) => [(data as any), ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  if (expressions.length === 0) {
    return (
      <div className="rounded-md border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-600">
          No expressions yet. Be the first to share what your run expressed!
        </p>
      </div>
    )
  }

  const breakpointColumns = {
    default: 3,
    1024: 2,
    640: 1,
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {expressions.map((expression) => (
        <ExpressionCard key={expression.id} expression={expression} />
      ))}
    </Masonry>
  )
}
