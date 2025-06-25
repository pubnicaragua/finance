// Eliminar "use client"
export const dynamic = "force-dynamic" // Mantener esto para renderizado dinámico en el servidor
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PartnershipTable from "./PartnershipTable" // Importar el componente de tabla
import { AddPartnershipDialog } from "@/components/add-partnership-dialog" // Importar el nuevo componente de diálogo
import { revalidatePath } from "next/cache" // Importar revalidatePath

export default function PartnershipsPage() {
  // Eliminar const [isFormOpen, setIsFormOpen] = useState(false)

  // Esta función se pasará al Client Component y revalidará la ruta
  const handlePartnershipAdded = async () => {
    // AÑADIR 'async' AQUÍ
    "use server" // Marcar como Server Action
    revalidatePath("/partnerships")
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Partnerships</h1>
        {/* Usar el nuevo componente de diálogo */}
        <AddPartnershipDialog onPartnershipAdded={handlePartnershipAdded} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Partnerships Registrados</CardTitle>
          <CardDescription>Listado de todos los acuerdos con socios.</CardDescription>
        </CardHeader>
        <CardContent>
          <PartnershipTable />
        </CardContent>
      </Card>
    </div>
  )
}
