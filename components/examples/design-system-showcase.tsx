'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-run-neutral-50 py-12 px-6">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <header className="space-y-4 text-center">
          <h1 className="font-mono text-4xl md:text-6xl text-run-primary-900">
            RunExpression Design System
          </h1>
          <p className="font-sans text-lg md:text-xl text-run-primary-700 leading-relaxed max-w-3xl mx-auto">
            The visual language for expressive runners. Built with sage green wisdom,
            purple flow energy, and monospace character.
          </p>
        </header>

        {/* Typography Section */}
        <section className="space-y-8">
          <div className="border-b border-run-primary-200 pb-4">
            <h2 className="font-mono text-3xl text-run-primary-900">Typography</h2>
            <p className="mt-2 font-sans text-run-primary-600">
              DM Mono for UI elements, Merriweather for body content
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* DM Mono Examples */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-run-primary-900">
                  DM Mono (UI Elements)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="font-mono text-5xl text-run-primary-900">
                  The Flow
                </div>
                <div className="font-mono text-2xl text-run-primary-800">
                  Leave Heavy
                </div>
                <div className="font-mono text-lg text-run-primary-700">
                  Return Light
                </div>
                <div className="font-mono text-base text-run-primary-600">
                  Button Labels & Form Fields
                </div>
                <div className="font-mono text-sm text-run-neutral-400">
                  Metadata & Timestamps
                </div>
              </CardContent>
            </Card>

            {/* Merriweather Examples */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-run-primary-900">
                  Merriweather (Body Content)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-sans text-lg text-run-primary-900 leading-relaxed">
                  We believe running is not just a physical act; it is a creative one.
                </p>
                <p className="font-sans text-base text-run-primary-800 leading-relaxed">
                  Leave heavy. Return light. It's the most predictable magic trick your body knows.
                </p>
                <p className="font-sans text-sm text-run-primary-700 leading-relaxed">
                  Your squad is your battery pack. We run together, we transform together.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Brand Colors Section */}
        <section className="space-y-8">
          <div className="border-b border-run-primary-200 pb-4">
            <h2 className="font-mono text-3xl text-run-primary-900">Brand Colors</h2>
            <p className="mt-2 font-sans text-run-primary-600">
              Sage green (trust, growth), purple (flow, transformation), cream (warmth)
            </p>
          </div>

          {/* Sage Green Palette */}
          <div className="space-y-4">
            <h3 className="font-mono text-xl text-run-primary-900">Primary (Sage Green)</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-50 border border-run-primary-200"></div>
                <p className="font-mono text-xs text-center">50</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-100 border border-run-primary-200"></div>
                <p className="font-mono text-xs text-center">100</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-200 border border-run-primary-300"></div>
                <p className="font-mono text-xs text-center">200</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-300 border border-run-primary-400"></div>
                <p className="font-mono text-xs text-center">300</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-400 border border-run-primary-500"></div>
                <p className="font-mono text-xs text-center">400</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-500 border border-run-primary-600"></div>
                <p className="font-mono text-xs text-center text-white">500</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-600 border border-run-primary-700"></div>
                <p className="font-mono text-xs text-center text-white">600</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-700 border border-run-primary-800"></div>
                <p className="font-mono text-xs text-center text-white">700</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-800 border border-run-primary-900"></div>
                <p className="font-mono text-xs text-center text-white">800</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-primary-900"></div>
                <p className="font-mono text-xs text-center text-white">900</p>
              </div>
            </div>
          </div>

          {/* Purple Palette */}
          <div className="space-y-4">
            <h3 className="font-mono text-xl text-run-primary-900">Accent (Purple)</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-50 border border-run-accent-200"></div>
                <p className="font-mono text-xs text-center">50</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-100 border border-run-accent-200"></div>
                <p className="font-mono text-xs text-center">100</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-200 border border-run-accent-300"></div>
                <p className="font-mono text-xs text-center">200</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-300 border border-run-accent-400"></div>
                <p className="font-mono text-xs text-center">300</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-400 border border-run-accent-500"></div>
                <p className="font-mono text-xs text-center">400</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-500 border border-run-accent-600"></div>
                <p className="font-mono text-xs text-center text-white">500</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-600 border border-run-accent-700"></div>
                <p className="font-mono text-xs text-center text-white">600</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-700 border border-run-accent-800"></div>
                <p className="font-mono text-xs text-center text-white">700</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-800 border border-run-accent-900"></div>
                <p className="font-mono text-xs text-center text-white">800</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-accent-900"></div>
                <p className="font-mono text-xs text-center text-white">900</p>
              </div>
            </div>
          </div>

          {/* Cream Palette */}
          <div className="space-y-4">
            <h3 className="font-mono text-xl text-run-primary-900">Neutral (Cream)</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-neutral-0 border border-run-neutral-300"></div>
                <p className="font-mono text-xs text-center">0 (white)</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-neutral-50 border border-run-neutral-300"></div>
                <p className="font-mono text-xs text-center">50</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-neutral-100 border border-run-neutral-300"></div>
                <p className="font-mono text-xs text-center">100</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-neutral-200 border border-run-neutral-300"></div>
                <p className="font-mono text-xs text-center">200</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-neutral-300 border border-run-neutral-400"></div>
                <p className="font-mono text-xs text-center">300</p>
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-lg bg-run-neutral-400 border border-run-primary-300"></div>
                <p className="font-mono text-xs text-center">400</p>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-8">
          <div className="border-b border-run-primary-200 pb-4">
            <h2 className="font-mono text-3xl text-run-primary-900">Buttons</h2>
            <p className="mt-2 font-sans text-run-primary-600">
              All button variants with brand styling
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Default/Primary */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Default (Primary)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full font-mono">Share Your Run</Button>
                <Button className="w-full font-mono" size="sm">
                  Small Button
                </Button>
                <Button className="w-full font-mono" size="lg">
                  Large Button
                </Button>
              </CardContent>
            </Card>

            {/* Secondary */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Secondary (Accent)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="secondary" className="w-full font-mono">
                  Enter The Flow
                </Button>
                <Button variant="secondary" className="w-full font-mono" size="sm">
                  Small Secondary
                </Button>
                <Button variant="secondary" className="w-full font-mono" size="lg">
                  Large Secondary
                </Button>
              </CardContent>
            </Card>

            {/* Outline */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Outline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full font-mono">
                  Cancel
                </Button>
                <Button variant="outline" className="w-full font-mono" size="sm">
                  Small Outline
                </Button>
                <Button variant="outline" className="w-full font-mono" size="lg">
                  Large Outline
                </Button>
              </CardContent>
            </Card>

            {/* Ghost */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Ghost
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full font-mono">
                  View More
                </Button>
                <Button variant="ghost" className="w-full font-mono" size="sm">
                  Small Ghost
                </Button>
                <Button variant="ghost" className="w-full font-mono" size="lg">
                  Large Ghost
                </Button>
              </CardContent>
            </Card>

            {/* Destructive */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Destructive
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" className="w-full font-mono">
                  Delete Post
                </Button>
                <Button variant="destructive" className="w-full font-mono" size="sm">
                  Small Destructive
                </Button>
                <Button variant="destructive" className="w-full font-mono" size="lg">
                  Large Destructive
                </Button>
              </CardContent>
            </Card>

            {/* Brand Customizations */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Brand Variants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full font-mono bg-run-primary-500 hover:bg-run-primary-600">
                  Sage CTA
                </Button>
                <Button className="w-full font-mono bg-run-accent-500 hover:bg-run-accent-600">
                  Purple Flow
                </Button>
                <Button className="w-full font-mono bg-run-primary-500 hover:bg-run-primary-600 glow-purple transition-all duration-300">
                  Glow Effect
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-8">
          <div className="border-b border-run-primary-200 pb-4">
            <h2 className="font-mono text-3xl text-run-primary-900">Cards</h2>
            <p className="mt-2 font-sans text-run-primary-600">
              Default, organic, and flow card variants
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Default Card */}
            <Card className="border-run-primary-100 bg-run-neutral-0">
              <CardHeader>
                <CardTitle className="font-mono text-run-primary-900">
                  Default Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-run-primary-700 leading-relaxed">
                  Standard card with border and background. Clean and professional.
                </p>
              </CardContent>
            </Card>

            {/* Organic Card */}
            <Card className="border-run-primary-100 bg-run-neutral-0 organic-edges">
              <CardHeader>
                <CardTitle className="font-mono text-run-primary-900">
                  Organic Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-run-primary-700 leading-relaxed">
                  Hand-drawn border radius for personality and warmth.
                </p>
              </CardContent>
            </Card>

            {/* Flow Card */}
            <Card className="border-run-primary-100 bg-run-neutral-0 organic-edges hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-mono text-run-primary-900">
                  Flow Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-run-primary-700 leading-relaxed">
                  Interactive card with hover effects and transitions.
                </p>
              </CardContent>
            </Card>

            {/* Glow Card */}
            <Card className="border-run-accent-300 bg-run-neutral-0 glow-purple">
              <CardHeader>
                <CardTitle className="font-mono text-run-primary-900">
                  Purple Glow Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-run-primary-700 leading-relaxed">
                  Purple glow effect for emphasis and energy.
                </p>
              </CardContent>
            </Card>

            {/* Sage Glow Card */}
            <Card className="border-run-primary-300 bg-run-neutral-0 glow-sage">
              <CardHeader>
                <CardTitle className="font-mono text-run-primary-900">
                  Sage Glow Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-run-primary-700 leading-relaxed">
                  Sage glow effect for trust and growth.
                </p>
              </CardContent>
            </Card>

            {/* Gradient Card */}
            <Card className="border-0 flow-gradient text-white">
              <CardHeader>
                <CardTitle className="font-mono">
                  Flow Gradient Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-sans leading-relaxed opacity-95">
                  Signature gradient: sage to purple to sage.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Utilities Section */}
        <section className="space-y-8">
          <div className="border-b border-run-primary-200 pb-4">
            <h2 className="font-mono text-3xl text-run-primary-900">Utilities</h2>
            <p className="mt-2 font-sans text-run-primary-600">
              Glow effects, organic edges, gradients, and animations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Glow Effects */}
            <div className="space-y-4">
              <h3 className="font-mono text-xl text-run-primary-900">Glow Effects</h3>
              <div className="space-y-4">
                <div className="p-6 bg-run-neutral-0 border border-run-accent-300 rounded-lg glow-purple">
                  <p className="font-mono text-sm text-run-accent-700">
                    .glow-purple
                  </p>
                  <p className="font-sans text-xs text-run-primary-600 mt-2">
                    Purple glow for energy and flow
                  </p>
                </div>
                <div className="p-6 bg-run-neutral-0 border border-run-primary-300 rounded-lg glow-sage">
                  <p className="font-mono text-sm text-run-primary-700">
                    .glow-sage
                  </p>
                  <p className="font-sans text-xs text-run-primary-600 mt-2">
                    Sage glow for trust and growth
                  </p>
                </div>
              </div>
            </div>

            {/* Organic Edges */}
            <div className="space-y-4">
              <h3 className="font-mono text-xl text-run-primary-900">Organic Edges</h3>
              <div className="space-y-4">
                <div className="p-6 bg-run-neutral-0 border-2 border-run-primary-300 organic-edges">
                  <p className="font-mono text-sm text-run-primary-700">
                    .organic-edges
                  </p>
                  <p className="font-sans text-xs text-run-primary-600 mt-2">
                    Hand-drawn border radius (large)
                  </p>
                </div>
                <div className="p-6 bg-run-neutral-0 border-2 border-run-primary-300 organic-edges-sm">
                  <p className="font-mono text-sm text-run-primary-700">
                    .organic-edges-sm
                  </p>
                  <p className="font-sans text-xs text-run-primary-600 mt-2">
                    Hand-drawn border radius (small)
                  </p>
                </div>
              </div>
            </div>

            {/* Flow Gradient */}
            <div className="space-y-4">
              <h3 className="font-mono text-xl text-run-primary-900">Flow Gradient</h3>
              <div className="p-8 flow-gradient rounded-lg text-white">
                <p className="font-mono text-lg">
                  .flow-gradient
                </p>
                <p className="font-sans text-sm mt-2 opacity-95">
                  Signature gradient: sage → purple → sage
                </p>
              </div>
            </div>

            {/* Animations */}
            <div className="space-y-4">
              <h3 className="font-mono text-xl text-run-primary-900">Animations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-run-neutral-0 border border-run-accent-300 rounded-lg animate-glow-pulse">
                  <p className="font-mono text-xs text-center text-run-accent-700">
                    .animate-glow-pulse
                  </p>
                </div>
                <div className="p-4 bg-run-neutral-0 border border-run-primary-300 rounded-lg animate-float">
                  <p className="font-mono text-xs text-center text-run-primary-700">
                    .animate-float
                  </p>
                </div>
                <div className="p-4 bg-run-neutral-0 border border-run-primary-300 rounded-lg animate-fade-in">
                  <p className="font-mono text-xs text-center text-run-primary-700">
                    .animate-fade-in
                  </p>
                </div>
                <div className="p-4 bg-run-neutral-0 border border-run-primary-300 rounded-lg animate-slide-up">
                  <p className="font-mono text-xs text-center text-run-primary-700">
                    .animate-slide-up
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section className="space-y-8">
          <div className="border-b border-run-primary-200 pb-4">
            <h2 className="font-mono text-3xl text-run-primary-900">Forms</h2>
            <p className="mt-2 font-sans text-run-primary-600">
              Inputs with sage focus rings and brand styling
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Text Input */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Text Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="font-mono text-sm font-medium text-run-primary-900">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="runner@example.com"
                    className="border-run-primary-100 focus:border-run-primary-500 focus:ring-run-primary-500 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="font-mono text-sm font-medium text-run-primary-900">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="@runner_name"
                    className="border-run-primary-100 focus:border-run-primary-500 focus:ring-run-primary-500 font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Textarea */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Textarea
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="content" className="font-mono text-sm font-medium text-run-primary-900">
                    What did you discover?
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Today, I ran for..."
                    rows={4}
                    className="border-run-primary-100 focus:border-run-primary-500 font-sans resize-none"
                  />
                  <p className="text-xs text-run-neutral-400 font-mono">
                    Share your running wisdom with the community
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Error State */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Error State
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="error-email" className="font-mono text-sm text-run-primary-900">
                    Email
                  </label>
                  <Input
                    id="error-email"
                    type="email"
                    className="border-red-500 focus:ring-red-500"
                    defaultValue="invalid-email"
                  />
                  <p className="text-sm text-red-600 font-mono">
                    Please enter a valid email address
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disabled State */}
            <Card className="border-run-primary-100">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-run-primary-900">
                  Disabled State
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="disabled-input" className="font-mono text-sm text-run-neutral-400">
                    Disabled Input
                  </label>
                  <Input
                    id="disabled-input"
                    type="text"
                    disabled
                    placeholder="Cannot edit"
                    className="font-mono"
                  />
                  <Button disabled className="w-full font-mono opacity-50">
                    Submit (5 character minimum)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-run-primary-200 pt-8 text-center">
          <p className="font-sans text-run-primary-600">
            Built with the RunExpression Design System
          </p>
          <p className="font-mono text-sm text-run-neutral-400 mt-2">
            Version 1.0 • January 2026
          </p>
        </footer>
      </div>
    </div>
  )
}
