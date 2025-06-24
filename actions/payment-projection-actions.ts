// actions/payment-projection-actions.ts

import { createClient } from "@/lib/supabase/server" // Importación directa del cliente de servidor
import type { Tables } from "@/lib/database.types"

// Helper function to update JSONB arrays
async function updateClientJsonbArray(
  clientId: string,
  fieldName: "historial_pagos" | "proyeccion_pagos",
  newArray: any[],
) {
  const supabase = await createClient() // Usar await
  const { error } = await supabase
    .from("clientes")
    .update({ [fieldName]: newArray as Tables<"clientes">[typeof fieldName] })
    .eq("id", clientId)

  if (error) {
    console.error(`Error updating ${fieldName} for client ${clientId}:`, error)
    return { success: false, message: `Error al actualizar ${fieldName}: ${error.message}` }
  }

  // revalidatePath(`/clients/${clientId}`) // Descomentar si necesitas revalidar la ruta del cliente
  return { success: true, message: `${fieldName} actualizado exitosamente.` }
}

// --- Historial de Pagos Actions ---

export async function addPayment(formData: FormData) {
  const clientId = formData.get("cliente_id") as string
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const descripcion = formData.get("descripcion") as string

  const supabase = await createClient() // Usar await
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("historial_pagos")
    .eq("id", clientId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for payment update:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentPayments = (client.historial_pagos || []) as Array<any>
  const newPayment = { fecha, monto, descripcion }
  const updatedPayments = [...currentPayments, newPayment]

  return updateClientJsonbArray(clientId, "historial_pagos", updatedPayments)
}

export async function updatePayment(formData: FormData) {
  const clientId = formData.get("cliente_id") as string
  const index = Number.parseInt(formData.get("index") as string)
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const descripcion = formData.get("descripcion") as string

  const supabase = await createClient() // Usar await
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("historial_pagos")
    .eq("id", clientId)
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

  return updateClientJsonbArray(clientId, "historial_pagos", updatedPayments)
}

export async function deletePayment(clientId: string, index: number) {
  const supabase = await createClient() // Usar await
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

export async function addProjection(formData: FormData) {
  const clientId = formData.get("cliente_id") as string
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const pagado = formData.get("pagado") === "true"

  const supabase = await createClient() // Usar await
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", clientId)
    .single()

  if (fetchError || !client) {
    console.error("Error fetching client for projection update:", fetchError)
    return { success: false, message: `Error al obtener cliente: ${fetchError?.message}` }
  }

  const currentProjections = (client.proyeccion_pagos || []) as Array<any>
  const newProjection = { fecha, monto, pagado }
  const updatedProjections = [...currentProjections, newProjection]

  return updateClientJsonbArray(clientId, "proyeccion_pagos", updatedProjections)
}

export async function updateProjection(formData: FormData) {
  const clientId = formData.get("cliente_id") as string
  const index = Number.parseInt(formData.get("index") as string)
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const pagado = formData.get("pagado") === "true"

  const supabase = await createClient() // Usar await
  const { data: client, error: fetchError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", clientId)
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

  return updateClientJsonbArray(clientId, "proyeccion_pagos", updatedProjections)
}

export async function deleteProjection(clientId: string, index: number) {
  const supabase = await createClient() // Usar await
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
