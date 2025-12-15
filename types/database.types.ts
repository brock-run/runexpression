/**
 * Database types generated from Supabase schema
 *
 * To regenerate:
 * npm run db:types
 *
 * Requires SUPABASE_PROJECT_ID in environment
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Placeholder - will be generated from actual schema
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
