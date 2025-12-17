import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { notFound } from 'next/navigation'

interface StoryDetailPageProps {
  params: Promise<{ slug: string; storyId: string }>
}

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const { slug, storyId } = await params

  // Mock data - will be replaced with Supabase query
  const story = {
    id: storyId,
    title: 'The Bacon Ritual: Origins',
    author: 'Sarah M.',
    date: '2025-12-10',
    tags: ['bacon', 'tradition', 'lore', 'founding-story'],
    body: `# The Bacon Ritual: Origins

It started on a Tuesday morning. The air was thick with humidity and questionable life choices. We'd just finished a brutal time trial—one of those sessions where you question every decision that led you to a track at 5 AM.

## The Discovery

Someone (I won't name names, but you know who you are) pulled out a portable camping stove from their trunk. Then came the bacon. Not pre-cooked. Not microwaved. Real, raw bacon, ready to be cooked in a parking lot while we were still in our race bibs.

The absurdity was immediate. The brilliance took a moment longer.

## Why It Works

There's something profound about cooking bacon in a parking lot after you've just run yourself into the ground. It's the ultimate juxtaposition:

- **Suffering meets celebration**
- **Performance meets pleasure**
- **Discipline meets chaos**

We run to push ourselves. We cook bacon because we can. Because we're alive. Because the parking lot is our laboratory, and bacon is our reward for showing up.

## The Tradition Takes Root

That first Tuesday, it was just three of us standing around a camping stove, laughing at ourselves. By the next week, seven people showed up with bacon. Then twelve. Then we had to organize who brings what.

Now it's sacred. Not because bacon is healthy (it's decidedly not). Not because it makes you faster (it doesn't). But because it reminds us that running is about more than times and training plans.

It's about the parking lot conversations. The shared suffering. The collective decision to do something absurd and embrace it fully.

## The Philosophy

The Sage in the Parking Lot says: "Leave heavy. Return light. Then cook bacon."

Running strips away the unnecessary. The bacon ritual reminds us to celebrate the unnecessary. Both are essential.

Every Tuesday, we gather. We run hard. We suffer together. Then we stand around a camping stove in a parking lot and remember why we do this ridiculous thing we call running.

## Your Invitation

If you're new to DWTC, know this: the bacon ritual isn't about the bacon. It's about showing up. It's about community. It's about celebrating the absurdity of paying to wake up at 4 AM to run in circles.

But also, it's definitely about the bacon.

---

*This is DWTC. This is what we do. Welcome to the laboratory.*`,
  }

  if (!story) {
    notFound()
  }

  // Related stories
  const relatedStories = [
    {
      id: '2',
      title: 'Breaking into the Sub-16 Club',
      excerpt: "The 5K time trial that changed everything...",
      tags: ['sub-16', 'time-trial'],
    },
    {
      id: '3',
      title: 'Why We Run at 4 AM',
      excerpt: 'The absurdity of pre-dawn miles...',
      tags: ['philosophy', 'dawn-patrol'],
    },
  ]

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
          <span>By {story.author}</span>
          <span>•</span>
          <span>{story.date}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-run-gray-100 px-3 py-1.5 text-sm font-medium text-run-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Story Body */}
      <article className="prose prose-lg max-w-none">
        {/* In a real app, this would use a markdown parser like react-markdown */}
        <div
          className="space-y-6 text-run-gray-900"
          dangerouslySetInnerHTML={{
            __html: story.body
              .split('\n\n')
              .map((paragraph) => {
                if (paragraph.startsWith('# ')) {
                  return `<h1 class="text-3xl font-bold mb-4">${paragraph.slice(2)}</h1>`
                }
                if (paragraph.startsWith('## ')) {
                  return `<h2 class="text-2xl font-bold mb-3 mt-8">${paragraph.slice(3)}</h2>`
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph
                    .split('\n')
                    .filter((line) => line.startsWith('- '))
                    .map((line) => `<li>${line.slice(2)}</li>`)
                    .join('')
                  return `<ul class="list-disc list-inside space-y-2 my-4">${items}</ul>`
                }
                if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                  return `<p class="italic text-center text-muted-foreground my-8">${paragraph.slice(1, -1)}</p>`
                }
                if (paragraph.startsWith('---')) {
                  return '<hr class="my-8 border-t border-border" />'
                }
                return `<p class="leading-relaxed">${paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>`
              })
              .join(''),
          }}
        />
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
      <section>
        <h2 className="mb-6 text-2xl font-bold">Related Stories</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {relatedStories.map((related) => (
            <Card key={related.id} className="p-6">
              <h3 className="mb-3 text-xl font-bold">
                <Link
                  href={`/club/${slug}/lore/${related.id}`}
                  className="hover:text-orange-600"
                >
                  {related.title}
                </Link>
              </h3>
              <p className="mb-4 text-sm text-run-gray-700">
                {related.excerpt}
              </p>
              <div className="flex flex-wrap gap-2">
                {related.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-run-gray-100 px-2 py-1 text-xs font-medium text-run-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
