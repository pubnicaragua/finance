import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import LeadForm from "@/components/lead-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LeadTable from "./LeadTable" // Importar el nuevo componente de tabla

export default async function LeadsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gestión de Leads</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Agregar Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Lead</DialogTitle>
              <DialogDescription>Completa los detalles para añadir un nuevo lead.</DialogDescription>
            </DialogHeader>
            <LeadForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Usar el componente LeadTable aquí */}
      <LeadTable />
    </div>
  )
}
