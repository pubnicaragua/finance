"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addPayroll(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const newPayroll: TablesInsert<"nomina"> = {
    empleado_id: formData.get("empleado_id") as string,
    periodo_inicio: formData.get("periodo_inicio") as string,
    periodo_fin: formData.get("periodo_fin") as string,
    salario_base: Number.parseFloat(formData.get("salario_base") as string),
    bonificaciones: Number.parseFloat(formData.get("bonificaciones") as string) || 0,
    deducciones: Number.parseFloat(formData.get("deducciones") as string) || 0,
    estado: formData.get("estado") as string,
    fecha_pago: formData.get("fecha_pago") as string || null,
    notas: formData.get("notas") as string,
  }

  const { error } = await supabase.from("nomina").insert(newPayroll)

  if (error) {
    console.error("Error adding payroll:", error)
    return { success: false, message: `Error al procesar nómina: ${error.message}` }
  }

  revalidatePath("/payroll")
  return { success: true, message: "Nómina procesada exitosamente." }
}

export async function updatePayroll(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const updatedPayroll: TablesUpdate<"nomina"> = {
    empleado_id: formData.get("empleado_id") as string,
    periodo_inicio: formData.get("periodo_inicio") as string,
    periodo_fin: formData.get("periodo_fin") as string,
    salario_base: Number.parseFloat(formData.get("salario_base") as string),
    bonificaciones: Number.parseFloat(formData.get("bonificaciones") as string) || 0,
    deducciones: Number.parseFloat(formData.get("deducciones") as string) || 0,
    estado: formData.get("estado") as string,
    fecha_pago: formData.get("fecha_pago") as string || null,
    notas: formData.get("notas") as string,
  }

  const { error } = await supabase.from("nomina").update(updatedPayroll).eq("id", id)

  if (error) {
    console.error("Error updating payroll:", error)
    return { success: false, message: `Error al actualizar nómina: ${error.message}` }
  }

  revalidatePath("/payroll")
  return { success: true, message: "Nómina actualizada exitosamente." }
}

export async function deletePayroll(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("nomina").delete().eq("id", id)

  if (error) {
    console.error("Error deleting payroll:", error)
    return { success: false, message: `Error al eliminar registro de nómina: ${error.message}` }
  }

  revalidatePath("/payroll")
  return { success: true, message: "Registro de nómina eliminado exitosamente." }
}

export async function getActiveEmployees() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("empleados")
    .select("*")
    .eq("estado", "Activo")
    .order("nombre", { ascending: true })
  
  if (error) {
    console.error("Error fetching active employees:", error)
    return []
  }
  return data || []
}

export async function getPayroll() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("nomina")
    .select(`
      *,
      empleados (
        nombre,
        apellido,
        puesto
      )
    `)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching payroll:", error)
    return []
  }
  return data || []
}