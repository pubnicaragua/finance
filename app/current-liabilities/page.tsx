import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import CurrentLiabilityForm from "@/components/pasivo-corriente-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LiabilitiesTable from "@/components/LiabilitiesTable" // Importar el nuevo componente de tabla

export default async function CurrentLiabilitiesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pasivos Corrientes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Agregar Pasivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Pasivo Corriente</DialogTitle>
              <DialogDescription>Completa los detalles para añadir un nuevo pasivo corriente.</DialogDescription>
            </DialogHeader>
            <CurrentLiabilityForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Usar el componente LiabilitiesTable aquí */}
      <LiabilitiesTable />
    </div>
  )
}
