'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, useInView, useAnimation } from 'framer-motion'

export function ClubhouseTeaser() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-border bg-run-black py-20 text-run-white md:py-32"
    >
      {/* Optional: Background image with overlay - placeholder for now */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-run-gray-900 to-run-black opacity-80" />

      <div className="container relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: 'easeOut',
              },
            },
          }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Main Headline */}
          <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to the Laboratory.
          </h2>

          {/* Body Copy */}
          <p className="mb-8 text-balance text-lg leading-relaxed text-run-gray-300 md:text-xl">
            The Clubhouse is where the &ldquo;Sage in the Parking Lot&rdquo;
            lives. It&apos;s where we swap stories, dissect the process, and
            remind each other that while running is absurd, it&apos;s also
            essential.
          </p>

          {/* Callout */}
          <p className="mb-10 text-balance text-xl font-semibold italic md:text-2xl">
            This is an invitation. Not to run faster, but to run deeper.
          </p>

          {/* CTA */}
          <Link href="/club/dwtc">
            <Button
              size="lg"
              variant="outline"
              className="border-run-white bg-transparent text-run-white hover:bg-run-white hover:text-run-black"
            >
              Visit the Clubhouse →
            </Button>
          </Link>

          {/* Additional Info */}
          <p className="mt-8 text-sm text-run-gray-400">
            Where lore lives. Where miles turn into memories.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
