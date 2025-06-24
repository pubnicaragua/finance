import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

interface Params {
  id: string
}

export default async function ClientPage({ params }: { params: Params }) {
  const { id } = params

  const supabase = await createClient()

  const { data: client, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error(error)
    return notFound()
  }

  if (!client) {
    return notFound()
  }

  return (
    <div>
      <h1>Client Details</h1>
      <p>ID: {client.id}</p>
      <p>Name: {client.name}</p>
      <p>Email: {client.email}</p>
      {/* Display other client details here */}
    </div>
  )
}
