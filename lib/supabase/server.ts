"use server"
import "server-only"

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

/**
 * createServerSupabase: devuelve un cliente Supabase que
 * SOLO puede usarse en Server Components, Server Actions o Route Handlers.
 */
export async function createServerSupabase() {
  const cookieStore = cookies()

  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name, value, options: CookieOptions) => cookieStore.set({ name, value, ...options }),
      remove: (name, options: CookieOptions) => cookieStore.set({ name, value: "", ...options }),
    },
  })
}

/**
 * Alias para no romper los imports existentes:
 *   import { createClient } from "@/lib/supabase/server"
 */
export const createClient = createServerSupabase
