'use client'

import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface Expression {
  id: string
  type: 'text' | 'image'
  content: string | null
  media_url: string | null
  vibe_tags: string[]
  created_at: string
  user_id: string | null
}

interface ExpressionCardProps {
  expression: Expression
}

export function ExpressionCard({ expression }: ExpressionCardProps) {
  const { type, content, media_url, vibe_tags, created_at } = expression

  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true })

  return (
    <div className="organic-edges overflow-hidden bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Image Type */}
      {type === 'image' && media_url && (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={media_url}
            alt={content || 'Expression image'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          {content && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-sm italic text-white">{content}</p>
            </div>
          )}
        </div>
      )}

      {/* Text Type */}
      {type === 'text' && content && (
        <div className="p-6">
          <blockquote className="text-lg font-medium italic leading-relaxed">
            &ldquo;{content}&rdquo;
          </blockquote>
        </div>
      )}

      {/* Tags and Timestamp */}
      <div className="space-y-3 p-4">
        {/* Vibe Tags */}
        {vibe_tags && vibe_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {vibe_tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  )
}
