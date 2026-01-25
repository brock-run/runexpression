'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  CLUB_CONTRIBUTION_TYPES,
  TEXT_LIMITS,
  FILE_UPLOAD_LIMITS,
} from '@/lib/constants'
import { Loader2, Upload, X, ArrowLeft } from 'lucide-react'

type ContributionType = 'story' | 'media' | 'document' | ''

export default function UploadPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [contributionType, setContributionType] = useState<ContributionType>('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
      const file = e.target.files?.[0]
      if (!file) return

      setError(null)

      // Validate file type
      const allowedTypes: readonly string[] =
        type === 'image'
          ? FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES
          : FILE_UPLOAD_LIMITS.ALLOWED_DOCUMENT_TYPES

      if (!allowedTypes.includes(file.type)) {
        setError(
          `Please select a valid ${type === 'image' ? 'image (JPEG, PNG, HEIC)' : 'document (PDF, GPX)'} file.`
        )
        return
      }

      // Validate file size
      const maxSize =
        type === 'image'
          ? FILE_UPLOAD_LIMITS.MAX_IMAGE_SIZE
          : FILE_UPLOAD_LIMITS.MAX_DOCUMENT_SIZE

      if (file.size > maxSize) {
        setError(`File must be less than ${maxSize / 1024 / 1024}MB.`)
        return
      }

      setSelectedFile(file)

      // Create preview for images
      if (type === 'image') {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result as string)
        }
        reader.onerror = () => {
          setError('Failed to preview image.')
          setSelectedFile(null)
        }
        reader.readAsDataURL(file)
      }
    },
    []
  )

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setUploading(true)

    try {
      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/auth/login?next=/club/${slug}/upload`)
        return
      }

      // Get club ID (for now, handle DWTC specially)
      const { data: club } = await supabase
        .from('clubs')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!club) {
        throw new Error('Club not found')
      }

      let mediaUrl: string | null = null
      let fileSize: number | null = null
      let fileType: string | null = null

      // Upload file if present
      if (selectedFile) {
        // Extract file extension with fallback
        let fileExt = selectedFile.name.includes('.')
          ? selectedFile.name.split('.').pop()
          : null
        if (!fileExt) {
          const mimeExt = selectedFile.type.split('/').pop()
          fileExt = mimeExt && mimeExt !== 'heic' ? mimeExt : 'bin'
        }

        const fileName = `${slug}/${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('club-contributions')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw new Error('Failed to upload file. Please try again.')
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('club-contributions').getPublicUrl(fileName)

        mediaUrl = publicUrl
        fileSize = selectedFile.size
        fileType = selectedFile.type
      }

      // Parse tags
      const tagArray = tags
        .split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(t => t.length > 0)

      // Create contribution
      const { error: insertError } = await supabase
        .from('club_contributions')
        .insert({
          club_id: club.id,
          user_id: user.id,
          type: contributionType,
          title,
          body: body || null,
          media_url: mediaUrl,
          file_size: fileSize,
          file_type: fileType,
          tags: tagArray.length > 0 ? tagArray : null,
          moderation_status: 'pending',
          visibility: 'club_only',
        })

      if (insertError) {
        throw new Error('Failed to submit. Please try again.')
      }

      // Success - redirect to appropriate section
      const redirectPath =
        contributionType === 'story'
          ? `/club/${slug}/lore`
          : contributionType === 'media'
            ? `/club/${slug}/media`
            : `/club/${slug}/resources`

      router.push(redirectPath)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setContributionType('')
    setTitle('')
    setBody('')
    setTags('')
    setSelectedFile(null)
    setFilePreview(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Share Your Story
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Every run is a story. Every photo captures a moment. Every resource
          helps the crew. Add your contribution to the collective lore.
        </p>
      </div>

      {/* Contribution Type Selection */}
      {!contributionType && (
        <div className="grid gap-6 sm:grid-cols-3">
          <Card
            className="cursor-pointer p-8 text-center transition-all hover:scale-105 hover:border-orange-600 hover:bg-orange-50"
            onClick={() => setContributionType(CLUB_CONTRIBUTION_TYPES.STORY)}
          >
            <div className="mb-4 text-5xl">📖</div>
            <h3 className="mb-2 text-xl font-bold">Share a Story</h3>
            <p className="text-sm text-muted-foreground">
              Race reports, reflections, philosophy, lore, traditions
            </p>
          </Card>

          <Card
            className="cursor-pointer p-8 text-center transition-all hover:scale-105 hover:border-orange-600 hover:bg-orange-50"
            onClick={() => setContributionType(CLUB_CONTRIBUTION_TYPES.MEDIA)}
          >
            <div className="mb-4 text-5xl">📸</div>
            <h3 className="mb-2 text-xl font-bold">Upload Media</h3>
            <p className="text-sm text-muted-foreground">
              Photos and videos from runs, races, and bacon rituals
            </p>
          </Card>

          <Card
            className="cursor-pointer p-8 text-center transition-all hover:scale-105 hover:border-orange-600 hover:bg-orange-50"
            onClick={() =>
              setContributionType(CLUB_CONTRIBUTION_TYPES.DOCUMENT)
            }
          >
            <div className="mb-4 text-5xl">📄</div>
            <h3 className="mb-2 text-xl font-bold">Add a Resource</h3>
            <p className="text-sm text-muted-foreground">
              Training plans, route maps, PDFs, GPX files
            </p>
          </Card>
        </div>
      )}

      {/* Story Form */}
      {contributionType === CLUB_CONTRIBUTION_TYPES.STORY && (
        <Card className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Write Your Story</h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="The Day I Broke into the Sub-16 Club"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_TITLE}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {title.length}/{TEXT_LIMITS.CLUBHOUSE_TITLE} characters
              </p>
            </div>

            <div>
              <Label htmlFor="body">Your Story</Label>
              <Textarea
                id="body"
                className="min-h-64"
                placeholder="It started on a Tuesday morning. The air was thick with humidity and questionable life choices..."
                value={body}
                onChange={e => setBody(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_BODY}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {body.length}/{TEXT_LIMITS.CLUBHOUSE_BODY} characters | Markdown
                supported
              </p>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="bacon, sub-16, time-trial, suffering"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Comma-separated. Helps others find your story.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-run-gray-50 p-4 text-sm">
              <p className="mb-2 font-medium">Writing Tips:</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  Write like you&apos;re talking in the parking lot after a run
                </li>
                <li>Be honest about the suffering and the absurdity</li>
                <li>
                  Focus on the &quot;why&quot; more than the &quot;what&quot;
                </li>
                <li>You can use markdown: **bold**, *italic*, [links](url)</li>
              </ul>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={uploading || !title.trim()}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Story'
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Media Upload Form */}
      {contributionType === CLUB_CONTRIBUTION_TYPES.MEDIA && (
        <Card className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Upload Media</h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="media-title">Title</Label>
              <Input
                id="media-title"
                placeholder="Dawn Patrol at 4:47 AM"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_TITLE}
                required
              />
            </div>

            <div>
              <Label>Photo or Video</Label>
              {filePreview ? (
                <div className="relative mt-2 aspect-video overflow-hidden rounded-lg border border-border">
                  <Image
                    src={filePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={removeFile}
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
                  className="mt-2 flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-run-gray-300 bg-run-gray-50 transition-colors hover:border-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, HEIC up to{' '}
                    {FILE_UPLOAD_LIMITS.MAX_IMAGE_SIZE / 1024 / 1024}MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="media-file"
                type="file"
                accept={FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.join(',')}
                onChange={e => handleFileSelect(e, 'image')}
                className="hidden"
              />
            </div>

            <div>
              <Label htmlFor="media-caption">Caption</Label>
              <Textarea
                id="media-caption"
                className="min-h-24"
                placeholder="Dawn patrol at 4:47 AM. The world belongs to us."
                value={body}
                onChange={e => setBody(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_CAPTION}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {body.length}/{TEXT_LIMITS.CLUBHOUSE_CAPTION} characters
              </p>
            </div>

            <div>
              <Label htmlFor="media-tags">Tags</Label>
              <Input
                id="media-tags"
                placeholder="dawn-patrol, track, crew, bacon"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={uploading || !title.trim() || !selectedFile}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Media'
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Document Upload Form */}
      {contributionType === CLUB_CONTRIBUTION_TYPES.DOCUMENT && (
        <Card className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Add Resource</h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="doc-title">Resource Title</Label>
              <Input
                id="doc-title"
                placeholder="DWTC Training Plan - 5K Speed"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_TITLE}
                required
              />
            </div>

            <div>
              <Label>File</Label>
              {selectedFile ? (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-run-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">📄</div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
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
                  aria-label="Upload a document. PDF or GPX, maximum 10 megabytes."
                  className="mt-2 flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-run-gray-300 bg-run-gray-50 transition-colors hover:border-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF or GPX up to{' '}
                    {FILE_UPLOAD_LIMITS.MAX_DOCUMENT_SIZE / 1024 / 1024}MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="doc-file"
                type="file"
                accept={FILE_UPLOAD_LIMITS.ALLOWED_DOCUMENT_TYPES.join(',')}
                onChange={e => handleFileSelect(e, 'document')}
                className="hidden"
              />
            </div>

            <div>
              <Label htmlFor="doc-description">Description</Label>
              <Textarea
                id="doc-description"
                className="min-h-32"
                placeholder="Our signature 8-week training plan for breaking into the Sub-16 club..."
                value={body}
                onChange={e => setBody(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_CAPTION}
              />
            </div>

            <div>
              <Label htmlFor="doc-tags">Tags</Label>
              <Input
                id="doc-tags"
                placeholder="training-plan, sub-16, 5k"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={uploading || !title.trim() || !selectedFile}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Resource'
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Guidelines */}
      <Card className="border-orange-600 bg-orange-50 p-6">
        <h3 className="mb-4 text-lg font-bold">Contribution Guidelines</h3>
        <ul className="space-y-2 text-sm text-run-gray-700">
          <li>
            All uploads are reviewed before going live (usually within 24 hours)
          </li>
          <li>
            Keep it authentic - we celebrate the absurdity and honesty of
            running
          </li>
          <li>Tag your content to help others discover it</li>
          <li>Respect the crew - no negativity, just real talk</li>
          <li>Questions? Reach out to any admin or coach in the parking lot</li>
        </ul>
      </Card>
    </div>
  )
}
