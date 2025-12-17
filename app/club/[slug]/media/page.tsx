import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MediaPage() {
  // Mock data - will be replaced with Supabase queries
  const mediaItems = [
    {
      id: '1',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Dawn+Patrol+5AM',
      type: 'image',
      caption: 'Dawn patrol at 4:47 AM. The world belongs to us.',
      author: 'Alex K.',
      date: '2025-12-14',
      tags: ['dawn-patrol', 'track', 'crew'],
    },
    {
      id: '2',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Bacon+Ritual',
      type: 'image',
      caption:
        'Post-workout bacon ritual. Our most sacred tradition, captured in its full glory.',
      author: 'Jordan P.',
      date: '2025-12-13',
      tags: ['bacon', 'tradition', 'post-run'],
    },
    {
      id: '3',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Time+Trial+Finish',
      type: 'image',
      caption:
        'Championship time trial finish. Pain is temporary, times are forever.',
      author: 'Casey L.',
      date: '2025-12-12',
      tags: ['time-trial', 'race', 'finish-line'],
    },
    {
      id: '4',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Al+Qudra+Sunrise',
      type: 'image',
      caption: 'Al Qudra long run sunrise. 20km into the desert.',
      author: 'Sarah M.',
      date: '2025-12-10',
      tags: ['al-qudra', 'long-run', 'sunrise'],
    },
    {
      id: '5',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Sub+16+Club',
      type: 'image',
      caption: 'Breaking into the Sub-16 club. 15:58. Pure euphoria.',
      author: 'Mike R.',
      date: '2025-12-08',
      tags: ['sub-16', 'milestone', 'celebration'],
    },
    {
      id: '6',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Crew+Photo',
      type: 'image',
      caption: 'Tuesday morning crew. We choose this. Every week.',
      author: 'Taylor W.',
      date: '2025-12-07',
      tags: ['crew', 'community', 'track'],
    },
    {
      id: '7',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Parking+Lot+Debrief',
      type: 'image',
      caption:
        'Parking lot philosophy session. Where the sage emerges after suffering.',
      author: 'Chris H.',
      date: '2025-12-05',
      tags: ['philosophy', 'community', 'post-run'],
    },
    {
      id: '8',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Track+Intervals',
      type: 'image',
      caption: 'Track intervals under the lights. The grind never stops.',
      author: 'Jamie S.',
      date: '2025-12-03',
      tags: ['track', 'intervals', 'night-run'],
    },
    {
      id: '9',
      url: 'https://placehold.co/600x400/1a1a1a/fafafa?text=Recovery+Run',
      type: 'image',
      caption: 'Easy Sunday recovery. Sometimes slow is the hardest pace.',
      author: 'Pat M.',
      date: '2025-12-01',
      tags: ['recovery', 'easy-run', 'sunday'],
    },
  ]

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
          <Link href="/club/dwtc/upload">Upload Photo/Video</Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <section className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-run-gray-50 p-4">
        <span className="text-sm font-medium text-run-gray-700">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {[
            'All',
            'bacon',
            'time-trial',
            'dawn-patrol',
            'al-qudra',
            'crew',
            'race',
          ].map(filter => (
            <button
              key={filter}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === 'All'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-run-gray-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {filter === 'All' ? filter : `#${filter}`}
            </button>
          ))}
        </div>
      </section>

      {/* Media Grid - Masonry-style */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mediaItems.map((item, index) => (
          <Card
            key={item.id}
            className={`group overflow-hidden ${
              index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
            }`}
          >
            <div className="relative">
              <img
                src={item.url}
                alt={item.caption}
                className={`w-full object-cover transition-transform group-hover:scale-105 ${
                  index % 5 === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
                }`}
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <p className="mb-2 text-sm font-medium leading-tight">
                {item.caption}
              </p>
              <p className="mb-3 text-xs text-muted-foreground">
                By {item.author} • {item.date}
              </p>
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
            </div>
          </Card>
        ))}
      </section>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Photos
        </Button>
      </div>

      {/* Stats */}
      <section className="grid gap-4 rounded-lg border border-border bg-run-gray-50 p-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-orange-600">342</div>
          <div className="text-sm font-medium text-muted-foreground">
            Total Photos
          </div>
        </div>
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-orange-600">28</div>
          <div className="text-sm font-medium text-muted-foreground">
            Contributors
          </div>
        </div>
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-orange-600">2.4k</div>
          <div className="text-sm font-medium text-muted-foreground">
            Total Views
          </div>
        </div>
      </section>
    </div>
  )
}
