"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Avances de Proyecto Actions ---

export async function addAvance(prevState: any, data: Partial<TablesInsert<"avances_proyecto">>) {
  console.log("--- Server Action: addAvance called ---")
  console.log("Server: Received data:", data)

  const { cliente_id, fecha, descripcion, porcentaje_avance, comentarios_cliente } = data

  if (!cliente_id || typeof cliente_id !== "string" || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para addAvance.")
    return {
      success: false,
      message: "Error al añadir avance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!fecha || typeof fecha !== "string" || fecha.trim() === "") {
    console.error("Error: fecha es nulo o inválido para addAvance.")
    return { success: false, message: "Error al añadir avance: La fecha es requerida." }
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para addAvance.")
    return { success: false, message: "Error al añadir avance: La descripción es requerida." }
  }
  if (porcentaje_avance === undefined || porcentaje_avance === null || isNaN(Number(porcentaje_avance))) {
    console.error("Error: porcentaje_avance es nulo o inválido para addAvance.")
    return {
      success: false,
      message: "Error al añadir avance: El porcentaje de avance es requerido y debe ser un número.",
    }
  }

  const supabase = createClient()
  const newAvance: TablesInsert<"avances_proyecto"> = {
    cliente_id: cliente_id as string,
    fecha: fecha as string,
    descripcion: descripcion as string,
    porcentaje_avance: Number.parseFloat(porcentaje_avance as any),
    comentarios_cliente: comentarios_cliente as string,
  }

  const { error } = await supabase.from("avances_proyecto").insert(newAvance)

  if (error) {
    console.error("Error adding avance:", error)
    return { success: false, message: `Error al añadir avance: ${error.message}` }
  }

  revalidatePath(`/clients/${newAvance.cliente_id}`)
  return { success: true, message: "Avance añadido exitosamente." }
}

export async function updateAvance(prevState: any, data: Partial<TablesUpdate<"avances_proyecto">> & { id: string }) {
  console.log("--- Server Action: updateAvance called ---")
  console.log("Server: Received data:", data)

  const { id, cliente_id, fecha, descripcion, porcentaje_avance, comentarios_cliente } = data

  if (!id || typeof id !== "string" || id.trim() === "") {
    console.error("Error: ID es nulo o inválido para updateAvance.")
    return { success: false, message: "Error al actualizar avance: El ID del avance es requerido." }
  }
  if (!cliente_id || typeof cliente_id !== "string" || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para updateAvance.")
    return {
      success: false,
      message: "Error al actualizar avance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!fecha || typeof fecha !== "string" || fecha.trim() === "") {
    console.error("Error: fecha es nulo o inválido para updateAvance.")
    return { success: false, message: "Error al actualizar avance: La fecha es requerida." }
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para updateAvance.")
    return { success: false, message: "Error al actualizar avance: La descripción es requerida." }
  }
  if (porcentaje_avance === undefined || porcentaje_avance === null || isNaN(Number(porcentaje_avance))) {
    console.error("Error: porcentaje_avance es nulo o inválido para updateAvance.")
    return {
      success: false,
      message: "Error al actualizar avance: El porcentaje de avance es requerido y debe ser un número.",
    }
  }

  const supabase = createClient()
  const updatedAvance: TablesUpdate<"avances_proyecto"> = {
    fecha: fecha as string,
    descripcion: descripcion as string,
    porcentaje_avance: Number.parseFloat(porcentaje_avance as any),
    comentarios_cliente: comentarios_cliente as string,
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

export async function addAlcance(prevState: any, data: Partial<TablesInsert<"alcances_desarrollo">>) {
  console.log("--- Server Action: addAlcance called ---")
  console.log("Server: Received data:", data)

  const { cliente_id, nombre_modulo, descripcion, fecha_implementacion, estado } = data

  if (!cliente_id || typeof cliente_id !== "string" || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para addAlcance.")
    return {
      success: false,
      message: "Error al añadir alcance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!nombre_modulo || typeof nombre_modulo !== "string" || nombre_modulo.trim() === "") {
    console.error("Error: nombre_modulo es nulo o inválido para addAlcance.")
    return { success: false, message: "Error al añadir alcance: El nombre del módulo es requerido." }
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para addAlcance.")
    return { success: false, message: "Error al añadir alcance: La descripción es requerida." }
  }
  // Estado es opcional en el tipo Insert, pero si la DB lo requiere, se debe manejar.
  // Por ahora, no lo validamos aquí si el tipo lo permite.

  const supabase = createClient()
  const newAlcance: TablesInsert<"alcances_desarrollo"> = {
    cliente_id: cliente_id as string,
    nombre_modulo: nombre_modulo as string,
    descripcion: descripcion as string,
    fecha_implementacion: fecha_implementacion as string,
    estado: estado as string,
  }

  const { error } = await supabase.from("alcances_desarrollo").insert(newAlcance)

  if (error) {
    console.error("Error adding alcance:", error)
    return { success: false, message: `Error al añadir alcance: ${error.message}` }
  }

  revalidatePath(`/clients/${newAlcance.cliente_id}`)
  return { success: true, message: "Alcance añadido exitosamente." }
}

export async function updateAlcance(
  prevState: any,
  data: Partial<TablesUpdate<"alcances_desarrollo">> & { id: string },
) {
  console.log("--- Server Action: updateAlcance called ---")
  console.log("Server: Received data:", data)

  const { id, cliente_id, nombre_modulo, descripcion, fecha_implementacion, estado } = data

  if (!id || typeof id !== "string" || id.trim() === "") {
    console.error("Error: ID es nulo o inválido para updateAlcance.")
    return { success: false, message: "Error al actualizar alcance: El ID del alcance es requerido." }
  }
  if (!cliente_id || typeof cliente_id !== "string" || cliente_id.trim() === "") {
    console.error("Error: cliente_id es nulo o inválido para updateAlcance.")
    return {
      success: false,
      message: "Error al actualizar alcance: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!nombre_modulo || typeof nombre_modulo !== "string" || nombre_modulo.trim() === "") {
    console.error("Error: nombre_modulo es nulo o inválido para updateAlcance.")
    return { success: false, message: "Error al actualizar alcance: El nombre del módulo es requerido." }
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    console.error("Error: descripcion es nulo o inválido para updateAlcance.")
    return { success: false, message: "Error al actualizar alcance: La descripción es requerida." }
  }

  const supabase = createClient()
  const updatedAlcance: TablesUpdate<"alcances_desarrollo"> = {
    nombre_modulo: nombre_modulo as string,
    descripcion: descripcion as string,
    fecha_implementacion: fecha_implementacion as string,
    estado: estado as string,
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

export async function getAvancesByClientId(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("avances_proyecto")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha", { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getAlcancesByClientId(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("alcances_desarrollo")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha_implementacion", { ascending: false })
  if (error) throw new Error(error.message)
  return data
}
