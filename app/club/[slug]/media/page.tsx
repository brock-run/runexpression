import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getClubBySlug,
  getClubContributions,
  getClubContributionCounts,
} from '@/lib/clubhouse/queries'

interface MediaPageProps {
  params: { slug: string }
}

export default async function MediaPage({ params }: MediaPageProps) {
  const club = await getClubBySlug(params.slug)

  if (!club) {
    notFound()
  }

  // Fetch media from database
  const [mediaItems, counts] = await Promise.all([
    getClubContributions(club.id, { type: 'media', limit: 30 }),
    getClubContributionCounts(club.id),
  ])

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Collect all unique tags for the filter section
  const allTags = new Set<string>()
  mediaItems.forEach(item => {
    item.tags?.forEach(tag => allTags.add(tag))
  })
  const uniqueTags = Array.from(allTags).slice(0, 8)

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
          <Link href={`/club/${params.slug}/upload`}>Upload Photo/Video</Link>
        </Button>
      </div>

      {/* Filter Bar */}
      {uniqueTags.length > 0 && (
        <section className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-run-gray-50 p-4">
          <span className="text-sm font-medium text-run-gray-700">Filter:</span>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-medium text-white">
              All
            </button>
            {uniqueTags.map(tag => (
              <button
                key={tag}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-run-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Media Grid - Masonry-style */}
      {mediaItems.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.map((item, index) => (
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
                {/* Overlay on Hover */}
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
      ) : (
        <Card className="p-8 text-center">
          <p className="mb-4 text-muted-foreground">
            No photos yet. Be the first to share!
          </p>
          <Button asChild variant="outline">
            <Link href={`/club/${params.slug}/upload`}>Upload Photo</Link>
          </Button>
        </Card>
      )}

      {/* Load More - would use client component for pagination */}
      {mediaItems.length >= 30 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
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
            {uniqueTags.length}
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
