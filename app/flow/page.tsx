import { FlowWall } from '@/components/flow/flow-wall'
import { FlowSubmissionForm } from '@/components/flow/flow-submission-form'

export default function FlowPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
              What did your run express today?
            </h1>
            <p className="mb-8 text-lg text-neutral-600 md:text-xl">
              It doesn&apos;t have to be pretty. Just honest.
            </p>
            <p className="text-sm text-neutral-500">
              Share your miles, your mood, your meaning. This is The Flow—where
              every runner&apos;s raw truth becomes part of our collective canvas.
            </p>
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section className="border-b border-neutral-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <FlowSubmissionForm />
          </div>
        </div>
      </section>

      {/* The Wall */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-neutral-900">
              The Wall
            </h2>
            <p className="text-neutral-600">
              A living canvas of what we&apos;re running for
            </p>
          </div>
          <FlowWall />
        </div>
      </section>
    </div>
  )
}
