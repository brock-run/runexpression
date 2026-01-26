import '@testing-library/jest-dom'

// Only set up browser-specific mocks if window is defined (jsdom environment)
if (typeof window !== 'undefined') {
  // Mock matchMedia for components that use media queries
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock scrollTo for scroll animations
  window.scrollTo = jest.fn()

  // Mock URL.createObjectURL for file uploads
  if (typeof URL !== 'undefined') {
    URL.createObjectURL = jest.fn(() => 'mock-object-url')
    URL.revokeObjectURL = jest.fn()
  }
}

// Mock ResizeObserver (available in both environments)
if (typeof global !== 'undefined') {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

  // Mock IntersectionObserver for components with lazy loading or scroll detection
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }))
}
