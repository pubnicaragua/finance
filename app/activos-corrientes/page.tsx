import { createServerSupabase } from "@/lib/supabase/server"
import { ActivoCorrienteForm } from "@/components/activo-corriente-form" // Importación nombrada
import { AssetsTable } from "@/components/AssetsTable" // Importación nombrada
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

export const revalidate = 0

export default async function CurrentAssetsPage() {
  const supabase = createServerSupabase()
  const { data: assets, error } = await supabase
    .from("activos_corrientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching current assets:", error)
    return <div>Error al cargar activos corrientes: {error.message}</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Activos Corrientes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Añadir Activo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Activo Corriente</DialogTitle>
              <DialogDescription>
                Rellena los campos para añadir un nuevo activo corriente a la base de datos.
              </DialogDescription>
            </DialogHeader>
            <ActivoCorrienteForm />
          </DialogContent>
        </Dialog>
      </div>

      <AssetsTable assets={assets || []} type="corriente" />
    </div>
  )
}
