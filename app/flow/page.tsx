import { FlowSubmission } from '@/components/flow/flow-submission'
import { FlowWall } from '@/components/flow/flow-wall'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Flow - Express Your Run',
  description:
    'Share what your run expressed today. Join the collective stream of runner expressions.',
}

export default function FlowPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/30 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            What did your run express today?
          </h1>
          <p className="text-balance text-lg text-muted-foreground md:text-xl">
            It doesn&apos;t have to be pretty. Just honest.
          </p>
        </div>
      </section>

      {/* Submission Form */}
      <section className="border-b border-border px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <FlowSubmission />
        </div>
      </section>

      {/* Flow Wall */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
              The Flow
            </h2>
            <p className="text-muted-foreground">
              You are not alone on the road. These are our expressions.
            </p>
          </div>
          <FlowWall />
        </div>
      </section>
    </div>
  )
}
