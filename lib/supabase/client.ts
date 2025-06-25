import { createBrowserClient } from "@supabase/ssr"
// Asegura que @supabase/storage-js esté presente en el bundle
import "@supabase/storage-js"
import type { Database } from "./database.types"

let supabase: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (!supabase) {
    supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabase
}
