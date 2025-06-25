"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

function getSupabaseServerClient() {
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

export async function createPartnership(
  prevState: any,
  data: { nombre: string; tipo: string; fecha_inicio: string; estado: string },
) {
  console.log("--- Server Action: createPartnership called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { data: newPartnership, error } = await supabase.from("asociaciones").insert([data])

  if (error) {
    console.error("Error creating partnership:", error)
    return { success: false, message: `Error al crear asociación: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Asociación creada exitosamente." }
}

export async function updatePartnership(
  prevState: any,
  data: { id: string; nombre: string; tipo: string; fecha_inicio: string; estado: string },
) {
  console.log("--- Server Action: updatePartnership called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { id, ...updateData } = data
  const { data: updatedPartnership, error } = await supabase.from("asociaciones").update(updateData).eq("id", id)

  if (error) {
    console.error("Error updating partnership:", error)
    return { success: false, message: `Error al actualizar asociación: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Asociación actualizada exitosamente." }
}

export async function deletePartnership(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("asociaciones").delete().eq("id", id)

  if (error) {
    console.error("Error deleting partnership:", error)
    return { success: false, message: `Error al eliminar asociación: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Asociación eliminada exitosamente." }
}
