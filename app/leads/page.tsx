import { createServerSupabase } from "@/lib/supabase/server"
import { LeadForm } from "@/components/lead-form" // Importación nombrada
import { LeadTable } from "./LeadTable" // Importación nombrada
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

export default async function LeadsPage() {
  const supabase = createServerSupabase()
  const { data: leads, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    return <div>Error al cargar leads: {error.message}</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Leads</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Añadir Lead</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Lead</DialogTitle>
              <DialogDescription>Rellena los campos para añadir un nuevo lead a la base de datos.</DialogDescription>
            </DialogHeader>
            <LeadForm />
          </DialogContent>
        </Dialog>
      </div>

      <LeadTable leads={leads || []} />
    </div>
  )
}
