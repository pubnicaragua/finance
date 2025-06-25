"use client" // Añadir esta línea

export const dynamic = "force-dynamic"
import { PlusIcon } from "lucide-react"
import { useState } from "react" // Importar useState
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LeadForm } from "@/components/lead-form"
import LeadTable from "./LeadTable" // Importar el componente de tabla

export default function LeadsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false) // Estado para controlar el diálogo

  const handleSuccess = () => {
    setIsFormOpen(false) // Cerrar el diálogo al éxito
    // LeadTable ya debe revalidar si usa use(fetchData) o si se actualiza su estado.
    // Si LeadTable usa Server Actions, revalidatePath ya se encarga.
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Leads</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Lead</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Lead</DialogTitle>
            </DialogHeader>
            <LeadForm onSuccess={handleSuccess} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Leads Registrados</CardTitle>
          <CardDescription>Listado de todos los leads y su estado actual.</CardDescription>
        </CardHeader>
        <CardContent>
          <LeadTable />
        </CardContent>
      </Card>
    </div>
  )
}
