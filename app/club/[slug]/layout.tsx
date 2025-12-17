import { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ClubLayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

// Mock club data - will be replaced with Supabase query
const CLUBS = {
  dwtc: {
    name: 'Dubai Water Tribe Collective',
    slug: 'dwtc',
    description: 'Where bacon meets miles. Where suffering becomes lore.',
    logoUrl: null,
    coverImageUrl: null,
  },
}

export default async function ClubLayout({
  children,
  params,
}: ClubLayoutProps) {
  const { slug } = await params
  const club = CLUBS[slug as keyof typeof CLUBS]

  if (!club) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-run-white">
      {/* Club Header */}
      <header className="border-b border-border bg-run-black text-run-white">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
              {club.name}
            </h1>
            <p className="text-lg text-run-gray-300">{club.description}</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-2 border-t border-run-gray-800 pt-4">
            <NavLink href={`/club/${slug}`}>Overview</NavLink>
            <NavLink href={`/club/${slug}/lore`}>Lore</NavLink>
            <NavLink href={`/club/${slug}/media`}>Media</NavLink>
            <NavLink href={`/club/${slug}/resources`}>Resources</NavLink>
            <NavLink href={`/club/${slug}/upload`}>Upload</NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">{children}</main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-run-gray-800"
    >
      {children}
    </Link>
  )
}
