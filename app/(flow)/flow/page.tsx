import { Metadata } from 'next'
import { FlowWall } from '@/components/flow/flow-wall'
import { SubmissionDialog } from '@/components/flow/submission-dialog'

export const metadata: Metadata = {
  title: 'The Flow | RunExpression',
  description:
    'Join the river of runners expressing what they run for. Share your intentions, discoveries, and moments.',
}

export default function FlowPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background pb-8 pt-12 md:pb-12 md:pt-20">
        <div className="container">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The Flow
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            A river of runners expressing what they run for. Add your voice to
            the stream.
          </p>
        </div>
      </section>

      {/* Flow Wall */}
      <section className="container py-8 md:py-12">
        <FlowWall />
      </section>

      {/* Floating Submit Button */}
      <SubmissionDialog />
    </main>
  )
}
