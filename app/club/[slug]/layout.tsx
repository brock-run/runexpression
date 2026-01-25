import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClubhouseNav } from '@/components/clubhouse/clubhouse-nav'

interface ClubLayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

export default async function ClubLayout({
  children,
  params,
}: ClubLayoutProps) {
  const { slug } = await params

  const supabase = await createClient()

  // Fetch club from database
  const { data: club, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', slug)
    .single()

  // If not in database, check for DWTC seed (initial MVP)
  // TODO: Remove this fallback once DWTC is seeded in database
  const fallbackClub =
    slug === 'dwtc'
      ? {
          id: 'dwtc-placeholder',
          name: 'Dead Weather Track Club',
          slug: 'dwtc',
          description: 'Where bacon meets miles. Where suffering becomes lore.',
          manifesto: {},
          is_public: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      : null

  const clubData = club || fallbackClub

  if (error && !fallbackClub) {
    console.error('Error fetching club:', error)
    notFound()
  }

  if (!clubData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-run-white">
      {/* Club Header */}
      <header className="border-b border-border bg-run-black text-run-white">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
              {clubData.name}
            </h1>
            <p className="text-lg text-run-gray-300">{clubData.description}</p>
          </div>

          {/* Navigation */}
          <ClubhouseNav slug={slug} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">{children}</main>
    </div>
  )
}
