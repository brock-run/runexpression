"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import * as Sentry from '@sentry/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ClubContribution } from '@/lib/clubhouse/queries'

type MediaResponse = {
  items: ClubContribution[]
  hasMore: boolean
  nextOffset: number
}

interface MediaGridProps {
  initialItems: ClubContribution[]
  initialHasMore: boolean
  slug: string
  selectedTag?: string
  pageSize?: number
}

const DEFAULT_PAGE_SIZE = 30

export function MediaGrid({
  initialItems,
  initialHasMore,
  slug,
  selectedTag,
  pageSize = DEFAULT_PAGE_SIZE,
}: MediaGridProps) {
  const [items, setItems] = useState<ClubContribution[]>(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [offset, setOffset] = useState(initialItems.length)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setItems(initialItems)
    setHasMore(initialHasMore)
    setOffset(initialItems.length)
    setIsLoading(false)
  }, [initialItems, initialHasMore])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      slug,
      offset: String(offset),
      limit: String(pageSize),
    })

    if (selectedTag) {
      params.set('tag', selectedTag)
    }

    return params
  }, [slug, offset, pageSize, selectedTag])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return
    }

    setIsLoading(true)

    try {
      const payload = await Sentry.startSpan(
        {
          op: 'ui.action',
          name: 'clubhouse.media.load_more',
          attributes: {
            slug,
            tag: selectedTag ?? 'all',
            offset,
          },
        },
        async () => {
          const response = await fetch(`/api/club/media?${queryParams.toString()}`)

          if (!response.ok) {
            throw new Error('Failed to load more media.')
          }

          return (await response.json()) as MediaResponse
        }
      )

      const newItems = Array.isArray(payload.items) ? payload.items : []

      setItems(prev => [...prev, ...newItems])
      setHasMore(Boolean(payload.hasMore))
      setOffset(prev =>
        typeof payload.nextOffset === 'number' ? payload.nextOffset : prev + newItems.length
      )
    } catch (error) {
      console.error('Media pagination error:', error)
      Sentry.captureException(error)
    } finally {
      setIsLoading(false)
    }
  }, [hasMore, isLoading, offset, queryParams, selectedTag, slug])

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className={`group overflow-hidden ${
              index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
            }`}
          >
            <div
              className={`relative w-full overflow-hidden ${
                index % 5 === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
              }`}
            >
              {item.media_url ? (
                <Image
                  src={item.media_url}
                  alt={item.title || 'Club media'}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-run-gray-100">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <p className="mb-2 text-sm font-medium leading-tight">
                {item.title || item.body}
              </p>
              <p className="mb-3 text-xs text-muted-foreground">
                {formatDate(item.created_at)}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-run-gray-100 px-2 py-0.5 text-xs font-medium text-run-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </section>

      {hasMore && (
        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => void loadMore()} disabled={isLoading}>
            Load More Photos
          </Button>
        </div>
      )}
    </>
  )
}
