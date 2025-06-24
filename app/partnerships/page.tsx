import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PartnershipForm } from "@/components/partnership-form"
import { PartnershipActionsClient } from "@/components/partnership-actions-client"
import { Plus } from "lucide-react"

export default async function PartnershipsPage() {
  const supabase = await createClient()
  const { data: partnerships, error } = await supabase.from("partnerships").select("*")

  if (error) {
    console.error("Error fetching partnerships:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Partnerships</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Gestión de Partnerships</h2>
          <p className="text-red-500">Error al cargar las partnerships.</p>
        </main>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Partnerships</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Gestión de Partnerships</h2>
        <p className="text-muted-foreground">Aquí puedes gestionar tus acuerdos de colaboración.</p>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Listado de Partnerships</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Partnership
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Añadir Nueva Partnership</DialogTitle>
                </DialogHeader>
                <PartnershipForm />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo de Acuerdo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Monto Financiado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(partnerships || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No hay partnerships registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (partnerships || []).map((partnership) => (
                      <TableRow key={partnership.id}>
                        <TableCell>{partnership.nombre}</TableCell>
                        <TableCell>{partnership.tipo_acuerdo || "N/A"}</TableCell>
                        <TableCell>{partnership.estado || "N/A"}</TableCell>
                        <TableCell>{partnership.fecha_inicio || "N/A"}</TableCell>
                        <TableCell>{partnership.fecha_fin || "N/A"}</TableCell>
                        <TableCell>USD {partnership.monto_financiado?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                          <PartnershipActionsClient partnership={partnership} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
