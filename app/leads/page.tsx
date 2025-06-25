// NO "use client" aquí, es un Server Component
export const dynamic = "force-dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LeadTable from "./LeadTable"
import { AddLeadDialog } from "@/components/add-lead-dialog"
import { revalidatePath } from "next/cache"

export default function LeadsPage() {
  const handleLeadAdded = async () => {
    "use server"
    revalidatePath("/leads")
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Leads</h1>
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
