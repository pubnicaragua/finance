import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function PartnershipsPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Partnerships</h1>
      <p>This is the partnerships page. Content coming soon.</p>
    </div>
  )
}
