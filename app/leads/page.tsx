// Eliminar "use client"
export const dynamic = "force-dynamic" // Mantener esto para renderizado dinámico en el servidor
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LeadTable from "./LeadTable" // Importar el componente de tabla
import { AddLeadDialog } from "@/components/add-lead-dialog" // Importar el nuevo componente de diálogo
import { revalidatePath } from "next/cache" // Importar revalidatePath

export default function LeadsPage() {
  // Eliminar const [isFormOpen, setIsFormOpen] = useState(false)

  // Esta función se pasará al Client Component y revalidará la ruta
  const handleLeadAdded = async () => {
    // AÑADIR 'async' AQUÍ
    "use server" // Marcar como Server Action
    revalidatePath("/leads")
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Leads</h1>
        {/* Usar el nuevo componente de diálogo */}
        <AddLeadDialog onLeadAdded={handleLeadAdded} />
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
