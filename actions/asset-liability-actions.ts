"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          console.warn("Could not set cookie from server:", error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          console.warn("Could not remove cookie from server:", error)
        }
      },
    },
  })
}

// --- Activos Corrientes Actions ---
export async function addActivoCorriente(
  prevState: any,
  data: { nombre: string; monto: number; fecha_adquisicion: string },
) {
  console.log("--- Server Action: addActivoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("activos_corrientes").insert([data])

  if (error) {
    console.error("Error adding current asset:", error)
    return { success: false, message: `Error al añadir activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente añadido exitosamente." }
}

export async function updateActivoCorriente(
  prevState: any,
  data: { id: string; nombre: string; monto: number; fecha_adquisicion: string },
) {
  console.log("--- Server Action: updateActivoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { id, ...updateData } = data
  const { error } = await supabase.from("activos_corrientes").update(updateData).eq("id", id)

  if (error) {
    console.error("Error updating current asset:", error)
    return { success: false, message: `Error al actualizar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente actualizado exitosamente." }
}

export async function deleteActivoCorriente(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("activos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting current asset:", error)
    return { success: false, message: `Error al eliminar activo corriente: ${error.message}` }
  }

  revalidatePath("/activos-corrientes")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo corriente eliminado exitosamente." }
}

// --- Activos No Corrientes Actions ---
export async function addActivoNoCorriente(
  prevState: any,
  data: { nombre: string; monto: number; fecha_adquisicion: string; vida_util_anios: number },
) {
  console.log("--- Server Action: addActivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("activos_no_corrientes").insert([data])

  if (error) {
    console.error("Error adding non-current asset:", error)
    return { success: false, message: `Error al añadir activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente añadido exitosamente." }
}

export async function updateActivoNoCorriente(
  prevState: any,
  data: { id: string; nombre: string; monto: number; fecha_adquisicion: string; vida_util_anios: number },
) {
  console.log("--- Server Action: updateActivoNoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { id, ...updateData } = data
  const { error } = await supabase.from("activos_no_corrientes").update(updateData).eq("id", id)

  if (error) {
    console.error("Error updating non-current asset:", error)
    return { success: false, message: `Error al actualizar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente actualizado exitosamente." }
}

export async function deleteActivoNoCorriente(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("activos_no_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting non-current asset:", error)
    return { success: false, message: `Error al eliminar activo no corriente: ${error.message}` }
  }

  revalidatePath("/non-current-assets")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Activo no corriente eliminado exitosamente." }
}

// --- Pasivos Corrientes Actions ---
export async function addPasivoCorriente(
  prevState: any,
  data: { nombre: string; monto: number; fecha_vencimiento: string },
) {
  console.log("--- Server Action: addPasivoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("pasivos_corrientes").insert([data])

  if (error) {
    console.error("Error adding current liability:", error)
    return { success: false, message: `Error al añadir pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente añadido exitosamente." }
}

export async function updatePasivoCorriente(
  prevState: any,
  data: { id: string; nombre: string; monto: number; fecha_vencimiento: string },
) {
  console.log("--- Server Action: updatePasivoCorriente called ---")
  console.log("Server: Received data:", data)

  const supabase = getSupabaseServerClient()
  const { id, ...updateData } = data
  const { error } = await supabase.from("pasivos_corrientes").update(updateData).eq("id", id)

  if (error) {
    console.error("Error updating current liability:", error)
    return { success: false, message: `Error al actualizar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente actualizado exitosamente." }
}

export async function deletePasivoCorriente(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("pasivos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting current liability:", error)
    return { success: false, message: `Error al eliminar pasivo corriente: ${error.message}` }
  }

  revalidatePath("/current-liabilities")
  revalidatePath("/balance-sheet")
  return { success: true, message: "Pasivo corriente eliminado exitosamente." }
}
