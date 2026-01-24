import { render, screen } from '@testing-library/react'
import { ManifestoChapters } from '@/components/home/manifesto-chapters'

// Mock framer-motion to avoid animation issues in tests
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

describe('ManifestoChapters', () => {
  it('renders all four manifesto chapters', () => {
    render(<ManifestoChapters />)

    // Check for all chapter numbers
    expect(screen.getByText('Chapter 01')).toBeInTheDocument()
    expect(screen.getByText('Chapter 02')).toBeInTheDocument()
    expect(screen.getByText('Chapter 03')).toBeInTheDocument()
    expect(screen.getByText('Chapter 04')).toBeInTheDocument()
  })

  it('renders chapter headlines', () => {
    render(<ManifestoChapters />)

    expect(
      screen.getByRole('heading', { name: /leave heavy\. return light\./i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /we take our fun very seriously/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /your squad is your battery pack/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /enlightenment smells like laundry/i,
      })
    ).toBeInTheDocument()
  })

  it('renders chapter body content', () => {
    render(<ManifestoChapters />)

    // Check for key phrases from each chapter
    expect(screen.getByText(/we run to change our minds/i)).toBeInTheDocument()
    expect(screen.getByText(/the bagel tastes better/i)).toBeInTheDocument()
    expect(
      screen.getByText(/we go farther when we go together/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/scrub the stress off our souls/i)
    ).toBeInTheDocument()
  })

  it('renders chapter navigation links', () => {
    render(<ManifestoChapters />)

    // Check for prompt links - these link to /flow
    expect(
      screen.getByRole('link', { name: /explore the mindset/i })
    ).toHaveAttribute('href', '/flow')
    expect(
      screen.getByRole('link', { name: /embrace the grind/i })
    ).toHaveAttribute('href', '/flow')

    // This links to /club/dwtc
    expect(
      screen.getByRole('link', { name: /find your crew/i })
    ).toHaveAttribute('href', '/club/dwtc')

    // This links to /library
    expect(
      screen.getByRole('link', { name: /bring it to life/i })
    ).toHaveAttribute('href', '/library')
  })

  it('has proper section structure', () => {
    const { container } = render(<ManifestoChapters />)

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('id', 'manifesto')
  })

  it('renders chapters with proper heading hierarchy', () => {
    render(<ManifestoChapters />)

    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings).toHaveLength(4)
  })
})
