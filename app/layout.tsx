import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
