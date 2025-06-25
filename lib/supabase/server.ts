// Este archivo **solo debe** importarse desde Server Components o Server Actions.
// Provee un cliente Supabase con la Service Role Key (solo en el servidor).

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

/**
 * Crea un cliente Supabase para uso exclusivo del servidor.
 * No incluyas este módulo en componentes "use client".
 */
export function createClient() {
  // Validación básica para evitar errores de typo en las env-vars
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY no están definidas. " +
        "Configúralas en tu .env.local y en Vercel.",
    )
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookies().set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookies().set({ name, value: "", ...options })
      },
    },
  })
}

// Alias de compatibilidad con código existente
export { createClient as createServerSupabase }
