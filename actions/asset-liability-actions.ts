"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Activos Corrientes Actions ---

export async function addActivoCorriente(formData: FormData) {
  const supabase = createClient()
  const newActivo: TablesInsert<"activos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    cuenta_id: formData.get("cuenta_id") as string,
    fecha_adquisicion: formData.get("fecha_adquisicion") as string,
  }

  const { error } = await supabase.from("activos_corrientes").insert(newActivo)

  if (error) {
    console.error("Error adding activo corriente:", error)
    return { success: false, message: `Error al añadir activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  return { success: true, message: "Activo corriente añadido exitosamente." }
}

export async function updateActivoCorriente(formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const updatedActivo: TablesUpdate<"activos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    cuenta_id: formData.get("cuenta_id") as string,
    fecha_adquisicion: formData.get("fecha_adquisicion") as string,
  }

  const { error } = await supabase.from("activos_corrientes").update(updatedActivo).eq("id", id)

  if (error) {
    console.error("Error updating activo corriente:", error)
    return { success: false, message: `Error al actualizar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
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
  return { success: true, message: "Activo corriente eliminado exitosamente." }
}

// --- Activos No Corrientes Actions ---

export async function addActivoNoCorriente(formData: FormData) {
  const supabase = createClient()
  const newActivo: TablesInsert<"activos_no_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    depreciacion: Number.parseFloat(formData.get("depreciacion") as string),
    valor_neto: Number.parseFloat(formData.get("valor_neto") as string),
  }

  const { error } = await supabase.from("activos_no_corrientes").insert(newActivo)

  if (error) {
    console.error("Error adding activo no corriente:", error)
    return { success: false, message: `Error al añadir activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  return { success: true, message: "Activo no corriente añadido exitosamente." }
}

export async function updateActivoNoCorriente(formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const updatedActivo: TablesUpdate<"activos_no_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    depreciacion: Number.parseFloat(formData.get("depreciacion") as string),
    valor_neto: Number.parseFloat(formData.get("valor_neto") as string),
  }

  const { error } = await supabase.from("activos_no_corrientes").update(updatedActivo).eq("id", id)

  if (error) {
    console.error("Error updating activo no corriente:", error)
    return { success: false, message: `Error al actualizar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
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
  return { success: true, message: "Activo no corriente eliminado exitosamente." }
}

// --- Pasivos Corrientes Actions ---

export async function addPasivoCorriente(formData: FormData) {
  const supabase = createClient()
  const newPasivo: TablesInsert<"pasivos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    debe: Number.parseFloat(formData.get("debe") as string),
    saldo: Number.parseFloat(formData.get("saldo") as string),
  }

  const { error } = await supabase.from("pasivos_corrientes").insert(newPasivo)

  if (error) {
    console.error("Error adding pasivo corriente:", error)
    return { success: false, message: `Error al añadir pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  return { success: true, message: "Pasivo corriente añadido exitosamente." }
}

export async function updatePasivoCorriente(formData: FormData) {
  const supabase = createClient()
  const id = formData.get("id") as string
  const updatedPasivo: TablesUpdate<"pasivos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    debe: Number.parseFloat(formData.get("debe") as string),
    saldo: Number.parseFloat(formData.get("saldo") as string),
  }

  const { error } = await supabase.from("pasivos_corrientes").update(updatedPasivo).eq("id", id)

  if (error) {
    console.error("Error updating pasivo corriente:", error)
    return { success: false, message: `Error al actualizar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
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
  return { success: true, message: "Pasivo corriente eliminado exitosamente." }
}
