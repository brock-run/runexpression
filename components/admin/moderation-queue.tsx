'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ModerationItem } from './moderation-item'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PendingExpression {
  id: string
  type: 'text' | 'image'
  content: string | null
  media_url: string | null
  vibe_tags: string[]
  created_at: string
  user_id: string | null
  moderation_status: string
  visibility: string
}

export function ModerationQueue() {
  const [expressions, setExpressions] = useState<PendingExpression[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  const fetchPendingExpressions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('expression_events')
        .select('*')
        .eq('moderation_status', 'pending')
        .order('created_at', { ascending: true }) // Oldest first

      if (error) throw error
      setExpressions(data || [])
    } catch (error) {
      console.error('Error fetching pending expressions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPendingExpressions()
  }, [fetchPendingExpressions])

  const handleApprove = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))

    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' }),
      })

      if (!response.ok) throw new Error('Failed to approve')

      // Remove from list
      setExpressions(prev => prev.filter(expr => expr.id !== id))
      setSelectedIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    } catch (error) {
      console.error('Error approving expression:', error)
      alert('Failed to approve expression. Please try again.')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleReject = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))

    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject' }),
      })

      if (!response.ok) throw new Error('Failed to reject')

      // Remove from list
      setExpressions(prev => prev.filter(expr => expr.id !== id))
      setSelectedIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    } catch (error) {
      console.error('Error rejecting expression:', error)
      alert('Failed to reject expression. Please try again.')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return

    const idsToApprove = Array.from(selectedIds)
    setProcessingIds(new Set(idsToApprove))

    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToApprove, action: 'approve' }),
      })

      if (!response.ok) throw new Error('Failed to bulk approve')

      // Remove all from list
      setExpressions(prev => prev.filter(expr => !selectedIds.has(expr.id)))
      setSelectedIds(new Set())
    } catch (error) {
      console.error('Error bulk approving:', error)
      alert('Failed to approve all. Please try again.')
    } finally {
      setProcessingIds(new Set())
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === expressions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(expressions.map(expr => expr.id)))
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground">
            Loading pending submissions...
          </p>
        </div>
      </div>
    )
  }

  if (expressions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-lg font-medium">All caught up! 🎉</p>
          <p className="text-muted-foreground">
            There are no pending submissions to review.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      {expressions.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedIds.size === expressions.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({expressions.length})
              </label>
            </div>

            {selectedIds.size > 0 && (
              <>
                <div className="text-sm text-muted-foreground">
                  {selectedIds.size} selected
                </div>
                <Button
                  onClick={handleBulkApprove}
                  disabled={processingIds.size > 0}
                  size="sm"
                >
                  Approve All Selected
                </Button>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Pending Items List */}
      <div className="space-y-4">
        {expressions.map(expression => (
          <ModerationItem
            key={expression.id}
            expression={expression}
            isSelected={selectedIds.has(expression.id)}
            isProcessing={processingIds.has(expression.id)}
            onToggleSelect={() => toggleSelection(expression.id)}
            onApprove={() => handleApprove(expression.id)}
            onReject={() => handleReject(expression.id)}
          />
        ))}
      </div>
    </div>
  )
}
