import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schemas
const singleModerationSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
})

const bulkModerationSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  action: z.enum(['approve', 'reject']),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add proper role-based access control
    // For now, any authenticated user can moderate (update this with admin role check)
    // Example:
    // const { data: profile } = await supabase
    //   .from('profiles')
    //   .select('role')
    //   .eq('id', user.id)
    //   .single()
    // if (profile?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const body = await request.json()

    // Determine if it's a single or bulk moderation
    if ('ids' in body) {
      // Bulk moderation
      const { ids, action } = bulkModerationSchema.parse(body)

      const updates = {
        moderation_status: action === 'approve' ? 'approved' : 'rejected',
        visibility: action === 'approve' ? 'public' : 'hidden',
      }

      const { error } = await supabase
        .from('expression_events')
        .update(updates)
        .in('id', ids)
        .eq('moderation_status', 'pending') // Only update if still pending

      if (error) throw error

      return NextResponse.json(
        {
          success: true,
          message: `${ids.length} expressions ${action === 'approve' ? 'approved' : 'rejected'}`,
        },
        { status: 200 }
      )
    } else {
      // Single moderation
      const { id, action } = singleModerationSchema.parse(body)

      const updates = {
        moderation_status: action === 'approve' ? 'approved' : 'rejected',
        visibility: action === 'approve' ? 'public' : 'hidden',
      }

      const { error } = await supabase
        .from('expression_events')
        .update(updates)
        .eq('id', id)
        .eq('moderation_status', 'pending') // Only update if still pending

      if (error) throw error

      return NextResponse.json(
        {
          success: true,
          message: `Expression ${action === 'approve' ? 'approved' : 'rejected'}`,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Moderation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process moderation action' },
      { status: 500 }
    )
  }
}
