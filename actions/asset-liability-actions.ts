"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Activos Corrientes Actions ---
export async function addCurrentAsset(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const newAsset: TablesInsert<"activos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    fecha_adquisicion: formData.get("fecha_adquisicion") as string,
    cuenta_id: formData.get("cuenta_id") as string || null,
  }

  const { error } = await supabase.from("activos_corrientes").insert(newAsset)

  if (error) {
    console.error("Error adding current asset:", error)
    return { success: false, message: `Error al añadir activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente añadido exitosamente." }
}

export async function updateCurrentAsset(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const id = formData.get("id") as string
  const updatedAsset: TablesUpdate<"activos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    fecha_adquisicion: formData.get("fecha_adquisicion") as string,
    cuenta_id: formData.get("cuenta_id") as string || null,
  }

  const { error } = await supabase.from("activos_corrientes").update(updatedAsset).eq("id", id)

  if (error) {
    console.error("Error updating current asset:", error)
    return { success: false, message: `Error al actualizar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente actualizado exitosamente." }
}

export async function deleteCurrentAsset(id: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.from("activos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting current asset:", error)
    return { success: false, message: `Error al eliminar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente eliminado exitosamente." }
}

export async function getCurrentAssets() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from("activos_corrientes")
    .select("*")
    .order("fecha_adquisicion", { ascending: false })
  if (error) {
    console.error("Error fetching current assets:", error)
    return []
  }
  return data || []
}

// --- Activos No Corrientes Actions ---
export async function addNonCurrentAsset(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const newAsset: TablesInsert<"activos_no_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    depreciacion: Number.parseFloat(formData.get("depreciacion") as string) || 0,
  }

  const { error } = await supabase.from("activos_no_corrientes").insert(newAsset)

  if (error) {
    console.error("Error adding non-current asset:", error)
    return { success: false, message: `Error al añadir activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente añadido exitosamente." }
}

export async function updateNonCurrentAsset(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const id = formData.get("id") as string
  const updatedAsset: TablesUpdate<"activos_no_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    depreciacion: Number.parseFloat(formData.get("depreciacion") as string) || 0,
  }

  const { error } = await supabase.from("activos_no_corrientes").update(updatedAsset).eq("id", id)

  if (error) {
    console.error("Error updating non-current asset:", error)
    return { success: false, message: `Error al actualizar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente actualizado exitosamente." }
}

export async function deleteNonCurrentAsset(id: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.from("activos_no_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting non-current asset:", error)
    return { success: false, message: `Error al eliminar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente eliminado exitosamente." }
}

export async function getNonCurrentAssets() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from("activos_no_corrientes")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching non-current assets:", error)
    return []
  }
  return data || []
}

// --- Pasivos Corrientes Actions ---
export async function addCurrentLiability(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const newLiability: TablesInsert<"pasivos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    debe: Number.parseFloat(formData.get("debe") as string),
    saldo: Number.parseFloat(formData.get("saldo") as string),
  }

  const { error } = await supabase.from("pasivos_corrientes").insert(newLiability)

  if (error) {
    console.error("Error adding current liability:", error)
    return { success: false, message: `Error al añadir pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente añadido exitosamente." }
}

export async function updateCurrentLiability(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const id = formData.get("id") as string
  const updatedLiability: TablesUpdate<"pasivos_corrientes"> = {
    descripcion: formData.get("descripcion") as string,
    debe: Number.parseFloat(formData.get("debe") as string),
    saldo: Number.parseFloat(formData.get("saldo") as string),
  }

  const { error } = await supabase.from("pasivos_corrientes").update(updatedLiability).eq("id", id)

  if (error) {
    console.error("Error updating current liability:", error)
    return { success: false, message: `Error al actualizar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente actualizado exitosamente." }
}

export async function deleteCurrentLiability(id: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.from("pasivos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting current liability:", error)
    return { success: false, message: `Error al eliminar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente eliminado exitosamente." }
}

export async function getCurrentLiabilities() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from("pasivos_corrientes")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching current liabilities:", error)
    return []
  }
  return data || []
}