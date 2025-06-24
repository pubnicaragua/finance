"use server"

import { createClient } from "@/lib/supabase/server" // Importación directa del cliente de servidor
import type { Tables } from "@/lib/database.types"

export async function addLead(formData: FormData) {
  const supabase = await createClient()
  const leadData: Partial<Tables<"leads">> = {
    cliente: formData.get("cliente") as string,
    proyecto: formData.get("proyecto") as string,
    tipo_software: formData.get("tipo_software") as string,
    pais: formData.get("pais") as string,
    proyeccion_usd: Number.parseFloat(formData.get("proyeccion_usd") as string),
    estado: formData.get("estado") as Tables<"leads">["estado"],
    canal_contacto: formData.get("canal_contacto") as string,
    fecha_ultimo_contacto: formData.get("fecha_ultimo_contacto") as string,
    seguimiento: JSON.parse(formData.get("seguimiento") as string),
  }

  const { data, error } = await supabase.from("leads").insert([leadData]).select()

  if (error) {
    console.error("Error adding lead:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Lead añadido exitosamente", data: data[0] }
}

export async function updateLead(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const leadData: Partial<Tables<"leads">> = {
    cliente: formData.get("cliente") as string,
    proyecto: formData.get("proyecto") as string,
    tipo_software: formData.get("tipo_software") as string,
    pais: formData.get("pais") as string,
    proyeccion_usd: Number.parseFloat(formData.get("proyeccion_usd") as string),
    estado: formData.get("estado") as Tables<"leads">["estado"],
    canal_contacto: formData.get("canal_contacto") as string,
    fecha_ultimo_contacto: formData.get("fecha_ultimo_contacto") as string,
    seguimiento: JSON.parse(formData.get("seguimiento") as string),
  }

  const { data, error } = await supabase.from("leads").update(leadData).eq("id", id).select()

  if (error) {
    console.error("Error updating lead:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Lead actualizado exitosamente", data: data[0] }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("leads").delete().eq("id", id)

  if (error) {
    console.error("Error deleting lead:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Lead eliminado exitosamente" }
}
