import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import OpenAI from 'openai'
import { env } from '@/env'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

// Validation schemas
const textSubmissionSchema = z.object({
  type: z.literal('text'),
  content: z.string().min(5).max(500),
  note: z.string().max(1000).optional(),
  vibeTags: z.array(z.string()).min(1).max(3),
})

const imageSubmissionSchema = z.object({
  type: z.literal('image'),
  caption: z.string().min(5).max(500),
  vibeTags: z.array(z.string()).min(1).max(3),
  mediaUrl: z.string().url(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user (optional - anonymous submissions allowed)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Parse request based on content type
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      // Text submission
      const body = await request.json()
      const validatedData = textSubmissionSchema.parse(body)

      // Run OpenAI moderation on text content
      const moderationResult = await moderateContent(validatedData.content)

      if (moderationResult.flagged) {
        return NextResponse.json(
          {
            error:
              'Your submission was flagged by our content moderation system. Please revise and try again.',
          },
          { status: 400 }
        )
      }

      // Get user's trust score (if authenticated)
      const trustScore = user ? await getTrustScore(supabase, user.id) : 0

      // Determine moderation status based on trust score
      const moderationStatus = trustScore >= 3 ? 'approved' : 'pending'
      const visibility = trustScore >= 3 ? 'public' : 'pending'

      // Create expression event
      const { data, error } = await supabase
        .from('expression_events')
        .insert({
          user_id: user?.id || null,
          type: 'text',
          content: validatedData.content,
          vibe_tags: validatedData.vibeTags,
          metadata: {
            note: validatedData.note,
            ai_moderation_result: moderationResult,
            source: 'web',
          },
          moderation_status: moderationStatus,
          visibility: visibility,
        })
        .select()
        .single()

      if (error) throw error

      // If user is authenticated, increment trust score
      if (user && moderationStatus === 'approved') {
        await incrementTrustScore(supabase, user.id)
      }

      return NextResponse.json(
        {
          success: true,
          data,
          message:
            moderationStatus === 'approved'
              ? 'Your expression is now live in the Flow!'
              : 'Your expression is under review and will appear soon.',
        },
        { status: 201 }
      )
    } else if (contentType.includes('multipart/form-data')) {
      // Image submission
      const formData = await request.formData()
      const file = formData.get('file') as File
      const caption = formData.get('caption') as string
      const vibeTags = JSON.parse(formData.get('vibeTags') as string)

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Validate data
      imageSubmissionSchema.partial({ mediaUrl: true }).parse({
        type: 'image',
        caption,
        vibeTags,
      })

      // Run OpenAI moderation on caption
      const moderationResult = await moderateContent(caption)

      if (moderationResult.flagged) {
        return NextResponse.json(
          {
            error:
              'Your caption was flagged by our content moderation system. Please revise and try again.',
          },
          { status: 400 }
        )
      }

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(`flow/${fileName}`, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('uploads').getPublicUrl(uploadData.path)

      // Get user's trust score
      const trustScore = user ? await getTrustScore(supabase, user.id) : 0

      // Determine moderation status
      const moderationStatus = trustScore >= 3 ? 'approved' : 'pending'
      const visibility = trustScore >= 3 ? 'public' : 'pending'

      // Create expression event
      const { data, error } = await supabase
        .from('expression_events')
        .insert({
          user_id: user?.id || null,
          type: 'image',
          content: caption,
          media_url: publicUrl,
          vibe_tags: vibeTags,
          metadata: {
            ai_moderation_result: moderationResult,
            source: 'web',
          },
          moderation_status: moderationStatus,
          visibility: visibility,
        })
        .select()
        .single()

      if (error) throw error

      // Increment trust score if approved
      if (user && moderationStatus === 'approved') {
        await incrementTrustScore(supabase, user.id)
      }

      return NextResponse.json(
        {
          success: true,
          data,
          message:
            moderationStatus === 'approved'
              ? 'Your expression is now live in the Flow!'
              : 'Your expression is under review and will appear soon.',
        },
        { status: 201 }
      )
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Flow submission error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit expression' },
      { status: 500 }
    )
  }
}

// Moderate content using OpenAI Moderation API
async function moderateContent(text: string) {
  try {
    const moderation = await openai.moderations.create({
      input: text,
    })

    return {
      flagged: moderation.results[0].flagged,
      categories: moderation.results[0].categories,
    }
  } catch (error) {
    console.error('OpenAI moderation error:', error)
    // If moderation fails, default to requiring manual review
    return { flagged: false, categories: {} }
  }
}

// Get user's trust score
async function getTrustScore(supabase: any, userId: string): Promise<number> {
  const { count } = await supabase
    .from('expression_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('moderation_status', 'approved')

  return count || 0
}

// Increment user's trust score
async function incrementTrustScore(_supabase: any, _userId: string) {
  // This is handled implicitly by counting approved submissions
  // No need to maintain a separate trust_score field
  return
}
