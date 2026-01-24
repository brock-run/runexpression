import type { Metadata } from 'next'
import * as Sentry from '@sentry/nextjs'
import { DM_Mono, Merriweather } from 'next/font/google'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

import './globals.css'

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const baseMetadata: Metadata = {
  title: {
    default: 'RunExpression - Express Yourself Through Motion',
    template: '%s | RunExpression',
  },
  description:
    'Where runners express themselves through motion, community, and creative flow. Join the movement.',
  keywords: [
    'running',
    'community',
    'expression',
    'training',
    'running club',
    'flow',
  ],
  authors: [{ name: 'RunExpression' }],
  creator: 'RunExpression',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://runexpression.com',
    siteName: 'RunExpression',
    title: 'RunExpression - Express Yourself Through Motion',
    description:
      'Where runners express themselves through motion, community, and creative flow.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RunExpression - Express Yourself Through Motion',
    description:
      'Where runners express themselves through motion, community, and creative flow.',
  },
  robots: {
    index: true,
    follow: true,
  },
}


export function generateMetadata(): Metadata {
  const traceData = Sentry.getTraceData()
  return {
    ...baseMetadata,
    other: {
      ...(baseMetadata.other ?? {}),
      ...(traceData as Record<string, string>),
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmMono.variable} ${merriweather.variable}`}
    >
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
