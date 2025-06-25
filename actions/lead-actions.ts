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

export async function createLead(
  prevState: any,
  data: { nombre: string; email: string; telefono: string; estado: string },
) {
  console.log("--- Server Action: createLead called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { data: newLead, error } = await supabase.from("leads").insert([data])

  if (error) {
    console.error("Error creating lead:", error)
    return { success: false, message: `Error al crear lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead creado exitosamente." }
}

export async function updateLead(
  prevState: any,
  data: { id: string; nombre: string; email: string; telefono: string; estado: string },
) {
  console.log("--- Server Action: updateLead called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { id, ...updateData } = data
  const { data: updatedLead, error } = await supabase.from("leads").update(updateData).eq("id", id)

  if (error) {
    console.error("Error updating lead:", error)
    return { success: false, message: `Error al actualizar lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead actualizado exitosamente." }
}

export async function deleteLead(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("leads").delete().eq("id", id)

  if (error) {
    console.error("Error deleting lead:", error)
    return { success: false, message: `Error al eliminar lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead eliminado exitosamente." }
}
