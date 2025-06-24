import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function ProjectionsPage() {
  const supabase = createClient()
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, cliente, proyeccion_pagos, fecha_vencimiento")

  if (error) {
    console.error("Error fetching clients for projections:", error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar las proyecciones: {error.message}
      </div>
    )
  }

  let totalProyectado = 0
  let pagosVencidos = 0
  let clientesVencidosCount = 0
  const mesesProyectados: { [key: string]: { total: number; vencidos: number; clientes: Set<string> } } = {}

  const today = new Date()

  clientes?.forEach((cliente) => {
    if (cliente.proyeccion_pagos && Array.isArray(cliente.proyeccion_pagos)) {
      cliente.proyeccion_pagos.forEach((pago: any) => {
        const monto = pago.monto || 0
        const fecha = new Date(pago.fecha)

        totalProyectado += monto

        const monthKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, "0")}`
        if (!mesesProyectados[monthKey]) {
          mesesProyectados[monthKey] = { total: 0, vencidos: 0, clientes: new Set() }
        }
        mesesProyectados[monthKey].total += monto
        mesesProyectados[monthKey].clientes.add(cliente.cliente)

        if (fecha < today && !pago.pagado) {
          // Assuming 'pagado' property in projection_pagos
          pagosVencidos += monto
          mesesProyectados[monthKey].vencidos += monto
          if (cliente.fecha_vencimiento && new Date(cliente.fecha_vencimiento) < today) {
            clientesVencidosCount++
          }
        }
      })
    }
  })

  const sortedMonths = Object.keys(mesesProyectados).sort()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Proyecciones</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Proyecciones de Ingresos</h2>
        <p className="text-muted-foreground">Análisis mensual de ingresos esperados y seguimiento de vencimientos</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Proyectado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">${totalProyectado.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ingresos esperados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pagos Vencidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${pagosVencidos.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Clientes Vencidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{clientesVencidosCount}</div>
              <p className="text-xs text-muted-foreground">Con pagos atrasados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Meses Proyectados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sortedMonths.length}</div>
              <p className="text-xs text-muted-foreground">Con ingresos esperados</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Mensual de Ingresos Proyectados</CardTitle>
            <p className="text-sm text-muted-foreground">Cuánto dinero se espera recuperar cada mes</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead>Total Proyectado</TableHead>
                    <TableHead>Pagos Vencidos</TableHead>
                    <TableHead>Clientes Involucrados</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMonths.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No hay proyecciones de ingresos registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedMonths.map((monthKey) => {
                      const monthData = mesesProyectados[monthKey]
                      const monthName = new Date(monthKey).toLocaleString("es-ES", { month: "long", year: "numeric" })
                      return (
                        <TableRow key={monthKey}>
                          <TableCell>{monthName}</TableCell>
                          <TableCell className="text-green-amount">${monthData.total.toFixed(2)}</TableCell>
                          <TableCell className={cn(monthData.vencidos > 0 ? "text-red-600" : "text-green-amount")}>
                            ${monthData.vencidos.toFixed(2)}
                          </TableCell>
                          <TableCell>{monthData.clientes.size}</TableCell>
                          <TableCell>{monthData.vencidos > 0 ? "Con Vencimientos" : "Al Día"}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalle por Cliente y Fecha</CardTitle>
            <p className="text-sm text-muted-foreground">Proyecciones específicas organizadas por mes</p>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
              Tabla de detalle de proyecciones (próximamente)
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
