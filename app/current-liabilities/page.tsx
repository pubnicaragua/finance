import { createServerSupabase } from "@/lib/supabase/server"
import PasivoCorrienteForm from "@/components/pasivo-corriente-form" // Importación por defecto
import { LiabilitiesTable } from "@/components/LiabilitiesTable" // Importación nombrada
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
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export const revalidate = 0

export default async function CurrentLiabilitiesPage() {
  const supabase = createServerSupabase()
  const { data: liabilities, error } = await supabase
    .from("pasivos_corrientes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching current liabilities:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Pasivos Corrientes</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Pasivos Corrientes</h2>
          <p className="text-red-500">Error al cargar pasivos corrientes: {error.message}</p>
        </main>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Pasivos Corrientes</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Pasivos Corrientes</h2>
        <p className="text-muted-foreground">Obligaciones financieras a corto plazo de la empresa.</p>

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Lista de Pasivos Corrientes</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Añadir Pasivo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Pasivo Corriente</DialogTitle>
                <DialogDescription>
                  Rellena los campos para añadir un nuevo pasivo corriente a la base de datos.
                </DialogDescription>
              </DialogHeader>
              <PasivoCorrienteForm />
            </DialogContent>
          </Dialog>
        </div>

        <LiabilitiesTable liabilities={liabilities || []} type="corriente" />
      </main>
    </SidebarInset>
  )
}
