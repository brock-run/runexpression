import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up | RunExpression',
  description: 'Create your RunExpression account',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-mono text-4xl font-bold text-run-primary-900">
            Join RunExpression
          </h1>
          <p className="font-sans text-run-primary-700">
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
