'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-4 py-20 md:py-32">
      {/* Background subtle animation - optional: add a gradient or motion effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-muted/30" />

      <div className="container mx-auto max-w-4xl text-center">
        {/* Main Headline */}
        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Make running mean more.
        </h1>

        {/* Subheadline */}
        <p className="mb-10 text-balance text-xl text-muted-foreground sm:text-2xl md:mb-12 md:text-3xl">
          Turn your struggle into art and feed the running community with your
          story.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/flow">
            <Button size="lg" className="min-w-[200px] text-base">
              Enter the Flow
            </Button>
          </Link>
          <Link href="/club/dwtc">
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px] text-base"
            >
              Visit the Clubhouse
            </Button>
          </Link>
        </div>

        {/* Optional scroll indicator */}
        <div className="mt-16 animate-bounce md:mt-20">
          <svg
            className="mx-auto h-6 w-6 text-muted-foreground"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  )
}
