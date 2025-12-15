'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">
            RunExpression
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link
            href="/#manifesto"
            className="transition-colors hover:text-foreground/80"
          >
            Manifesto
          </Link>
          <Link
            href="/flow"
            className="transition-colors hover:text-foreground/80"
          >
            The Flow
          </Link>
          <Link
            href="/club/dwtc"
            className="transition-colors hover:text-foreground/80"
          >
            Clubhouse
          </Link>
          <Link
            href="/library"
            className="transition-colors hover:text-foreground/80"
          >
            Library
          </Link>
          <Link
            href="/shop"
            className="transition-colors hover:text-foreground/80"
          >
            Shop
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
