import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { env } from '@/env'

export async function POST() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', env.NEXT_PUBLIC_APP_URL))
}
