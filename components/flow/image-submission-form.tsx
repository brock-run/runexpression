'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ALL_VIBE_TAGS,
  MAX_VIBE_TAGS,
  TEXT_LIMITS,
  FILE_UPLOAD_LIMITS,
} from '@/lib/constants'

export function ImageSubmissionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const captionCharsLeft = TEXT_LIMITS.CLUBHOUSE_CAPTION - caption.length

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    const allowedTypes =
      FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]
    if (!allowedTypes.includes(selectedFile.type)) {
      setSubmitMessage({
        type: 'error',
        text: 'Please upload a JPG, PNG, or HEIC image.',
      })
      return
    }

    // Validate file size
    if (selectedFile.size > FILE_UPLOAD_LIMITS.MAX_IMAGE_SIZE) {
      setSubmitMessage({
        type: 'error',
        text: `Image must be less than ${FILE_UPLOAD_LIMITS.MAX_IMAGE_SIZE / 1024 / 1024}MB.`,
      })
      return
    }

    setFile(selectedFile)
    setSubmitMessage(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < MAX_VIBE_TAGS) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Compress image using compressorjs
      const Compressor = (await import('compressorjs')).default

      const compressedFile = await new Promise<File>((resolve, reject) => {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1920,
          maxHeight: 1920,
          convertSize: FILE_UPLOAD_LIMITS.COMPRESSED_IMAGE_TARGET,
          success: result => {
            const compressedFile = new File([result], file.name, {
              type: result.type,
            })
            resolve(compressedFile)
          },
          error: reject,
        })
      })

      // Upload to Supabase Storage
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('caption', caption)
      formData.append('vibeTags', JSON.stringify(selectedTags))

      const response = await fetch('/api/flow/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      // Success - reset form
      setFile(null)
      setPreview(null)
      setCaption('')
      setSelectedTags([])
      if (fileInputRef.current) fileInputRef.current.value = ''

      setSubmitMessage({
        type: 'success',
        text: 'Your expression is joining the Flow...',
      })
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid =
    file !== null &&
    caption.trim().length >= 5 &&
    caption.length <= TEXT_LIMITS.CLUBHOUSE_CAPTION &&
    selectedTags.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">
          Upload Image<span className="text-destructive"> *</span>
        </Label>

        {/* File Input */}
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept={FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            {file ? 'Change Image' : 'Choose Image'}
          </Button>
          {file && (
            <span className="text-sm text-muted-foreground">{file.name}</span>
          )}
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="relative mt-4 overflow-hidden rounded-lg border border-border">
            <Image
              src={preview}
              alt="Preview"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Caption Input */}
      <div className="space-y-2">
        <Label htmlFor="caption">
          Caption<span className="text-destructive"> *</span>
        </Label>
        <Textarea
          id="caption"
          placeholder="Describe your run..."
          value={caption}
          onChange={e => setCaption(e.target.value)}
          maxLength={TEXT_LIMITS.CLUBHOUSE_CAPTION}
          rows={3}
          className="resize-none"
          required
        />
        <p
          className={`text-sm ${captionCharsLeft < 50 ? 'text-destructive' : 'text-muted-foreground'}`}
        >
          {captionCharsLeft} characters remaining
        </p>
      </div>

      {/* Vibe Tags */}
      <div className="space-y-3">
        <Label>
          Select vibe tags (1-{MAX_VIBE_TAGS})
          <span className="text-destructive"> *</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {ALL_VIBE_TAGS.map(tag => {
            const isSelected = selectedTags.includes(tag)
            const isDisabled =
              !isSelected && selectedTags.length >= MAX_VIBE_TAGS

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={isDisabled}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'} ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
              >
                {tag}
              </button>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedTags.length} of {MAX_VIBE_TAGS} selected
        </p>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div
          className={`rounded-md p-4 ${
            submitMessage.type === 'success'
              ? 'bg-green-50 text-green-900'
              : 'bg-red-50 text-red-900'
          }`}
        >
          <p className="text-sm font-medium">{submitMessage.text}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Adding to the Flow...' : 'Add to the Flow'}
      </Button>
    </form>
  )
}
