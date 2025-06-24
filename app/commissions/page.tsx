import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function CommissionsPage() {
  const supabase = createClient()
  const { data: comisiones, error } = await supabase.from("comisiones").select("*")

  if (error) {
    console.error("Error fetching commissions:", error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar las comisiones: {error.message}
      </div>
    )
  }

  const totalComisiones = comisiones?.reduce((sum, c) => sum + (c.monto || 0), 0) || 0
  const pagadas = comisiones?.filter((c) => c.pagada).reduce((sum, c) => sum + (c.monto || 0), 0) || 0
  const pendientes = totalComisiones - pagadas
  const transaccionesConComision = comisiones?.length || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Comisiones de Ventas</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Comisiones de Ventas</h2>
        <p className="text-muted-foreground">Control de comisiones automáticas del 4% sobre abonos de clientes</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Comisiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">${totalComisiones.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Generadas automáticamente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">${pagadas.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ya liquidadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${pendientes.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Por pagar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transaccionesConComision}</div>
              <p className="text-xs text-muted-foreground">Con comisión aplicada</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalle de Comisiones</CardTitle>
            <p className="text-sm text-muted-foreground">Historial completo de comisiones generadas automáticamente</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto Comisión</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comisiones?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No hay comisiones registradas aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    comisiones?.map((comision) => (
                      <TableRow key={comision.id}>
                        <TableCell>{comision.fecha}</TableCell>
                        <TableCell>{comision.vendedor}</TableCell>
                        <TableCell>{comision.cliente_id || "N/A"}</TableCell>
                        <TableCell className="text-green-amount">${comision.monto?.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              comision.pagada ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                            )}
                          >
                            {comision.pagada ? "Pagada" : "Pendiente"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
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
