import CurrentLiabilitiesClient from "@/components/current-liabilities-client"
import { createClient } from "@/lib/supabase/server"

export default async function CurrentLiabilitiesPage() {
  const supabase = createClient()
  const { data: pasivos = [], error } = await supabase
    .from("pasivos_corrientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    // Puedes personalizar este fallback si lo deseas
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar los pasivos corrientes: {error.message}
      </div>
    )
  }

  // Server Component puro: sólo pasa los datos al Client Component
  return <CurrentLiabilitiesClient pasivos={pasivos} />
}
