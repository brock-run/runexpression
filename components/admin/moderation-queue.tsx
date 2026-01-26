'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import * as Sentry from '@sentry/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Loader2, ImageIcon, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FlowPost {
  id: string
  user_id: string
  type: string
  content: string | null
  content_long: string | null
  media_url: string | null
  vibe_tags: string[] | null
  created_at: string
  profiles: {
    username: string | null
    full_name: string | null
  } | null
}

interface Contribution {
  id: string
  user_id: string
  club_id: string
  type: string
  title: string | null
  body: string | null
  media_url: string | null
  tags: string[] | null
  created_at: string
  profiles: {
    username: string | null
    full_name: string | null
  } | null
  clubs: {
    name: string
    slug: string
  } | null
}

interface ModerationQueueProps {
  flowPosts: FlowPost[]
  contributions: Contribution[]
}

export function ModerationQueue({
  flowPosts,
  contributions,
}: ModerationQueueProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleModerate = async (
    type: 'flow' | 'contribution',
    id: string,
    userId: string,
    action: 'approve' | 'reject'
  ) => {
    setProcessingId(id)

    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          id,
          user_id: userId,
          action,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to moderate content')
      }

      // Refresh the page to update the queue
      router.refresh()
    } catch (error) {
      console.error('Moderation error:', error)
      Sentry.captureException(error, {
        tags: {
          feature: 'moderation',
          action,
          type,
        },
        extra: {
          contentId: id,
          userId,
        },
      })
      toast({
        title: 'Could not complete moderation',
        description: 'Please try again. If the problem persists, contact support.',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const totalPending = flowPosts.length + contributions.length

  if (totalPending === 0) {
    return (
      <Card className="p-12 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h2 className="mb-2 text-xl font-bold">All caught up!</h2>
        <p className="text-muted-foreground">
          No pending submissions to review.
        </p>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="flow" className="space-y-6">
      <TabsList>
        <TabsTrigger value="flow" className="gap-2">
          Flow Posts
          {flowPosts.length > 0 && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
              {flowPosts.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="contributions" className="gap-2">
          Clubhouse
          {contributions.length > 0 && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
              {contributions.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="flow" className="space-y-4">
        {flowPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No pending Flow posts.</p>
          </Card>
        ) : (
          flowPosts.map(post => (
            <Card key={post.id} className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-grow space-y-3">
                  {/* Author info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {post.profiles?.full_name ||
                        post.profiles?.username ||
                        'Anonymous'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(post.created_at)}</span>
                    <span>•</span>
                    <span className="capitalize">{post.type}</span>
                  </div>

                  {/* Content */}
                  {post.content && (
                    <p className="text-lg">{post.content}</p>
                  )}
                  {post.content_long && (
                    <p className="text-sm text-muted-foreground">
                      {post.content_long}
                    </p>
                  )}

                  {/* Media preview */}
                  {post.media_url && (
                    <div className="relative aspect-video max-w-md overflow-hidden rounded-lg border">
                      <Image
                        src={post.media_url}
                        alt="Submission media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Vibe tags */}
                  {post.vibe_tags && post.vibe_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.vibe_tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                      handleModerate('flow', post.id, post.user_id, 'reject')
                    }
                    disabled={processingId === post.id}
                  >
                    {processingId === post.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() =>
                      handleModerate('flow', post.id, post.user_id, 'approve')
                    }
                    disabled={processingId === post.id}
                  >
                    {processingId === post.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="contributions" className="space-y-4">
        {contributions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No pending Clubhouse contributions.
            </p>
          </Card>
        ) : (
          contributions.map(contribution => (
            <Card key={contribution.id} className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-grow space-y-3">
                  {/* Author and club info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {contribution.profiles?.full_name ||
                        contribution.profiles?.username ||
                        'Anonymous'}
                    </span>
                    <span>•</span>
                    <span>{contribution.clubs?.name || 'Unknown Club'}</span>
                    <span>•</span>
                    <span>{formatDate(contribution.created_at)}</span>
                  </div>

                  {/* Type badge */}
                  <div className="flex items-center gap-2">
                    {contribution.type === 'media' ? (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {contribution.type}
                    </span>
                  </div>

                  {/* Title and body */}
                  {contribution.title && (
                    <h3 className="text-lg font-bold">{contribution.title}</h3>
                  )}
                  {contribution.body && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {contribution.body}
                    </p>
                  )}

                  {/* Media preview */}
                  {contribution.media_url && contribution.type === 'media' && (
                    <div className="relative aspect-video max-w-md overflow-hidden rounded-lg border">
                      <Image
                        src={contribution.media_url}
                        alt="Submission media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {contribution.tags && contribution.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {contribution.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                      handleModerate(
                        'contribution',
                        contribution.id,
                        contribution.user_id,
                        'reject'
                      )
                    }
                    disabled={processingId === contribution.id}
                  >
                    {processingId === contribution.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() =>
                      handleModerate(
                        'contribution',
                        contribution.id,
                        contribution.user_id,
                        'approve'
                      )
                    }
                    disabled={processingId === contribution.id}
                  >
                    {processingId === contribution.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}
