'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { VibeTagSelector } from './vibe-tag-selector'
import { TEXT_LIMITS, FILE_UPLOAD_LIMITS } from '@/lib/constants'
import { Loader2, Plus, Upload, X, ImageIcon, Type } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubmissionDialogProps {
  children?: React.ReactNode
}

export function SubmissionDialog({ children }: SubmissionDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')
  const [content, setContent] = useState('')
  const [contentLong, setContentLong] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const supabase = createClient()

  const resetForm = useCallback(() => {
    setContent('')
    setContentLong('')
    setSelectedTags([])
    setSelectedImage(null)
    setImagePreview(null)
    setError(null)
    setActiveTab('text')
  }, [])

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      const allowedTypes: readonly string[] =
        FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a JPEG, PNG, or HEIC image.')
        setSelectedImage(null)
        setImagePreview(null)
        e.currentTarget.value = ''
        return
      }

      // Validate file size
      if (file.size > FILE_UPLOAD_LIMITS.MAX_IMAGE_SIZE) {
        setError('Image must be less than 5MB.')
        setSelectedImage(null)
        setImagePreview(null)
        e.currentTarget.value = ''
        return
      }

      setSelectedImage(file)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.onerror = () => {
        console.error('Failed to read image file')
        setError('Failed to read image. Please try again.')
        setSelectedImage(null)
        setImagePreview(null)
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const removeImage = useCallback(() => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to login
        router.push('/auth/login?next=/flow')
        return
      }

      let mediaUrl: string | null = null

      // Upload image if present
      if (selectedImage) {
        // Extract file extension, falling back to MIME type if no extension in filename
        let fileExt = selectedImage.name.includes('.')
          ? selectedImage.name.split('.').pop()
          : null
        if (!fileExt) {
          // Fall back to MIME type (e.g., 'image/jpeg' -> 'jpeg', 'image/heic' -> 'heic')
          const mimeExt = selectedImage.type.split('/').pop()
          if (!mimeExt) {
            throw new Error('Unable to determine file type. Please try again.')
          }
          fileExt = mimeExt
        }
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('flow-media')
          .upload(fileName, selectedImage, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw new Error('Failed to upload image. Please try again.')
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('flow-media').getPublicUrl(fileName)

        mediaUrl = publicUrl
      }

      // Determine expression type
      let type: 'text' | 'image' | 'photo_text' = 'text'
      if (selectedImage && content) {
        type = 'photo_text'
      } else if (selectedImage) {
        type = 'image'
      }

      // Create expression event
      const { error: insertError } = await supabase
        .from('expression_events')
        .insert({
          user_id: user.id,
          type,
          content: content || null,
          content_long: contentLong || null,
          media_url: mediaUrl,
          vibe_tags: selectedTags.length > 0 ? selectedTags : null,
          moderation_status: 'pending',
          visibility: 'pending',
        })

      if (insertError) {
        throw new Error('Failed to submit. Please try again.')
      }

      // Success
      resetForm()
      setOpen(false)

      // Show success message or refresh
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit =
    (activeTab === 'text' && content.trim().length > 0) ||
    (activeTab === 'image' && selectedImage !== null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="lg" className="fixed bottom-6 right-6 z-50 shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Add to Flow
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-2xl">
            Share Your Flow
          </DialogTitle>
          <DialogDescription>
            What are you running for today? Your submission will be reviewed
            before appearing.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={v => setActiveTab(v as 'text' | 'image')}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="gap-2">
              <Type className="h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Your expression</Label>
              <Textarea
                id="content"
                placeholder="What are you running for today?"
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={TEXT_LIMITS.FLOW_SHORT}
                className="min-h-[100px] resize-none"
              />
              <p className="text-right text-xs text-muted-foreground">
                {content.length}/{TEXT_LIMITS.FLOW_SHORT}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentLong">
                More context{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="contentLong"
                placeholder="Share more about your run or intention..."
                value={contentLong}
                onChange={e => setContentLong(e.target.value)}
                maxLength={TEXT_LIMITS.FLOW_LONG}
                className="min-h-[80px] resize-none"
              />
              <p className="text-right text-xs text-muted-foreground">
                {contentLong.length}/{TEXT_LIMITS.FLOW_LONG}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-4 space-y-4">
            {/* Image upload area */}
            <div className="space-y-2">
              <Label>Photo</Label>
              {imagePreview ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={removeImage}
                    aria-label="Remove uploaded image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                  aria-label="Upload an image. JPEG, PNG, or HEIC, maximum 5 megabytes."
                  className={cn(
                    'flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, or HEIC (max 5MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/heic"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Caption for image */}
            <div className="space-y-2">
              <Label htmlFor="imageCaption">
                Caption{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="imageCaption"
                placeholder="Add a caption..."
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={TEXT_LIMITS.FLOW_SHORT}
                className="min-h-[60px] resize-none"
              />
              <p className="text-right text-xs text-muted-foreground">
                {content.length}/{TEXT_LIMITS.FLOW_SHORT}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Vibe Tags */}
        <div className="mt-4">
          <Label className="mb-2 block">Vibe tags (optional)</Label>
          <VibeTagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            maxTags={3}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Submit button */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
