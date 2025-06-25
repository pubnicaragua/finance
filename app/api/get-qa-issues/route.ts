import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()

  const { data: qaIssues, error } = await supabase
    .from("qa_issues")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching QA issues:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(qaIssues)
}
