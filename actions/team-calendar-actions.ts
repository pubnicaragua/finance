"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

// --- Miembros del Equipo ---
export async function addTeamMember(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const newMember: TablesInsert<"miembros_equipo"> = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    cargo: formData.get("cargo") as string,
    departamento: formData.get("departamento") as string,
    activo: true,
  }

  const { error } = await supabase.from("miembros_equipo").insert(newMember)

  if (error) {
    console.error("Error adding team member:", error)
    return { success: false, message: `Error al añadir miembro: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Miembro añadido exitosamente." }
}

export async function updateTeamMember(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const updatedMember: TablesUpdate<"miembros_equipo"> = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    cargo: formData.get("cargo") as string,
    departamento: formData.get("departamento") as string,
    activo: formData.get("activo") === "on",
  }

  const { error } = await supabase.from("miembros_equipo").update(updatedMember).eq("id", id)

  if (error) {
    console.error("Error updating team member:", error)
    return { success: false, message: `Error al actualizar miembro: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Miembro actualizado exitosamente." }
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("miembros_equipo").delete().eq("id", id)

  if (error) {
    console.error("Error deleting team member:", error)
    return { success: false, message: `Error al eliminar miembro: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Miembro eliminado exitosamente." }
}

export async function getTeamMembers() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("miembros_equipo").select("*").order("nombre", { ascending: true })
  
  if (error) {
    console.error("Error fetching team members:", error)
    return []
  }
  
  return data || []
}

// --- Asignaciones ---
export async function addAssignment(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const newAssignment: TablesInsert<"asignaciones"> = {
    miembro_id: formData.get("miembro_id") as string,
    titulo: formData.get("titulo") as string,
    descripcion: formData.get("descripcion") as string,
    fecha_inicio: formData.get("fecha_inicio") as string,
    fecha_fin: formData.get("fecha_fin") as string,
    estado: formData.get("estado") as string || "pendiente",
    prioridad: formData.get("prioridad") as string || "media",
    proyecto_id: formData.get("proyecto_id") as string || null,
  }

  const { error } = await supabase.from("asignaciones").insert(newAssignment)

  if (error) {
    console.error("Error adding assignment:", error)
    return { success: false, message: `Error al añadir asignación: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Asignación añadida exitosamente." }
}

export async function updateAssignment(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const updatedAssignment: TablesUpdate<"asignaciones"> = {
    miembro_id: formData.get("miembro_id") as string,
    titulo: formData.get("titulo") as string,
    descripcion: formData.get("descripcion") as string,
    fecha_inicio: formData.get("fecha_inicio") as string,
    fecha_fin: formData.get("fecha_fin") as string,
    estado: formData.get("estado") as string,
    prioridad: formData.get("prioridad") as string,
    proyecto_id: formData.get("proyecto_id") as string || null,
  }

  const { error } = await supabase.from("asignaciones").update(updatedAssignment).eq("id", id)

  if (error) {
    console.error("Error updating assignment:", error)
    return { success: false, message: `Error al actualizar asignación: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Asignación actualizada exitosamente." }
}

export async function deleteAssignment(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("asignaciones").delete().eq("id", id)

  if (error) {
    console.error("Error deleting assignment:", error)
    return { success: false, message: `Error al eliminar asignación: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Asignación eliminada exitosamente." }
}

export async function getAssignments(startDate?: string, endDate?: string) {
  const supabase = await createClient()
  
  let query = supabase.from("asignaciones").select(`
    *,
    miembros_equipo (
      id,
      nombre,
      cargo
    ),
    clientes:proyecto_id (
      id,
      cliente,
      proyecto
    )
  `)
  
  if (startDate) {
    query = query.gte('fecha_inicio', startDate)
  }
  
  if (endDate) {
    query = query.lte('fecha_fin', endDate)
  }
  
  const { data, error } = await query.order("fecha_inicio", { ascending: true })
  
  if (error) {
    console.error("Error fetching assignments:", error)
    return []
  }
  
  return data || []
}

export async function getAssignmentsByMember(memberId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("asignaciones")
    .select(`
      *,
      clientes:proyecto_id (
        id,
        cliente,
        proyecto
      )
    `)
    .eq("miembro_id", memberId)
    .order("fecha_inicio", { ascending: true })
  
  if (error) {
    console.error("Error fetching member assignments:", error)
    return []
  }
  
  return data || []
}

// --- Notificaciones ---
export async function getNotifications(memberId?: string) {
  const supabase = await createClient()
  
  let query = supabase.from("notificaciones").select(`
    *,
    miembros_equipo (
      id,
      nombre
    )
  `)
  
  if (memberId) {
    query = query.eq('miembro_id', memberId)
  }
  
  const { data, error } = await query.order("fecha_creacion", { ascending: false })
  
  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
  
  return data || []
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("notificaciones")
    .update({ 
      leida: true,
      fecha_lectura: new Date().toISOString()
    })
    .eq("id", id)

  if (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, message: `Error al marcar notificación como leída: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Notificación marcada como leída." }
}

// --- Configuración de Notificaciones ---
export async function updateNotificationSettings(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const miembro_id = formData.get("miembro_id") as string
  const settings: TablesUpdate<"configuracion_notificaciones"> = {
    notificaciones_activas: formData.get("notificaciones_activas") === "on",
    notificar_sin_asignacion: formData.get("notificar_sin_asignacion") === "on",
    tiempo_sin_asignacion: `${formData.get("tiempo_sin_asignacion") || 1} hour`,
    notificar_por_email: formData.get("notificar_por_email") === "on",
  }

  // Verificar si ya existe una configuración para este miembro
  const { data: existingConfig } = await supabase
    .from("configuracion_notificaciones")
    .select("id")
    .eq("miembro_id", miembro_id)
    .single()

  let error;
  
  if (existingConfig) {
    // Actualizar configuración existente
    const result = await supabase
      .from("configuracion_notificaciones")
      .update(settings)
      .eq("miembro_id", miembro_id);
    
    error = result.error;
  } else {
    // Crear nueva configuración
    const result = await supabase
      .from("configuracion_notificaciones")
      .insert({
        miembro_id,
        ...settings
      });
    
    error = result.error;
  }

  if (error) {
    console.error("Error updating notification settings:", error)
    return { success: false, message: `Error al actualizar configuración: ${error.message}` }
  }

  revalidatePath("/team-calendar")
  return { success: true, message: "Configuración actualizada exitosamente." }
}

export async function getNotificationSettings(memberId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("configuracion_notificaciones")
    .select("*")
    .eq("miembro_id", memberId)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 es "no se encontró ningún registro"
    console.error("Error fetching notification settings:", error)
    return null
  }
  
  // Si no hay configuración, devolver valores predeterminados
  if (!data) {
    return {
      miembro_id: memberId,
      notificaciones_activas: true,
      notificar_sin_asignacion: true,
      tiempo_sin_asignacion: '1 hour',
      notificar_por_email: false
    }
  }
  
  return data
}