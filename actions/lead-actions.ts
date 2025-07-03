"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addLead(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const newLead: TablesInsert<"leads"> = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    interes: formData.get("interes") as string,
    estado: formData.get("estado") as string,
    fecha_contacto: formData.get("fecha_contacto") as string,
    fuente: formData.get("fuente") as string,
    notas: formData.get("notas") as string, // CAMBIO: 'comentarios' a 'notas'
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
  const supabase = await createClient()
  const id = formData.get("id") as string
  const updatedLead: TablesUpdate<"leads"> = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    interes: formData.get("interes") as string,
    estado: formData.get("estado") as string,
    fecha_contacto: formData.get("fecha_contacto") as string,
    fuente: formData.get("fuente") as string,
    notas: formData.get("notas") as string, // CAMBIO: 'comentarios' a 'notas'
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
  const supabase = await createClient()
  const { error } = await supabase.from("leads").delete().eq("id", id)

  if (error) {
    console.error("Error deleting lead:", error)
    return { success: false, message: `Error al eliminar lead: ${error.message}` }
  }

  revalidatePath("/leads")
  return { success: true, message: "Lead eliminado exitosamente." }
}

export async function getLeads() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("leads").select("*").order("fecha_contacto", { ascending: false })
  if (error) {
    console.error("Error fetching leads:", error)
    return []
  }
  return data || []
}