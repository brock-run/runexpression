import React from 'react'
import { render, screen } from '@testing-library/react'
import { ClubhouseNav } from '@/components/clubhouse/clubhouse-nav'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/club/dwtc'),
}))

describe('ClubhouseNav', () => {
  it('renders all navigation links', () => {
    render(<ClubhouseNav slug="dwtc" />)

    expect(screen.getByRole('link', { name: /overview/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /lore/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /media/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resources/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /upload/i })).toBeInTheDocument()
  })

  it('renders correct href for each link', () => {
    render(<ClubhouseNav slug="dwtc" />)

    expect(screen.getByRole('link', { name: /overview/i })).toHaveAttribute(
      'href',
      '/club/dwtc'
    )
    expect(screen.getByRole('link', { name: /lore/i })).toHaveAttribute(
      'href',
      '/club/dwtc/lore'
    )
    expect(screen.getByRole('link', { name: /media/i })).toHaveAttribute(
      'href',
      '/club/dwtc/media'
    )
    expect(screen.getByRole('link', { name: /resources/i })).toHaveAttribute(
      'href',
      '/club/dwtc/resources'
    )
    expect(screen.getByRole('link', { name: /upload/i })).toHaveAttribute(
      'href',
      '/club/dwtc/upload'
    )
  })

  it('highlights active link based on pathname', () => {
    render(<ClubhouseNav slug="dwtc" />)

    // Overview should be active (pathname is /club/dwtc)
    const overviewLink = screen.getByRole('link', { name: /overview/i })
    expect(overviewLink).toHaveClass('bg-orange-600')
    expect(overviewLink).toHaveClass('text-white')
  })

  it('renders correctly for different club slugs', () => {
    render(<ClubhouseNav slug="some-other-club" />)

    expect(screen.getByRole('link', { name: /overview/i })).toHaveAttribute(
      'href',
      '/club/some-other-club'
    )
    expect(screen.getByRole('link', { name: /lore/i })).toHaveAttribute(
      'href',
      '/club/some-other-club/lore'
    )
  })
})
