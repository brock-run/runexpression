import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import {
  getClubBySlug,
  getContributionById,
  getClubContributions,
} from '@/lib/clubhouse/queries'

interface StoryDetailPageProps {
  params: Promise<{ slug: string; storyId: string }>
}

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const { slug, storyId } = await params

  const club = await getClubBySlug(slug)
  if (!club) {
    notFound()
  }

  const story = await getContributionById(storyId)
  if (!story || story.type !== 'story') {
    notFound()
  }

  // Fetch related stories (same club, different story)
  const allStories = await getClubContributions(club.id, {
    type: 'story',
    limit: 5,
  })
  const relatedStories = allStories
    .filter(s => s.id !== storyId)
    .slice(0, 2)

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Simple markdown-like rendering
  const renderBody = (body: string | null) => {
    if (!body) return null

    return body
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('# ')) {
          return (
            <h1 key={index} className="mb-4 text-3xl font-bold">
              {paragraph.slice(2)}
            </h1>
          )
        }
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="mb-3 mt-8 text-2xl font-bold">
              {paragraph.slice(3)}
            </h2>
          )
        }
        if (paragraph.startsWith('- ')) {
          const items = paragraph
            .split('\n')
            .filter(line => line.startsWith('- '))
            .map((line, i) => <li key={i}>{line.slice(2)}</li>)
          return (
            <ul key={index} className="my-4 list-inside list-disc space-y-2">
              {items}
            </ul>
          )
        }
        if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
          return (
            <p
              key={index}
              className="my-8 text-center italic text-muted-foreground"
            >
              {paragraph.slice(1, -1)}
            </p>
          )
        }
        if (paragraph.startsWith('---')) {
          return <hr key={index} className="my-8 border-t border-border" />
        }
        // Handle bold text within paragraphs
        const formattedText = paragraph.replace(
          /\*\*([^*]+)\*\*/g,
          '<strong>$1</strong>'
        )
        return (
          <p
            key={index}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        )
      })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost">
        <Link href={`/club/${slug}/lore`}>← Back to Lore</Link>
      </Button>

      {/* Story Header */}
      <div className="border-b border-border pb-8">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{story.title}</h1>
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDate(story.created_at)}</span>
        </div>
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {story.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-run-gray-100 px-3 py-1.5 text-sm font-medium text-run-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Story Body */}
      <article className="prose prose-lg max-w-none">
        <div className="space-y-6 text-run-gray-900">{renderBody(story.body)}</div>
      </article>

      {/* Share/Actions */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Enjoyed this story?</p>
            <p className="text-sm text-muted-foreground">
              Share your own experience with the crew
            </p>
          </div>
          <Button
            asChild
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            <Link href={`/club/${slug}/upload`}>Share Your Story</Link>
          </Button>
        </div>
      </Card>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-bold">Related Stories</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedStories.map(related => (
              <Card key={related.id} className="p-6">
                <h3 className="mb-3 text-xl font-bold">
                  <Link
                    href={`/club/${slug}/lore/${related.id}`}
                    className="hover:text-orange-600"
                  >
                    {related.title}
                  </Link>
                </h3>
                {related.body && (
                  <p className="mb-4 line-clamp-2 text-sm text-run-gray-700">
                    {related.body}
                  </p>
                )}
                {related.tags && related.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {related.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-run-gray-100 px-2 py-1 text-xs font-medium text-run-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
