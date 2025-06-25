"use client" // Añadir esta línea
export const dynamic = "force-dynamic"
import { PlusIcon } from "lucide-react"
import { useState } from "react" // Importar useState
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PartnershipForm } from "@/components/partnership-form"
import PartnershipTable from "./PartnershipTable" // Importar el componente de tabla

export default function PartnershipsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false) // Estado para controlar el diálogo

  const handleSuccess = () => {
    setIsFormOpen(false) // Cerrar el diálogo al éxito
    // PartnershipTable ya debe revalidar si usa use(fetchData) o si se actualiza su estado.
    // Si PartnershipTable usa Server Actions, revalidatePath ya se encarga.
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Partnerships</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          {" "}
          {/* Controlar el estado del diálogo */}
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Partnership</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Partnership</DialogTitle>
            </DialogHeader>
            <PartnershipForm onSuccess={handleSuccess} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Partnerships Registrados</CardTitle>
          <CardDescription>Listado de todos los partnerships y su estado actual.</CardDescription>
        </CardHeader>
        <CardContent>
          <PartnershipTable />
        </CardContent>
      </Card>
    </div>
  )
}
