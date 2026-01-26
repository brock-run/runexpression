import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getClubBySlug, getClubContributions } from '@/lib/clubhouse/queries'

const DEFAULT_LIMIT = 30
const MAX_LIMIT = 50

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Club slug required.' }, { status: 400 })
    }

    const offsetParam = Number(searchParams.get('offset') ?? '0')
    const limitParam = Number(searchParams.get('limit') ?? String(DEFAULT_LIMIT))
    const tagParam = searchParams.get('tag')?.trim()

    const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
      : DEFAULT_LIMIT
    const tag = tagParam && tagParam.length > 0 ? tagParam : undefined

    const club = await getClubBySlug(slug)

    if (!club) {
      return NextResponse.json({ error: 'Club not found.' }, { status: 404 })
    }

    const results = await Sentry.startSpan(
      {
        op: 'db.query',
        name: 'clubhouse.media.pagination',
        attributes: {
          slug,
          tag: tag ?? 'all',
          offset,
          limit,
        },
      },
      () =>
        getClubContributions(club.id, {
          type: 'media',
          tag,
          offset,
          limit: limit + 1,
        })
    )

    const items = results.slice(0, limit)
    const hasMore = results.length > limit
    const nextOffset = offset + items.length

    return NextResponse.json({ items, hasMore, nextOffset })
  } catch (error) {
    console.error('Media pagination error:', error)
    Sentry.captureException(error)

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
