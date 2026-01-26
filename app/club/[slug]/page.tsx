import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getClubBySlug,
  getClubContributions,
  getClubContributionCounts,
  getClubMemberCount,
} from '@/lib/clubhouse/queries'

interface ClubOverviewPageProps {
  params: Promise<{ slug: string }>
}

export default async function ClubOverviewPage({
  params,
}: ClubOverviewPageProps) {
  const { slug } = await params
  const club = await getClubBySlug(slug)

  if (!club) {
    notFound()
  }

  // Fetch real data from database
  const [recentStories, recentMedia, counts, memberCount] = await Promise.all([
    getClubContributions(club.id, { type: 'story', limit: 2 }),
    getClubContributions(club.id, { type: 'media', limit: 3 }),
    getClubContributionCounts(club.id),
    getClubMemberCount(club.id),
  ])

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
      {/* Hero Message */}
      <section className="rounded-lg bg-run-black p-8 text-run-white md:p-12">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Welcome to the Laboratory
        </h2>
        <p className="mb-6 text-lg text-run-gray-300">
          Where lore lives. Where miles turn into memories. This is where the
          {club.name} preserves our stories, celebrates our absurdity, and
          reminds each other why we pay to wake up at 4 AM.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <Link href={`/club/${slug}/upload`}>Share Your Story</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`/club/${slug}/lore`}>Explore the Lore</Link>
          </Button>
        </div>
      </section>

      {/* Recent Stories */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Stories</h2>
          <Button asChild variant="ghost">
            <Link href={`/club/${slug}/lore`}>View All →</Link>
          </Button>
        </div>
        {recentStories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {recentStories.map(story => (
              <Card key={story.id} className="p-6">
                <h3 className="mb-2 text-xl font-bold">{story.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {formatDate(story.created_at)}
                </p>
                <p className="mb-4 line-clamp-3 text-run-gray-700">
                  {story.body}
                </p>
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="mb-4 text-muted-foreground">
              No stories yet. Be the first to share!
            </p>
            <Button asChild variant="outline">
              <Link href={`/club/${slug}/upload`}>Add Your Story</Link>
            </Button>
          </Card>
        )}
      </section>

      {/* Recent Media */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Media</h2>
          <Button asChild variant="ghost">
            <Link href={`/club/${slug}/media`}>View Gallery →</Link>
          </Button>
        </div>
        {recentMedia.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentMedia.map(media => (
              <Card key={media.id} className="overflow-hidden">
                <div className="relative aspect-[4/3] w-full">
                  {media.media_url ? (
                    <Image
                      src={media.media_url}
                      alt={media.title || 'Club media'}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-run-gray-100">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="mb-1 text-sm font-medium">
                    {media.title || media.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(media.created_at)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="mb-4 text-muted-foreground">
              No photos yet. Share your first one!
            </p>
            <Button asChild variant="outline">
              <Link href={`/club/${slug}/upload`}>Upload Photo</Link>
            </Button>
          </Card>
        )}
      </section>

      {/* Club Stats */}
      <section className="grid gap-6 sm:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="mb-2 text-4xl font-bold text-orange-600">
            {counts.stories}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Stories Shared
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="mb-2 text-4xl font-bold text-orange-600">
            {counts.media}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Photos & Videos
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="mb-2 text-4xl font-bold text-orange-600">
            {memberCount}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Active Members
          </div>
        </Card>
      </section>
    </div>
  )
}
