import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { FolderOpenIcon, CheckCircleIcon, PlayCircleIcon } from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export const revalidate = 0

export default async function ProjectSummaryPage() {
  const supabase = createClient()

  const { data: clients, error } = await supabase.from("clientes").select("*")

  if (error) {
    console.error("Error fetching clients for project summary:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Resumen de Proyectos</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div>Error al cargar el resumen de proyectos: {error.message}</div>
        </main>
      </SidebarInset>
    )
  }

  const totalProjects = clients.length
  const completedProjects = clients.filter((c) => c.estado === "Completa").length
  const activeProjects = clients.filter((c) => c.estado === "MVP").length
  const totalCost = clients.reduce((sum, c) => sum + (c.costo_proyecto || 0), 0)
  const totalPaid = clients.reduce((sum, c) => sum + (c.abonado || 0), 0)
  const totalDebt = clients.reduce((sum, c) => sum + (c.deuda || 0), 0)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Resumen de Proyectos</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
              <FolderOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">Proyectos registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Completados</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProjects}</div>
              <p className="text-xs text-muted-foreground">Proyectos finalizados exitosamente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <PlayCircleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">Proyectos en curso</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Financiero de Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Costo Total de Proyectos</TableCell>
                  <TableCell className="text-right text-red-500">{formatCurrency(totalCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Abonado por Clientes</TableCell>
                  <TableCell className="text-right text-green-500">{formatCurrency(totalPaid)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Deuda Pendiente de Clientes</TableCell>
                  <TableCell className="text-right text-red-500">{formatCurrency(totalDebt)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(
                  clients.reduce(
                    (acc, client) => {
                      acc[client.estado || 'Sin estado'] = (acc[client.estado || 'Sin estado'] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>,
                  ),
                ).map(([estado, count]) => (
                  <TableRow key={estado}>
                    <TableCell>{estado}</TableCell>
                    <TableCell className="text-right">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Costo Total</TableHead>
                  <TableHead className="text-right">Abonado</TableHead>
                  <TableHead className="text-right">Deuda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay proyectos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.cliente}</TableCell>
                      <TableCell>{client.proyecto}</TableCell>
                      <TableCell>{client.estado}</TableCell>
                      <TableCell className="text-right">{formatCurrency(client.costo_proyecto || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(client.abonado || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(client.deuda || 0)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}