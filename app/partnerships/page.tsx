export const dynamic = "force-dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PartnershipTable from "./PartnershipTable"
import { AddPartnershipDialog } from "@/components/add-partnership-dialog"
import { revalidatePath } from "next/cache"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function PartnershipsPage() {
  const handlePartnershipAdded = async () => {
    "use server"
    revalidatePath("/partnerships")
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestión de Partnerships</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddPartnershipDialog onPartnershipAdded={handlePartnershipAdded} />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Partnerships Registrados</CardTitle>
            <CardDescription>Listado de todos los acuerdos con socios.</CardDescription>
          </CardHeader>
          <CardContent>
            <PartnershipTable />
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}