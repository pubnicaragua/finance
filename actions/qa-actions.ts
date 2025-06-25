"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function addQaIssue(formData: FormData) {
  const supabase = createClient()

  const feature = formData.get("feature") as string
  const description = formData.get("description") as string

  if (!feature || !description) {
    return { success: false, message: "Feature and description are required." }
  }

  const { error } = await supabase.from("qa_issues").insert({
    feature,
    description,
    status: "open",
  })

  if (error) {
    console.error("Error adding QA issue:", error)
    return { success: false, message: "Failed to add QA issue." }
  }

  revalidatePath("/qa-status")
  return { success: true, message: "QA issue added successfully!" }
}

export async function resolveQaIssue(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("qa_issues")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error resolving QA issue:", error)
    return { success: false, message: "Failed to resolve QA issue." }
  }

  revalidatePath("/qa-status")
  return { success: true, message: "QA issue resolved successfully!" }
}
