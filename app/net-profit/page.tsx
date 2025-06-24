import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function NetProfitPage() {
  const supabase = createClient()

  // Fetch data for Net Profit calculation
  const { data: transacciones, error: transaccionesError } = await supabase.from("transacciones").select("monto, tipo")

  const { data: pasivosCorrientes, error: pcError } = await supabase.from("pasivos_corrientes").select("saldo")

  const { data: comisiones, error: comisionesError } = await supabase.from("comisiones").select("monto")

  if (transaccionesError || pcError || comisionesError) {
    console.error("Error fetching data for Net Profit:", {
      transaccionesError,
      pcError,
      comisionesError,
    })
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar la Utilidad Neta.
      </div>
    )
  }

  const totalIngresos =
    transacciones?.filter((t) => t.tipo === "ingreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
  const totalEgresos =
    transacciones?.filter((t) => t.tipo === "egreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
  const totalPasivosCorrientes = pasivosCorrientes?.reduce((sum, p) => sum + (p.saldo || 0), 0) || 0
  const totalComisiones = comisiones?.reduce((sum, c) => sum + (c.monto || 0), 0) || 0

  const utilidadNeta = totalIngresos - totalEgresos - totalPasivosCorrientes - totalComisiones
  const dividendosEmpresa = utilidadNeta * 0.7
  const distribucionInversionistas = utilidadNeta * 0.3

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Utilidad Neta y Distribución</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Utilidad Neta y Distribución</h2>
        <p className="text-muted-foreground">
          Resultado financiero final con distribución automática: 70% dividendos, 30% inversionistas
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", utilidadNeta >= 0 ? "text-green-amount" : "text-red-600")}>
                USD {utilidadNeta.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {utilidadNeta >= 0 ? "Ganancia del período" : "Pérdida del período"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Dividendos Empresa (70%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", dividendosEmpresa >= 0 ? "text-green-amount" : "text-red-600")}>
                USD {dividendosEmpresa.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Reinversión y crecimiento empresarial</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Distribución Inversionistas (30%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  distribucionInversionistas >= 0 ? "text-green-amount" : "text-red-600",
                )}
              >
                USD {distribucionInversionistas.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Dividendos a repartir</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cálculo Detallado de Utilidad Neta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fórmula: Total Ingresos - Total Egresos - Total Pasivos Corrientes - Total Comisiones
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Total Ingresos</TableCell>
                  <TableCell className="text-right text-green-amount">USD {totalIngresos.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">+</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Egresos</TableCell>
                  <TableCell className="text-right text-red-600">USD {totalEgresos.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Pasivos Corrientes</TableCell>
                  <TableCell className="text-right text-red-600">USD {totalPasivosCorrientes.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Comisiones</TableCell>
                  <TableCell className="text-right text-red-600">USD {totalComisiones.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">-</TableCell>
                </TableRow>
                <TableRow className="font-bold text-lg">
                  <TableCell>UTILIDAD NETA</TableCell>
                  <TableCell className={cn("text-right", utilidadNeta >= 0 ? "text-green-amount" : "text-red-600")}>
                    USD {utilidadNeta.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">=</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-semibold">Ingresos</h3>
                <p className="text-green-amount">USD {totalIngresos.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm">Total de entradas</p>
              </div>
              <div>
                <h3 className="font-semibold">Egresos</h3>
                <p className="text-red-600">USD {totalEgresos.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm">Gastos operativos</p>
              </div>
              <div>
                <h3 className="font-semibold">Pasivos</h3>
                <p className="text-red-600">USD {totalPasivosCorrientes.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm">Obligaciones</p>
              </div>
              <div>
                <h3 className="font-semibold">Comisiones</h3>
                <p className="text-red-600">USD {totalComisiones.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm">Vendedores (4%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis y Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[100px] rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
              Contenido de análisis y recomendaciones (próximamente)
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
