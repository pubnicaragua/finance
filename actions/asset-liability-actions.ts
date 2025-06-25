"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Activos Corrientes Actions ---

export async function addActivoCorriente(prevState: any, data: Partial<TablesInsert<"activos_corrientes">>) {
  console.log("--- Server Action: addActivoCorriente called ---")
  console.log("Server: Received data:", data)

  const { descripcion, valor, cuenta_id, fecha_adquisicion } = data

  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para addActivoCorriente.")
    return { success: false, message: "Error al añadir activo corriente: La descripción es requerida." }
  }
  if (valor === undefined || valor === null) {
    console.error("Error: valor es nulo o inválido para addActivoCorriente.")
    return { success: false, message: "Error al añadir activo corriente: El valor es requerido." }
  }

  const supabase = createClient()
  const newActivo: TablesInsert<"activos_corrientes"> = {
    descripcion: descripcion as string,
    valor: Number.parseFloat(valor as any),
    cuenta_id: cuenta_id as string,
    fecha_adquisicion: fecha_adquisicion as string,
  }

  const { error } = await supabase.from("activos_corrientes").insert(newActivo)

  if (error) {
    console.error("Error adding activo corriente:", error)
    return { success: false, message: `Error al añadir activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente añadido exitosamente." }
}

export async function updateActivoCorriente(
  prevState: any,
  data: Partial<TablesUpdate<"activos_corrientes">> & { id: string },
) {
  console.log("--- Server Action: updateActivoCorriente called ---")
  console.log("Server: Received data:", data)

  const { id, descripcion, valor, cuenta_id, fecha_adquisicion } = data

  if (!id) {
    console.error("Error: ID es nulo o inválido para updateActivoCorriente.")
    return { success: false, message: "Error al actualizar activo corriente: El ID es requerido." }
  }
  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para updateActivoCorriente.")
    return { success: false, message: "Error al actualizar activo corriente: La descripción es requerida." }
  }
  if (valor === undefined || valor === null) {
    console.error("Error: valor es nulo o inválido para updateActivoCorriente.")
    return { success: false, message: "Error al actualizar activo corriente: El valor es requerido." }
  }

  const supabase = createClient()
  const updatedActivo: TablesUpdate<"activos_corrientes"> = {
    descripcion: descripcion as string,
    valor: Number.parseFloat(valor as any),
    cuenta_id: cuenta_id as string,
    fecha_adquisicion: fecha_adquisicion as string,
  }

  const { error } = await supabase.from("activos_corrientes").update(updatedActivo).eq("id", id)

  if (error) {
    console.error("Error updating activo corriente:", error)
    return { success: false, message: `Error al actualizar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente actualizado exitosamente." }
}

export async function deleteActivoCorriente(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("activos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting activo corriente:", error)
    return { success: false, message: `Error al eliminar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente eliminado exitosamente." }
}

// --- Activos No Corrientes Actions ---

export async function addActivoNoCorriente(prevState: any, data: Partial<TablesInsert<"activos_no_corrientes">>) {
  console.log("--- Server Action: addActivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const { descripcion, valor, depreciacion, valor_neto } = data

  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para addActivoNoCorriente.")
    return { success: false, message: "Error al añadir activo no corriente: La descripción es requerida." }
  }
  if (valor === undefined || valor === null) {
    console.error("Error: valor es nulo o inválido para addActivoNoCorriente.")
    return { success: false, message: "Error al añadir activo no corriente: El valor es requerido." }
  }

  const supabase = createClient()
  const newActivo: TablesInsert<"activos_no_corrientes"> = {
    descripcion: descripcion as string,
    valor: Number.parseFloat(valor as any),
    depreciacion: depreciacion ? Number.parseFloat(depreciacion as any) : null,
    valor_neto: valor_neto ? Number.parseFloat(valor_neto as any) : null,
  }

  const { error } = await supabase.from("activos_no_corrientes").insert(newActivo)

  if (error) {
    console.error("Error adding activo no corriente:", error)
    return { success: false, message: `Error al añadir activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente añadido exitosamente." }
}

export async function updateActivoNoCorriente(
  prevState: any,
  data: Partial<TablesUpdate<"activos_no_corrientes">> & { id: string },
) {
  console.log("--- Server Action: updateActivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const { id, descripcion, valor, depreciacion, valor_neto } = data

  if (!id) {
    console.error("Error: ID es nulo o inválido para updateActivoNoCorriente.")
    return { success: false, message: "Error al actualizar activo no corriente: El ID es requerido." }
  }
  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para updateActivoNoCorriente.")
    return { success: false, message: "Error al actualizar activo no corriente: La descripción es requerida." }
  }
  if (valor === undefined || valor === null) {
    console.error("Error: valor es nulo o inválido para updateActivoNoCorriente.")
    return { success: false, message: "Error al actualizar activo no corriente: El valor es requerido." }
  }

  const supabase = createClient()
  const updatedActivo: TablesUpdate<"activos_no_corrientes"> = {
    descripcion: descripcion as string,
    valor: Number.parseFloat(valor as any),
    depreciacion: depreciacion ? Number.parseFloat(depreciacion as any) : null,
    valor_neto: valor_neto ? Number.parseFloat(valor_neto as any) : null,
  }

  const { error } = await supabase.from("activos_no_corrientes").update(updatedActivo).eq("id", id)

  if (error) {
    console.error("Error updating activo no corriente:", error)
    return { success: false, message: `Error al actualizar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente actualizado exitosamente." }
}

export async function deleteActivoNoCorriente(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("activos_no_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting activo no corriente:", error)
    return { success: false, message: `Error al eliminar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente eliminado exitosamente." }
}

// --- Pasivos Corrientes Actions ---

export async function addPasivoCorriente(prevState: any, data: Partial<TablesInsert<"pasivos_corrientes">>) {
  console.log("--- Server Action: addPasivoCorriente called ---")
  console.log("Server: Received data:", data)

  const { descripcion, debe, saldo } = data

  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para addPasivoCorriente.")
    return { success: false, message: "Error al añadir pasivo corriente: La descripción es requerida." }
  }
  if (debe === undefined || debe === null) {
    console.error("Error: debe es nulo o inválido para addPasivoCorriente.")
    return { success: false, message: "Error al añadir pasivo corriente: El campo 'debe' es requerido." }
  }
  if (saldo === undefined || saldo === null) {
    console.error("Error: saldo es nulo o inválido para addPasivoCorriente.")
    return { success: false, message: "Error al añadir pasivo corriente: El saldo es requerido." }
  }

  const supabase = createClient()
  const newPasivo: TablesInsert<"pasivos_corrientes"> = {
    descripcion: descripcion as string,
    debe: Number.parseFloat(debe as any),
    saldo: Number.parseFloat(saldo as any),
  }

  const { error } = await supabase.from("pasivos_corrientes").insert(newPasivo)

  if (error) {
    console.error("Error adding pasivo corriente:", error)
    return { success: false, message: `Error al añadir pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente añadido exitosamente." }
}

export async function updatePasivoCorriente(
  prevState: any,
  data: Partial<TablesUpdate<"pasivos_corrientes">> & { id: string },
) {
  console.log("--- Server Action: updatePasivoCorriente called ---")
  console.log("Server: Received data:", data)

  const { id, descripcion, debe, saldo } = data

  if (!id) {
    console.error("Error: ID es nulo o inválido para updatePasivoCorriente.")
    return { success: false, message: "Error al actualizar pasivo corriente: El ID es requerido." }
  }
  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para updatePasivoCorriente.")
    return { success: false, message: "Error al actualizar pasivo corriente: La descripción es requerida." }
  }
  if (debe === undefined || debe === null) {
    console.error("Error: debe es nulo o inválido para updatePasivoCorriente.")
    return { success: false, message: "Error al actualizar pasivo corriente: El campo 'debe' es requerido." }
  }
  if (saldo === undefined || saldo === null) {
    console.error("Error: saldo es nulo o inválido para updatePasivoCorriente.")
    return { success: false, message: "Error al actualizar pasivo corriente: El saldo es requerido." }
  }

  const supabase = createClient()
  const updatedPasivo: TablesUpdate<"pasivos_corrientes"> = {
    descripcion: descripcion as string,
    debe: Number.parseFloat(debe as any),
    saldo: Number.parseFloat(saldo as any),
  }

  const { error } = await supabase.from("pasivos_corrientes").update(updatedPasivo).eq("id", id)

  if (error) {
    console.error("Error updating pasivo corriente:", error)
    return { success: false, message: `Error al actualizar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente actualizado exitosamente." }
}

export async function deletePasivoCorriente(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("pasivos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting pasivo corriente:", error)
    return { success: false, message: `Error al eliminar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente eliminado exitosamente." }
}

// --- Pasivos No Corrientes Actions ---

export async function addPasivoNoCorriente(prevState: any, data: Partial<TablesInsert<"pasivos_no_corrientes">>) {
  console.log("--- Server Action: addPasivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const { descripcion, saldo, fecha_vencimiento } = data

  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para addPasivoNoCorriente.")
    return { success: false, message: "Error al añadir pasivo no corriente: La descripción es requerida." }
  }
  if (saldo === undefined || saldo === null) {
    console.error("Error: saldo es nulo o inválido para addPasivoNoCorriente.")
    return { success: false, message: "Error al añadir pasivo no corriente: El saldo es requerido." }
  }

  const supabase = createClient()
  const newPasivo: TablesInsert<"pasivos_no_corrientes"> = {
    descripcion: descripcion as string,
    saldo: Number.parseFloat(saldo as any),
    fecha_vencimiento: fecha_vencimiento as string,
  }

  const { error } = await supabase.from("pasivos_no_corrientes").insert(newPasivo)

  if (error) {
    console.error("Error adding pasivo no corriente:", error)
    return { success: false, message: `Error al añadir pasivo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-liabilities") // Asumiendo que tienes una ruta para pasivos no corrientes
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo no corriente añadido exitosamente." }
}

export async function updatePasivoNoCorriente(
  prevState: any,
  data: Partial<TablesUpdate<"pasivos_no_corrientes">> & { id: string },
) {
  console.log("--- Server Action: updatePasivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const { id, descripcion, saldo, fecha_vencimiento } = data

  if (!id) {
    console.error("Error: ID es nulo o inválido para updatePasivoNoCorriente.")
    return { success: false, message: "Error al actualizar pasivo no corriente: El ID es requerido." }
  }
  if (!descripcion) {
    console.error("Error: descripcion es nulo o inválido para updatePasivoNoCorriente.")
    return { success: false, message: "Error al actualizar pasivo no corriente: La descripción es requerida." }
  }
  if (saldo === undefined || saldo === null) {
    console.error("Error: saldo es nulo o inválido para updatePasivoNoCorriente.")
    return { success: false, message: "Error al actualizar pasivo no corriente: El saldo es requerido." }
  }

  const supabase = createClient()
  const updatedPasivo: TablesUpdate<"pasivos_no_corrientes"> = {
    descripcion: descripcion as string,
    saldo: Number.parseFloat(saldo as any),
    fecha_vencimiento: fecha_vencimiento as string,
  }

  const { error } = await supabase.from("pasivos_no_corrientes").update(updatedPasivo).eq("id", id)

  if (error) {
    console.error("Error updating pasivo no corriente:", error)
    return { success: false, message: `Error al actualizar pasivo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo no corriente actualizado exitosamente." }
}

export async function deletePasivoNoCorriente(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("pasivos_no_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting pasivo no corriente:", error)
    return { success: false, message: `Error al eliminar pasivo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo no corriente eliminado exitosamente." }
}

/**
 * Generic deleter so that pages/components can call one function without
 * knowing the table name in advance.
 */
export async function deleteLiability(
  table: "pasivos_corrientes" | "pasivos_no_corrientes" | "activos_corrientes" | "activos_no_corrientes",
  id: string,
) {
  const supabase = createClient()
  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) throw new Error(`deleteLiability: ${error.message}`)
  // revalidate some common pages
  revalidatePath("/balance-sheet")
}
