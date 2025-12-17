import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { User } from 'lucide-react'

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

interface ExpressionCardProps {
  expression: Expression
}

export function ExpressionCard({ expression }: ExpressionCardProps) {
  const authorName = expression.profiles?.full_name || 'Anonymous Runner'
  const timeAgo = formatDistanceToNow(new Date(expression.created_at), {
    addSuffix: true,
  })

  return (
    <Card className="overflow-hidden border border-neutral-200 bg-white transition-shadow hover:shadow-md">
      {/* Image if present */}
      {expression.media_url && (
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={expression.media_url}
            alt={expression.content || 'Runner expression'}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Main content */}
        {expression.content && (
          <p
            className={`mb-4 ${
              expression.type === 'text' && !expression.media_url
                ? 'text-lg leading-relaxed'
                : 'text-base'
            } text-neutral-900`}
          >
            {expression.content}
          </p>
        )}

        {/* Long content if present */}
        {expression.content_long && (
          <p className="mb-4 text-sm leading-relaxed text-neutral-700">
            {expression.content_long}
          </p>
        )}

        {/* Vibe tags */}
        {expression.vibe_tags && expression.vibe_tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {expression.vibe_tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-orange-50 text-orange-700 hover:bg-orange-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer: Author and time */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-2">
            {expression.profiles?.avatar_url ? (
              <img
                src={expression.profiles.avatar_url}
                alt={authorName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200">
                <User className="h-4 w-4 text-neutral-600" />
              </div>
            )}
            <span className="text-sm font-medium text-neutral-700">
              {authorName}
            </span>
          </div>
          <span className="text-xs text-neutral-500">{timeAgo}</span>
        </div>
      </div>
    </Card>
  )
}
