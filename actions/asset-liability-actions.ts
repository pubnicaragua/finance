"use server"

import { createClient } from "@/lib/supabase/server" // Importar el cliente de servidor
import { revalidatePath } from "next/cache" // Para revalidar la caché y actualizar el frontend
import type { Tables } from "@/lib/database.types"

// --- Activos Corrientes Actions ---

export async function addActivoCorriente(prevState: any, data: Partial<Tables<"activos_corrientes">>) {
  console.log("--- Server Action: addActivoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()
  const { data: newActivo, error } = await supabase
    .from("activos_corrientes")
    .insert([data as Tables<"activos_corrientes">])
    .select()

  if (error) {
    console.error("Error creating activo corriente:", error)
    return { success: false, message: `Error al añadir activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes") // Revalidar la página de activos corrientes
  revalidatePath("/balance-sheet") // Revalidar el balance sheet
  revalidatePath("/") // Revalidar el dashboard general
  return { success: true, message: "Activo corriente añadido exitosamente.", data: newActivo[0] }
}

export async function updateActivoCorriente(
  prevState: any,
  data: Partial<Tables<"activos_corrientes">> & { id: string },
) {
  console.log("--- Server Action: updateActivoCorriente called ---")
  console.log("Server: Received data:", data)

  const { id, ...updateData } = data
  const supabase = createClient()
  const { data: updatedActivo, error } = await supabase
    .from("activos_corrientes")
    .update(updateData)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating activo corriente:", error)
    return { success: false, message: `Error al actualizar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { success: true, message: "Activo corriente actualizado exitosamente.", data: updatedActivo[0] }
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
  revalidatePath("/")
  return { success: true, message: "Activo corriente eliminado exitosamente." }
}

// --- Activos No Corrientes Actions ---

export async function addActivoNoCorriente(prevState: any, data: Partial<Tables<"activos_no_corrientes">>) {
  console.log("--- Server Action: addActivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()
  const { data: newActivo, error } = await supabase
    .from("activos_no_corrientes")
    .insert([data as Tables<"activos_no_corrientes">])
    .select()

  if (error) {
    console.error("Error creating activo no corriente:", error)
    return { success: false, message: `Error al añadir activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets") // Revalidar la página de activos no corrientes
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { success: true, message: "Activo no corriente añadido exitosamente.", data: newActivo[0] }
}

export async function updateActivoNoCorriente(
  prevState: any,
  data: Partial<Tables<"activos_no_corrientes">> & { id: string },
) {
  console.log("--- Server Action: updateActivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const { id, ...updateData } = data
  const supabase = createClient()
  const { data: updatedActivo, error } = await supabase
    .from("activos_no_corrientes")
    .update(updateData)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating activo no corriente:", error)
    return { success: false, message: `Error al actualizar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { success: true, message: "Activo no corriente actualizado exitosamente.", data: updatedActivo[0] }
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
  revalidatePath("/")
  return { success: true, message: "Activo no corriente eliminado exitosamente." }
}

// --- Pasivos Corrientes Actions ---

export async function addPasivoCorriente(prevState: any, data: Partial<Tables<"pasivos_corrientes">>) {
  console.log("--- Server Action: addPasivoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = createClient()
  const { data: newPasivo, error } = await supabase
    .from("pasivos_corrientes")
    .insert([data as Tables<"pasivos_corrientes">])
    .select()

  if (error) {
    console.error("Error creating pasivo corriente:", error)
    return { success: false, message: `Error al añadir pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities") // Revalidar la página de pasivos corrientes
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { success: true, message: "Pasivo corriente añadido exitosamente.", data: newPasivo[0] }
}

export async function updatePasivoCorriente(
  prevState: any,
  data: Partial<Tables<"pasivos_corrientes">> & { id: string },
) {
  console.log("--- Server Action: updatePasivoCorriente called ---")
  console.log("Server: Received data:", data)

  const { id, ...updateData } = data
  const supabase = createClient()
  const { data: updatedPasivo, error } = await supabase
    .from("pasivos_corrientes")
    .update(updateData)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating pasivo corriente:", error)
    return { success: false, message: `Error al actualizar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { success: true, message: "Pasivo corriente actualizado exitosamente.", data: updatedPasivo[0] }
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
  revalidatePath("/")
  return { success: true, message: "Pasivo corriente eliminado exitosamente." }
}

// Funciones genéricas de activos/pasivos (si se usan en otros lugares)
// Estas funciones no se usan directamente en los formularios actuales, pero se mantienen por si acaso.
export async function addAsset(asset: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from("assets").insert([asset]).select()
  if (error) {
    console.error("Error adding asset:", error)
    return { data: null, error: error }
  }
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { data: data, error: null }
}

export async function addLiability(liability: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from("liabilities").insert([liability]).select()
  if (error) {
    console.error("Error adding liability:", error)
    return { data: null, error: error }
  }
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { data: data, error: null }
}

export async function updateAsset(assetId: string, asset: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from("assets").update(asset).eq("id", assetId).select()
  if (error) {
    console.error("Error updating asset:", error)
    return { data: null, error: error }
  }
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { data: data, error: null }
}

export async function updateLiability(liabilityId: string, liability: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from("liabilities").update(liability).eq("id", liabilityId).select()
  if (error) {
    console.error("Error updating liability:", error)
    return { data: null, error: error }
  }
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { data: data, error: null }
}

export async function deleteAsset(assetId: string) {
  const supabase = createClient()
  const { error } = await supabase.from("assets").delete().eq("id", assetId)
  if (error) {
    console.error("Error deleting asset:", error)
    return { error: error }
  }
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { error: null }
}

export async function deleteLiability(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("liabilities").delete().eq("id", id)
  if (error) {
    console.error("Error deleting liability:", error)
    return { error: error }
  }
  revalidatePath("/balance-sheet")
  revalidatePath("/")
  return { error: null }
}
