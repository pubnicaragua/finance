import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default async function ProjectSummaryPage() {
  const supabase = createClient()
  const { data: clientes, error: clientesError } = await supabase
    .from("clientes")
    .select("id, cliente, proyecto, tipo_software, estado, pais, costo_proyecto, abonado, deuda, fecha_vencimiento")

  if (clientesError) {
    console.error("Error fetching clients for project summary:", clientesError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar el resumen de proyectos: {clientesError.message}
      </div>
    )
  }

  const totalCostoProyectos = clientes?.reduce((sum, c) => sum + (c.costo_proyecto || 0), 0) || 0
  const totalAbonado = clientes?.reduce((sum, c) => sum + (c.abonado || 0), 0) || 0
  const deudaPendiente = clientes?.reduce((sum, c) => sum + (c.deuda || 0), 0) || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Resumen de Proyectos</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Resumen de Proyectos por Cliente</h2>
        <p className="text-muted-foreground">Visión general de los proyectos y su estado financiero.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Costo Total Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">${totalCostoProyectos.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Suma de todos los costos de proyectos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Abonado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">${totalAbonado.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Cantidad total abonada por clientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Deuda Pendiente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${deudaPendiente.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Deuda total de todos los clientes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalle de Proyectos por Cliente</CardTitle>
            <p className="text-sm text-muted-foreground">
              Haz clic en un cliente para ver el detalle y seguimiento del proyecto.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Tipo Software</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Etapa del Proyecto</TableHead>
                    <TableHead>Costo Proyecto (USD)</TableHead>
                    <TableHead>Abonado (USD)</TableHead>
                    <TableHead>Deuda (USD)</TableHead>
                    <TableHead>Fecha Vencimiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">
                        No hay proyectos registrados aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientes?.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>{cliente.cliente}</TableCell>
                        <TableCell>{cliente.proyecto}</TableCell>
                        <TableCell>{cliente.tipo_software || "N/A"}</TableCell>
                        <TableCell>{cliente.estado || "N/A"}</TableCell>
                        <TableCell>{cliente.pais || "N/A"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell className="text-green-amount">
                          ${cliente.costo_proyecto?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell className="text-green-amount">${cliente.abonado?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell
                          className={cn(cliente.deuda && cliente.deuda > 0 ? "text-red-600" : "text-green-amount")}
                        >
                          ${cliente.deuda?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>{cliente.fecha_vencimiento || "N/A"}</TableCell>
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
