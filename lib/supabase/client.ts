"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types" // Asumimos que generarás tus tipos de Supabase

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
