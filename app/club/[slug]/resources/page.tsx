import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ResourcesPage() {
  // Mock data - will be replaced with Supabase queries
  const resources = [
    {
      id: '1',
      title: 'DWTC Training Plan - 5K Speed',
      description:
        'Our signature 8-week training plan for breaking into the Sub-16 club. Includes track workouts, tempo runs, and the all-important bacon ritual recovery protocol.',
      type: 'PDF',
      size: '2.4 MB',
      author: 'Coach Sarah M.',
      date: '2025-12-10',
      downloadUrl: '#',
      tags: ['training-plan', 'sub-16', '5k'],
    },
    {
      id: '2',
      title: 'Al Qudra Long Run Route',
      description:
        'The official DWTC Al Qudra route (22km). Includes water stop locations, sunrise viewing points, and emergency bailout options.',
      type: 'GPX',
      size: '124 KB',
      author: 'Alex K.',
      date: '2025-12-08',
      downloadUrl: '#',
      tags: ['route', 'al-qudra', 'long-run'],
    },
    {
      id: '3',
      title: 'Time Trial Championship Rules',
      description:
        'Official rules for Tuesday morning time trials. Read this before your first championship attempt. Includes pacing strategies and post-race etiquette.',
      type: 'PDF',
      size: '890 KB',
      author: 'Mike R.',
      date: '2025-12-05',
      downloadUrl: '#',
      tags: ['time-trial', 'rules', 'competition'],
    },
    {
      id: '4',
      title: 'Track Workout Library',
      description:
        'Collection of 20+ track workouts tested and approved by DWTC. From VO2 max sessions to threshold builders. Suffer smarter, not just harder.',
      type: 'PDF',
      size: '3.2 MB',
      author: 'Jordan P.',
      date: '2025-11-28',
      downloadUrl: '#',
      tags: ['track', 'workouts', 'training'],
    },
    {
      id: '5',
      title: 'Dubai Track Locations Map',
      description:
        'Comprehensive guide to all runnable tracks in Dubai. Includes surface type, lighting, and ideal training times.',
      type: 'PDF',
      size: '1.8 MB',
      author: 'Casey L.',
      date: '2025-11-25',
      downloadUrl: '#',
      tags: ['track', 'locations', 'dubai'],
    },
    {
      id: '6',
      title: 'Bacon Ritual Cookbook',
      description:
        'Yes, this is real. Our complete guide to post-workout bacon preparation. Includes parking lot cooking tips and the philosophy behind the ritual.',
      type: 'PDF',
      size: '4.1 MB',
      author: 'The Collective',
      date: '2025-11-20',
      downloadUrl: '#',
      tags: ['bacon', 'tradition', 'recovery'],
    },
  ]

  const categories = [
    { name: 'Training Plans', count: 4, icon: '📋' },
    { name: 'Routes & Maps', count: 8, icon: '🗺️' },
    { name: 'Race Reports', count: 12, icon: '🏁' },
    { name: 'Nutrition', count: 6, icon: '🥓' },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Resources</h1>
        <p className="mb-6 max-w-3xl text-lg text-muted-foreground">
          Training plans, route maps, race reports, and everything else
          we&apos;ve learned the hard way. Download, share, and add your own
          wisdom to the collective knowledge.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-orange-600 text-white hover:bg-orange-700"
        >
          <Link href="/club/dwtc/upload">Upload Resource</Link>
        </Button>
      </div>

      {/* Categories */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <Card
              key={category.name}
              className="cursor-pointer p-6 transition-colors hover:border-orange-600 hover:bg-orange-50"
            >
              <div className="mb-2 text-3xl">{category.icon}</div>
              <h3 className="mb-1 font-bold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.count} resources
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* All Resources */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">All Resources</h2>
        <div className="space-y-4">
          {resources.map(resource => (
            <Card key={resource.id} className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-grow">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-bold">{resource.title}</h3>
                    <span className="rounded bg-run-gray-100 px-2 py-1 text-xs font-medium text-run-gray-700">
                      {resource.type}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    By {resource.author} • {resource.date} • {resource.size}
                  </p>
                  <p className="mb-4 text-run-gray-700">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-run-gray-100 px-3 py-1 text-xs font-medium text-run-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 lg:flex-col">
                  <Button className="bg-orange-600 text-white hover:bg-orange-700">
                    Download
                  </Button>
                  <Button variant="outline">Preview</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contribution CTA */}
      <section className="rounded-lg border-2 border-dashed border-run-gray-300 bg-run-gray-50 p-8 text-center">
        <h3 className="mb-3 text-2xl font-bold">Have Something to Share?</h3>
        <p className="mb-6 text-muted-foreground">
          Got a training plan, route map, or race report that helped you? Share
          it with the crew. Our collective knowledge grows with every
          contribution.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-orange-600 text-white hover:bg-orange-700"
        >
          <Link href="/club/dwtc/upload">Upload Your Resource</Link>
        </Button>
      </section>
    </div>
  )
}
