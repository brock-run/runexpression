import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password | RunExpression',
  description: 'Reset your RunExpression password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-mono text-4xl font-bold text-run-primary-900">
            Reset Password
          </h1>
          <p className="font-sans text-run-primary-700">
            We&apos;ll send you a link to reset your password
          </p>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
