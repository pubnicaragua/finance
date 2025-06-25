"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addTransaction(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesInsert<"transacciones">>

  const { fecha, tipo, categoria, descripcion, monto, cuenta_origen_id, cuenta_destino_id, cliente_id, proyecto_id } =
    data

  if (!fecha || typeof fecha !== "string" || fecha.trim() === "") {
    return { success: false, message: "La fecha es requerida." }
  }
  if (!tipo || typeof tipo !== "string" || tipo.trim() === "") {
    return { success: false, message: "El tipo es requerido." }
  }
  if (!categoria || typeof categoria !== "string" || categoria.trim() === "") {
    return { success: false, message: "La categoría es requerida." }
  }
  if (monto === undefined || monto === null || isNaN(Number(monto))) {
    return { success: false, message: "El monto es requerido y debe ser un número." }
  }

  const newTransaction: TablesInsert<"transacciones"> = {
    fecha: fecha,
    tipo: tipo,
    categoria: categoria,
    descripcion: descripcion || null,
    monto: Number(monto),
    cuenta_origen_id: cuenta_origen_id || null,
    cuenta_destino_id: cuenta_destino_id || null,
    cliente_id: cliente_id || null,
    proyecto_id: proyecto_id || null,
  }

  const { error } = await supabase.from("transacciones").insert(newTransaction)

  if (error) {
    console.error("Error adding transaction:", error)
    return { success: false, message: `Error al añadir transacción: ${error.message}` }
  }

  revalidatePath("/transactions")
  return { success: true, message: "Transacción añadida exitosamente." }
}

export async function updateTransaction(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesUpdate<"transacciones">> & { id: string }

  const {
    id,
    fecha,
    tipo,
    categoria,
    descripcion,
    monto,
    cuenta_origen_id,
    cuenta_destino_id,
    cliente_id,
    proyecto_id,
  } = data

  if (!id || typeof id !== "string" || id.trim() === "") {
    return { success: false, message: "El ID de la transacción es requerido." }
  }
  if (!fecha || typeof fecha !== "string" || fecha.trim() === "") {
    return { success: false, message: "La fecha es requerida." }
  }
  if (!tipo || typeof tipo !== "string" || tipo.trim() === "") {
    return { success: false, message: "El tipo es requerido." }
  }
  if (!categoria || typeof categoria !== "string" || categoria.trim() === "") {
    return { success: false, message: "La categoría es requerida." }
  }
  if (monto === undefined || monto === null || isNaN(Number(monto))) {
    return { success: false, message: "El monto es requerido y debe ser un número." }
  }

  const updatedTransaction: TablesUpdate<"transacciones"> = {
    fecha: fecha,
    tipo: tipo,
    categoria: categoria,
    descripcion: descripcion || null,
    monto: Number(monto),
    cuenta_origen_id: cuenta_origen_id || null,
    cuenta_destino_id: cuenta_destino_id || null,
    cliente_id: cliente_id || null,
    proyecto_id: proyecto_id || null,
  }

  const { error } = await supabase.from("transacciones").update(updatedTransaction).eq("id", id)

  if (error) {
    console.error("Error updating transaction:", error)
    return { success: false, message: `Error al actualizar transacción: ${error.message}` }
  }

  revalidatePath("/transactions")
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
  return { success: true, message: "Transacción eliminada exitosamente." }
}

export async function getTransactions() {
  const supabase = createClient()
  const { data, error } = await supabase.from("transacciones").select("*").order("fecha", { ascending: false })
  if (error) {
    console.error("Error fetching transactions:", error)
    return [] // Devolver array vacío en caso de error
  }
  return data || [] // Asegurar que siempre sea un array
}
