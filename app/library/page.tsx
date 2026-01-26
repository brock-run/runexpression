import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Library | RunExpression',
  description:
    'Stories, guides, and wisdom from the running community. Content library coming soon.',
}

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background pb-8 pt-12 md:pb-12 md:pt-20">
        <div className="container">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The Library
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            Stories, guides, and wisdom from the running community.
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Content Library Coming Soon
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            We&apos;re curating stories, training guides, and community wisdom.
            In the meantime, join the Flow and share what running means to you.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/flow">
                Enter the Flow
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/club/dwtc">Visit the Clubhouse</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
