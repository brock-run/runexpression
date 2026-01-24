import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | RunExpression',
  description: 'Sign in to your RunExpression account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-mono text-4xl font-bold text-sage-900 mb-2">
            Welcome Back
          </h1>
          <p className="font-sans text-sage-700">
            Sign in to continue your expressive running journey
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
