import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { DollarSign } from "lucide-react" // Importar DollarSign

export const revalidate = 0

export default async function CuentasPorCobrarPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from("clientes")
    .select("cliente, proyecto, proyeccion_pagos")
    .not("proyeccion_pagos", "is", null) // Solo clientes con proyecciones

  if (error) {
    console.error("Error fetching accounts receivable:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Cuentas Por Cobrar</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Cuentas Por Cobrar</h2>
          <p className="text-red-500">Error al cargar las cuentas por cobrar: {error.message}</p>
        </main>
      </SidebarInset>
    )
  }

  const allProjections = (clients || []).flatMap((client) =>
    ((client.proyeccion_pagos || []) as Array<any>).map((proj) => ({
      cliente: client.cliente,
      proyecto: client.proyecto,
      ...proj,
    })),
  )

  const totalProjectedRevenue = allProjections.reduce((sum, p) => sum + p.monto, 0)
  const totalPaid = allProjections.filter((p) => p.pagado).reduce((sum, p) => sum + p.monto, 0)
  const totalPending = allProjections.filter((p) => !p.pagado).reduce((sum, p) => sum + p.monto, 0)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Cuentas Por Cobrar</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Cuentas Por Cobrar</h2>
        <p className="text-muted-foreground">Aquí puedes ver todas las proyecciones de pagos de tus clientes.</p>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proyectado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">{formatCurrency(totalProjectedRevenue)}</div>
              <p className="text-xs text-muted-foreground">Suma de todos los montos proyectados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">Monto total de proyecciones pagadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendiente</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-amount">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">Monto total de proyecciones pendientes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalle de Cuentas Por Cobrar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProjections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No hay cuentas por cobrar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allProjections.map((proj, index) => (
                      <TableRow key={index}>
                        <TableCell>{proj.cliente}</TableCell>
                        <TableCell>{proj.proyecto}</TableCell>
                        <TableCell>{proj.fecha}</TableCell>
                        <TableCell className={proj.pagado ? "text-green-amount" : "text-red-amount"}>
                          {formatCurrency(proj.monto)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              proj.pagado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {proj.pagado ? "Pagado" : "Pendiente"}
                          </span>
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
