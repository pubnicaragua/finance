"use server"

import { createClient } from "@/lib/supabase/server" // Importar el cliente de servidor
import { revalidatePath } from "next/cache" // Para revalidar la caché y actualizar el frontend
import type { Tables } from "@/lib/database.types"

export async function addPartnership(prevState: any, data: Partial<Tables<"partnerships">>) {
  console.log("--- Server Action: addPartnership called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()
  const { data: newPartnership, error } = await supabase
    .from("partnerships")
    .insert([data as Tables<"partnerships">])
    .select()

  if (error) {
    console.error("Error creating partnership:", error)
    return { success: false, message: `Error al añadir partnership: ${error.message}` }
  }

  revalidatePath("/partnerships") // Revalidar la página de partnerships
  return { success: true, message: "Partnership añadido exitosamente.", data: newPartnership[0] }
}

export async function updatePartnership(prevState: any, data: Partial<Tables<"partnerships">> & { id: string }) {
  console.log("--- Server Action: updatePartnership called ---")
  console.log("Server: Received data:", data)

  const { id, ...updateData } = data
  const supabase = createClient()
  const { data: updatedPartnership, error } = await supabase
    .from("partnerships")
    .update(updateData)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating partnership:", error)
    return { success: false, message: `Error al actualizar partnership: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Partnership actualizado exitosamente.", data: updatedPartnership[0] }
}

export async function deletePartnership(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("partnerships").delete().eq("id", id)

  if (error) {
    console.error("Error deleting partnership:", error)
    return { success: false, message: `Error al eliminar partnership: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Partnership eliminado exitosamente." }
}
