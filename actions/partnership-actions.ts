"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addPartnership(formData: FormData) {
  const supabase = createClient()
  const newPartnership: TablesInsert<"partnerships"> = {
    nombre: formData.get("nombre") as string,
    tipo_acuerdo: formData.get("tipo_acuerdo") as string,
    fecha_inicio: formData.get("fecha_inicio") as string,
    fecha_fin: formData.get("fecha_fin") as string,
    estado: formData.get("estado") as string,
    monto_financiado: Number.parseFloat(formData.get("monto_financiado") as string),
    responsabilidades: JSON.parse((formData.get("responsabilidades") as string) || "[]"),
    expectativas: JSON.parse((formData.get("expectativas") as string) || "[]"),
    historial_interacciones: JSON.parse((formData.get("historial_interacciones") as string) || "[]"),
  }

  const { error } = await supabase.from("partnerships").insert(newPartnership)

  if (error) {
    console.error("Error adding partnership:", error)
    return { success: false, message: `Error al añadir partnership: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Partnership añadido exitosamente." }
}

export async function updatePartnership(formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const updatedPartnership: TablesUpdate<"partnerships"> = {
    nombre: formData.get("nombre") as string,
    tipo_acuerdo: formData.get("tipo_acuerdo") as string,
    fecha_inicio: formData.get("fecha_inicio") as string,
    fecha_fin: formData.get("fecha_fin") as string,
    estado: formData.get("estado") as string,
    monto_financiado: Number.parseFloat(formData.get("monto_financiado") as string),
    responsabilidades: JSON.parse((formData.get("responsabilidades") as string) || "[]"),
    expectativas: JSON.parse((formData.get("expectativas") as string) || "[]"),
    historial_interacciones: JSON.parse((formData.get("historial_interacciones") as string) || "[]"),
  }

  const { error } = await supabase.from("partnerships").update(updatedPartnership).eq("id", id)

  if (error) {
    console.error("Error updating partnership:", error)
    return { success: false, message: `Error al actualizar partnership: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Partnership actualizado exitosamente." }
}

export async function deletePartnership(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("partnerships").delete().eq("id", id)

  if (error) {
    console.error("Error deleting partnership:", error)
    return { success: false, message: `Error al eliminar partnership: ${error.message}` }
  }

  revalidatePath("/partnerships")
  return { success: true, message: "Partnership eliminado exitosamente." }
}
