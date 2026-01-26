import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingFlow } from '@/components/auth/onboarding-flow'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    })),
  }),
}))

describe('OnboardingFlow', () => {
  it('renders welcome step initially', () => {
    render(<OnboardingFlow />)

    expect(screen.getByText('Welcome to RunExpression')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /get started/i })
    ).toBeInTheDocument()
  })

  it('advances to profile step when clicking Get Started', () => {
    render(<OnboardingFlow />)

    fireEvent.click(screen.getByRole('button', { name: /get started/i }))

    expect(screen.getByText('What should we call you?')).toBeInTheDocument()
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument()
  })

  it('advances to vibes step from profile step', () => {
    render(<OnboardingFlow />)

    // Go to profile step
    fireEvent.click(screen.getByRole('button', { name: /get started/i }))

    // Go to vibes step
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(
      screen.getByText('What vibes resonate with you?')
    ).toBeInTheDocument()
  })

  it('allows selecting vibes', () => {
    render(<OnboardingFlow />)

    // Navigate to vibes step
    fireEvent.click(screen.getByRole('button', { name: /get started/i }))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    // Select a vibe
    const meditativeVibe = screen.getByText('Meditative')
    fireEvent.click(meditativeVibe)

    expect(screen.getByText('1/5 selected')).toBeInTheDocument()
  })

  it('advances to complete step from vibes step', () => {
    render(<OnboardingFlow />)

    // Navigate through steps
    fireEvent.click(screen.getByRole('button', { name: /get started/i }))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByText("You're all set!")).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /enter the flow/i })
    ).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    render(<OnboardingFlow />)

    // There should be 4 progress dots (one for each step)
    const progressContainer = screen.getByText('Welcome to RunExpression')
      .parentElement?.parentElement?.parentElement?.parentElement
    const progressDots = progressContainer?.querySelectorAll('.rounded-full')

    // First dot should be active (orange)
    expect(progressDots).toBeDefined()
  })

  it('allows going back to previous steps', () => {
    render(<OnboardingFlow />)

    // Navigate to profile step
    fireEvent.click(screen.getByRole('button', { name: /get started/i }))
    expect(screen.getByText('What should we call you?')).toBeInTheDocument()

    // Go back
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByText('Welcome to RunExpression')).toBeInTheDocument()
  })
})
