import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: qa_issues, error } = await supabase
    .from("qa_issues")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching QA issues:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(qa_issues)
}