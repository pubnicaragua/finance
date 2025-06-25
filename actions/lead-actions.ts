"use server"

import { createClient } from "@/lib/supabase/server" // Importar el cliente de servidor
import { revalidatePath } from "next/cache" // Para revalidar la caché y actualizar el frontend
import type { Tables } from "@/lib/database.types"

export async function addLead(prevState: any, data: Partial<Tables<"leads">>) {
  console.log("--- Server Action: addLead called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()
  const { data: newLead, error } = await supabase
    .from("leads")
    .insert([data as Tables<"leads">])
    .select()

  if (error) {
    console.error("Error creating lead:", error)
    return { success: false, message: `Error al añadir lead: ${error.message}` }
  }

  revalidatePath("/leads") // Revalidar la página de leads
  return { success: true, message: "Lead añadido exitosamente.", data: newLead[0] }
}

export async function updateLead(prevState: any, data: Partial<Tables<"leads">> & { id: string }) {
  console.log("--- Server Action: updateLead called ---")
  console.log("Server: Received data:", data)

  const { id, ...updateData } = data
  const supabase = createClient()
  const { data: updatedLead, error } = await supabase.from("leads").update(updateData).eq("id", id).select()

  if (error) {
    console.error("Error updating lead:", error)
    return { success: false, message: `Error al actualizar lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead actualizado exitosamente.", data: updatedLead[0] }
}

export async function deleteLead(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("leads").delete().eq("id", id)

  if (error) {
    console.error("Error deleting lead:", error)
    return { success: false, message: `Error al eliminar lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead eliminado exitosamente." }
}
