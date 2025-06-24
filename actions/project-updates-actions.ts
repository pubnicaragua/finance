"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Avances de Proyecto Actions ---

export async function addAvance(formData: FormData) {
  const supabase = createClient()
  const newAvance: TablesInsert<"avances_proyecto"> = {
    cliente_id: formData.get("cliente_id") as string,
    fecha: formData.get("fecha") as string,
    descripcion: formData.get("descripcion") as string,
    porcentaje_avance: Number.parseFloat(formData.get("porcentaje_avance") as string),
    comentarios_cliente: formData.get("comentarios_cliente") as string,
  }

  const { error } = await supabase.from("avances_proyecto").insert(newAvance)

  if (error) {
    console.error("Error adding avance:", error)
    return { success: false, message: `Error al añadir avance: ${error.message}` }
  }

  revalidatePath(`/clients/${newAvance.cliente_id}`)
  return { success: true, message: "Avance añadido exitosamente." }
}

export async function updateAvance(formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const cliente_id = formData.get("cliente_id") as string
  const updatedAvance: TablesUpdate<"avances_proyecto"> = {
    fecha: formData.get("fecha") as string,
    descripcion: formData.get("descripcion") as string,
    porcentaje_avance: Number.parseFloat(formData.get("porcentaje_avance") as string),
    comentarios_cliente: formData.get("comentarios_cliente") as string,
  }

  const { error } = await supabase.from("avances_proyecto").update(updatedAvance).eq("id", id)

  if (error) {
    console.error("Error updating avance:", error)
    return { success: false, message: `Error al actualizar avance: ${error.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Avance actualizado exitosamente." }
}

export async function deleteAvance(id: string, cliente_id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("avances_proyecto").delete().eq("id", id)

  if (error) {
    console.error("Error deleting avance:", error)
    return { success: false, message: `Error al eliminar avance: ${error.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Avance eliminado exitosamente." }
}

// --- Alcances de Desarrollo Actions ---

export async function addAlcance(formData: FormData) {
  const supabase = createClient()
  const newAlcance: TablesInsert<"alcances_desarrollo"> = {
    cliente_id: formData.get("cliente_id") as string,
    nombre_modulo: formData.get("nombre_modulo") as string,
    descripcion: formData.get("descripcion") as string,
    fecha_implementacion: formData.get("fecha_implementacion") as string,
    estado: formData.get("estado") as string,
  }

  const { error } = await supabase.from("alcances_desarrollo").insert(newAlcance)

  if (error) {
    console.error("Error adding alcance:", error)
    return { success: false, message: `Error al añadir alcance: ${error.message}` }
  }

  revalidatePath(`/clients/${newAlcance.cliente_id}`)
  return { success: true, message: "Alcance añadido exitosamente." }
}

export async function updateAlcance(formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const cliente_id = formData.get("cliente_id") as string
  const updatedAlcance: TablesUpdate<"alcances_desarrollo"> = {
    nombre_modulo: formData.get("nombre_modulo") as string,
    descripcion: formData.get("descripcion") as string,
    fecha_implementacion: formData.get("fecha_implementacion") as string,
    estado: formData.get("estado") as string,
  }

  const { error } = await supabase.from("alcances_desarrollo").update(updatedAlcance).eq("id", id)

  if (error) {
    console.error("Error updating alcance:", error)
    return { success: false, message: `Error al actualizar alcance: ${error.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Alcance actualizado exitosamente." }
}

export async function deleteAlcance(id: string, cliente_id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("alcances_desarrollo").delete().eq("id", id)

  if (error) {
    console.error("Error deleting alcance:", error)
    return { success: false, message: `Error al eliminar alcance: ${error.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Alcance eliminado exitosamente." }
}
