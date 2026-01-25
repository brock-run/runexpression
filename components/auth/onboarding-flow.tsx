'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VIBE_TAGS } from '@/lib/constants'
import { Loader2 } from 'lucide-react'

const ONBOARDING_STEPS = ['welcome', 'profile', 'vibes', 'complete'] as const
type OnboardingStep = (typeof ONBOARDING_STEPS)[number]

export function OnboardingFlow() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [fullName, setFullName] = useState('')
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allVibes = [
    ...VIBE_TAGS.MINDSET,
    ...VIBE_TAGS.CONTEXT,
    ...VIBE_TAGS.FEELING,
  ]

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibe)
        ? prev.filter(v => v !== vibe)
        : prev.length < 5
          ? [...prev, vibe]
          : prev
    )
  }

  const handleNext = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(step)
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setStep(ONBOARDING_STEPS[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(step)
    if (currentIndex > 0) {
      setStep(ONBOARDING_STEPS[currentIndex - 1])
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Update profile with onboarding data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          expression_data: {
            favorite_vibes: selectedVibes,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        throw new Error('Failed to save profile. Please try again.')
      }

      // Redirect to the flow or home
      router.push('/flow')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Progress indicator */}
      <div className="mb-8 flex justify-center gap-2">
        {ONBOARDING_STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-2 w-12 rounded-full transition-colors ${
              ONBOARDING_STEPS.indexOf(step) >= i
                ? 'bg-orange-600'
                : 'bg-run-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Welcome Step */}
      {step === 'welcome' && (
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 text-6xl">🏃</div>
            <CardTitle className="font-mono text-3xl">
              Welcome to RunExpression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Where running becomes creative expression, community connection,
              and personal transformation.
            </p>
            <p className="text-muted-foreground">
              Let&apos;s set up your profile in just a few steps.
            </p>
            <Button
              size="lg"
              onClick={handleNext}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Profile Step */}
      {step === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-2xl">
              What should we call you?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="fullName">Display Name</Label>
              <Input
                id="fullName"
                placeholder="Your name or alias"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="mt-2"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                This is how you&apos;ll appear to other runners. You can change
                it later.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vibes Step */}
      {step === 'vibes' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-2xl">
              What vibes resonate with you?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Select up to 5 vibes that describe your running style. These help
              personalize your experience.
            </p>

            <div className="flex flex-wrap gap-2">
              {allVibes.map(vibe => (
                <Badge
                  key={vibe}
                  variant={selectedVibes.includes(vibe) ? 'default' : 'outline'}
                  className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                    selectedVibes.includes(vibe)
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'hover:bg-orange-50 hover:text-orange-600'
                  }`}
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              {selectedVibes.length}/5 selected
            </p>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 text-6xl">✨</div>
            <CardTitle className="font-mono text-3xl">
              You&apos;re all set!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Welcome to the community, {fullName || 'runner'}. Time to explore
              The Flow and connect with fellow expressive runners.
            </p>

            {selectedVibes.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Your vibes:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedVibes.map(vibe => (
                    <Badge key={vibe} className="bg-orange-600 text-white">
                      {vibe}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={loading}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Enter The Flow'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
