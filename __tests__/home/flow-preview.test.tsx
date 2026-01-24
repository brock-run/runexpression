import { render, screen } from '@testing-library/react'
import { FlowPreview } from '@/components/home/flow-preview'

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
  }
})

// Mock window.matchMedia for reduced motion detection
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

// Mock requestAnimationFrame for auto-scroll testing
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('FlowPreview', () => {
  it('renders the section headline', () => {
    render(<FlowPreview />)

    expect(
      screen.getByRole('heading', { name: /what are we running for today/i })
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<FlowPreview />)

    expect(
      screen.getByText(/you are not alone on the road/i)
    ).toBeInTheDocument()
  })

  it('renders seed expressions', () => {
    render(<FlowPreview />)

    // Check for some of the seed expressions
    expect(screen.getAllByText(/sanity/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/the bacon/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/connection/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the CTA button', () => {
    render(<FlowPreview />)

    const ctaLink = screen.getByRole('link', { name: /add your voice/i })
    expect(ctaLink).toHaveAttribute('href', '/flow')
  })

  it('has proper section structure', () => {
    const { container } = render(<FlowPreview />)

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('contains multiple expression cards', () => {
    render(<FlowPreview />)

    // The expressions are displayed in italic text
    const expressions = document.querySelectorAll('.italic')
    expect(expressions.length).toBeGreaterThan(10) // Should have many expressions
  })
})
