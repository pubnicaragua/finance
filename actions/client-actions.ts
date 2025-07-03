"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addClient(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  try {
    // Validate required fields
    const cliente = formData.get("cliente") as string
    const proyecto = formData.get("proyecto") as string
    
    if (!cliente || !proyecto) {
      return { 
        success: false, 
        message: "Cliente y proyecto son campos requeridos." 
      }
    }
    
    // Parse numeric values
    const costoProyectoStr = formData.get("costo_proyecto") as string
    const abonadoStr = formData.get("abonado") as string
    
    const costo_proyecto = costoProyectoStr ? Number.parseFloat(costoProyectoStr) : 0
    const abonado = abonadoStr ? Number.parseFloat(abonadoStr) : 0
    
    // Create client object
    const newClient: TablesInsert<"clientes"> = {
      cliente: cliente,
      proyecto: proyecto,
      tipo_software: formData.get("tipo_software") as string || null,
      estado: formData.get("estado") as string || "Activo", // Default to "Activo" if not provided
      pais: formData.get("pais") as string || null,
      costo_proyecto: costo_proyecto,
      abonado: abonado,
      // deuda is a computed field
      fecha_vencimiento: formData.get("fecha_vencimiento") as string || null,
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
  } catch (err: any) {
    console.error("Exception adding client:", err)
    return { success: false, message: `Error inesperado: ${err.message}` }
  }
}

export async function updateClient(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  try {
    const id = formData.get("id") as string
    if (!id) {
      return { success: false, message: "ID del cliente es requerido para actualizar." }
    }
    
    // Validate required fields
    const cliente = formData.get("cliente") as string
    const proyecto = formData.get("proyecto") as string
    
    if (!cliente || !proyecto) {
      return { 
        success: false, 
        message: "Cliente y proyecto son campos requeridos." 
      }
    }
    
    // Parse numeric values
    const costoProyectoStr = formData.get("costo_proyecto") as string
    const abonadoStr = formData.get("abonado") as string
    
    const costo_proyecto = costoProyectoStr ? Number.parseFloat(costoProyectoStr) : 0
    const abonado = abonadoStr ? Number.parseFloat(abonadoStr) : 0
    
    const updatedClient: TablesUpdate<"clientes"> = {
      cliente: cliente,
      proyecto: proyecto,
      tipo_software: formData.get("tipo_software") as string || null,
      estado: formData.get("estado") as string || null,
      pais: formData.get("pais") as string || null,
      costo_proyecto: costo_proyecto,
      abonado: abonado,
      fecha_vencimiento: formData.get("fecha_vencimiento") as string || null,
    }

    const { error } = await supabase.from("clientes").update(updatedClient).eq("id", id)

    if (error) {
      console.error("Error updating client:", error)
      return { success: false, message: `Error al actualizar cliente: ${error.message}` }
    }

    revalidatePath(`/clients/${id}`)
    revalidatePath("/clients")
    return { success: true, message: "Cliente actualizado exitosamente." }
  } catch (err: any) {
    console.error("Exception updating client:", err)
    return { success: false, message: `Error inesperado: ${err.message}` }
  }
}

export async function deleteClient(id: string) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase.from("clientes").delete().eq("id", id)

    if (error) {
      console.error("Error deleting client:", error)
      return { success: false, message: `Error al eliminar cliente: ${error.message}` }
    }

    revalidatePath("/clients")
    return { success: true, message: "Cliente eliminado exitosamente." }
  } catch (err: any) {
    console.error("Exception deleting client:", err)
    return { success: false, message: `Error inesperado: ${err.message}` }
  }
}

export async function getClientById(id: string) {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single()
    
    if (error) {
      console.error("Error fetching client:", error)
      return { success: false, message: error.message, data: null }
    }
    
    return { success: true, data }
  } catch (err: any) {
    console.error("Exception fetching client:", err)
    return { success: false, message: err.message, data: null }
  }
}

export async function getClients() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching clients:", error)
      return []
    }
    
    return data || []
  } catch (err: any) {
    console.error("Exception fetching clients:", err)
    return []
  }
}