export const dynamic = "force-dynamic"
import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default async function BalanceSheetPage() {
  const supabase = createClient()

  // Fetch Activos Circulantes
  const { data: cuentas, error: cuentasError } = await supabase.from("cuentas_financieras").select("nombre, saldo")
  const { data: activosCorrientes, error: acError } = await supabase
    .from("activos_corrientes")
    .select("descripcion, valor") // Asumiendo que inventarios y cuentas por cobrar están aquí o se pueden categorizar

  // Fetch Activos No Corrientes
  const { data: activosNoCorrientes, error: ancError } = await supabase
    .from("activos_no_corrientes")
    .select("valor_neto")

  // Fetch Pasivos Corrientes
  const { data: pasivosCorrientes, error: pcError } = await supabase.from("pasivos_corrientes").select("saldo")

  // Fetch Pasivos No Corrientes
  const { data: pasivosNoCorrientes, error: pncError } = await supabase.from("pasivos_no_corrientes").select("saldo")

  // Fetch Utilidad Neta (para Patrimonio)
  const { data: ingresosData, error: ingresosError } = await supabase
    .from("transacciones")
    .select("monto")
    .eq("tipo", "ingreso")
  const { data: egresosData, error: egresosError } = await supabase
    .from("transacciones")
    .select("monto")
    .eq("tipo", "egreso")
  const { data: comisionesData, error: comisionesError } = await supabase
    .from("comisiones")
    .select("monto")
    .eq("pagada", false) // Asumiendo que solo las comisiones no pagadas afectan la utilidad neta para este cálculo

  if (cuentasError || acError || ancError || pcError || pncError || ingresosError || egresosError || comisionesError) {
    console.error("Error fetching balance sheet data:", {
      cuentasError,
      acError,
      ancError,
      pcError,
      pncError,
      ingresosError,
      egresosError,
      comisionesError,
    })
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Balance General</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Balance General</h2>
          <p className="text-red-500">Error al cargar los datos del balance general.</p>
        </main>
      </SidebarInset>
    )
  }

  // Cálculos de Activos
  const caja = cuentas?.find((c) => c.nombre === "Caja Dólares")?.saldo || 0
  const bancos = cuentas?.find((c) => c.nombre === "Banco Lafise USD")?.saldo || 0
  const inventarios = activosCorrientes?.find((a) => a.descripcion === "Inventarios")?.valor || 0
  const cuentasPorCobrar = activosCorrientes?.find((a) => a.descripcion === "Cuentas por Cobrar")?.valor || 0

  const totalActivosCirculantes = caja + bancos + inventarios + cuentasPorCobrar
  const totalActivosNoCorrientes = (activosNoCorrientes || []).reduce((sum, a) => sum + (a.valor_neto || 0), 0)
  const totalActivos = totalActivosCirculantes + totalActivosNoCorrientes

  // Cálculos de Pasivos
  const totalPasivosCorrientes = (pasivosCorrientes || []).reduce((sum, p) => sum + (p.saldo || 0), 0)
  const totalPasivosNoCorrientes = (pasivosNoCorrientes || []).reduce((sum, p) => sum + (p.saldo || 0), 0)
  const totalPasivos = totalPasivosCorrientes + totalPasivosNoCorrientes

  // Cálculo de Utilidad Neta para Patrimonio
  const totalIngresos = (ingresosData || []).reduce((sum, t) => sum + (t.monto || 0), 0)
  const totalEgresos = (egresosData || []).reduce((sum, t) => sum + (t.monto || 0), 0)
  const totalComisionesPendientes = (comisionesData || []).reduce((sum, c) => sum + (c.monto || 0), 0)
  const utilidadNeta = totalIngresos - totalEgresos - totalPasivosCorrientes - totalComisionesPendientes // Nueva fórmula

  const totalPatrimonio = utilidadNeta // Asumiendo que la utilidad neta es el principal componente del patrimonio por ahora

  const totalPasivosYPatrimonio = totalPasivos + totalPatrimonio
  const diferenciaBalance = totalActivos - totalPasivosYPatrimonio

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Balance General</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Balance General</h2>
        <p className="text-muted-foreground">Estado financiero consolidado de Software Nicaragua</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Activos */}
          <Card>
            <CardHeader>
              <CardTitle>ACTIVOS</CardTitle>
              <p className="text-sm text-muted-foreground">Recursos y bienes de la empresa</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Valor USD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell>Activos Circulantes</TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Caja</TableCell>
                    <TableCell className="text-right text-green-amount">{caja.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Bancos</TableCell>
                    <TableCell className="text-right text-green-amount">{bancos.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Inventarios</TableCell>
                    <TableCell className="text-right text-green-amount">{inventarios.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Cuentas por Cobrar</TableCell>
                    <TableCell className="text-right text-green-amount">{cuentasPorCobrar.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold">
                    <TableCell>Total Activos Circulantes</TableCell>
                    <TableCell className="text-right text-green-amount">{totalActivosCirculantes.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Activos No Corrientes</TableCell>
                    <TableCell className="text-right text-green-amount">
                      {totalActivosNoCorrientes.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg">
                    <TableCell>TOTAL ACTIVOS</TableCell>
                    <TableCell className="text-right text-green-amount">{totalActivos.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pasivos y Patrimonio */}
          <Card>
            <CardHeader>
              <CardTitle>PASIVOS Y PATRIMONIO</CardTitle>
              <p className="text-sm text-muted-foreground">Obligaciones y capital de la empresa</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Valor USD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-semibold">
                    <TableCell>Pasivos Corrientes</TableCell>
                    <TableCell className="text-right text-red-amount">{totalPasivosCorrientes.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Pasivos No Corrientes</TableCell>
                    <TableCell className="text-right text-red-amount">{totalPasivosNoCorrientes.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold">
                    <TableCell>Total Pasivos</TableCell>
                    <TableCell className="text-right text-red-amount">{totalPasivos.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Patrimonio</TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Utilidad Neta</TableCell>
                    <TableCell
                      className={cn("text-right", utilidadNeta >= 0 ? "text-green-amount" : "text-red-amount")}
                    >
                      {utilidadNeta.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold">
                    <TableCell>Total Patrimonio</TableCell>
                    <TableCell
                      className={cn("text-right", totalPatrimonio >= 0 ? "text-green-amount" : "text-red-amount")}
                    >
                      {totalPatrimonio.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg">
                    <TableCell>TOTAL PASIVOS + PATRIMONIO</TableCell>
                    <TableCell
                      className={cn(
                        "text-right",
                        totalPasivosYPatrimonio >= 0 ? "text-green-amount" : "text-red-amount",
                      )}
                    >
                      {totalPasivosYPatrimonio.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Verificación de Balance</CardTitle>
            <p className="text-sm text-muted-foreground">Los activos deben ser iguales a pasivos + patrimonio</p>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Activos:</span>
              <span className="font-medium text-green-amount">USD {totalActivos.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Pasivos + Patrimonio:</span>
              <span className="font-medium text-green-amount">USD {totalPasivosYPatrimonio.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-bold">
              <span>Diferencia:</span>
              <span className={cn(diferenciaBalance === 0 ? "text-green-amount" : "text-red-amount")}>
                USD {diferenciaBalance.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}