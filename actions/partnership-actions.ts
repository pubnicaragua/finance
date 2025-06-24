// actions/partnership-actions.ts

import { createClient } from "@/utils/supabase/server"

export async function getPartnerships() {
  const supabase = await createClient()

  const { data: partnerships, error } = await supabase.from("partnerships").select("*")

  if (error) {
    console.error("Error fetching partnerships:", error)
    return []
  }

  return partnerships
}

export async function getPartnership(id: string) {
  const supabase = await createClient()

  const { data: partnership, error } = await supabase.from("partnerships").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching partnership:", error)
    return null
  }

  return partnership
}

export async function createPartnership(name: string, description: string, imageUrl: string, websiteUrl: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("partnerships")
    .insert([
      {
        name,
        description,
        image_url: imageUrl,
        website_url: websiteUrl,
      },
    ])
    .select()

  if (error) {
    console.error("Error creating partnership:", error)
    return null
  }

  return data
}

export async function updatePartnership(
  id: string,
  name: string,
  description: string,
  imageUrl: string,
  websiteUrl: string,
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("partnerships")
    .update({
      name,
      description,
      image_url: imageUrl,
      website_url: websiteUrl,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating partnership:", error)
    return null
  }

  return data
}

export async function deletePartnership(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("partnerships").delete().eq("id", id)

  if (error) {
    console.error("Error deleting partnership:", error)
    return false
  }

  return true
}
