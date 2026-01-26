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
import { FileText, Map, Download } from 'lucide-react'

interface ResourcesPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tag?: string }>
}

export default async function ResourcesPage({
  params,
  searchParams,
}: ResourcesPageProps) {
  const { slug } = await params
  const { tag: selectedTag } = await searchParams

  const club = await getClubBySlug(slug)

  if (!club) {
    notFound()
  }

  // Fetch documents and tags from database
  const [resources, allTags] = await Promise.all([
    getClubContributions(club.id, {
      type: 'document',
      limit: 50,
      tag: selectedTag,
    }),
    getClubTags(club.id, 'document'),
  ])

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Format file size helper
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get file type icon
  const getFileIcon = (fileType: string | null) => {
    if (fileType?.includes('gpx') || fileType?.includes('map')) {
      return <Map className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  // Get file type label
  const getFileTypeLabel = (fileType: string | null) => {
    if (!fileType) return 'FILE'
    if (fileType.includes('pdf')) return 'PDF'
    if (fileType.includes('gpx')) return 'GPX'
    if (fileType.includes('doc')) return 'DOC'
    return fileType.toUpperCase().slice(0, 4)
  }

  // Derive categories from tags
  const categories = [
    {
      name: 'Training Plans',
      icon: '📋',
      count: resources.filter(
        r => r.tags?.some(t => t.includes('training') || t.includes('plan'))
      ).length,
    },
    {
      name: 'Routes & Maps',
      icon: '🗺️',
      count: resources.filter(
        r =>
          r.tags?.some(t => t.includes('route') || t.includes('map')) ||
          r.file_type?.includes('gpx')
      ).length,
    },
    {
      name: 'Race Reports',
      icon: '🏁',
      count: resources.filter(r =>
        r.tags?.some(t => t.includes('race') || t.includes('report'))
      ).length,
    },
    {
      name: 'Other',
      icon: '📄',
      count: resources.filter(
        r =>
          !r.tags?.some(
            t =>
              t.includes('training') ||
              t.includes('plan') ||
              t.includes('route') ||
              t.includes('map') ||
              t.includes('race') ||
              t.includes('report')
          )
      ).length,
    },
  ].filter(c => c.count > 0)

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
          <Link href={`/club/${slug}/upload`}>Upload Resource</Link>
        </Button>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <section className="rounded-lg border border-border bg-run-gray-50 p-6">
          <h3 className="mb-4 text-lg font-bold">Filter by Tag</h3>
          <Suspense fallback={<div className="h-10" />}>
            <TagFilter tags={allTags} selectedTag={selectedTag} />
          </Suspense>
        </section>
      )}

      {/* Categories */}
      {!selectedTag && categories.length > 0 && (
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
                  {category.count} resource{category.count !== 1 ? 's' : ''}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Resources */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">
          {selectedTag ? `Resources tagged #${selectedTag}` : 'All Resources'}
        </h2>
        {resources.length > 0 ? (
          <div className="space-y-4">
            {resources.map(resource => (
              <Card key={resource.id} className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-grow">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-bold">{resource.title}</h3>
                      <span className="flex items-center gap-1 rounded bg-run-gray-100 px-2 py-1 text-xs font-medium text-run-gray-700">
                        {getFileIcon(resource.file_type)}
                        {getFileTypeLabel(resource.file_type)}
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {formatDate(resource.created_at)} •{' '}
                      {formatFileSize(resource.file_size)}
                    </p>
                    {resource.body && (
                      <p className="mb-4 text-run-gray-700 line-clamp-2">
                        {resource.body}
                      </p>
                    )}
                    {resource.tags && resource.tags.length > 0 && (
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
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2 lg:flex-col">
                    {resource.media_url && (
                      <Button
                        asChild
                        className="bg-orange-600 text-white hover:bg-orange-700"
                      >
                        <a
                          href={resource.media_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="mb-4 text-muted-foreground">
              {selectedTag
                ? `No resources found with tag #${selectedTag}.`
                : 'No resources yet. Be the first to share!'}
            </p>
            <Button asChild variant="outline">
              <Link href={`/club/${slug}/upload`}>Upload Resource</Link>
            </Button>
          </Card>
        )}
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
          <Link href={`/club/${slug}/upload`}>Upload Your Resource</Link>
        </Button>
      </section>
    </div>
  )
}
