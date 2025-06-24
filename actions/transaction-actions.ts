"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addTransaction(formData: FormData) {
  const supabase = createClient()
  const newTransaction: TablesInsert<"transacciones"> = {
    concepto: formData.get("concepto") as string,
    tipo: formData.get("tipo") as string, // 'ingreso' or 'egreso'
    monto: Number.parseFloat(formData.get("monto") as string),
    fecha: formData.get("fecha") as string,
    cuenta_id: formData.get("cuenta_id") as string,
    detalle: formData.get("detalle") as string,
    cliente_id: (formData.get("cliente_id") as string) || null, // Optional for income
    tipo_ingreso: (formData.get("tipo_ingreso") as string) || null, // Specific for income
    tipo_egreso: (formData.get("tipo_egreso") as string) || null, // Specific for expense
    aplicar_comision: formData.get("aplicar_comision") === "true",
    vendedor_comision: (formData.get("vendedor_comision") as string) || null,
    comision_aplicada: formData.get("comision_aplicada")
      ? Number.parseFloat(formData.get("comision_aplicada") as string)
      : null,
  }

  const { error } = await supabase.from("transacciones").insert(newTransaction)

  if (error) {
    console.error("Error adding transaction:", error)
    return { success: false, message: `Error al añadir transacción: ${error.message}` }
  }

  revalidatePath("/transactions")
  revalidatePath("/account-summary") // Revalidate account summary as balances might change
  revalidatePath("/net-profit") // Revalidate net profit
  revalidatePath("/") // Revalidate dashboard
  return { success: true, message: "Transacción añadida exitosamente." }
}

export async function updateTransaction(formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const updatedTransaction: TablesUpdate<"transacciones"> = {
    concepto: formData.get("concepto") as string,
    tipo: formData.get("tipo") as string,
    monto: Number.parseFloat(formData.get("monto") as string),
    fecha: formData.get("fecha") as string,
    cuenta_id: formData.get("cuenta_id") as string,
    detalle: formData.get("detalle") as string,
    cliente_id: (formData.get("cliente_id") as string) || null,
    tipo_ingreso: (formData.get("tipo_ingreso") as string) || null,
    tipo_egreso: (formData.get("tipo_egreso") as string) || null,
    aplicar_comision: formData.get("aplicar_comision") === "true",
    vendedor_comision: (formData.get("vendedor_comision") as string) || null,
    comision_aplicada: formData.get("comision_aplicada")
      ? Number.parseFloat(formData.get("comision_aplicada") as string)
      : null,
  }

  const { error } = await supabase.from("transacciones").update(updatedTransaction).eq("id", id)

  if (error) {
    console.error("Error updating transaction:", error)
    return { success: false, message: `Error al actualizar transacción: ${error.message}` }
  }

  revalidatePath("/transactions")
  revalidatePath("/account-summary")
  revalidatePath("/net-profit")
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
  revalidatePath("/")
  return { success: true, message: "Transacción eliminada exitosamente." }
}
