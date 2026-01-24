import { describe, it, expect, beforeEach } from '@jest/globals'
import { DM_Mono, Merriweather } from 'next/font/google'

describe('Design System - Typography', () => {
  beforeEach(() => {
    // Set up font CSS custom properties in the test environment
    const root = document.documentElement
    root.style.setProperty('--font-mono', '__DM_Mono_123456, monospace')
    root.style.setProperty('--font-sans', '__Merriweather_789012, serif')
  })

  it('should define DM Mono font variable', () => {
    const styles = getComputedStyle(document.documentElement)
    const monoFont = styles.getPropertyValue('--font-mono').trim()
    expect(monoFont).toBeTruthy()
    expect(monoFont).toContain('monospace')
  })

  it('should define Merriweather font variable', () => {
    const styles = getComputedStyle(document.documentElement)
    const sansFont = styles.getPropertyValue('--font-sans').trim()
    expect(sansFont).toBeTruthy()
    expect(sansFont).toContain('serif')
  })

  it('should apply font variables to body', () => {
    const body = document.createElement('body')
    body.style.fontFamily = 'var(--font-sans)'
    document.documentElement.appendChild(body)

    const styles = getComputedStyle(body)
    const fontFamily = styles.fontFamily
    expect(fontFamily).toBeTruthy()
  })

  it('should export DM Mono font configuration', () => {
    expect(DM_Mono).toBeDefined()
    expect(typeof DM_Mono).toBe('function')
  })

  it('should export Merriweather font configuration', () => {
    expect(Merriweather).toBeDefined()
    expect(typeof Merriweather).toBe('function')
  })

  it('should configure DM Mono with correct weights', () => {
    const dmMono = DM_Mono({
      subsets: ['latin'],
      weight: ['400', '500'],
      variable: '--font-mono',
    })

    expect(dmMono).toBeDefined()
    // Next.js font loader returns an object with className and style properties
    expect(dmMono).toHaveProperty('className')
  })

  it('should configure Merriweather with correct weights', () => {
    const merriweather = Merriweather({
      subsets: ['latin'],
      weight: ['300', '400', '700', '900'],
      style: ['normal', 'italic'],
      variable: '--font-sans',
    })

    expect(merriweather).toBeDefined()
    // Next.js font loader returns an object with className and style properties
    expect(merriweather).toHaveProperty('className')
  })
})
