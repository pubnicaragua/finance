// ⚠️  Cargamos 'next/headers' sólo si existe (App Router):
let cookies: () => ReturnType<typeof import("next/headers")["cookies"]>
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  cookies = require("next/headers").cookies
} catch {
  // Estamos fuera del App Router (por ejemplo en /pages). Devolvemos stub.
  cookies = () => ({
    get: () => undefined,
    set: () => undefined,
  })
}

import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers" // Removed original import

export function createServerSupabase() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          console.warn("Could not set cookie from server:", error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          console.warn("Could not remove cookie from server:", error)
        }
      },
    },
  })
}

// Back-compat: allow older code that still imports `createClient`
export const createClient = createServerSupabase
