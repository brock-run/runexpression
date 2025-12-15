import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        {/* Footer Headline */}
        <div className="mb-12 text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
            Run for yourself. Run for us. Express yourself.
          </h2>
        </div>

        {/* Footer Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Column 1: Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Navigate
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#manifesto"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Manifesto
                </Link>
              </li>
              <li>
                <Link
                  href="/flow"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  The Flow
                </Link>
              </li>
              <li>
                <Link
                  href="/club/dwtc"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clubhouse
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Community */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Community
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/coach/waitlist"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  AI Coach Waitlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Connect
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://instagram.com/runexpression"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@runexpression.com"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} RunExpression. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
