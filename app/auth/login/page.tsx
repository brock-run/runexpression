import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | RunExpression',
  description: 'Sign in to your RunExpression account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-mono text-4xl font-bold text-run-primary-900">
            Welcome Back
          </h1>
          <p className="font-sans text-run-primary-700">
            Sign in to continue your expressive running journey
          </p>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
