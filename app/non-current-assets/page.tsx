import { createServerSupabase } from "@/lib/supabase/server"
import ActivoNoCorrienteForm from "@/components/activo-no-corriente-form" // Importación por defecto
import { AssetsTable } from "@/components/AssetsTable"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export const revalidate = 0

export default async function NonCurrentAssetsPage() {
  const supabase = createServerSupabase()
  const { data: assets, error } = await supabase
    .from("activos_no_corrientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching non-current assets:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Activos No Corrientes</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Activos No Corrientes</h2>
          <p className="text-red-500">Error al cargar activos no corrientes: {error.message}</p>
        </main>
      </SidebarInset>
    )
  }

  const totalValorOriginal = assets?.reduce((sum, asset) => sum + (asset.valor || 0), 0) || 0
  const totalDepreciacionAcumulada = assets?.reduce((sum, asset) => sum + (asset.depreciacion || 0), 0) || 0
  const totalValorNeto = assets?.reduce((sum, asset) => sum + (asset.valor_neto || 0), 0) || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Activos No Corrientes</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Activos No Corrientes</h2>
        <p className="text-muted-foreground">Bienes de uso y activos intangibles de la empresa.</p>

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Lista de Activos No Corrientes</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Añadir Activo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Activo No Corriente</DialogTitle>
                <DialogDescription>
                  Rellena los campos para añadir un nuevo activo no corriente a la base de datos.
                </DialogDescription>
              </DialogHeader>
              <ActivoNoCorrienteForm />
            </DialogContent>
          </Dialog>
        </div>

        <AssetsTable assets={assets || []} type="no-corriente" />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumen de Activos No Corrientes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Valor Original Total:</span>
              <span className="font-medium text-green-amount">USD {totalValorOriginal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Depreciación Acumulada:</span>
              <span className="font-medium text-red-amount">USD {totalDepreciacionAcumulada.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span>Valor Neto Total:</span>
              <span className="text-green-amount">USD {totalValorNeto.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
