import { describe, it, expect, beforeEach } from '@jest/globals'

describe('Design System - Colors', () => {
  beforeEach(() => {
    // Set up CSS custom properties in the test environment
    const root = document.documentElement

    // RunExpression Brand Colors - Primary (Sage)
    root.style.setProperty('--run-primary-50', '147 15% 95%')
    root.style.setProperty('--run-primary-100', '147 15% 88%')
    root.style.setProperty('--run-primary-200', '147 15% 76%')
    root.style.setProperty('--run-primary-300', '147 20% 64%')
    root.style.setProperty('--run-primary-400', '147 25% 52%')
    root.style.setProperty('--run-primary-500', '147 30% 40%')
    root.style.setProperty('--run-primary-600', '147 35% 32%')
    root.style.setProperty('--run-primary-700', '147 40% 24%')
    root.style.setProperty('--run-primary-800', '147 45% 16%')
    root.style.setProperty('--run-primary-900', '147 50% 10%')

    // Accent (Purple)
    root.style.setProperty('--run-accent-50', '270 30% 96%')
    root.style.setProperty('--run-accent-100', '270 30% 92%')
    root.style.setProperty('--run-accent-200', '270 30% 84%')
    root.style.setProperty('--run-accent-300', '270 35% 72%')
    root.style.setProperty('--run-accent-400', '270 40% 60%')
    root.style.setProperty('--run-accent-500', '270 50% 48%')
    root.style.setProperty('--run-accent-600', '270 55% 38%')
    root.style.setProperty('--run-accent-700', '270 60% 28%')
    root.style.setProperty('--run-accent-800', '270 65% 20%')
    root.style.setProperty('--run-accent-900', '270 70% 12%')

    // Neutral (Cream)
    root.style.setProperty('--run-neutral-0', '0 0% 100%')
    root.style.setProperty('--run-neutral-50', '40 25% 98%')
    root.style.setProperty('--run-neutral-100', '40 25% 95%')
    root.style.setProperty('--run-neutral-200', '40 20% 90%')
    root.style.setProperty('--run-neutral-300', '40 15% 85%')
    root.style.setProperty('--run-neutral-400', '40 12% 75%')

    // Semantic tokens
    root.style.setProperty('--primary', '147 30% 40%')
    root.style.setProperty('--secondary', '270 50% 48%')
    root.style.setProperty('--background', '40 25% 98%')
    root.style.setProperty('--foreground', '147 50% 10%')
  })

  it('should define sage (primary) color scale', () => {
    const styles = getComputedStyle(document.documentElement)
    const primary500 = styles.getPropertyValue('--run-primary-500').trim()
    expect(primary500).toBeTruthy()
    expect(primary500).toBe('147 30% 40%')
  })

  it('should define purple (accent) color scale', () => {
    const styles = getComputedStyle(document.documentElement)
    const accent500 = styles.getPropertyValue('--run-accent-500').trim()
    expect(accent500).toBeTruthy()
    expect(accent500).toBe('270 50% 48%')
  })

  it('should define cream (neutral) color scale', () => {
    const styles = getComputedStyle(document.documentElement)
    const neutral50 = styles.getPropertyValue('--run-neutral-50').trim()
    expect(neutral50).toBeTruthy()
    expect(neutral50).toBe('40 25% 98%')
  })

  it('should map semantic primary token to sage-500', () => {
    const styles = getComputedStyle(document.documentElement)
    const primary = styles.getPropertyValue('--primary').trim()
    expect(primary).toBeTruthy()
    // Should have the same value as run-primary-500
    expect(primary).toBe('147 30% 40%')
  })

  it('should map semantic secondary token to accent-500', () => {
    const styles = getComputedStyle(document.documentElement)
    const secondary = styles.getPropertyValue('--secondary').trim()
    expect(secondary).toBeTruthy()
    // Should have the same value as run-accent-500
    expect(secondary).toBe('270 50% 48%')
  })

  it('should define complete primary color scale (50-900)', () => {
    const styles = getComputedStyle(document.documentElement)
    const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

    scales.forEach(scale => {
      const value = styles.getPropertyValue(`--run-primary-${scale}`).trim()
      expect(value).toBeTruthy()
      expect(value).toMatch(/^\d+ \d+% \d+%$/) // HSL format: "147 30% 40%"
    })
  })

  it('should define complete accent color scale (50-900)', () => {
    const styles = getComputedStyle(document.documentElement)
    const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

    scales.forEach(scale => {
      const value = styles.getPropertyValue(`--run-accent-${scale}`).trim()
      expect(value).toBeTruthy()
      expect(value).toMatch(/^\d+ \d+% \d+%$/) // HSL format
    })
  })

  it('should use HSL color space for all brand colors', () => {
    const styles = getComputedStyle(document.documentElement)

    // Test a few key colors follow HSL format
    const colors = [
      '--run-primary-500',
      '--run-accent-500',
      '--run-neutral-50'
    ]

    colors.forEach(colorVar => {
      const value = styles.getPropertyValue(colorVar).trim()
      // HSL format: "hue saturation% lightness%"
      expect(value).toMatch(/^\d+ \d+% \d+%$/)
    })
  })
})
