import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function LorePage() {
  // Mock data - will be replaced with Supabase queries
  const stories = [
    {
      id: '1',
      title: 'The Bacon Ritual: Origins',
      excerpt:
        'How a simple act of cooking bacon in a parking lot became our most sacred tradition. It started on a Tuesday morning after a particularly brutal time trial...',
      author: 'Sarah M.',
      date: '2025-12-10',
      tags: ['bacon', 'tradition', 'lore', 'founding-story'],
      featured: true,
    },
    {
      id: '2',
      title: 'Breaking into the Sub-16 Club',
      excerpt:
        "The 5K time trial that changed everything. Here's what I learned about suffering, and why 15:59 feels different from 16:01...",
      author: 'Mike R.',
      date: '2025-12-08',
      tags: ['sub-16', 'time-trial', 'milestone', 'suffering'],
      featured: true,
    },
    {
      id: '3',
      title: 'Why We Run at 4 AM',
      excerpt:
        "The absurdity of pre-dawn miles. A philosophical inquiry into why we pay to suffer before sunrise, and why it's the best decision we make all week...",
      author: 'Alex K.',
      date: '2025-12-05',
      tags: ['philosophy', 'dawn-patrol', 'manifesto'],
      featured: false,
    },
    {
      id: '4',
      title: 'The First Al Qudra Long Run',
      excerpt:
        'Twenty-three kilometers into the desert. What started as a casual Saturday run became our weekly pilgrimage to the dunes...',
      author: 'Jordan P.',
      date: '2025-12-01',
      tags: ['al-qudra', 'long-run', 'tradition'],
      featured: false,
    },
    {
      id: '5',
      title: 'Championship Time Trials: A History',
      excerpt:
        'From humble beginnings to our most competitive tradition. Every Tuesday at 5 AM, we gather to chase times and build lore...',
      author: 'Casey L.',
      date: '2025-11-28',
      tags: ['time-trial', 'competition', 'history'],
      featured: false,
    },
    {
      id: '6',
      title: 'The Parking Lot Philosophy',
      excerpt:
        'Our best conversations happen in parking lots after runs. This is where the Sage emerges, where wisdom meets sweat, where suffering becomes story...',
      author: 'Taylor W.',
      date: '2025-11-25',
      tags: ['philosophy', 'community', 'sage'],
      featured: false,
    },
  ]

  const featuredStories = stories.filter((s) => s.featured)
  const regularStories = stories.filter((s) => !s.featured)

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
          <Link href="/club/dwtc/upload">Add Your Story</Link>
        </Button>
      </div>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <span className="text-orange-600">★</span> Featured Lore
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {featuredStories.map((story) => (
              <Card
                key={story.id}
                className="overflow-hidden border-2 border-orange-600"
              >
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-bold">{story.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    By {story.author} • {story.date}
                  </p>
                  <p className="mb-6 text-run-gray-700">{story.excerpt}</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline">Read Full Story →</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Stories */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">All Stories</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regularStories.map((story) => (
            <Card key={story.id} className="flex flex-col p-6">
              <h3 className="mb-2 text-xl font-bold">{story.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                By {story.author} • {story.date}
              </p>
              <p className="mb-4 flex-grow text-sm text-run-gray-700">
                {story.excerpt}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {story.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="self-start">
                Read More →
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Tags Filter - Future enhancement */}
      <section className="rounded-lg border border-border bg-run-gray-50 p-8">
        <h3 className="mb-4 text-lg font-bold">Explore by Theme</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'bacon',
            'sub-16',
            'time-trial',
            'philosophy',
            'tradition',
            'al-qudra',
            'dawn-patrol',
            'suffering',
            'community',
          ].map((tag) => (
            <button
              key={tag}
              className="rounded-full border border-run-gray-300 bg-white px-4 py-2 text-sm font-medium text-run-gray-700 transition-colors hover:border-orange-600 hover:bg-orange-50 hover:text-orange-600"
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
