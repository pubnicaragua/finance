"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/database.types"

export async function addEmployee(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const newEmployee: TablesInsert<"empleados"> = {
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    puesto: formData.get("puesto") as string,
    departamento: formData.get("departamento") as string,
    salario_base: Number.parseFloat(formData.get("salario_base") as string),
    fecha_contratacion: formData.get("fecha_contratacion") as string,
    estado: formData.get("estado") as string,
    numero_cuenta: formData.get("numero_cuenta") as string,
    banco: formData.get("banco") as string,
  }

  const { error } = await supabase.from("empleados").insert(newEmployee)

  if (error) {
    console.error("Error adding employee:", error)
    return { success: false, message: `Error al añadir empleado: ${error.message}` }
  }

  revalidatePath("/employees")
  return { success: true, message: "Empleado añadido exitosamente." }
}

export async function updateEmployee(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const updatedEmployee: TablesUpdate<"empleados"> = {
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    puesto: formData.get("puesto") as string,
    departamento: formData.get("departamento") as string,
    salario_base: Number.parseFloat(formData.get("salario_base") as string),
    fecha_contratacion: formData.get("fecha_contratacion") as string,
    estado: formData.get("estado") as string,
    numero_cuenta: formData.get("numero_cuenta") as string,
    banco: formData.get("banco") as string,
  }

  const { error } = await supabase.from("empleados").update(updatedEmployee).eq("id", id)

  if (error) {
    console.error("Error updating employee:", error)
    return { success: false, message: `Error al actualizar empleado: ${error.message}` }
  }

  revalidatePath("/employees")
  return { success: true, message: "Empleado actualizado exitosamente." }
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("empleados").delete().eq("id", id)

  if (error) {
    console.error("Error deleting employee:", error)
    return { success: false, message: `Error al eliminar empleado: ${error.message}` }
  }

  revalidatePath("/employees")
  return { success: true, message: "Empleado eliminado exitosamente." }
}

export async function getEmployees() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("empleados").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching employees:", error)
    return []
  }
  return data || []
}