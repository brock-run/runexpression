import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const adminSupabase = createAdminClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Check if user has admin role
    // For now, any authenticated user can moderate
    // In production, add proper role check

    // Parse request
    const body = await request.json()
    const { expression_id, action } = body

    if (!expression_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update expression
    const updates =
      action === 'approve'
        ? {
            moderation_status: 'approved',
            visibility: 'public',
            moderated_by: user.id,
            moderated_at: new Date().toISOString(),
          }
        : {
            moderation_status: 'rejected',
            visibility: 'hidden',
            moderated_by: user.id,
            moderated_at: new Date().toISOString(),
          }

    const { data, error } = await adminSupabase
      .from('expression_events')
      .update(updates)
      .eq('id', expression_id)
      .select()
      .single()

    if (error) {
      console.error('Moderation error:', error)
      return NextResponse.json(
        { error: 'Failed to update expression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      expression: data,
      action,
    })
  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
      )
  }
}
