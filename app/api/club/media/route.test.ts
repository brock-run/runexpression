import { NextRequest } from 'next/server'
import { GET } from './route'
import { getClubBySlug, getClubContributions } from '@/lib/clubhouse/queries'

jest.mock('@/lib/clubhouse/queries')
jest.mock('@sentry/nextjs', () => ({
  startSpan: (_context: unknown, callback: () => unknown) => callback(),
  captureException: jest.fn(),
}))

const mockedGetClubBySlug = getClubBySlug as jest.MockedFunction<typeof getClubBySlug>
const mockedGetClubContributions = getClubContributions as jest.MockedFunction<
  typeof getClubContributions
>

const createMediaItem = (id: string) =>
  ({
    id,
    club_id: 'club-1',
    type: 'media',
    created_at: '2026-01-26T00:00:00.000Z',
  }) as const

describe('GET /api/club/media', () => {
  beforeEach(() => {
    mockedGetClubBySlug.mockReset()
    mockedGetClubContributions.mockReset()
  })

  it('returns 400 when slug is missing', async () => {
    const response = await GET(new NextRequest('http://localhost/api/club/media'))

    expect(response.status).toBe(400)
  })

  it('returns 404 when club is not found', async () => {
    mockedGetClubBySlug.mockResolvedValue(null)

    const response = await GET(
      new NextRequest('http://localhost/api/club/media?slug=missing')
    )

    expect(response.status).toBe(404)
  })

  it('returns paginated media results', async () => {
    mockedGetClubBySlug.mockResolvedValue({ id: 'club-1' } as never)
    mockedGetClubContributions.mockResolvedValue([
      createMediaItem('one'),
      createMediaItem('two'),
      createMediaItem('three'),
    ] as never)

    const response = await GET(
      new NextRequest(
        'http://localhost/api/club/media?slug=runexpression&limit=2&offset=1&tag=joy'
      )
    )

    expect(response.status).toBe(200)
    expect(mockedGetClubContributions).toHaveBeenCalledWith('club-1', {
      type: 'media',
      tag: 'joy',
      offset: 1,
      limit: 3,
    })

    const body = (await response.json()) as {
      items: { id: string }[]
      hasMore: boolean
      nextOffset: number
    }

    expect(body.items).toHaveLength(2)
    expect(body.items[0]?.id).toBe('one')
    expect(body.hasMore).toBe(true)
    expect(body.nextOffset).toBe(3)
  })
})
