"use server"
import "server-only"
import { createServerSupabase, createClient as createClientFromLib } from "../../lib/supabase/server"

/**
 * Archivo alias para los imports que apuntan a:
 *   "@/utils/supabase/server"
 * Re-exporta explícitamente solo las funciones asíncronas del lado del servidor.
 */
export const createClient = createClientFromLib
export const createServerSupabaseClient = createServerSupabase
