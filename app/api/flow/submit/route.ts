import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// OpenAI moderation
async function moderateContent(text: string): Promise<{
  flagged: boolean
  categories: Record<string, boolean>
}> {
  // Skip moderation if no OpenAI key configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, skipping moderation')
    return { flagged: false, categories: {} }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ input: text }),
    })

    if (!response.ok) {
      throw new Error('Moderation API request failed')
    }

    const data = await response.json()
    const result = data.results[0]

    return {
      flagged: result.flagged,
      categories: result.categories,
    }
  } catch (error) {
    console.error('Moderation error:', error)
    // On error, default to safe side (flagged)
    return { flagged: true, categories: {} }
  }
}

// Trust scoring: auto-approve if user has 3+ approved submissions
async function getTrustScore(userId: string | null): Promise<number> {
  if (!userId) return 0

  const supabase = createAdminClient()

  const { count, error } = await supabase
    .from('expression_events')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('moderation_status', 'approved')

  if (error) {
    console.error('Trust score error:', error)
    return 0
  }

  return count || 0
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const adminSupabase = createAdminClient()

    // Get current user (optional - allow anonymous)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Parse form data
    const formData = await request.formData()
    const type = formData.get('type') as string
    const content = formData.get('content') as string
    const contentLong = formData.get('content_long') as string
    const vibeTagsJson = formData.get('vibe_tags') as string
    const imageFile = formData.get('image') as File | null

    // Validate input
    if (!type || !['text', 'image'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid submission type' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Parse vibe tags
    let vibeTags: string[] = []
    try {
      vibeTags = JSON.parse(vibeTagsJson || '[]')
    } catch {
      vibeTags = []
    }

    // Handle image upload if present
    let mediaUrl: string | null = null
    if (imageFile && type === 'image') {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `flow/${fileName}`

      // Convert File to ArrayBuffer then to Buffer for Node.js
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await adminSupabase.storage
        .from('uploads')
        .upload(filePath, buffer, {
          contentType: imageFile.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = adminSupabase.storage.from('uploads').getPublicUrl(filePath)

      mediaUrl = publicUrl
    }

    // Moderate content
    const moderationResult = await moderateContent(content)

    if (moderationResult.flagged) {
      return NextResponse.json(
        {
          error:
            'Your submission contains content that violates our community guidelines. Please revise and try again.',
        },
        { status: 400 }
      )
    }

    // Get trust score
    const trustScore = await getTrustScore(user?.id || null)
    const isAutoApproved = trustScore >= 3

    // Create database entry
    const { data: expression, error: dbError } = await adminSupabase
      .from('expression_events')
      .insert({
        user_id: user?.id || null,
        type,
        content,
        content_long: contentLong || null,
        media_url: mediaUrl,
        vibe_tags: vibeTags,
        moderation_status: isAutoApproved ? 'approved' : 'pending',
        visibility: isAutoApproved ? 'public' : 'pending',
        metadata: {
          ai_moderation_result: moderationResult,
          trust_score: trustScore,
          source: 'web',
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save expression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      expression,
      moderation_status: isAutoApproved ? 'approved' : 'pending',
      message: isAutoApproved
        ? 'Your expression is now live on the wall!'
        : 'Your expression is pending review and will appear shortly.',
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
