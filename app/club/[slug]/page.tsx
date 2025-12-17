import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function ClubOverviewPage() {
  // Mock data - will be replaced with Supabase queries
  const recentStories = [
    {
      id: '1',
      title: 'The Bacon Ritual: Origins',
      excerpt:
        'How a simple act of cooking bacon in a parking lot became our most sacred tradition...',
      author: 'Sarah M.',
      date: '2025-12-10',
      tags: ['bacon', 'tradition', 'lore'],
    },
    {
      id: '2',
      title: 'Breaking into the Sub-16 Club',
      excerpt:
        "The 5K time trial that changed everything. Here's what I learned about suffering...",
      author: 'Mike R.',
      date: '2025-12-08',
      tags: ['sub-16', 'time-trial', 'milestone'],
    },
  ]

  const recentMedia = [
    {
      id: '1',
      url: 'https://placehold.co/400x300/1a1a1a/fafafa?text=Dawn+Patrol',
      caption: 'Dawn patrol at 4:47 AM. The world belongs to us.',
      author: 'Alex K.',
    },
    {
      id: '2',
      url: 'https://placehold.co/400x300/1a1a1a/fafafa?text=Bacon+Day',
      caption: 'Post-workout bacon ritual. A moment of pure joy.',
      author: 'Jordan P.',
    },
    {
      id: '3',
      url: 'https://placehold.co/400x300/1a1a1a/fafafa?text=Time+Trial',
      caption: 'Championship time trial. Pain is temporary, times are forever.',
      author: 'Casey L.',
    },
  ]

  const upcomingEvents = [
    {
      id: '1',
      name: 'Tuesday Time Trial',
      date: '2025-12-17',
      time: '5:00 AM',
      location: 'Track',
    },
    {
      id: '2',
      name: 'Saturday Long Run',
      date: '2025-12-21',
      time: '5:30 AM',
      location: 'Al Qudra',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Message */}
      <section className="rounded-lg bg-run-black p-8 text-run-white md:p-12">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Welcome to the Laboratory
        </h2>
        <p className="mb-6 text-lg text-run-gray-300">
          Where lore lives. Where miles turn into memories. This is where the
          Dubai Water Tribe Collective preserves our stories, celebrates our
          absurdity, and reminds each other why we pay to wake up at 4 AM.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <Link href="/club/dwtc/upload">Share Your Story</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/club/dwtc/lore">Explore the Lore</Link>
          </Button>
        </div>
      </section>

      {/* Recent Stories */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Stories</h2>
          <Button asChild variant="ghost">
            <Link href="/club/dwtc/lore">View All →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {recentStories.map((story) => (
            <Card key={story.id} className="p-6">
              <h3 className="mb-2 text-xl font-bold">{story.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                By {story.author} • {story.date}
              </p>
              <p className="mb-4 text-run-gray-700">{story.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Media */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Media</h2>
          <Button asChild variant="ghost">
            <Link href="/club/dwtc/media">View Gallery →</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentMedia.map((media) => (
            <Card key={media.id} className="overflow-hidden">
              <img
                src={media.url}
                alt={media.caption}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4">
                <p className="mb-1 text-sm font-medium">{media.caption}</p>
                <p className="text-xs text-muted-foreground">
                  By {media.author}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-2 text-lg font-bold">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.date} at {event.time} • {event.location}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Club Stats */}
      <section className="grid gap-6 sm:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="mb-2 text-4xl font-bold text-orange-600">127</div>
          <div className="text-sm font-medium text-muted-foreground">
            Stories Shared
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="mb-2 text-4xl font-bold text-orange-600">342</div>
          <div className="text-sm font-medium text-muted-foreground">
            Photos & Videos
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="mb-2 text-4xl font-bold text-orange-600">47</div>
          <div className="text-sm font-medium text-muted-foreground">
            Active Members
          </div>
        </Card>
      </section>
    </div>
  )
}
