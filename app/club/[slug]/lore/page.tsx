import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TagFilter } from '@/components/clubhouse/tag-filter'
import {
  getClubBySlug,
  getClubContributions,
  getClubTags,
} from '@/lib/clubhouse/queries'

interface LorePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tag?: string }>
}

export default async function LorePage({ params, searchParams }: LorePageProps) {
  const { slug } = await params
  const { tag: selectedTag } = await searchParams

  const club = await getClubBySlug(slug)

  if (!club) {
    notFound()
  }

  // Fetch stories and tags from database
  const [featuredStories, allStories, allTags] = await Promise.all([
    getClubContributions(club.id, {
      type: 'story',
      featured: true,
      limit: 4,
      tag: selectedTag,
    }),
    getClubContributions(club.id, { type: 'story', limit: 50, tag: selectedTag }),
    getClubTags(club.id, 'story'),
  ])

  // Filter out featured stories from all stories to avoid duplicates
  const featuredIds = new Set(featuredStories.map(s => s.id))
  const regularStories = allStories.filter(s => !featuredIds.has(s.id))

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">The Lore</h1>
        <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
          Where miles turn into mythology. These are our stories—the ones we
          tell in parking lots after runs, the traditions that define us, the
          moments that remind us why we do this absurd thing we call running.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-orange-600 text-white hover:bg-orange-700"
        >
          <Link href={`/club/${slug}/upload`}>Add Your Story</Link>
        </Button>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <section className="rounded-lg border border-border bg-run-gray-50 p-6">
          <h3 className="mb-4 text-lg font-bold">Filter by Theme</h3>
          <Suspense fallback={<div className="h-10" />}>
            <TagFilter tags={allTags} selectedTag={selectedTag} />
          </Suspense>
        </section>
      )}

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <span className="text-orange-600">★</span> Featured Lore
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {featuredStories.map(story => (
              <Card
                key={story.id}
                className="overflow-hidden border-2 border-orange-600"
              >
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-bold">{story.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {formatDate(story.created_at)}
                  </p>
                  <p className="mb-6 line-clamp-4 text-run-gray-700">
                    {story.body}
                  </p>
                  {story.tags && story.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {story.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button asChild variant="outline">
                    <Link href={`/club/${slug}/lore/${story.id}`}>
                      Read Full Story →
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Stories */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">
          {selectedTag ? `Stories tagged #${selectedTag}` : 'All Stories'}
        </h2>
        {regularStories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularStories.map(story => (
              <Card key={story.id} className="flex flex-col p-6">
                <h3 className="mb-2 text-xl font-bold">{story.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {formatDate(story.created_at)}
                </p>
                <p className="mb-4 flex-grow text-sm text-run-gray-700 line-clamp-3">
                  {story.body}
                </p>
                {story.tags && story.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {story.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <Button asChild variant="ghost" size="sm" className="self-start">
                  <Link href={`/club/${slug}/lore/${story.id}`}>
                    Read More →
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        ) : featuredStories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="mb-4 text-muted-foreground">
              {selectedTag
                ? `No stories found with tag #${selectedTag}.`
                : 'No stories yet. Be the first to share your lore!'}
            </p>
            <Button asChild variant="outline">
              <Link href={`/club/${slug}/upload`}>Add Your Story</Link>
            </Button>
          </Card>
        ) : null}
      </section>
    </div>
  )
}
