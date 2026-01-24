import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/home/hero-section'

describe('HeroSection', () => {
  it('renders the main headline', () => {
    render(<HeroSection />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Make running mean more.'
    )
  })

  it('renders the subheadline', () => {
    render(<HeroSection />)

    expect(screen.getByText(/Turn your struggle into art/i)).toBeInTheDocument()
  })

  it('renders both CTA buttons', () => {
    render(<HeroSection />)

    expect(
      screen.getByRole('link', { name: /enter the flow/i })
    ).toHaveAttribute('href', '/flow')
    expect(
      screen.getByRole('link', { name: /visit the clubhouse/i })
    ).toHaveAttribute('href', '/club/dwtc')
  })

  it('renders scroll indicator', () => {
    render(<HeroSection />)

    // Check for the scroll indicator SVG
    const scrollIndicator = document.querySelector('svg')
    expect(scrollIndicator).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    const { container } = render(<HeroSection />)

    // Should be wrapped in a section element
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()

    // Should have heading hierarchy
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('is accessible with proper landmark', () => {
    const { container } = render(<HeroSection />)

    // Section should be present as a landmark
    const section = container.querySelector('section')
    expect(section).toHaveClass('min-h-[90vh]')
  })
})
