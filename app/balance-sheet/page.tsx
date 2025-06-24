import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function BalanceSheetPage() {
  const supabase = createClient()

  // Fetch data for Balance Sheet
  const { data: cuentasFinancieras, error: cuentasError } = await supabase
    .from("cuentas_financieras")
    .select("id, nombre, moneda, saldo")

  const { data: clientes, error: clientesError } = await supabase.from("clientes").select("id, deuda")

  const { data: activosNoCorrientes, error: ancError } = await supabase
    .from("activos_no_corrientes")
    .select("valor_neto")

  const { data: pasivosCorrientes, error: pcError } = await supabase.from("pasivos_corrientes").select("saldo")

  const { data: transacciones, error: transaccionesError } = await supabase.from("transacciones").select("monto, tipo")

  const { data: comisiones, error: comisionesError } = await supabase.from("comisiones").select("monto")

  const { data: tipoCambio, error: tipoCambioError } = await supabase.from("tipo_cambio").select("valor").maybeSingle()

  if (
    cuentasError ||
    clientesError ||
    ancError ||
    pcError ||
    transaccionesError ||
    comisionesError ||
    tipoCambioError
  ) {
    console.error("Error fetching data for Balance Sheet:", {
      cuentasError,
      clientesError,
      ancError,
      pcError,
      transaccionesError,
      comisionesError,
      tipoCambioError,
    })
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar el Balance General.
      </div>
    )
  }

  const tipoCambioUSDNIO = tipoCambio?.valor || 36.5

  // Calculate Assets
  let cajaUSD = 0
  let bancosUSD = 0
  cuentasFinancieras?.forEach((cuenta) => {
    if (cuenta.moneda === "USD") {
      if (cuenta.nombre.includes("Caja")) cajaUSD += cuenta.saldo || 0
      if (cuenta.nombre.includes("Banco")) bancosUSD += cuenta.saldo || 0
    } else if (cuenta.moneda === "NIO") {
      if (cuenta.nombre.includes("Caja")) cajaUSD += (cuenta.saldo || 0) / tipoCambioUSDNIO
      if (cuenta.nombre.includes("Banco")) bancosUSD += (cuenta.saldo || 0) / tipoCambioUSDNIO
    }
  })

  const cuentasPorCobrar = clientes?.reduce((sum, c) => sum + (c.deuda || 0), 0) || 0
  const totalActivosCirculantes = cajaUSD + bancosUSD + cuentasPorCobrar // Inventarios are 0 for now
  const totalActivosNoCorrientes = activosNoCorrientes?.reduce((sum, a) => sum + (a.valor_neto || 0), 0) || 0
  const totalActivos = totalActivosCirculantes + totalActivosNoCorrientes

  // Calculate Liabilities
  const totalPasivosCorrientes = pasivosCorrientes?.reduce((sum, p) => sum + (p.saldo || 0), 0) || 0
  const totalPasivos = totalPasivosCorrientes

  // Calculate Equity (Utilidad Neta)
  const totalIngresos =
    transacciones?.filter((t) => t.tipo === "ingreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
  const totalEgresos =
    transacciones?.filter((t) => t.tipo === "egreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
  const totalComisiones = comisiones?.reduce((sum, c) => sum + (c.monto || 0), 0) || 0

  const utilidadNeta = totalIngresos - totalEgresos - totalPasivosCorrientes - totalComisiones // Simplified for now
  const totalPatrimonio = utilidadNeta // Assuming no other equity components for now
  const totalPasivosPatrimonio = totalPasivos + totalPatrimonio
  const diferenciaBalance = totalActivos - totalPasivosPatrimonio

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Balance General</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Balance General</h2>
        <p className="text-muted-foreground">Estado financiero consolidado de Software Nicaragua</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>ACTIVOS</CardTitle>
              <p className="text-sm text-muted-foreground">Recursos y bienes de la empresa</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Activos Circulantes</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">Caja</TableCell>
                    <TableCell className="text-right text-green-amount">USD {cajaUSD.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">Bancos</TableCell>
                    <TableCell className="text-right text-green-amount">USD {bancosUSD.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">Inventarios</TableCell>
                    <TableCell className="text-right">0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">Cuentas por Cobrar</TableCell>
                    <TableCell className="text-right text-green-amount">USD {cuentasPorCobrar.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Total Activos Circulantes</TableCell>
                    <TableCell className="text-right text-green-amount">
                      USD {totalActivosCirculantes.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Activos No Corrientes</TableCell>
                    <TableCell className="text-right text-green-amount">
                      USD {totalActivosNoCorrientes.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg">
                    <TableCell>TOTAL ACTIVOS</TableCell>
                    <TableCell className="text-right text-green-amount">USD {totalActivos.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PASIVOS Y PATRIMONIO</CardTitle>
              <p className="text-sm text-muted-foreground">Obligaciones y capital de la empresa</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Pasivos Corrientes</TableCell>
                    <TableCell className="text-right text-red-600">USD {totalPasivosCorrientes.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Total Pasivos</TableCell>
                    <TableCell className="text-right text-red-600">USD {totalPasivos.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Patrimonio</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">Utilidad Neta</TableCell>
                    <TableCell className={cn("text-right", utilidadNeta >= 0 ? "text-green-amount" : "text-red-600")}>
                      USD {utilidadNeta.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Total Patrimonio</TableCell>
                    <TableCell
                      className={cn("text-right", totalPatrimonio >= 0 ? "text-green-amount" : "text-red-600")}
                    >
                      USD {totalPatrimonio.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg">
                    <TableCell>TOTAL PASIVOS + PATRIMONIO</TableCell>
                    <TableCell
                      className={cn("text-right", totalPasivosPatrimonio >= 0 ? "text-green-amount" : "text-red-600")}
                    >
                      USD {totalPasivosPatrimonio.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verificación de Balance</CardTitle>
            <p className="text-sm text-muted-foreground">Los activos deben ser iguales a pasivos + patrimonio</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Activos</span>
              <span className="text-green-amount">USD {totalActivos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Pasivos + Patrimonio</span>
              <span className={cn(totalPasivosPatrimonio >= 0 ? "text-green-amount" : "text-red-600")}>
                USD {totalPasivosPatrimonio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-4">
              <span>Diferencia</span>
              <span className={cn(diferenciaBalance === 0 ? "text-green-amount" : "text-red-600")}>
                USD {diferenciaBalance.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
