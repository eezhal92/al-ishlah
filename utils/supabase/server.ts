import { createClient as supabaseCreateClient } from '@supabase/supabase-js'
import { Database } from '@/database.types'



/**
 * Create a single supabase client for interacting with your database
 * @returns
 */
export function createClient() {
  return supabaseCreateClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export type SupabaseClient = ReturnType<typeof createClient>
