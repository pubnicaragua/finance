import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function NonCurrentAssetsPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div>
      <h1>Non-Current Assets</h1>
      {/* Add your non-current assets content here */}
    </div>
  )
}
