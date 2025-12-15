'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ALL_VIBE_TAGS, MAX_VIBE_TAGS, TEXT_LIMITS } from '@/lib/constants'

export function TextSubmissionForm() {
  const [content, setContent] = useState('')
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const contentCharsLeft = TEXT_LIMITS.FLOW_SHORT - content.length
  const noteCharsLeft = TEXT_LIMITS.FLOW_LONG - note.length

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < MAX_VIBE_TAGS) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/flow/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'text',
          content,
          note,
          vibeTags: selectedTags,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      // Success - reset form
      setContent('')
      setNote('')
      setSelectedTags([])
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
    content.trim().length >= 5 &&
    content.length <= TEXT_LIMITS.FLOW_SHORT &&
    selectedTags.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Expression Input */}
      <div className="space-y-2">
        <Label htmlFor="content">
          What did your run express today?
          <span className="text-destructive"> *</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Today, I ran for..."
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={TEXT_LIMITS.FLOW_SHORT}
          rows={4}
          className="resize-none"
          required
        />
        <p
          className={`text-sm ${contentCharsLeft < 50 ? 'text-destructive' : 'text-muted-foreground'}`}
        >
          {contentCharsLeft} characters remaining
        </p>
      </div>

      {/* Optional Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Add more context (optional)</Label>
        <Textarea
          id="note"
          placeholder="Tell us more about this run..."
          value={note}
          onChange={e => setNote(e.target.value)}
          maxLength={TEXT_LIMITS.FLOW_LONG}
          rows={3}
          className="resize-none"
        />
        <p className="text-sm text-muted-foreground">
          {noteCharsLeft} characters remaining
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
