"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Avances de Proyecto Actions ---

export async function addAvance(prevState: any, formData: FormData) {
  console.log("--- Server Action: addAvance called ---")
  const cliente_id = formData.get("cliente_id") as string
  const fecha = formData.get("fecha") as string
  const descripcion = formData.get("descripcion") as string
  const porcentaje_avance = Number.parseFloat(formData.get("porcentaje_avance") as string)
  const comentarios_cliente = formData.get("comentarios_cliente") as string

  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para addAvance.")
    return {
      success: false,
      message: "Error al añadir avance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!fecha || fecha.trim() === "") {
    console.error("Error: fecha es nulo o inválido para addAvance.")
    return { success: false, message: "Error al añadir avance: La fecha es requerida." }
  }
  if (!descripcion || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para addAvance.")
    return { success: false, message: "Error al añadir avance: La descripción es requerida." }
  }
  if (isNaN(porcentaje_avance)) {
    console.error("Error: porcentaje_avance es nulo o inválido para addAvance.")
    return {
      success: false,
      message: "Error al añadir avance: El porcentaje de avance es requerido y debe ser un número.",
    }
  }

  const supabase = await createClient()
  const newAvance: TablesInsert<"avances_proyecto"> = {
    cliente_id: cliente_id,
    fecha: fecha,
    descripcion: descripcion,
    porcentaje_avance: porcentaje_avance,
    comentarios_cliente: comentarios_cliente,
  }

  const { error } = await supabase.from("avances_proyecto").insert(newAvance)

  if (error) {
    console.error("Error adding avance:", error)
    return { success: false, message: `Error al añadir avance: ${error.message}` }
  }

  revalidatePath(`/clients/${newAvance.cliente_id}`)
  return { success: true, message: "Avance añadido exitosamente." }
}

export async function updateAvance(prevState: any, formData: FormData) {
  console.log("--- Server Action: updateAvance called ---")
  const id = formData.get("id") as string
  const cliente_id = formData.get("cliente_id") as string
  const fecha = formData.get("fecha") as string
  const descripcion = formData.get("descripcion") as string
  const porcentaje_avance = Number.parseFloat(formData.get("porcentaje_avance") as string)
  const comentarios_cliente = formData.get("comentarios_cliente") as string

  if (!id || id.trim() === "") {
    console.error("Error: ID es nulo o inválido para updateAvance.")
    return { success: false, message: "Error al actualizar avance: El ID del avance es requerido." }
  }
  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para updateAvance.")
    return {
      success: false,
      message: "Error al actualizar avance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!fecha || fecha.trim() === "") {
    console.error("Error: fecha es nulo o inválido para updateAvance.")
    return { success: false, message: "Error al actualizar avance: La fecha es requerida." }
  }
  if (!descripcion || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para updateAvance.")
    return { success: false, message: "Error al actualizar avance: La descripción es requerida." }
  }
  if (isNaN(porcentaje_avance)) {
    console.error("Error: porcentaje_avance es nulo o inválido para updateAvance.")
    return {
      success: false,
      message: "Error al actualizar avance: El porcentaje de avance es requerido y debe ser un número.",
    }
  }

  const supabase = await createClient()
  const updatedAvance: TablesUpdate<"avances_proyecto"> = {
    fecha: fecha,
    descripcion: descripcion,
    porcentaje_avance: porcentaje_avance,
    comentarios_cliente: comentarios_cliente,
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
  const supabase = await createClient()
  const { error } = await supabase.from("avances_proyecto").delete().eq("id", id)

  if (error) {
    console.error("Error deleting avance:", error)
    return { success: false, message: `Error al eliminar avance: ${error.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Avance eliminado exitosamente." }
}

// --- Alcances de Desarrollo Actions ---

export async function addAlcance(prevState: any, formData: FormData) {
  console.log("--- Server Action: addAlcance called ---")
  const cliente_id = formData.get("cliente_id") as string
  const nombre_modulo = formData.get("nombre_modulo") as string
  const descripcion = formData.get("descripcion") as string
  const fecha_implementacion = formData.get("fecha_implementacion") as string
  const estado = formData.get("estado") as string

  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para addAlcance.")
    return {
      success: false,
      message: "Error al añadir alcance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!nombre_modulo || nombre_modulo.trim() === "") {
    console.error("Error: nombre_modulo es nulo o inválido para addAlcance.")
    return { success: false, message: "Error al añadir alcance: El nombre del módulo es requerido." }
  }
  if (!descripcion || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para addAlcance.")
    return { success: false, message: "Error al añadir alcance: La descripción es requerida." }
  }

  const supabase = await createClient()
  const newAlcance: TablesInsert<"alcances_desarrollo"> = {
    cliente_id: cliente_id,
    nombre_modulo: nombre_modulo,
    descripcion: descripcion,
    fecha_implementacion: fecha_implementacion,
    estado: estado,
  }

  const { error } = await supabase.from("alcances_desarrollo").insert(newAlcance)

  if (error) {
    console.error("Error adding alcance:", error)
    return { success: false, message: `Error al añadir alcance: ${error.message}` }
  }

  revalidatePath(`/clients/${newAlcance.cliente_id}`)
  return { success: true, message: "Alcance añadido exitosamente." }
}

export async function updateAlcance(prevState: any, formData: FormData) {
  console.log("--- Server Action: updateAlcance called ---")
  const id = formData.get("id") as string
  const cliente_id = formData.get("cliente_id") as string
  const nombre_modulo = formData.get("nombre_modulo") as string
  const descripcion = formData.get("descripcion") as string
  const fecha_implementacion = formData.get("fecha_implementacion") as string
  const estado = formData.get("estado") as string

  if (!id || id.trim() === "") {
    console.error("Error: ID es nulo o inválido para updateAlcance.")
    return { success: false, message: "Error al actualizar alcance: El ID del alcance es requerido." }
  }
  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para updateAlcance.")
    return {
      success: false,
      message: "Error al actualizar alcance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!nombre_modulo || nombre_modulo.trim() === "") {
    console.error("Error: nombre_modulo es nulo o inválido para updateAlcance.")
    return { success: false, message: "Error al actualizar alcance: El nombre del módulo es requerido." }
  }
  if (!descripcion || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para updateAlcance.")
    return { success: false, message: "Error al actualizar alcance: La descripción es requerida." }
  }

  const supabase = await createClient()
  const updatedAlcance: TablesUpdate<"alcances_desarrollo"> = {
    nombre_modulo: nombre_modulo,
    descripcion: descripcion,
    fecha_implementacion: fecha_implementacion,
    estado: estado,
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
  const supabase = await createClient()
  const { error } = await supabase.from("alcances_desarrollo").delete().eq("id", id)

  if (error) {
    console.error("Error deleting alcance:", error)
    return { success: false, message: `Error al eliminar alcance: ${error.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Alcance eliminado exitosamente." }
}

export async function getAvancesByClientId(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("avances_proyecto")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha", { ascending: false })
  if (error) {
    console.error("Error fetching avances:", error)
    return [] // Asegurar que siempre devuelve un array
  }
  return data || []
}

export async function getAlcancesByClientId(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("alcances_desarrollo")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha_implementacion", { ascending: false })
  if (error) {
    console.error("Error fetching alcances:", error)
    return [] // Asegurar que siempre devuelve un array
  }
  return data || []
}