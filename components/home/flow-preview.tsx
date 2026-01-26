'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

// Fallback seed data (used when database doesn't have enough entries)
const SEED_EXPRESSIONS = [
  'Sanity...',
  'The Bacon...',
  'My Sobriety...',
  'The Sunrise...',
  'Silence...',
  'My Mom...',
  'Freedom from anxiety...',
  'The crew waiting at the finish...',
  'Gratitude for moving...',
  'Clarity on a hard decision...',
  "My dog who can't run anymore...",
  'The version of me that gave up last time...',
  'Joy. Just joy...',
  'A new PR that nobody else cares about...',
  "The miles that don't count...",
  'Connection...',
  'My future self...',
  "The friends I haven't met yet...",
  'Process over outcome...',
  'The community that gets it...',
]

interface FlowPreviewProps {
  /** Expression content from the database */
  expressions?: string[]
}

export function FlowPreview({ expressions }: FlowPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Use database expressions if we have enough, otherwise mix with seed data
  const displayExpressions =
    expressions && expressions.length >= 10
      ? expressions
      : [...(expressions || []), ...SEED_EXPRESSIONS].slice(0, 20)

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement || isPaused) return

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed
      if (scrollElement) {
        scrollElement.scrollLeft = scrollPosition

        // Reset scroll when reaching the end (seamless loop)
        if (
          scrollPosition >=
          scrollElement.scrollWidth - scrollElement.clientWidth
        ) {
          scrollPosition = 0
        }
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isPaused])

  return (
    <section className="border-y border-border bg-muted/30 py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What are we running for today?
          </h2>
          <p className="text-balance text-lg text-muted-foreground md:text-xl">
            You are not alone on the road. Add your intention to the stream.
          </p>
        </div>

        {/* Scrolling Expression Stream */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="mb-12 overflow-x-hidden whitespace-nowrap"
          style={{ scrollBehavior: 'auto' }}
          role="marquee"
          aria-label="Runner intentions and expressions"
        >
          <div className="inline-flex gap-4 py-8">
            {/* Duplicate the array to create seamless loop effect */}
            {[...displayExpressions, ...displayExpressions].map(
              (expr, index) => (
                <motion.div
                  key={`${expr}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="organic-edges inline-block bg-card px-6 py-4 shadow-sm"
                >
                  <p className="text-sm italic text-muted-foreground">{expr}</p>
                </motion.div>
              )
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/flow">
            <Button size="lg">Add Your Voice →</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
