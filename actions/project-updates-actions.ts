"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Avances de Proyecto Actions ---

export async function addAvance(prevState: any, data: Partial<TablesInsert<"avances_proyecto">>) {
  console.log("--- Server Action: addAvance called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()
  const newAvance: TablesInsert<"avances_proyecto"> = {
    cliente_id: data.cliente_id as string,
    fecha: data.fecha as string,
    descripcion: data.descripcion as string,
    porcentaje_avance: Number.parseFloat(data.porcentaje_avance as any),
    comentarios_cliente: data.comentarios_cliente as string,
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

  const supabase = createClient()
  const id = data.id as string
  const cliente_id = data.cliente_id as string // Necesario para revalidar la ruta
  const updatedAvance: TablesUpdate<"avances_proyecto"> = {
    fecha: data.fecha as string,
    descripcion: data.descripcion as string,
    porcentaje_avance: Number.parseFloat(data.porcentaje_avance as any),
    comentarios_cliente: data.comentarios_cliente as string,
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

  const supabase = createClient()
  const newAlcance: TablesInsert<"alcances_desarrollo"> = {
    cliente_id: data.cliente_id as string,
    nombre_modulo: data.nombre_modulo as string,
    descripcion: data.descripcion as string,
    fecha_implementacion: data.fecha_implementacion as string,
    estado: data.estado as string,
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

  const supabase = createClient()
  const id = data.id as string
  const cliente_id = data.cliente_id as string // Necesario para revalidar la ruta
  const updatedAlcance: TablesUpdate<"alcances_desarrollo"> = {
    nombre_modulo: data.nombre_modulo as string,
    descripcion: data.descripcion as string,
    fecha_implementacion: data.fecha_implementacion as string,
    estado: data.estado as string,
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
