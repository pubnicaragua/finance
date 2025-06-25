"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addTransaction(
  prevState: any,
  data: Partial<TablesInsert<"transacciones"> & { categoria: string }>,
) {
  console.log("--- Server Action: addTransaction called ---")
  console.log("Server: Received data:", data)

  const {
    concepto,
    fecha,
    monto,
    tipo,
    descripcion,
    categoria,
    aplicar_comision,
    vendedor_comision,
    comision_aplicada,
  } = data

  // Validaciones básicas para campos NOT NULL
  if (!concepto) {
    console.error("Error: concepto es nulo o inválido para addTransaction.")
    return { success: false, message: "Error al añadir transacción: El concepto es requerido." }
  }
  if (!fecha) {
    console.error("Error: fecha es nulo o inválido para addTransaction.")
    return { success: false, message: "Error al añadir transacción: La fecha es requerida." }
  }
  if (monto === undefined || monto === null) {
    console.error("Error: monto es nulo o inválido para addTransaction.")
    return { success: false, message: "Error al añadir transacción: El monto es requerido." }
  }
  if (!tipo) {
    console.error("Error: tipo es nulo o inválido para addTransaction.")
    return { success: false, message: "Error al añadir transacción: El tipo de transacción es requerido." }
  }

  const supabase = createClient()
  const newTransaction: TablesInsert<"transacciones"> = {
    concepto: concepto as string,
    fecha: fecha as string,
    monto: Number.parseFloat(monto as any),
    tipo: tipo as string,
    detalle: descripcion, // Mapear descripcion a detalle
    tipo_ingreso: tipo === "ingreso" ? categoria : null, // Usar categoria como tipo_ingreso/egreso
    tipo_egreso: tipo === "egreso" ? categoria : null,
    aplicar_comision: aplicar_comision || false,
    vendedor_comision: aplicar_comision ? (vendedor_comision as string) : null,
    comision_aplicada: aplicar_comision ? Number.parseFloat(comision_aplicada as any) : null,
    // cliente_id y cuenta_id se pueden añadir si son relevantes para transacciones generales
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
  revalidatePath("/") // Revalidar el dashboard general
  return { success: true, message: "Transacción añadida exitosamente." }
}

export async function updateTransaction(
  prevState: any,
  data: Partial<TablesUpdate<"transacciones">> & { id: string; categoria: string },
) {
  console.log("--- Server Action: updateTransaction called ---")
  console.log("Server: Received data:", data)

  const {
    id,
    concepto,
    fecha,
    monto,
    tipo,
    descripcion,
    categoria,
    aplicar_comision,
    vendedor_comision,
    comision_aplicada,
  } = data

  // Validaciones básicas para campos NOT NULL
  if (!id) {
    console.error("Error: ID es nulo o inválido para updateTransaction.")
    return { success: false, message: "Error al actualizar transacción: El ID es requerido." }
  }
  if (!concepto) {
    console.error("Error: concepto es nulo o inválido para updateTransaction.")
    return { success: false, message: "Error al actualizar transacción: El concepto es requerido." }
  }
  if (!fecha) {
    console.error("Error: fecha es nulo o inválido para updateTransaction.")
    return { success: false, message: "Error al actualizar transacción: La fecha es requerida." }
  }
  if (monto === undefined || monto === null) {
    console.error("Error: monto es nulo o inválido para updateTransaction.")
    return { success: false, message: "Error al actualizar transacción: El monto es requerido." }
  }
  if (!tipo) {
    console.error("Error: tipo es nulo o inválido para updateTransaction.")
    return { success: false, message: "Error al actualizar transacción: El tipo de transacción es requerido." }
  }

  const supabase = createClient()
  const updatedTransaction: TablesUpdate<"transacciones"> = {
    concepto: concepto as string,
    fecha: fecha as string,
    monto: Number.parseFloat(monto as any),
    tipo: tipo as string,
    detalle: descripcion, // Mapear descripcion a detalle
    tipo_ingreso: tipo === "ingreso" ? categoria : null, // Usar categoria como tipo_ingreso/egreso
    tipo_egreso: tipo === "egreso" ? categoria : null,
    aplicar_comision: aplicar_comision || false,
    vendedor_comision: aplicar_comision ? (vendedor_comision as string) : null,
    comision_aplicada: aplicar_comision ? Number.parseFloat(comision_aplicada as any) : null,
    // cliente_id y cuenta_id se pueden añadir si son relevantes para transacciones generales
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
