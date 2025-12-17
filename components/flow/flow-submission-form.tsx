'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { VIBE_TAGS, TEXT_LIMITS } from '@/lib/constants'
import { Upload, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type SubmissionType = 'text' | 'image'

export function FlowSubmissionForm() {
  const router = useRouter()
  const [submissionType, setSubmissionType] = useState<SubmissionType>('text')
  const [content, setContent] = useState('')
  const [contentLong, setContentLong] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setImageFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate based on type
      if (submissionType === 'text' && !content.trim()) {
        throw new Error('Please share what your run expressed')
      }

      if (submissionType === 'image' && !imageFile) {
        throw new Error('Please select an image')
      }

      if (submissionType === 'image' && !content.trim()) {
        throw new Error('Please add a caption for your image')
      }

      // Prepare form data
      const formData = new FormData()
      formData.append('type', submissionType)
      formData.append('content', content)
      formData.append('content_long', contentLong)
      formData.append('vibe_tags', JSON.stringify(selectedTags))

      if (imageFile) {
        formData.append('image', imageFile)
      }

      // Submit to API
      const response = await fetch('/api/flow/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit expression')
      }

      // Success!
      setSubmitSuccess(true)

      // Reset form after a delay
      setTimeout(() => {
        setContent('')
        setContentLong('')
        setSelectedTags([])
        setImageFile(null)
        setImagePreview(null)
        setSubmitSuccess(false)
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contentCharsRemaining = TEXT_LIMITS.FLOW_SHORT - content.length
  const longCharsRemaining = TEXT_LIMITS.FLOW_LONG - contentLong.length

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">How do you want to express?</Label>
        <RadioGroup
          value={submissionType}
          onValueChange={(value) => setSubmissionType(value as SubmissionType)}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="text" id="text" className="peer sr-only" />
            <Label
              htmlFor="text"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-neutral-200 bg-white p-4 hover:bg-neutral-50 peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-50"
            >
              <span className="text-sm font-medium">Text</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="image" id="image" className="peer sr-only" />
            <Label
              htmlFor="image"
              className="flex cursor-pointer items-center justify-center rounded-md border-2 border-neutral-200 bg-white p-4 hover:bg-neutral-50 peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-50"
            >
              <span className="text-sm font-medium">Image</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Text Mode */}
      {submissionType === 'text' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="content">Your Expression</Label>
            <Textarea
              id="content"
              placeholder="Today, I ran for..."
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, TEXT_LIMITS.FLOW_SHORT))}
              className="mt-2 min-h-[120px] resize-none"
              maxLength={TEXT_LIMITS.FLOW_SHORT}
              required
            />
            <p className="mt-1 text-sm text-neutral-500">
              {contentCharsRemaining} characters remaining
            </p>
          </div>

          <div>
            <Label htmlFor="content_long">Want to say more? (Optional)</Label>
            <Textarea
              id="content_long"
              placeholder="The longer story..."
              value={contentLong}
              onChange={(e) =>
                setContentLong(e.target.value.slice(0, TEXT_LIMITS.FLOW_LONG))
              }
              className="mt-2 min-h-[120px] resize-none"
              maxLength={TEXT_LIMITS.FLOW_LONG}
            />
            <p className="mt-1 text-sm text-neutral-500">
              {longCharsRemaining} characters remaining
            </p>
          </div>
        </div>
      )}

      {/* Image Mode */}
      {submissionType === 'image' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-64 w-full rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
                >
                  <Upload className="mb-2 h-8 w-8 text-neutral-400" />
                  <span className="text-sm text-neutral-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="mt-1 text-xs text-neutral-500">
                    JPG, PNG up to 5MB
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="caption">Caption (Required)</Label>
            <Textarea
              id="caption"
              placeholder="What does this image express?"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, TEXT_LIMITS.FLOW_SHORT))}
              className="mt-2 min-h-[100px] resize-none"
              maxLength={TEXT_LIMITS.FLOW_SHORT}
              required
            />
            <p className="mt-1 text-sm text-neutral-500">
              {contentCharsRemaining} characters remaining
            </p>
          </div>
        </div>
      )}

      {/* Vibe Tags */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">
            Choose up to 3 vibe tags (Optional)
          </Label>
          <p className="mt-1 text-sm text-neutral-600">
            Help others find your expression
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium text-neutral-700">Mindset</h4>
            <div className="flex flex-wrap gap-2">
              {VIBE_TAGS.MINDSET.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer',
                    selectedTags.includes(tag)
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'hover:bg-neutral-100'
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-neutral-700">Context</h4>
            <div className="flex flex-wrap gap-2">
              {VIBE_TAGS.CONTEXT.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer',
                    selectedTags.includes(tag)
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'hover:bg-neutral-100'
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-neutral-700">Feeling</h4>
            <div className="flex flex-wrap gap-2">
              {VIBE_TAGS.FEELING.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer',
                    selectedTags.includes(tag)
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'hover:bg-neutral-100'
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {selectedTags.length === 3 && (
          <p className="text-sm text-neutral-500">
            Maximum of 3 tags selected. Deselect one to choose another.
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </Card>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <Card className="border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Your expression is joining the Flow!
            </p>
          </div>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-orange-600 text-white hover:bg-orange-700"
        disabled={isSubmitting || submitSuccess}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitSuccess ? 'Added to Flow!' : 'Add to the Flow'}
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Your expression will be reviewed to ensure it aligns with our community
        values before appearing on the wall.
      </p>
    </form>
  )
}
