'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FlowPost } from '@/hooks/use-flow-posts'

interface FlowPostCardProps {
  post: FlowPost
  className?: string
}

export function FlowPostCard({ post, className }: FlowPostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const hasImage = post.type === 'image' || post.type === 'photo_text'
  const hasText = post.content || post.content_long

  // Format the date - handle null/malformed values
  const formattedDate = (() => {
    if (!post.created_at) return null
    const date = new Date(post.created_at)
    if (isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  })()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn('mb-4', className)}
    >
      <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md">
        {/* Image */}
        {hasImage && post.media_url && !imageError && (
          <div className="relative aspect-auto min-h-[150px] bg-muted">
            <Image
              src={post.media_url}
              alt={post.content || 'Flow expression'}
              fill
              className={cn(
                'object-cover transition-opacity duration-300',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
          </div>
        )}

        <CardContent className="p-4">
          {/* Content */}
          {hasText && (
            <p
              className={cn(
                'text-foreground',
                post.type === 'text' ? 'text-lg font-medium' : 'text-sm'
              )}
            >
              {post.content}
            </p>
          )}

          {/* Long content */}
          {post.content_long && (
            <p className="mt-2 text-sm text-muted-foreground">
              {post.content_long}
            </p>
          )}

          {/* Vibe Tags */}
          {post.vibe_tags && post.vibe_tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.vibe_tags.slice(0, 3).map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {post.vibe_tags.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{post.vibe_tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          {formattedDate && (
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <time dateTime={post.created_at}>{formattedDate}</time>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
