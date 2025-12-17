'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CLUB_CONTRIBUTION_TYPES,
  TEXT_LIMITS,
  FILE_UPLOAD_LIMITS,
} from '@/lib/constants'

export default function UploadPage() {
  const [contributionType, setContributionType] = useState<string>('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    // TODO: Implement actual upload logic with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert('Upload successful! Your contribution will be reviewed shortly.')
    setUploading(false)
    setContributionType('')
    setTitle('')
    setBody('')
    setTags('')
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setContributionType('')}
            >
              ← Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="The Day I Broke into the Sub-16 Club"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_TITLE}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {title.length}/{TEXT_LIMITS.CLUBHOUSE_TITLE} characters
              </p>
            </div>

            <div>
              <Label htmlFor="body">Your Story</Label>
              <textarea
                id="body"
                className="min-h-64 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="It started on a Tuesday morning. The air was thick with humidity and questionable life choices..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_BODY}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {body.length}/{TEXT_LIMITS.CLUBHOUSE_BODY} characters •
                Markdown supported
              </p>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="bacon, sub-16, time-trial, suffering"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Comma-separated. Helps others find your story.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-run-gray-50 p-4 text-sm">
              <p className="mb-2 font-medium">📝 Writing Tips:</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>Write like you're talking in the parking lot after a run</li>
                <li>Be honest about the suffering and the absurdity</li>
                <li>Focus on the "why" more than the "what"</li>
                <li>
                  You can use markdown: **bold**, *italic*, [links](url)
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={uploading}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {uploading ? 'Publishing...' : 'Publish Story'}
            </Button>
          </form>
        </Card>
      )}

      {/* Media Upload Form */}
      {contributionType === CLUB_CONTRIBUTION_TYPES.MEDIA && (
        <Card className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Upload Media</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setContributionType('')}
            >
              ← Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="media-file">Photo or Video</Label>
              <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-run-gray-300 bg-run-gray-50 p-12 transition-colors hover:border-orange-600 hover:bg-orange-50">
                <div className="text-center">
                  <div className="mb-4 text-5xl">📸</div>
                  <p className="mb-2 text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, HEIC up to{' '}
                    {FILE_UPLOAD_LIMITS.MAX_IMAGE_SIZE / 1024 / 1024}MB
                  </p>
                  <input
                    id="media-file"
                    type="file"
                    accept={FILE_UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES.join(',')}
                    className="mt-4"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="media-caption">Caption</Label>
              <textarea
                id="media-caption"
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Dawn patrol at 4:47 AM. The world belongs to us."
                value={body}
                onChange={(e) => setBody(e.target.value)}
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
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={uploading}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {uploading ? 'Uploading...' : 'Upload Media'}
            </Button>
          </form>
        </Card>
      )}

      {/* Document Upload Form */}
      {contributionType === CLUB_CONTRIBUTION_TYPES.DOCUMENT && (
        <Card className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Add Resource</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setContributionType('')}
            >
              ← Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="doc-title">Resource Title</Label>
              <Input
                id="doc-title"
                placeholder="DWTC Training Plan - 5K Speed"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_TITLE}
                required
              />
            </div>

            <div>
              <Label htmlFor="doc-file">File</Label>
              <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-run-gray-300 bg-run-gray-50 p-12 transition-colors hover:border-orange-600 hover:bg-orange-50">
                <div className="text-center">
                  <div className="mb-4 text-5xl">📄</div>
                  <p className="mb-2 text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF or GPX up to{' '}
                    {FILE_UPLOAD_LIMITS.MAX_DOCUMENT_SIZE / 1024 / 1024}MB
                  </p>
                  <input
                    id="doc-file"
                    type="file"
                    accept={FILE_UPLOAD_LIMITS.ALLOWED_DOCUMENT_TYPES.join(
                      ','
                    )}
                    className="mt-4"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="doc-description">Description</Label>
              <textarea
                id="doc-description"
                className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Our signature 8-week training plan for breaking into the Sub-16 club..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={TEXT_LIMITS.CLUBHOUSE_CAPTION}
              />
            </div>

            <div>
              <Label htmlFor="doc-tags">Tags</Label>
              <Input
                id="doc-tags"
                placeholder="training-plan, sub-16, 5k"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={uploading}
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </form>
        </Card>
      )}

      {/* Guidelines */}
      <Card className="border-orange-600 bg-orange-50 p-6">
        <h3 className="mb-4 text-lg font-bold">Contribution Guidelines</h3>
        <ul className="space-y-2 text-sm text-run-gray-700">
          <li>
            ✓ All uploads are reviewed before going live (usually within 24
            hours)
          </li>
          <li>
            ✓ Keep it authentic—we celebrate the absurdity and honesty of
            running
          </li>
          <li>✓ Tag your content to help others discover it</li>
          <li>✓ Respect the crew—no negativity, just real talk</li>
          <li>
            ✓ Questions? Reach out to any admin or coach in the parking lot
          </li>
        </ul>
      </Card>
    </div>
  )
}
