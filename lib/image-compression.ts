/**
 * Client-side image compression utility
 *
 * Uses the browser Canvas API to resize and compress images before upload.
 * This reduces storage costs and improves upload/load times.
 */

export interface CompressionOptions {
  /** Maximum width or height in pixels (default: 2048) */
  maxDimension?: number
  /** JPEG quality 0-1 (default: 0.85) */
  quality?: number
  /** Output format (default: 'image/jpeg') */
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'
}

export interface CompressionResult {
  /** Compressed file blob */
  blob: Blob
  /** Compressed file as File object */
  file: File
  /** Original file size in bytes */
  originalSize: number
  /** Compressed file size in bytes */
  compressedSize: number
  /** Compression ratio (compressed/original) */
  compressionRatio: number
  /** Final dimensions */
  width: number
  height: number
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxDimension: 2048,
  quality: 0.85,
  outputFormat: 'image/jpeg',
}

/**
 * Load an image file into an HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('Failed to load image'))
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height }
  }

  const ratio = Math.min(maxDimension / width, maxDimension / height)
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

/**
 * Compress an image file
 *
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise resolving to compression result
 *
 * @example
 * ```ts
 * const result = await compressImage(file, { maxDimension: 1920, quality: 0.8 })
 * // Use result.file for upload instead of original file
 * ```
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Skip compression for non-image files
  if (!file.type.startsWith('image/')) {
    throw new Error('File is not an image')
  }

  // Load the image
  const img = await loadImage(file)

  // Calculate new dimensions
  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    opts.maxDimension
  )

  // Create canvas and draw resized image
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Use high-quality image scaling
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Draw the image
  ctx.drawImage(img, 0, 0, width, height)

  // Convert to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      result => {
        if (result) {
          resolve(result)
        } else {
          reject(new Error('Failed to compress image'))
        }
      },
      opts.outputFormat,
      opts.quality
    )
  })

  // Determine file extension based on output format
  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  const ext = extMap[opts.outputFormat] || 'jpg'

  // Create new File object with appropriate name
  const originalName = file.name.replace(/\.[^.]+$/, '')
  const compressedFile = new File([blob], `${originalName}.${ext}`, {
    type: opts.outputFormat,
  })

  return {
    blob,
    file: compressedFile,
    originalSize: file.size,
    compressedSize: blob.size,
    compressionRatio: blob.size / file.size,
    width,
    height,
  }
}

/**
 * Check if a file should be compressed
 * Returns true for JPEG, PNG, and WebP images
 * Returns false for already small files or non-compressible formats
 */
export function shouldCompressImage(file: File): boolean {
  // Only compress standard image types
  const compressibleTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!compressibleTypes.includes(file.type)) {
    return false
  }

  // Skip compression for small files (< 100KB)
  const minSizeForCompression = 100 * 1024
  if (file.size < minSizeForCompression) {
    return false
  }

  return true
}

/**
 * Compress image if needed, otherwise return original
 * This is the main utility to use in upload handlers
 */
export async function maybeCompressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<{ file: File; wasCompressed: boolean; stats?: CompressionResult }> {
  if (!shouldCompressImage(file)) {
    return { file, wasCompressed: false }
  }

  try {
    const result = await compressImage(file, options)

    // Only use compressed version if it's actually smaller
    if (result.compressedSize < file.size) {
      return { file: result.file, wasCompressed: true, stats: result }
    }

    // Original was smaller, use it instead
    return { file, wasCompressed: false }
  } catch (error) {
    // On any error, fall back to original file
    console.warn('Image compression failed, using original:', error)
    return { file, wasCompressed: false }
  }
}
