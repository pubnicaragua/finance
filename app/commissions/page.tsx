export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function CommissionsPage() {
  const supabase = await createClient()

  const { data: comisiones, error } = await supabase.from("comisiones").select("*")

  if (error) {
    console.error("Error fetching commissions:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Comisiones</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Gestión de Comisiones</h2>
          <p className="text-red-500">Error al cargar las comisiones.</p>
        </main>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Comisiones</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Gestión de Comisiones</h2>
        <p className="text-muted-foreground">Aquí puedes gestionar las comisiones de tus vendedores.</p>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Comisiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Pagada</TableHead>
                    <TableHead>Cliente ID</TableHead>
                    <TableHead>Transacción ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(comisiones || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No hay comisiones registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (comisiones || []).map((comision) => (
                      <TableRow key={comision.id}>
                        <TableCell>{comision.fecha}</TableCell>
                        <TableCell>{comision.vendedor}</TableCell>
                        <TableCell className={comision.pagada ? "text-green-amount" : "text-red-amount"}>
                          USD {comision.monto.toFixed(2)}
                        </TableCell>
                        <TableCell>{comision.pagada ? "Sí" : "No"}</TableCell>
                        <TableCell>{comision.cliente_id || "N/A"}</TableCell>
                        <TableCell>{comision.transaccion_id || "N/A"}</TableCell>
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
