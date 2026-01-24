'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Masonry from 'react-masonry-css'
import { AnimatePresence } from 'framer-motion'
import { FlowPostCard } from './flow-post-card'
import { useFlowPosts, type FlowPost } from '@/hooks/use-flow-posts'
import { useRealtimeFlow } from '@/hooks/use-realtime-flow'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const breakpointColumns = {
  default: 4,
  1280: 3,
  1024: 2,
  640: 1,
}

interface FlowWallProps {
  initialVibeTags?: string[]
}

export function FlowWall({ initialVibeTags }: FlowWallProps) {
  const [vibeTags] = useState<string[] | undefined>(initialVibeTags)
  const [newPosts, setNewPosts] = useState<FlowPost[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { posts, isLoading, error, hasMore, loadMore, refresh } = useFlowPosts({
    vibeTags,
  })

  // Handle realtime updates
  const handleNewPost = useCallback((post: FlowPost) => {
    setNewPosts(prev => [post, ...prev])
  }, [])

  const handlePostUpdated = useCallback((post: FlowPost) => {
    setNewPosts(prev => {
      const existing = prev.find(p => p.id === post.id)
      if (existing) {
        return prev.map(p => (p.id === post.id ? post : p))
      }
      return [post, ...prev]
    })
  }, [])

  const handlePostDeleted = useCallback((postId: string) => {
    setNewPosts(prev => prev.filter(p => p.id !== postId))
  }, [])

  useRealtimeFlow({
    onNewPost: handleNewPost,
    onPostUpdated: handlePostUpdated,
    onPostDeleted: handlePostDeleted,
  })

  // Merge new realtime posts with fetched posts
  const allPosts = [
    ...newPosts,
    ...posts.filter(p => !newPosts.find(np => np.id === p.id)),
  ]

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [hasMore, isLoading, loadMore])

  // Show new posts notification
  const showNewPostsNotification = newPosts.length > 0

  const handleShowNewPosts = () => {
    refresh()
    setNewPosts([])
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          Something went wrong loading the Flow.
        </p>
        <Button onClick={refresh} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (isLoading && allPosts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">
          The Flow is empty. Be the first to share.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* New posts notification */}
      {showNewPostsNotification && (
        <div className="sticky top-4 z-10 mb-4 flex justify-center">
          <Button onClick={handleShowNewPosts} size="sm" className="shadow-lg">
            {newPosts.length} new {newPosts.length === 1 ? 'post' : 'posts'}
          </Button>
        </div>
      )}

      {/* Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumns}
        className="-ml-4 flex w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        <AnimatePresence mode="popLayout">
          {allPosts.map(post => (
            <FlowPostCard key={post.id} post={post} />
          ))}
        </AnimatePresence>
      </Masonry>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-10" />

      {/* Loading indicator */}
      {isLoading && allPosts.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* End of list */}
      {!hasMore && allPosts.length > 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          You&apos;ve reached the end of the Flow.
        </p>
      )}
    </div>
  )
}
