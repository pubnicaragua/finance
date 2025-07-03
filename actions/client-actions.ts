"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addClient(prevState: any, formData: FormData) {
  const supabase = createClient()
  const newClient: TablesInsert<"clientes"> = {
    cliente: formData.get("cliente") as string,
    proyecto: formData.get("proyecto") as string,
    tipo_software: formData.get("tipo_software") as string,
    estado: formData.get("estado") as string,
    pais: formData.get("pais") as string,
    costo_proyecto: Number.parseFloat(formData.get("costo_proyecto") as string),
    abonado: Number.parseFloat(formData.get("abonado") as string),
    deuda: Number.parseFloat(formData.get("deuda") as string),
    fecha_vencimiento: formData.get("fecha_vencimiento") as string,
    historial_pagos: [],
    proyeccion_pagos: [],
  }

  const { error } = await supabase.from("clientes").insert(newClient)

  if (error) {
    console.error("Error adding client:", error)
    return { success: false, message: `Error al añadir cliente: ${error.message}` }
  }

  revalidatePath("/clients")
  return { success: true, message: "Cliente añadido exitosamente." }
}

export async function updateClient(prevState: any, formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const updatedClient: TablesUpdate<"clientes"> = {
    cliente: formData.get("cliente") as string,
    proyecto: formData.get("proyecto") as string,
    tipo_software: formData.get("tipo_software") as string,
    estado: formData.get("estado") as string,
    pais: formData.get("pais") as string,
    costo_proyecto: Number.parseFloat(formData.get("costo_proyecto") as string),
    abonado: Number.parseFloat(formData.get("abonado") as string),
    deuda: Number.parseFloat(formData.get("deuda") as string),
    fecha_vencimiento: formData.get("fecha_vencimiento") as string,
  }

  const { error } = await supabase.from("clientes").update(updatedClient).eq("id", id)

  if (error) {
    console.error("Error updating client:", error)
    return { success: false, message: `Error al actualizar cliente: ${error.message}` }
  }

  revalidatePath(`/clients/${id}`)
  revalidatePath("/clients")
  return { success: true, message: "Cliente actualizado exitosamente." }
}

export async function deleteClient(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("clientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting client:", error)
    return { success: false, message: `Error al eliminar cliente: ${error.message}` }
  }

  revalidatePath("/clients")
  return { success: true, message: "Cliente eliminado exitosamente." }
}

export async function getClientById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single()
  
  if (error) {
    console.error("Error fetching client:", error)
    return { success: false, message: error.message, data: null }
  }
  
  return { success: true, data }
}

export async function getClients() {
  const supabase = createClient()
  const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }
  
  return data || []
}