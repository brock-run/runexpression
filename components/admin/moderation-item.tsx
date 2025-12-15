'use client'

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ModerationItemProps {
  expression: {
    id: string
    type: 'text' | 'image'
    content: string | null
    media_url: string | null
    vibe_tags: string[]
    created_at: string
    user_id: string | null
  }
  isSelected: boolean
  isProcessing: boolean
  onToggleSelect: () => void
  onApprove: () => void
  onReject: () => void
}

export function ModerationItem({
  expression,
  isSelected,
  isProcessing,
  onToggleSelect,
  onApprove,
  onReject,
}: ModerationItemProps) {
  const { type, content, media_url, vibe_tags, created_at, user_id } =
    expression
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true })

  return (
    <Card className={isProcessing ? 'opacity-50' : ''}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Checkbox */}
          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              disabled={isProcessing}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {/* Type Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {type === 'text' ? '📝 Text' : '🖼️ Image'}
              </span>
              <span className="text-sm text-muted-foreground">{timeAgo}</span>
              {user_id && (
                <span className="text-sm text-muted-foreground">
                  User: {user_id.slice(0, 8)}...
                </span>
              )}
            </div>

            {/* Image Preview */}
            {type === 'image' && media_url && (
              <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border sm:h-64">
                <Image
                  src={media_url}
                  alt="Submission preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}

            {/* Text Content */}
            {content && (
              <div className="rounded-lg bg-muted p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {content}
                </p>
              </div>
            )}

            {/* Vibe Tags */}
            {vibe_tags && vibe_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vibe_tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={onApprove}
                disabled={isProcessing}
                variant="default"
                size="sm"
              >
                ✓ Approve
              </Button>
              <Button
                onClick={onReject}
                disabled={isProcessing}
                variant="destructive"
                size="sm"
              >
                ✗ Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
