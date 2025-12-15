'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import Link from 'next/link'

interface ChapterProps {
  number: string
  headline: string
  body: string
  prompt: string
  href?: string
}

function Chapter({ number, headline, body, prompt, href }: ChapterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: 'easeOut',
          },
        },
      }}
      className="mx-auto max-w-3xl px-4 py-20 md:py-32"
    >
      <div className="space-y-6">
        {/* Chapter Number */}
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Chapter {number}
        </p>

        {/* Headline */}
        <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {headline}
        </h2>

        {/* Body */}
        <p className="text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          {body}
        </p>

        {/* Optional Prompt Link */}
        {href && (
          <div className="pt-4">
            <Link
              href={href}
              className="inline-flex items-center text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {prompt}
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function ManifestoChapters() {
  return (
    <section id="manifesto" className="border-t border-border">
      {/* Chapter 01: Motion Creates Emotion */}
      <Chapter
        number="01"
        headline="Leave heavy. Return light."
        body="We've all felt it. You lace up with a head full of noise, stress, and unfinished arguments. Three miles later, the noise settles. The problem that seemed impossible at 6:00 AM solves itself by mile four. We run to change our minds, not just our bodies."
        prompt="Explore the Mindset →"
        href="/flow"
      />

      {/* Chapter 02: Process Over Outcome */}
      <Chapter
        number="02"
        headline="We take our fun very seriously."
        body="Let's be honest: in the grand scheme of the universe, running in circles is ridiculous. We pay to wake up at 4 AM. We obsess over split times nobody else cares about. We don't run because it's 'logical.' We run because the bagel tastes better when your legs are dead."
        prompt="Embrace the Grind →"
        href="/flow"
      />

      {/* Chapter 03: Interdependence */}
      <Chapter
        number="03"
        headline="Your squad is your battery pack."
        body="Science confirms what the gut already knows: We go farther when we go together. The runner next to you isn't your competition; they are the reason you'll hold that pace for one more mile when your legs want to quit. We draft off each other's energy."
        prompt="Find Your Crew →"
        href="/club/dwtc"
      />

      {/* Chapter 04: Living Laboratory */}
      <Chapter
        number="04"
        headline="Enlightenment smells like laundry."
        body="We run to find clarity, patience, and creativity that we can bring back to our 'real lives.' Does that make us artists? Yes. Does it also mean we have the questionable toenails of a warrior poet? Also yes. The run is where we scrub the stress off our souls (even if we need a shower immediately after)."
        prompt="Bring It to Life →"
        href="/library"
      />
    </section>
  )
}
