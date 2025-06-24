import { createClient } from "@/lib/supabase/server" // Importación directa del cliente de servidor

export async function getAssetsAndLiabilities() {
  const supabase = await createClient()

  const { data: assets, error: assetsError } = await supabase.from("assets").select("*")

  if (assetsError) {
    console.error("Error fetching assets:", assetsError)
    return { assets: [], liabilities: [] }
  }

  const { data: liabilities, error: liabilitiesError } = await supabase.from("liabilities").select("*")

  if (liabilitiesError) {
    console.error("Error fetching liabilities:", liabilitiesError)
    return { assets: assets, liabilities: [] }
  }

  return { assets: assets, liabilities: liabilities }
}

// Activos Corrientes
export async function addActivoCorriente(formData: FormData) {
  const supabase = await createClient()
  const descripcion = formData.get("descripcion") as string
  const debe = Number.parseFloat(formData.get("debe") as string)
  const saldo = Number.parseFloat(formData.get("saldo") as string)

  const { data, error } = await supabase.from("activos_corrientes").insert([{ descripcion, debe, saldo }]).select()

  if (error) {
    console.error("Error adding activo corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Activo corriente añadido exitosamente", data: data[0] }
}

export async function updateActivoCorriente(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const descripcion = formData.get("descripcion") as string
  const debe = Number.parseFloat(formData.get("debe") as string)
  const saldo = Number.parseFloat(formData.get("saldo") as string)

  const { data, error } = await supabase
    .from("activos_corrientes")
    .update({ descripcion, debe, saldo })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating activo corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Activo corriente actualizado exitosamente", data: data[0] }
}

export async function deleteActivoCorriente(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("activos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting activo corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Activo corriente eliminado exitosamente" }
}

// Activos No Corrientes
export async function addActivoNoCorriente(formData: FormData) {
  const supabase = await createClient()
  const descripcion = formData.get("descripcion") as string
  const debe = Number.parseFloat(formData.get("debe") as string)
  const saldo = Number.parseFloat(formData.get("saldo") as string)

  const { data, error } = await supabase.from("activos_no_corrientes").insert([{ descripcion, debe, saldo }]).select()

  if (error) {
    console.error("Error adding activo no corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Activo no corriente añadido exitosamente", data: data[0] }
}

export async function updateActivoNoCorriente(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const descripcion = formData.get("descripcion") as string
  const debe = Number.parseFloat(formData.get("debe") as string)
  const saldo = Number.parseFloat(formData.get("saldo") as string)

  const { data, error } = await supabase
    .from("activos_no_corrientes")
    .update({ descripcion, debe, saldo })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating activo no corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Activo no corriente actualizado exitosamente", data: data[0] }
}

export async function deleteActivoNoCorriente(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("activos_no_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting activo no corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Activo no corriente eliminado exitosamente" }
}

// Pasivos Corrientes
export async function addPasivoCorriente(formData: FormData) {
  const supabase = await createClient()
  const descripcion = formData.get("descripcion") as string
  const debe = Number.parseFloat(formData.get("debe") as string)
  const saldo = Number.parseFloat(formData.get("saldo") as string)

  const { data, error } = await supabase.from("pasivos_corrientes").insert([{ descripcion, debe, saldo }]).select()

  if (error) {
    console.error("Error adding pasivo corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Pasivo corriente añadido exitosamente", data: data[0] }
}

export async function updatePasivoCorriente(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const descripcion = formData.get("descripcion") as string
  const debe = Number.parseFloat(formData.get("debe") as string)
  const saldo = Number.parseFloat(formData.get("saldo") as string)

  const { data, error } = await supabase
    .from("pasivos_corrientes")
    .update({ descripcion, debe, saldo })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating pasivo corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Pasivo corriente actualizado exitosamente", data: data[0] }
}

export async function deletePasivoCorriente(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("pasivos_corrientes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting pasivo corriente:", error)
    return { success: false, message: error.message }
  }
  return { success: true, message: "Pasivo corriente eliminado exitosamente" }
}

// Funciones genéricas de activos/pasivos (si se usan en otros lugares)
export async function addAsset(asset: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("assets").insert([asset]).select()
  if (error) {
    console.error("Error adding asset:", error)
    return { data: null, error: error }
  }
  return { data: data, error: null }
}

export async function addLiability(liability: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("liabilities").insert([liability]).select()
  if (error) {
    console.error("Error adding liability:", error)
    return { data: null, error: error }
  }
  return { data: data, error: null }
}

export async function updateAsset(assetId: string, asset: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("assets").update(asset).eq("id", assetId).select()
  if (error) {
    console.error("Error updating asset:", error)
    return { data: null, error: error }
  }
  return { data: data, error: null }
}

export async function updateLiability(liabilityId: string, liability: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("liabilities").update(liability).eq("id", liabilityId).select()
  if (error) {
    console.error("Error updating liability:", error)
    return { data: null, error: error }
  }
  return { data: data, error: null }
}

export async function deleteAsset(assetId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("assets").delete().eq("id", assetId)
  if (error) {
    console.error("Error deleting asset:", error)
    return { error: error }
  }
  return { error: null }
}

export async function deleteLiability(liabilityId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("liabilities").delete().eq("id", liabilityId)
  if (error) {
    console.error("Error deleting liability:", error)
    return { error: error }
  }
  return { error: null }
}
