import { render, screen } from '@testing-library/react'
import { ClubhouseTeaser } from '@/components/home/clubhouse-teaser'

// Mock framer-motion
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react')

  const MockMotionDiv = React.forwardRef(function MockMotionDiv(
    props: React.PropsWithChildren<Record<string, unknown>>,
    ref: React.Ref<HTMLDivElement>
  ) {
    const { children, ...rest } = props
    return React.createElement('div', { ...rest, ref }, children)
  })

  return {
    motion: {
      div: MockMotionDiv,
    },
    useInView: () => true,
    useAnimation: () => ({
      start: jest.fn(),
    }),
  }
})

describe('ClubhouseTeaser', () => {
  it('renders the main headline', () => {
    render(<ClubhouseTeaser />)

    expect(
      screen.getByRole('heading', { name: /welcome to the laboratory/i })
    ).toBeInTheDocument()
  })

  it('renders the body copy', () => {
    render(<ClubhouseTeaser />)

    expect(screen.getByText(/sage in the parking lot/i)).toBeInTheDocument()
  })

  it('renders the callout', () => {
    render(<ClubhouseTeaser />)

    expect(screen.getByText(/this is an invitation/i)).toBeInTheDocument()
    expect(
      screen.getByText(/not to run faster, but to run deeper/i)
    ).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    render(<ClubhouseTeaser />)

    const ctaLink = screen.getByRole('link', { name: /visit the clubhouse/i })
    expect(ctaLink).toHaveAttribute('href', '/club/dwtc')
  })

  it('renders the footer tagline', () => {
    render(<ClubhouseTeaser />)

    expect(screen.getByText(/where lore lives/i)).toBeInTheDocument()
  })

  it('has proper section structure', () => {
    const { container } = render(<ClubhouseTeaser />)

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('uses dark theme styling', () => {
    const { container } = render(<ClubhouseTeaser />)

    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-run-black')
    expect(section).toHaveClass('text-run-white')
  })
})
