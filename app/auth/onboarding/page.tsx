import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingFlow } from '@/components/auth/onboarding-flow'

export const metadata: Metadata = {
  title: 'Welcome | RunExpression',
  description: 'Complete your RunExpression profile setup',
}

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?next=/auth/onboarding')
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('expression_data')
    .eq('id', user.id)
    .single()

  const onboardingCompleted =
    profile?.expression_data &&
    typeof profile.expression_data === 'object' &&
    'onboarding_completed' in profile.expression_data &&
    profile.expression_data.onboarding_completed === true

  // Redirect to flow if onboarding already completed
  if (onboardingCompleted) {
    redirect('/flow')
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
        <OnboardingFlow />
      </Suspense>
    </div>
  )
}
