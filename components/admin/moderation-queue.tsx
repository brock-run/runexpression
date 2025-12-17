'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type PendingExpression = {
  id: string
  user_id: string | null
  type: 'text' | 'image' | 'photo_text'
  content: string | null
  content_long: string | null
  media_url: string | null
  vibe_tags: string[]
  created_at: string
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

export function ModerationQueue() {
  const [pending, setPending] = useState<PendingExpression[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPendingExpressions()
  }, [])

  const loadPendingExpressions = async () => {
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
          profiles!inner (
            full_name,
            email
          )
        `
        )
        .eq('moderation_status', 'pending')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Type assertion since Supabase returns proper types
      setPending((data as any) || [])
    } catch (err) {
      console.error('Error loading pending expressions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id))

    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression_id: id,
          action: 'approve',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve expression')
      }

      // Remove from pending list
      setPending((prev) => prev.filter((exp) => exp.id !== id))
    } catch (err) {
      console.error('Error approving expression:', err)
      alert('Failed to approve expression')
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleReject = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id))

    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression_id: id,
          action: 'reject',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject expression')
      }

      // Remove from pending list
      setPending((prev) => prev.filter((exp) => exp.id !== id))
    } catch (err) {
      console.error('Error rejecting expression:', err)
      alert('Failed to reject expression')
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (pending.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-neutral-600">
          No expressions pending moderation. Great job keeping up!
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {pending.map((expression) => {
        const isProcessing = processingIds.has(expression.id)
        const timeAgo = formatDistanceToNow(new Date(expression.created_at), {
          addSuffix: true,
        })

        return (
          <Card key={expression.id} className="overflow-hidden">
            <div className="grid gap-4 p-6 md:grid-cols-[1fr_auto]">
              {/* Expression Content */}
              <div className="space-y-4">
                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {expression.type === 'image' && (
                      <ImageIcon className="mr-1 h-3 w-3" />
                    )}
                    {expression.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-neutral-500">{timeAgo}</span>
                </div>

                {/* Image Preview */}
                {expression.media_url && (
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={expression.media_url}
                      alt="Expression media"
                      className="max-h-64 w-full object-cover"
                    />
                  </div>
                )}

                {/* Text Content */}
                {expression.content && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-neutral-700">
                      Main Content:
                    </h4>
                    <p className="text-neutral-900">{expression.content}</p>
                  </div>
                )}

                {/* Long Content */}
                {expression.content_long && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-neutral-700">
                      Extended Note:
                    </h4>
                    <p className="text-sm text-neutral-700">
                      {expression.content_long}
                    </p>
                  </div>
                )}

                {/* Vibe Tags */}
                {expression.vibe_tags && expression.vibe_tags.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-neutral-700">
                      Vibe Tags:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {expression.vibe_tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-orange-50 text-orange-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className="border-t border-neutral-200 pt-4">
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">Author:</span>{' '}
                    {expression.profiles?.full_name || 'Anonymous'} (
                    {expression.profiles?.email || 'No email'})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 md:w-40">
                <Button
                  onClick={() => handleApprove(expression.id)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleReject(expression.id)}
                  disabled={isProcessing}
                  variant="destructive"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
