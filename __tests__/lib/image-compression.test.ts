/**
 * Tests for client-side image compression utility
 */
import {
  compressImage,
  shouldCompressImage,
  maybeCompressImage,
} from '@/lib/image-compression'

// Mock canvas and context
const mockDrawImage = jest.fn()
const mockToBlob = jest.fn()

const mockContext = {
  drawImage: mockDrawImage,
  imageSmoothingEnabled: true,
  imageSmoothingQuality: 'high',
}

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: jest.fn(() => mockContext),
  toBlob: mockToBlob,
}

// Mock document.createElement for canvas
const originalCreateElement = document.createElement.bind(document)
document.createElement = jest.fn((tagName: string) => {
  if (tagName === 'canvas') {
    return mockCanvas as unknown as HTMLCanvasElement
  }
  return originalCreateElement(tagName)
})

// Mock Image
class MockImage {
  onload: (() => void) | null = null
  onerror: ((error: Error) => void) | null = null
  src = ''
  width = 1920
  height = 1080

  constructor() {
    // Simulate async image loading
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 0)
  }
}

// @ts-expect-error - Mocking global Image
global.Image = MockImage

describe('Image Compression', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCanvas.width = 0
    mockCanvas.height = 0
  })

  describe('shouldCompressImage', () => {
    it('returns true for large JPEG images', () => {
      const file = new File(['x'.repeat(200 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })
      expect(shouldCompressImage(file)).toBe(true)
    })

    it('returns true for large PNG images', () => {
      const file = new File(['x'.repeat(200 * 1024)], 'test.png', {
        type: 'image/png',
      })
      expect(shouldCompressImage(file)).toBe(true)
    })

    it('returns true for large WebP images', () => {
      const file = new File(['x'.repeat(200 * 1024)], 'test.webp', {
        type: 'image/webp',
      })
      expect(shouldCompressImage(file)).toBe(true)
    })

    it('returns false for small images (< 100KB)', () => {
      const file = new File(['x'.repeat(50 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })
      expect(shouldCompressImage(file)).toBe(false)
    })

    it('returns false for non-image files', () => {
      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      })
      expect(shouldCompressImage(file)).toBe(false)
    })

    it('returns false for HEIC images (not directly compressible)', () => {
      const file = new File(['x'.repeat(200 * 1024)], 'test.heic', {
        type: 'image/heic',
      })
      expect(shouldCompressImage(file)).toBe(false)
    })

    it('returns false for GIF images', () => {
      const file = new File(['x'.repeat(200 * 1024)], 'test.gif', {
        type: 'image/gif',
      })
      expect(shouldCompressImage(file)).toBe(false)
    })
  })

  describe('compressImage', () => {
    it('throws error for non-image files', async () => {
      const file = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      })

      await expect(compressImage(file)).rejects.toThrow('File is not an image')
    })

    it('compresses image and returns result', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      // Mock successful blob creation
      const mockBlob = new Blob(['compressed'], { type: 'image/jpeg' })
      mockToBlob.mockImplementation(
        (callback: BlobCallback, _type: string, _quality: number) => {
          callback(mockBlob)
        }
      )

      const result = await compressImage(file)

      expect(result.blob).toBe(mockBlob)
      expect(result.file).toBeInstanceOf(File)
      expect(result.file.type).toBe('image/jpeg')
      expect(result.originalSize).toBe(file.size)
      expect(result.compressedSize).toBe(mockBlob.size)
    })

    it('respects maxDimension option', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      const mockBlob = new Blob(['compressed'], { type: 'image/jpeg' })
      mockToBlob.mockImplementation((callback: BlobCallback) => {
        callback(mockBlob)
      })

      await compressImage(file, { maxDimension: 1024 })

      // Canvas should be set to scaled dimensions
      expect(mockCanvas.width).toBeLessThanOrEqual(1024)
      expect(mockCanvas.height).toBeLessThanOrEqual(1024)
    })

    it('maintains aspect ratio when scaling', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      const mockBlob = new Blob(['compressed'], { type: 'image/jpeg' })
      mockToBlob.mockImplementation((callback: BlobCallback) => {
        callback(mockBlob)
      })

      // MockImage has 1920x1080 (16:9 aspect ratio)
      await compressImage(file, { maxDimension: 1024 })

      // Should scale to 1024x576 to maintain 16:9
      const aspectRatio = mockCanvas.width / mockCanvas.height
      expect(Math.abs(aspectRatio - 16 / 9)).toBeLessThan(0.01)
    })

    it('uses specified output format', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.png', {
        type: 'image/png',
      })

      const mockBlob = new Blob(['compressed'], { type: 'image/webp' })
      mockToBlob.mockImplementation((callback: BlobCallback) => {
        callback(mockBlob)
      })

      const result = await compressImage(file, { outputFormat: 'image/webp' })

      expect(mockToBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/webp',
        expect.any(Number)
      )
      expect(result.file.name).toContain('.webp')
    })

    it('uses specified quality', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      const mockBlob = new Blob(['compressed'], { type: 'image/jpeg' })
      mockToBlob.mockImplementation((callback: BlobCallback) => {
        callback(mockBlob)
      })

      await compressImage(file, { quality: 0.7 })

      expect(mockToBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.7
      )
    })

    it('throws error when canvas context is unavailable', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      mockCanvas.getContext.mockReturnValueOnce(null)

      await expect(compressImage(file)).rejects.toThrow(
        'Failed to get canvas context'
      )
    })

    it('throws error when blob creation fails', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      mockToBlob.mockImplementation((callback: BlobCallback) => {
        callback(null)
      })

      await expect(compressImage(file)).rejects.toThrow(
        'Failed to compress image'
      )
    })
  })

  describe('maybeCompressImage', () => {
    it('returns original file when compression not needed', async () => {
      const file = new File(['small'], 'test.jpg', {
        type: 'image/jpeg',
      })

      const result = await maybeCompressImage(file)

      expect(result.file).toBe(file)
      expect(result.wasCompressed).toBe(false)
      expect(result.stats).toBeUndefined()
    })

    it('returns original file for non-compressible types', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.heic', {
        type: 'image/heic',
      })

      const result = await maybeCompressImage(file)

      expect(result.file).toBe(file)
      expect(result.wasCompressed).toBe(false)
    })

    it('compresses large images', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      // Mock compressed result smaller than original
      const mockBlob = new Blob(['x'.repeat(100 * 1024)], { type: 'image/jpeg' })
      mockToBlob.mockImplementation((callback: BlobCallback) => {
        callback(mockBlob)
      })

      const result = await maybeCompressImage(file)

      expect(result.wasCompressed).toBe(true)
      expect(result.stats).toBeDefined()
      expect(result.file.size).toBeLessThan(file.size)
    })

    it('returns original if compressed is larger', async () => {
      const file = new File(['x'.repeat(200 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      // Mock compressed result larger than original
      const mockBlob = new Blob(['x'.repeat(300 * 1024)], { type: 'image/jpeg' })
      mockToBlob.mockImplementation((callback: BlobCallback) => {
        callback(mockBlob)
      })

      const result = await maybeCompressImage(file)

      expect(result.file).toBe(file)
      expect(result.wasCompressed).toBe(false)
    })

    it('handles compression errors gracefully', async () => {
      const file = new File(['x'.repeat(500 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      mockCanvas.getContext.mockReturnValueOnce(null)
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const result = await maybeCompressImage(file)

      expect(result.file).toBe(file)
      expect(result.wasCompressed).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})
