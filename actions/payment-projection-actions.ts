"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Tables } from "@/lib/database.types"

// Helper function to update JSONB arrays
async function updateClientJsonbArray(
  clientId: string,
  fieldName: "historial_pagos" | "proyeccion_pagos",
  newArray: any[],
) {
  const supabase = createClient()
  const { error } = await supabase
    .from("clientes")
    .update({ [fieldName]: newArray as Tables<"clientes">[typeof fieldName] })
    .eq("id", clientId)

  if (error) {
    console.error(`Error updating ${fieldName} for client ${clientId}:`, error)
    return { success: false, message: `Error al actualizar ${fieldName}: ${error.message}` }
  }

  revalidatePath(`/clients/${clientId}`) // Revalidar la página del cliente para mostrar los cambios
  return { success: true, message: `${fieldName} actualizado exitosamente.` }
}

// --- Historial de Pagos Actions ---

export async function addPayment(
  prevState: any,
  data: { clienteId: string; fecha: string; monto: number; descripcion: string },
) {
  console.log("--- Server Action: addPayment called ---")
  console.log("Server: Received data:", data)

  const { clienteId, fecha, monto, descripcion } = data

  const supabase = createClient()
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("historial_pagos")
    .eq("id", clienteId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for payment update:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentPayments = (client.historial_pagos || []) as Array<any>
  const newPayment = { fecha, monto, descripcion }
  const updatedPayments = [...currentPayments, newPayment]

  return updateClientJsonbArray(clienteId, "historial_pagos", updatedPayments)
}

export async function updatePayment(
  prevState: any,
  data: { clienteId: string; index: number; fecha: string; monto: number; descripcion: string },
) {
  console.log("--- Server Action: updatePayment called ---")
  console.log("Server: Received data:", data)

  const { clienteId, index, fecha, monto, descripcion } = data

  const supabase = createClient()
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("historial_pagos")
    .eq("id", clienteId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for payment update:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentPayments = (client.historial_pagos || []) as Array<any>
  if (index < 0 || index >= currentPayments.length) {
    return { success: false, message: "Índice de pago inválido." }
  }

  const updatedPayments = [...currentPayments]
  updatedPayments[index] = { fecha, monto, descripcion }

  return updateClientJsonbArray(clienteId, "historial_pagos", updatedPayments)
}

export async function deletePayment(clientId: string, index: number) {
  const supabase = createClient()
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("historial_pagos")
    .eq("id", clientId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for payment delete:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentPayments = (client.historial_pagos || []) as Array<any>
  if (index < 0 || index >= currentPayments.length) {
    return { success: false, message: "Índice de pago inválido." }
  }

  const updatedPayments = currentPayments.filter((_, i) => i !== index)

  return updateClientJsonbArray(clientId, "historial_pagos", updatedPayments)
}

// --- Proyecciones de Pagos Actions ---

export async function addProjection(
  prevState: any,
  data: { clienteId: string; fecha: string; monto: number; pagado: boolean },
) {
  console.log("--- Server Action: addProjection called ---")
  console.log("Server: Received data:", data)

  const { clienteId, fecha, monto, pagado } = data

  const supabase = createClient()
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", clienteId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for projection update:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentProjections = (client.proyeccion_pagos || []) as Array<any>
  const newProjection = { fecha, monto, pagado }
  const updatedProjections = [...currentProjections, newProjection]

  return updateClientJsonbArray(clienteId, "proyeccion_pagos", updatedProjections)
}

export async function updateProjection(
  prevState: any,
  data: { clienteId: string; index: number; fecha: string; monto: number; pagado: boolean },
) {
  console.log("--- Server Action: updateProjection called ---")
  console.log("Server: Received data:", data)

  const { clienteId, index, fecha, monto, pagado } = data

  const supabase = createClient()
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", clienteId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for projection update:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentProjections = (client.proyeccion_pagos || []) as Array<any>
  if (index < 0 || index >= currentProjections.length) {
    return { success: false, message: "Índice de proyección inválido." }
  }

  const updatedProjections = [...currentProjections]
  updatedProjections[index] = { fecha, monto, pagado }

  return updateClientJsonbArray(clienteId, "proyeccion_pagos", updatedProjections)
}

export async function deleteProjection(clientId: string, index: number) {
  const supabase = createClient()
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", clientId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for projection delete:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentProjections = (client.proyeccion_pagos || []) as Array<any>
  if (index < 0 || index >= currentProjections.length) {
    return { success: false, message: "Índice de proyección inválido." }
  }

  const updatedProjections = currentProjections.filter((_, i) => i !== index)

  return updateClientJsonbArray(clientId, "proyeccion_pagos", updatedProjections)
}
