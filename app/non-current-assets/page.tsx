import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { NonCurrentAssetsClientPage } from "@/components/non-current-assets-client-page"

export default async function NonCurrentAssetsPage() {
  const supabase = createClient()
  const { data: activos, error } = await supabase
    .from("activos_no_corrientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching non-current assets:", error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar los activos no corrientes: {error.message}
      </div>
    )
  }

  const valorOriginalTotal = activos?.reduce((sum, a) => sum + (a.valor || 0), 0) || 0
  const depreciacionAcumulada = activos?.reduce((sum, a) => sum + (a.depreciacion || 0), 0) || 0
  const valorNetoTotal = activos?.reduce((sum, a) => sum + (a.valor_neto || 0), 0) || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Activos No Corrientes</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <NonCurrentAssetsClientPage
        activos={activos || []}
        valorOriginalTotal={valorOriginalTotal}
        depreciacionAcumulada={depreciacionAcumulada}
        valorNetoTotal={valorNetoTotal}
      />
    </SidebarInset>
  )
}
