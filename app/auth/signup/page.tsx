import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up | RunExpression',
  description: 'Create your RunExpression account',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-mono text-4xl font-bold text-sage-900 mb-2">
            Join RunExpression
          </h1>
          <p className="font-sans text-sage-700">
            Start your expressive running journey
          </p>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
