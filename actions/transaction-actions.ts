"use server"

import { createClient } from "@/lib/supabase/server" // Importación directa del cliente de servidor
import type { Tables } from "@/lib/database.types"

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const transactionData: Partial<Tables<"transacciones">> = {
    tipo: formData.get("tipo") as Tables<"transacciones">["tipo"],
    concepto: formData.get("concepto") as string,
    monto: Number.parseFloat(formData.get("monto") as string),
    fecha: formData.get("fecha") as string,
    cuenta_id: formData.get("cuenta_id") as string,
    detalle: formData.get("detalle") as string,
    cliente_id: formData.get("cliente_id") === "N/A" ? null : (formData.get("cliente_id") as string),
    tipo_ingreso: formData.get("tipo_ingreso") as Tables<"transacciones">["tipo_ingreso"],
    tipo_egreso: formData.get("tipo_egreso") as Tables<"transacciones">["tipo_egreso"],
    aplicar_comision: formData.get("aplicar_comision") === "on",
    vendedor_comision:
      formData.get("vendedor_comision") === "N/A" ? null : (formData.get("vendedor_comision") as string),
    comision_aplicada: formData.get("comision_aplicada")
      ? Number.parseFloat(formData.get("comision_aplicada") as string)
      : null,
  }

  const { data, error } = await supabase.from("transacciones").insert([transactionData]).select()

  if (error) {
    console.error("Error creating transaction:", error)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Transacción creada exitosamente", data: data[0] }
}

export async function getTransactions() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("transacciones").select("*").order("fecha", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, message: error.message, data: [] }
  }

  return { success: true, message: "Transacciones obtenidas", data }
}

export async function updateTransaction(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const transactionData: Partial<Tables<"transacciones">> = {
    tipo: formData.get("tipo") as Tables<"transacciones">["tipo"],
    concepto: formData.get("concepto") as string,
    monto: Number.parseFloat(formData.get("monto") as string),
    fecha: formData.get("fecha") as string,
    cuenta_id: formData.get("cuenta_id") as string,
    detalle: formData.get("detalle") as string,
    cliente_id: formData.get("cliente_id") === "N/A" ? null : (formData.get("cliente_id") as string),
    tipo_ingreso: formData.get("tipo_ingreso") as Tables<"transacciones">["tipo_ingreso"],
    tipo_egreso: formData.get("tipo_egreso") as Tables<"transacciones">["tipo_egreso"],
    aplicar_comision: formData.get("aplicar_comision") === "on",
    vendedor_comision:
      formData.get("vendedor_comision") === "N/A" ? null : (formData.get("vendedor_comision") as string),
    comision_aplicada: formData.get("comision_aplicada")
      ? Number.parseFloat(formData.get("comision_aplicada") as string)
      : null,
  }

  const { data, error } = await supabase.from("transacciones").update(transactionData).eq("id", id).select()

  if (error) {
    console.error("Error updating transaction:", error)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Transacción actualizada exitosamente", data: data[0] }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("transacciones").delete().eq("id", id)

  if (error) {
    console.error("Error deleting transaction:", error)
    return { success: false, message: error.message }
  }

  return { success: true, message: "Transacción eliminada exitosamente" }
}
