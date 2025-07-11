// Este archivo **solo debe** importarse desde Server Components o Server Actions.
// Provee un cliente Supabase con la Service Role Key (solo en el servidor).

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Forzamos la inclusión de la dependencia peer de supabase-js
import "@supabase/storage-js"

/**
 * Crea un cliente Supabase para uso exclusivo del servidor.
 * No incluyas este módulo en componentes "use client".
 */
export async function createClient() {
  // --- VALIDATE ENV-VARS & CHOOSE THE RIGHT KEY ------------------------------
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!SUPABASE_URL) {
    throw new Error(
      "Faltan variables de entorno Supabase.\n" +
        "Requeridas: NEXT_PUBLIC_SUPABASE_URL y (SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    )
  }

  if (!SERVICE_ROLE && !ANON_KEY) {
    // Fallback to hardcoded values if environment variables are not available
    // This is not recommended for production, but helps during development
    console.warn("Using fallback Supabase credentials - not recommended for production")
    const FALLBACK_URL = "https://apicznctkrpmoctlelln.supabase.co"
    const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWN6bmN0a3JwbW9jdGxlbGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjA3ODgsImV4cCI6MjA2NDM5Njc4OH0.DhPqAveH5Q50PVBGIRPlbbg5qFn6RkjzDiwARM3VDdw"
    
    // Escogemos la llave Anónima de fallback
    const cookieStore = await cookies()
    return createServerClient(FALLBACK_URL, FALLBACK_KEY, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
  }

  // Escogemos Service Role cuando existe; si no, usamos la llave Anónima.
  const SUPABASE_KEY = SERVICE_ROLE ?? ANON_KEY
  // ---------------------------------------------------------------------------

  // Await the cookies() function as required by Next.js 15
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Alias de compatibilidad con código existente
export { createClient as createServerSupabase }