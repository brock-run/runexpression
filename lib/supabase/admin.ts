import { createClient } from '@supabase/supabase-js'
import { env } from '@/env'

/**
 * Admin client for Supabase - bypasses RLS policies
 * ⚠️ WARNING: Only use this in secure server-side contexts (API routes, Server Actions)
 * Never expose this client to the browser!
 */
export function createAdminClient() {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
