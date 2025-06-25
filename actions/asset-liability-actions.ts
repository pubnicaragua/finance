"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Activos Corrientes Actions ---

export async function addActivoCorriente(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesInsert<"activos_corrientes">>

  const { descripcion, valor, fecha_adquisicion, cuenta_id } = data

  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    return { success: false, message: "La descripción es requerida." }
  }
  if (valor === undefined || valor === null || isNaN(Number(valor))) {
    return { success: false, message: "El valor es requerido y debe ser un número." }
  }
  if (!fecha_adquisicion || typeof fecha_adquisicion !== "string" || fecha_adquisicion.trim() === "") {
    return { success: false, message: "La fecha de adquisición es requerida." }
  }
  if (!cuenta_id || typeof cuenta_id !== "string" || cuenta_id.trim() === "") {
    return { success: false, message: "El ID de la cuenta es requerido." }
  }

  const newActivo: TablesInsert<"activos_corrientes"> = {
    descripcion: descripcion,
    valor: Number(valor),
    fecha_adquisicion: fecha_adquisicion,
    cuenta_id: cuenta_id,
  }

  const { error } = await supabase.from("activos_corrientes").insert(newActivo)

  if (error) {
    console.error("Error adding activo corriente:", error)
    return { success: false, message: `Error al añadir activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  return { success: true, message: "Activo corriente añadido exitosamente." }
}

export async function updateActivoCorriente(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesUpdate<"activos_corrientes">> & { id: string }

  const { id, descripcion, valor, fecha_adquisicion, cuenta_id } = data

  if (!id || typeof id !== "string" || id.trim() === "") {
    return { success: false, message: "El ID del activo es requerido." }
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    return { success: false, message: "La descripción es requerida." }
  }
  if (valor === undefined || valor === null || isNaN(Number(valor))) {
    return { success: false, message: "El valor es requerido y debe ser un número." }
  }
  if (!fecha_adquisicion || typeof fecha_adquisicion !== "string" || fecha_adquisicion.trim() === "") {
    return { success: false, message: "La fecha de adquisición es requerida." }
  }
  if (!cuenta_id || typeof cuenta_id !== "string" || cuenta_id.trim() === "") {
    return { success: false, message: "El ID de la cuenta es requerido." }
  }

  const updatedActivo: TablesUpdate<"activos_corrientes"> = {
    descripcion: descripcion,
    valor: Number(valor),
    fecha_adquisicion: fecha_adquisicion,
    cuenta_id: cuenta_id,
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

export async function getActivosCorrientes() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("activos_corrientes")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching activos corrientes:", error)
    return [] // Devolver array vacío en caso de error
  }
  return data || [] // Asegurar que siempre sea un array
}

// --- Activos No Corrientes Actions ---

export async function addActivoNoCorriente(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesInsert<"activos_no_corrientes">>

  const { descripcion, valor, depreciacion, valor_neto } = data

  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    return { success: false, message: "La descripción es requerida." }
  }
  if (valor === undefined || valor === null || isNaN(Number(valor))) {
    return { success: false, message: "El valor es requerido y debe ser un número." }
  }
  if (depreciacion === undefined || depreciacion === null || isNaN(Number(depreciacion))) {
    return { success: false, message: "La depreciación es requerida y debe ser un número." }
  }
  if (valor_neto === undefined || valor_neto === null || isNaN(Number(valor_neto))) {
    return { success: false, message: "El valor neto es requerido y debe ser un número." }
  }

  const newActivo: TablesInsert<"activos_no_corrientes"> = {
    descripcion: descripcion,
    valor: Number(valor),
    depreciacion: Number(depreciacion),
    valor_neto: Number(valor_neto),
  }

  const { error } = await supabase.from("activos_no_corrientes").insert(newActivo)

  if (error) {
    console.error("Error adding activo no corriente:", error)
    return { success: false, message: `Error al añadir activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  return { success: true, message: "Activo no corriente añadido exitosamente." }
}

export async function updateActivoNoCorriente(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesUpdate<"activos_no_corrientes">> & { id: string }

  const { id, descripcion, valor, depreciacion, valor_neto } = data

  if (!id || typeof id !== "string" || id.trim() === "") {
    return { success: false, message: "El ID del activo es requerido." }
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    return { success: false, message: "La descripción es requerida." }
  }
  if (valor === undefined || valor === null || isNaN(Number(valor))) {
    return { success: false, message: "El valor es requerido y debe ser un número." }
  }
  if (depreciacion === undefined || depreciacion === null || isNaN(Number(depreciacion))) {
    return { success: false, message: "La depreciación es requerida y debe ser un número." }
  }
  if (valor_neto === undefined || valor_neto === null || isNaN(Number(valor_neto))) {
    return { success: false, message: "El valor neto es requerido y debe ser un número." }
  }

  const updatedActivo: TablesUpdate<"activos_no_corrientes"> = {
    descripcion: descripcion,
    valor: Number(valor),
    depreciacion: Number(depreciacion),
    valor_neto: Number(valor_neto),
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

export async function getActivosNoCorrientes() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("activos_no_corrientes")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching activos no corrientes:", error)
    return [] // Devolver array vacío en caso de error
  }
  return data || [] // Asegurar que siempre sea un array
}

// --- Pasivos Corrientes Actions ---

export async function addPasivoCorriente(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesInsert<"pasivos_corrientes">>

  const { descripcion, monto, fecha_vencimiento, estado } = data

  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    return { success: false, message: "La descripción es requerida." }
  }
  if (monto === undefined || monto === null || isNaN(Number(monto))) {
    return { success: false, message: "El monto es requerido y debe ser un número." }
  }
  if (!fecha_vencimiento || typeof fecha_vencimiento !== "string" || fecha_vencimiento.trim() === "") {
    return { success: false, message: "La fecha de vencimiento es requerida." }
  }
  if (!estado || typeof estado !== "string" || estado.trim() === "") {
    return { success: false, message: "El estado es requerido." }
  }

  const newPasivo: TablesInsert<"pasivos_corrientes"> = {
    descripcion: descripcion,
    monto: Number(monto),
    fecha_vencimiento: fecha_vencimiento,
    estado: estado,
  }

  const { error } = await supabase.from("pasivos_corrientes").insert(newPasivo)

  if (error) {
    console.error("Error adding pasivo corriente:", error)
    return { success: false, message: `Error al añadir pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  return { success: true, message: "Pasivo corriente añadido exitosamente." }
}

export async function updatePasivoCorriente(prevState: any, formData: FormData) {
  const supabase = createClient()
  const data = Object.fromEntries(formData.entries()) as Partial<TablesUpdate<"pasivos_corrientes">> & { id: string }

  const { id, descripcion, monto, fecha_vencimiento, estado } = data

  if (!id || typeof id !== "string" || id.trim() === "") {
    return { success: false, message: "El ID del pasivo es requerido." }
  }
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    return { success: false, message: "La descripción es requerida." }
  }
  if (monto === undefined || monto === null || isNaN(Number(monto))) {
    return { success: false, message: "El monto es requerido y debe ser un número." }
  }
  if (!fecha_vencimiento || typeof fecha_vencimiento !== "string" || fecha_vencimiento.trim() === "") {
    return { success: false, message: "La fecha de vencimiento es requerida." }
  }
  if (!estado || typeof estado !== "string" || estado.trim() === "") {
    return { success: false, message: "El estado es requerido." }
  }

  const updatedPasivo: TablesUpdate<"pasivos_corrientes"> = {
    descripcion: descripcion,
    monto: Number(monto),
    fecha_vencimiento: fecha_vencimiento,
    estado: estado,
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

export async function getPasivosCorrientes() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("pasivos_corrientes")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching pasivos corrientes:", error)
    return [] // Devolver array vacío en caso de error
  }
  return data || [] // Asegurar que siempre sea un array
}

// Re-export explícito por si el bundler lo omite
export { deletePasivoCorriente as deleteLiability }
