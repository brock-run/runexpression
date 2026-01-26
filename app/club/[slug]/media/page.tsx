import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TagFilter } from '@/components/clubhouse/tag-filter'
import { MediaGrid } from '@/components/clubhouse/media-grid'
import {
  getClubBySlug,
  getClubContributions,
  getClubContributionCounts,
  getClubTags,
} from '@/lib/clubhouse/queries'

interface MediaPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tag?: string }>
}

const PAGE_SIZE = 30

export default async function MediaPage({
  params,
  searchParams,
}: MediaPageProps) {
  const { slug } = await params
  const { tag: selectedTag } = await searchParams

  const club = await getClubBySlug(slug)

  if (!club) {
    notFound()
  }

  // Fetch media, counts, and tags from database
  const [mediaResults, counts, allTags] = await Promise.all([
    getClubContributions(club.id, {
      type: 'media',
      limit: PAGE_SIZE + 1,
      tag: selectedTag,
    }),
    getClubContributionCounts(club.id),
    getClubTags(club.id, 'media'),
  ])

  const mediaItems = mediaResults.slice(0, PAGE_SIZE)
  const initialHasMore = mediaResults.length > PAGE_SIZE

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Media Archive</h1>
        <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
          Our visual history. Every photo tells a story of early mornings, hard
          efforts, and the community we&apos;ve built mile by mile. This is what
          expressive running looks like.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-orange-600 text-white hover:bg-orange-700"
        >
          <Link href={`/club/${slug}/upload`}>Upload Photo/Video</Link>
        </Button>
      </div>

      {/* Filter Bar */}
      {allTags.length > 0 && (
        <section className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-run-gray-50 p-4">
          <span className="text-sm font-medium text-run-gray-700">Filter:</span>
          <Suspense fallback={<div className="h-8" />}>
            <TagFilter tags={allTags} selectedTag={selectedTag} />
          </Suspense>
        </section>
      )}

      {/* Media Grid - Masonry-style */}
      {mediaItems.length > 0 ? (
        <MediaGrid
          initialItems={mediaItems}
          initialHasMore={initialHasMore}
          slug={slug}
          selectedTag={selectedTag}
          pageSize={PAGE_SIZE}
        />
      ) : (
        <Card className="p-8 text-center">
          <p className="mb-4 text-muted-foreground">
            {selectedTag
              ? `No photos found with tag #${selectedTag}.`
              : 'No photos yet. Be the first to share!'}
          </p>
          <Button asChild variant="outline">
            <Link href={`/club/${slug}/upload`}>Upload Photo</Link>
          </Button>
        </Card>
      )}

      {/* Load More */}
      {mediaItems.length >= 9 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            disabled
            title="Pagination coming soon"
            aria-label="Load more photos - Pagination coming soon"
          >
            Load More Photos
          </Button>
        </div>
      )}

      {/* Stats */}
      <section className="grid gap-4 rounded-lg border border-border bg-run-gray-50 p-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-orange-600">
            {counts.media}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Total Photos
          </div>
        </div>
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-orange-600">
            {allTags.length}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Photo Tags
          </div>
        </div>
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-orange-600">
            {counts.stories + counts.media + counts.documents}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Total Contributions
          </div>
        </div>
      </section>
    </div>
  )
}
