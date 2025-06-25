"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// Helper function to update client's 'abonado' and 'historial_pagos'
async function updateClientPaymentHistory(clienteId: string, newHistorialPagos: any[]) {
  const supabase = createClient()

  // Calculate new 'abonado' total
  const newAbonado = newHistorialPagos.reduce((sum, payment) => sum + (payment?.monto || 0), 0)

  const { error: updateClientError } = await supabase
    .from("clientes")
    .update({
      historial_pagos: newHistorialPagos,
      abonado: newAbonado,
    })
    .eq("id", clienteId)

  if (updateClientError) {
    console.error("Error updating client's payment history and abonado:", updateClientError)
    return { success: false, message: `Error al actualizar el cliente: ${updateClientError.message}` }
  }
  return { success: true }
}

export async function addPayment(prevState: any, formData: FormData) {
  console.log("--- Server Action: addPayment called ---")
  const cliente_id = formData.get("cliente_id") as string
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const descripcion = formData.get("descripcion") as string

  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Validation Error: cliente_id es nulo o inválido para addPayment.")
    return {
      success: false,
      message: "Error al añadir pago: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!fecha || fecha.trim() === "") {
    console.error("Validation Error: fecha es nulo o inválido para addPayment.")
    return { success: false, message: "Error al añadir pago: La fecha es requerida." }
  }
  if (isNaN(monto)) {
    console.error("Validation Error: monto es nulo o inválido para addPayment.")
    return { success: false, message: "Error al añadir pago: El monto es requerido y debe ser un número válido." }
  }

  const supabase = createClient()

  const { data: client, error: fetchClientError } = await supabase
    .from("clientes")
    .select("historial_pagos, abonado")
    .eq("id", cliente_id)
    .single()

  if (fetchClientError || !client) {
    console.error("Error fetching client for addPayment:", fetchClientError)
    return { success: false, message: `Error al obtener cliente para añadir pago: ${fetchClientError?.message}` }
  }

  const currentHistorialPagos = (client.historial_pagos || []) as Array<any>
  const newPayment = { fecha, monto, descripcion: descripcion || null }
  const updatedHistorialPagos = [...currentHistorialPagos, newPayment]

  const { success, message } = await updateClientPaymentHistory(cliente_id, updatedHistorialPagos)

  if (!success) {
    return { success: false, message }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Pago añadido exitosamente." }
}

export async function updatePayment(prevState: any, formData: FormData) {
  console.log("--- Server Action: updatePayment called ---")
  const cliente_id = formData.get("cliente_id") as string
  const index = Number.parseInt(formData.get("index") as string)
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const descripcion = formData.get("descripcion") as string

  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Validation Error: cliente_id es nulo o inválido para updatePayment.")
    return {
      success: false,
      message: "Error al actualizar pago: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (isNaN(index) || index < 0) {
    console.error("Validation Error: index es nulo o inválido para updatePayment.")
    return {
      success: false,
      message: "Error al actualizar pago: El índice del pago es requerido y debe ser un número válido.",
    }
  }
  if (!fecha || fecha.trim() === "") {
    console.error("Validation Error: fecha es nulo o inválido para updatePayment.")
    return { success: false, message: "Error al actualizar pago: La fecha es requerida." }
  }
  if (isNaN(monto)) {
    console.error("Validation Error: monto es nulo o inválido para updatePayment.")
    return { success: false, message: "Error al actualizar pago: El monto es requerido y debe ser un número válido." }
  }

  const supabase = createClient()

  const { data: client, error: fetchClientError } = await supabase
    .from("clientes")
    .select("historial_pagos, abonado")
    .eq("id", cliente_id)
    .single()

  if (fetchClientError || !client) {
    console.error("Error fetching client for updatePayment:", fetchClientError)
    return { success: false, message: `Error al obtener cliente para actualizar pago: ${fetchClientError?.message}` }
  }

  const currentHistorialPagos = (client.historial_pagos || []) as Array<any>
  if (index >= currentHistorialPagos.length) {
    return { success: false, message: "Índice de pago fuera de rango." }
  }

  const updatedHistorialPagos = [...currentHistorialPagos]
  updatedHistorialPagos[index] = { fecha, monto, descripcion: descripcion || null }

  const { success, message } = await updateClientPaymentHistory(cliente_id, updatedHistorialPagos)

  if (!success) {
    return { success: false, message }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Pago actualizado exitosamente." }
}

export async function deletePayment(clienteId: string, index: number) {
  console.log("--- Server Action: deletePayment called ---")

  if (!clienteId || clienteId.trim() === "") {
    console.error("Validation Error: clienteId es nulo o inválido para deletePayment.")
    return {
      success: false,
      message: "Error al eliminar pago: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (isNaN(index) || index < 0) {
    console.error("Validation Error: index es nulo o inválido para deletePayment.")
    return {
      success: false,
      message: "Error al eliminar pago: El índice del pago es requerido y debe ser un número válido.",
    }
  }

  const supabase = createClient()

  const { data: client, error: fetchClientError } = await supabase
    .from("clientes")
    .select("historial_pagos, abonado")
    .eq("id", clienteId)
    .single()

  if (fetchClientError || !client) {
    console.error("Error fetching client for deletePayment:", fetchClientError)
    return { success: false, message: `Error al obtener cliente para eliminar pago: ${fetchClientError?.message}` }
  }

  const currentHistorialPagos = (client.historial_pagos || []) as Array<any>
  if (index >= currentHistorialPagos.length) {
    return { success: false, message: "Índice de pago fuera de rango." }
  }

  const updatedHistorialPagos = currentHistorialPagos.filter((_, i) => i !== index)

  const { success, message } = await updateClientPaymentHistory(clienteId, updatedHistorialPagos)

  if (!success) {
    return { success: false, message }
  }

  revalidatePath(`/clients/${clienteId}`)
  return { success: true, message: "Pago eliminado exitosamente." }
}

export async function addProjection(prevState: any, formData: FormData) {
  console.log("--- Server Action: addProjection called ---")
  const cliente_id = formData.get("cliente_id") as string
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const descripcion = formData.get("descripcion") as string
  const estado = formData.get("estado") as string

  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Validation Error: cliente_id es nulo o inválido para addProjection.")
    return {
      success: false,
      message: "Error al añadir proyección: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (!fecha || fecha.trim() === "") {
    console.error("Validation Error: fecha es nulo o inválido para addProjection.")
    return { success: false, message: "Error al añadir proyección: La fecha es requerida." }
  }
  if (isNaN(monto)) {
    console.error("Validation Error: monto es nulo o inválido para addProjection.")
    return { success: false, message: "Error al añadir proyección: El monto es requerido y debe ser un número válido." }
  }

  const supabase = createClient()

  const { data: client, error: fetchClientError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", cliente_id)
    .single()

  if (fetchClientError || !client) {
    console.error("Error fetching client for addProjection:", fetchClientError)
    return { success: false, message: `Error al obtener cliente para añadir proyección: ${fetchClientError?.message}` }
  }

  const currentProyeccionPagos = (client.proyeccion_pagos || []) as Array<any>
  const newProjection = { fecha, monto, descripcion: descripcion || null, estado: estado || "Pendiente" }
  const updatedProyeccionPagos = [...currentProyeccionPagos, newProjection]

  const { error: updateError } = await supabase
    .from("clientes")
    .update({ proyeccion_pagos: updatedProyeccionPagos })
    .eq("id", cliente_id)

  if (updateError) {
    console.error("Error adding projection:", updateError)
    return { success: false, message: `Error al añadir proyección: ${updateError.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Proyección añadida exitosamente." }
}

export async function updateProjection(prevState: any, formData: FormData) {
  console.log("--- Server Action: updateProjection called ---")
  const cliente_id = formData.get("cliente_id") as string
  const index = Number.parseInt(formData.get("index") as string)
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const descripcion = formData.get("descripcion") as string
  const estado = formData.get("estado") as string

  if (!cliente_id || cliente_id.trim() === "") {
    console.error("Validation Error: cliente_id es nulo o inválido para updateProjection.")
    return {
      success: false,
      message: "Error al actualizar proyección: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (isNaN(index) || index < 0) {
    console.error("Validation Error: index es nulo o inválido para updateProjection.")
    return {
      success: false,
      message: "Error al actualizar proyección: El índice de la proyección es requerido y debe ser un número válido.",
    }
  }
  if (!fecha || fecha.trim() === "") {
    console.error("Validation Error: fecha es nulo o inválido para updateProjection.")
    return { success: false, message: "Error al actualizar proyección: La fecha es requerida." }
  }
  if (isNaN(monto)) {
    console.error("Validation Error: monto es nulo o inválido para updateProjection.")
    return {
      success: false,
      message: "Error al actualizar proyección: El monto es requerido y debe ser un número válido.",
    }
  }

  const supabase = createClient()

  const { data: client, error: fetchClientError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", cliente_id)
    .single()

  if (fetchClientError || !client) {
    console.error("Error fetching client for updateProjection:", fetchClientError)
    return {
      success: false,
      message: `Error al obtener cliente para actualizar proyección: ${fetchClientError?.message}`,
    }
  }

  const currentProyeccionPagos = (client.proyeccion_pagos || []) as Array<any>
  if (index >= currentProyeccionPagos.length) {
    return { success: false, message: "Índice de proyección fuera de rango." }
  }

  const updatedProyeccionPagos = [...currentProyeccionPagos]
  updatedProyeccionPagos[index] = {
    fecha,
    monto,
    descripcion: descripcion || null,
    estado: estado || "Pendiente",
  }

  const { error: updateError } = await supabase
    .from("clientes")
    .update({ proyeccion_pagos: updatedProyeccionPagos })
    .eq("id", cliente_id)

  if (updateError) {
    console.error("Error updating projection:", updateError)
    return { success: false, message: `Error al actualizar proyección: ${updateError.message}` }
  }

  revalidatePath(`/clients/${cliente_id}`)
  return { success: true, message: "Proyección actualizada exitosamente." }
}

export async function deleteProjection(clienteId: string, index: number) {
  console.log("--- Server Action: deleteProjection called ---")

  if (!clienteId || clienteId.trim() === "") {
    console.error("Validation Error: clienteId es nulo o inválido para deleteProjection.")
    return {
      success: false,
      message: "Error al eliminar proyección: El ID del cliente es requerido y debe ser una cadena válida.",
    }
  }
  if (isNaN(index) || index < 0) {
    console.error("Validation Error: index es nulo o inválido para deleteProjection.")
    return {
      success: false,
      message: "Error al eliminar proyección: El índice de la proyección es requerido y debe ser un número válido.",
    }
  }

  const supabase = createClient()

  const { data: client, error: fetchClientError } = await supabase
    .from("clientes")
    .select("proyeccion_pagos")
    .eq("id", clienteId)
    .single()

  if (fetchClientError || !client) {
    console.error("Error fetching client for deleteProjection:", fetchClientError)
    return {
      success: false,
      message: `Error al obtener cliente para eliminar proyección: ${fetchClientError?.message}`,
    }
  }

  const currentProyeccionPagos = (client.proyeccion_pagos || []) as Array<any>
  if (index >= currentProyeccionPagos.length) {
    return { success: false, message: "Índice de proyección fuera de rango." }
  }

  const updatedProyeccionPagos = currentProyeccionPagos.filter((_, i) => i !== index)

  const { error: updateError } = await supabase
    .from("clientes")
    .update({ proyeccion_pagos: updatedProyeccionPagos })
    .eq("id", clienteId)

  if (updateError) {
    console.error("Error deleting projection:", updateError)
    return { success: false, message: `Error al eliminar proyección: ${updateError.message}` }
  }

  revalidatePath(`/clients/${clienteId}`)
  return { success: true, message: "Proyección eliminada exitosamente." }
}

export async function getPaymentsByClientId(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("clientes").select("historial_pagos").eq("id", id).single()
  if (error) {
    console.error("Error fetching payments:", error)
    return [] // Asegurar que siempre devuelve un array
  }
  return data?.historial_pagos ?? []
}

export async function getProjectionsByClientId(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("clientes").select("proyeccion_pagos").eq("id", id).single()
  if (error) {
    console.error("Error fetching projections:", error)
    return [] // Asegurar que siempre devuelve un array
  }
  return data?.proyeccion_pagos ?? []
}
