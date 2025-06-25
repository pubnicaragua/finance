// NO "use client" aquí, es un Server Component
export const dynamic = "force-dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PartnershipTable from "./PartnershipTable"
import { AddPartnershipDialog } from "@/components/add-partnership-dialog"
import { revalidatePath } from "next/cache"

export default function PartnershipsPage() {
  const handlePartnershipAdded = async () => {
    "use server"
    revalidatePath("/partnerships")
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Partnerships</h1>
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
