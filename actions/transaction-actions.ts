"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTransaction(
  prevState: any,
  data: {
    fecha: string
    tipo: "ingreso" | "egreso"
    monto: number
    descripcion: string
    categoria: string
    vendedor?: string | null
    comision?: number | null
  },
) {
  console.log("--- Server Action: createTransaction called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()

  const { data: newTransaction, error } = await supabase.from("transacciones").insert([
    {
      fecha: data.fecha,
      tipo: data.tipo,
      monto: data.monto,
      descripcion: data.descripcion,
      categoria: data.categoria,
      vendedor: data.vendedor || null,
      comision: data.comision || null,
    },
  ])

  if (error) {
    console.error("Error creating transaction:", error)
    return { success: false, message: `Error al crear transacción: ${error.message}` }
  }

  revalidatePath("/transactions") // Revalidar la página de transacciones
  revalidatePath("/account-summary") // Revalidar el resumen de cuenta
  revalidatePath("/net-profit") // Revalidar la utilidad neta
  revalidatePath("/commissions") // Revalidar comisiones
  revalidatePath("/") // Revalidar el dashboard general
  return { success: true, message: "Transacción creada exitosamente." }
}

export async function updateTransaction(
  prevState: any,
  data: {
    id: string
    fecha: string
    tipo: "ingreso" | "egreso"
    monto: number
    descripcion: string
    categoria: string
    vendedor?: string | null
    comision?: number | null
  },
) {
  console.log("--- Server Action: updateTransaction called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()

  const { id, ...updateData } = data

  const { data: updatedTransaction, error } = await supabase
    .from("transacciones")
    .update({
      fecha: updateData.fecha,
      tipo: updateData.tipo,
      monto: updateData.monto,
      descripcion: updateData.descripcion,
      categoria: updateData.categoria,
      vendedor: updateData.vendedor || null,
      comision: updateData.comision || null,
    })
    .eq("id", id)

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
  return { success: true, message: "Transacción eliminada exitosamente" }
}
