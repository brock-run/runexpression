import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/env'

/**
 * Create a Supabase client for browser usage.
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
