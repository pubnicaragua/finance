"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addTransaction(prevState: any, formData: FormData) {
  const supabase = createClient()
  const fecha = formData.get("fecha") as string
  const tipo = formData.get("tipo") as TablesInsert<"transacciones">["tipo"]
  const concepto = formData.get("concepto") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const descripcion = formData.get("descripcion") as string
  const categoria = formData.get("categoria") as string // Esto se mapeará a tipo_ingreso/egreso
  const aplicar_comision = formData.get("aplicar_comision") === "on"
  const vendedor_comision = formData.get("vendedor_comision") as string
  const comision_aplicada = Number.parseFloat(formData.get("comision_aplicada") as string)

  // Validaciones básicas para campos NOT NULL
  if (!concepto || concepto.trim() === "") {
    return { success: false, message: "Error al añadir transacción: El concepto es requerido." }
  }
  if (!fecha || fecha.trim() === "") {
    return { success: false, message: "Error al añadir transacción: La fecha es requerida." }
  }
  if (isNaN(monto)) {
    return { success: false, message: "Error al añadir transacción: El monto es requerido y debe ser un número." }
  }
  if (!tipo || tipo.trim() === "") {
    return { success: false, message: "Error al añadir transacción: El tipo de transacción es requerido." }
  }

  // Lógica para asegurar que solo uno de tipo_ingreso/tipo_egreso esté presente
  let tipo_ingreso_val: string | null = null
  let tipo_egreso_val: string | null = null

  if (tipo === "ingreso") {
    if (!categoria || categoria.trim() === "") {
      return { success: false, message: "Error al añadir transacción: La categoría es requerida para ingresos." }
    }
    tipo_ingreso_val = categoria
  } else if (tipo === "egreso") {
    if (!categoria || categoria.trim() === "") {
      return { success: false, message: "Error al añadir transacción: La categoría es requerida para egresos." }
    }
    tipo_egreso_val = categoria
  }
  // Si tipo es 'transferencia' o cualquier otro, ambos serán null, lo cual es correcto.

  const newTransaction: TablesInsert<"transacciones"> = {
    concepto: concepto,
    fecha: fecha,
    monto: monto,
    tipo: tipo,
    detalle: descripcion,
    tipo_ingreso: tipo_ingreso_val, // Mapeo correcto y validado
    tipo_egreso: tipo_egreso_val, // Mapeo correcto y validado
    aplicar_comision: aplicar_comision,
    vendedor_comision: aplicar_comision ? vendedor_comision : null,
    comision_aplicada: aplicar_comision ? comision_aplicada : null,
  }

  const { error } = await supabase.from("transacciones").insert(newTransaction)

  if (error) {
    console.error("Error adding transaction:", error)
    return { success: false, message: `Error al añadir transacción: ${error.message}` }
  }

  revalidatePath("/transactions")
  revalidatePath("/account-summary")
  revalidatePath("/net-profit")
  revalidatePath("/commissions")
  revalidatePath("/")
  return { success: true, message: "Transacción añadida exitosamente." }
}

export async function updateTransaction(prevState: any, formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const concepto = formData.get("concepto") as string
  const fecha = formData.get("fecha") as string
  const monto = Number.parseFloat(formData.get("monto") as string)
  const tipo = formData.get("tipo") as TablesUpdate<"transacciones">["tipo"]
  const descripcion = formData.get("descripcion") as string
  const categoria = formData.get("categoria") as string // Esto se mapeará a tipo_ingreso/egreso
  const aplicar_comision = formData.get("aplicar_comision") === "on"
  const vendedor_comision = formData.get("vendedor_comision") as string
  const comision_aplicada = Number.parseFloat(formData.get("comision_aplicada") as string)

  // Validaciones básicas para campos NOT NULL
  if (!id || id.trim() === "") {
    return { success: false, message: "Error al actualizar transacción: El ID es requerido." }
  }
  if (!concepto || concepto.trim() === "") {
    return { success: false, message: "Error al actualizar transacción: El concepto es requerido." }
  }
  if (!fecha || fecha.trim() === "") {
    return { success: false, message: "Error al actualizar transacción: La fecha es requerida." }
  }
  if (isNaN(monto)) {
    return { success: false, message: "Error al actualizar transacción: El monto es requerido y debe ser un número." }
  }
  if (!tipo || tipo.trim() === "") {
    return { success: false, message: "Error al actualizar transacción: El tipo de transacción es requerido." }
  }

  // Lógica para asegurar que solo uno de tipo_ingreso/tipo_egreso esté presente
  let tipo_ingreso_val: string | null = null
  let tipo_egreso_val: string | null = null

  if (tipo === "ingreso") {
    if (!categoria || categoria.trim() === "") {
      return { success: false, message: "Error al actualizar transacción: La categoría es requerida para ingresos." }
    }
    tipo_ingreso_val = categoria
  } else if (tipo === "egreso") {
    if (!categoria || categoria.trim() === "") {
      return { success: false, message: "Error al actualizar transacción: La categoría es requerida para egresos." }
    }
    tipo_egreso_val = categoria
  }

  const updatedTransaction: TablesUpdate<"transacciones"> = {
    concepto: concepto,
    fecha: fecha,
    monto: monto,
    tipo: tipo,
    detalle: descripcion,
    tipo_ingreso: tipo_ingreso_val, // Mapeo correcto y validado
    tipo_egreso: tipo_egreso_val, // Mapeo correcto y validado
    aplicar_comision: aplicar_comision,
    vendedor_comision: aplicar_comision ? vendedor_comision : null,
    comision_aplicada: aplicar_comision ? comision_aplicada : null,
  }

  const { error } = await supabase.from("transacciones").update(updatedTransaction).eq("id", id)

  if (error) {
    console.error("Error updating transaction:", error)
    return { success: false, message: `Error al actualizar transacción: ${error.message}` }
  }

  revalidatePath("/transactions")
  revalidatePath("/account-summary")
  revalidatePath("/net-profit")
  revalidatePath("/commissions")
  revalidatePath("/")
  return { success: true, message: "Transacción actualizada exitosamente." }
}

export async function deleteTransaction(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("transacciones").delete().eq("id", id)

  if (error) {
    console.error("Error deleting transaction:", error)
    return { success: false, message: `Error al eliminar transacción: ${error.message}` }
  }

  revalidatePath("/transactions")
  revalidatePath("/account-summary")
  revalidatePath("/net-profit")
  revalidatePath("/commissions")
  revalidatePath("/")
  return { success: true, message: "Transacción eliminada exitosamente." }
}

export async function getTransactions() {
  const supabase = createClient()
  const { data, error } = await supabase.from("transacciones").select("*").order("fecha", { ascending: false })
  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
  return data || []
}
