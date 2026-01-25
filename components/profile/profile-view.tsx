'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VIBE_TAGS } from '@/lib/constants'
import type { Tables } from '@/types/database.types'
import type { User } from '@supabase/supabase-js'
import { Loader2, Pencil, X, Check, Camera } from 'lucide-react'

interface ProfileViewProps {
  profile: Tables<'profiles'>
  user: User
}

type ExpressionData = {
  favorite_vibes?: string[]
  onboarding_completed?: boolean
  [key: string]: unknown
}

export function ProfileView({ profile, user }: ProfileViewProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(profile.full_name || '')
  const [selectedVibes, setSelectedVibes] = useState<string[]>(
    (profile.expression_data as ExpressionData)?.favorite_vibes || []
  )

  const allVibes = [
    ...VIBE_TAGS.MINDSET,
    ...VIBE_TAGS.CONTEXT,
    ...VIBE_TAGS.FEELING,
  ]

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibe)
        ? prev.filter(v => v !== vibe)
        : prev.length < 5
          ? [...prev, vibe]
          : prev
    )
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      const existingData = (profile.expression_data as ExpressionData) || {}

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          expression_data: {
            ...existingData,
            favorite_vibes: selectedVibes,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        throw new Error('Failed to update profile.')
      }

      setIsEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFullName(profile.full_name || '')
    setSelectedVibes(
      (profile.expression_data as ExpressionData)?.favorite_vibes || []
    )
    setIsEditing(false)
    setError(null)
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-3xl font-bold">Your Profile</h1>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-run-gray-100">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Profile'}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-run-gray-400">
                    {(profile.full_name ||
                      profile.email ||
                      'R')[0].toUpperCase()}
                  </div>
                )}
              </div>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  disabled
                  title="Avatar upload coming soon"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Display Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Your name or alias"
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">
                    {profile.full_name || 'Anonymous Runner'}
                  </h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Member since {memberSince}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vibes Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-xl">Your Vibes</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select up to 5 vibes that describe your running style.
              </p>
              <div className="flex flex-wrap gap-2">
                {allVibes.map(vibe => (
                  <Badge
                    key={vibe}
                    variant={
                      selectedVibes.includes(vibe) ? 'default' : 'outline'
                    }
                    className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                      selectedVibes.includes(vibe)
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'hover:bg-orange-50 hover:text-orange-600'
                    }`}
                    onClick={() => toggleVibe(vibe)}
                  >
                    {vibe}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedVibes.length}/5 selected
              </p>
            </div>
          ) : selectedVibes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedVibes.map(vibe => (
                <Badge key={vibe} className="bg-orange-600 text-white">
                  {vibe}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No vibes selected yet. Edit your profile to add some!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Edit Actions */}
      {isEditing && (
        <Card>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-xl">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">••••••••</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/auth/reset-password">Change Password</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
