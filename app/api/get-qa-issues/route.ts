import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server" // Asegúrate de que esta ruta sea correcta

export async function GET() {
  const supabase = createClient()
  const { data: qa_issues, error } = await supabase
    .from("qa_issues")
    .select("*")
    .order("created_at", { ascending: false }) // Ordenar por fecha de creación

  if (error) {
    console.error("Error fetching QA issues:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(qa_issues)
}
