export const dynamic = "force-dynamic"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

export default async function NetProfitPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: ingresosData, error: ingresosError } = await supabase
    .from("transacciones")
    .select("monto")
    .eq("tipo", "ingreso")
  const { data: egresosData, error: egresosError } = await supabase
    .from("transacciones")
    .select("monto")
    .eq("tipo", "egreso")
  const { data: pasivosCorrientesData, error: pcError } = await supabase.from("pasivos_corrientes").select("saldo")
  const { data: comisionesData, error: comisionesError } = await supabase
    .from("comisiones")
    .select("monto")
    .eq("pagada", false) // Asumiendo que solo las comisiones no pagadas afectan la utilidad neta

  if (ingresosError || egresosError || pcError || comisionesError) {
    console.error("Error fetching net profit data:", ingresosError || egresosError || pcError || comisionesError)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Utilidad Neta y Distribución</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Utilidad Neta y Distribución</h2>
          <p className="text-red-500">Error al cargar los datos de utilidad neta.</p>
        </main>
      </SidebarInset>
    )
  }

  const totalIngresos = (ingresosData || []).reduce((sum, t) => sum + (t.monto || 0), 0)
  const totalEgresos = (egresosData || []).reduce((sum, t) => sum + (t.monto || 0), 0)
  const totalPasivosCorrientes = (pasivosCorrientesData || []).reduce((sum, p) => sum + (p.saldo || 0), 0)
  const totalComisiones = (comisionesData || []).reduce((sum, c) => sum + (c.monto || 0), 0)

  // Nueva fórmula de Utilidad Neta
  const utilidadNeta = totalIngresos - totalEgresos - totalPasivosCorrientes - totalComisiones

  const dividendosEmpresa = utilidadNeta * 0.7
  const distribucionInversionistas = utilidadNeta * 0.3

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Utilidad Neta y Distribución</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Utilidad Neta y Distribución</h2>
        <p className="text-muted-foreground">
          Resultado financiero final con distribución automática: 70% dividendos, 30% inversionistas
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Utilidad Neta</CardTitle>
              <p className="text-sm text-muted-foreground">La empresa está generando ganancias</p>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", utilidadNeta >= 0 ? "text-green-amount" : "text-red-amount")}>
                USD {utilidadNeta.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Ganancia del período</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dividendos Empresa (70%)</CardTitle>
              <p className="text-sm text-muted-foreground">Reinversión y crecimiento empresarial</p>
            </CardHeader>
            <CardContent>
              <div
                className={cn("text-2xl font-bold", dividendosEmpresa >= 0 ? "text-green-amount" : "text-red-amount")}
              >
                USD {dividendosEmpresa.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Para desarrollo y operaciones</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribución Inversionistas (30%)</CardTitle>
              <p className="text-sm text-muted-foreground">Retorno para inversionistas</p>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  distribucionInversionistas >= 0 ? "text-green-amount" : "text-red-amount",
                )}
              >
                USD {distribucionInversionistas.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Dividendos a repartir</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cálculo Detallado de Utilidad Neta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fórmula: Total Ingresos - Total Egresos - Total Pasivos Corrientes - Total Comisiones
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Monto USD</TableHead>
                  <TableHead>Operación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Total Ingresos</TableCell>
                  <TableCell className="text-right text-green-amount">{totalIngresos.toFixed(2)}</TableCell>
                  <TableCell>+</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Egresos</TableCell>
                  <TableCell className="text-right text-red-amount">{totalEgresos.toFixed(2)}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Pasivos Corrientes</TableCell>
                  <TableCell className="text-right text-red-amount">{totalPasivosCorrientes.toFixed(2)}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Comisiones</TableCell>
                  <TableCell className="text-right text-red-amount">{totalComisiones.toFixed(2)}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow className="font-bold text-lg">
                  <TableCell>UTILIDAD NETA</TableCell>
                  <TableCell className={cn("text-right", utilidadNeta >= 0 ? "text-green-amount" : "text-red-amount")}>
                    {utilidadNeta.toFixed(2)}
                  </TableCell>
                  <TableCell>=</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Análisis y Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {utilidadNeta >= 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Situación Financiera Positiva</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>Situación Financiera Negativa</span>
              </div>
            )}
            <ul className="list-disc pl-5 mt-2 text-muted-foreground">
              <li>Dividendos empresa: USD {dividendosEmpresa.toFixed(2)}</li>
              <li>Para inversionistas: USD {distribucionInversionistas.toFixed(2)}</li>
              {utilidadNeta >= 0 ? (
                <li>Considerar reinversión estratégica para crecimiento.</li>
              ) : (
                <li>Analizar egresos y fuentes de ingresos para mejorar la rentabilidad.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}