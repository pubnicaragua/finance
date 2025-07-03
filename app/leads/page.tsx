export const dynamic = "force-dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LeadTable from "./LeadTable"
import { AddLeadDialog } from "@/components/add-lead-dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function LeadsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestión de Leads</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddLeadDialog />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Leads Registrados</CardTitle>
            <CardDescription>Listado de todos los leads y su estado actual.</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadTable />
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}