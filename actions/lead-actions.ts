"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addLead(prevState: any, formData: FormData) {
  const supabase = createClient()
  const newLead: TablesInsert<"leads"> = {
    cliente: formData.get("cliente") as string,
    proyecto: formData.get("proyecto") as string,
    estado: formData.get("estado") as string,
    proyeccion_usd: Number.parseFloat(formData.get("proyeccion_usd") as string),
    canal_contacto: formData.get("canal_contacto") as string,
    fecha_ultimo_contacto: formData.get("fecha_ultimo_contacto") as string,
    tipo_software: formData.get("tipo_software") as string,
    seguimiento: [], // Inicializar como JSON vacío o array vacío
  }

  const { error } = await supabase.from("leads").insert(newLead)

  if (error) {
    console.error("Error adding lead:", error)
    return { success: false, message: `Error al añadir lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead añadido exitosamente." }
}

export async function updateLead(prevState: any, formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const updatedLead: TablesUpdate<"leads"> = {
    cliente: formData.get("cliente") as string,
    proyecto: formData.get("proyecto") as string,
    estado: formData.get("estado") as string,
    proyeccion_usd: Number.parseFloat(formData.get("proyeccion_usd") as string),
    canal_contacto: formData.get("canal_contacto") as string,
    fecha_ultimo_contacto: formData.get("fecha_ultimo_contacto") as string,
    tipo_software: formData.get("tipo_software") as string,
  }

  const { error } = await supabase.from("leads").update(updatedLead).eq("id", id)

  if (error) {
    console.error("Error updating lead:", error)
    return { success: false, message: `Error al actualizar lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead actualizado exitosamente." }
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
