import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function AccountSummaryPage() {
  const supabase = createClient()
  const { data: cuentas, error: cuentasError } = await supabase.from("cuentas_financieras").select("*")
  const { data: tipoCambio, error: tipoCambioError } = await supabase.from("tipo_cambio").select("valor").maybeSingle()

  if (cuentasError || tipoCambioError) {
    console.error("Error fetching data for account summary:", { cuentasError, tipoCambioError })
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar el resumen de cuentas.
      </div>
    )
  }

  const tipoCambioUSDNIO = tipoCambio?.valor || 36.5 // Default value if not found

  let totalCajaNIO = 0
  let totalCajaUSD = 0
  let totalBancosNIO = 0
  let totalBancosUSD = 0

  cuentas?.forEach((cuenta) => {
    if (cuenta.nombre.includes("Caja")) {
      if (cuenta.moneda === "NIO") totalCajaNIO += cuenta.saldo || 0
      if (cuenta.moneda === "USD") totalCajaUSD += cuenta.saldo || 0
    } else if (cuenta.nombre.includes("Banco")) {
      if (cuenta.moneda === "NIO") totalBancosNIO += cuenta.saldo || 0
      if (cuenta.moneda === "USD") totalBancosUSD += cuenta.saldo || 0
    }
  })

  const totalCajaUSD_Converted = totalCajaUSD + totalCajaNIO / tipoCambioUSDNIO
  const totalBancosUSD_Converted = totalBancosUSD + totalBancosNIO / tipoCambioUSDNIO
  const granTotalConsolidadoUSD = totalCajaUSD_Converted + totalBancosUSD_Converted

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Resumen de Cuentas</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Resumen de Cuentas</h2>
        <p className="text-muted-foreground">Consolidado de todas las cuentas financieras</p>

        <Card>
          <CardHeader>
            <CardTitle>Resumen General</CardTitle>
            <p className="text-sm text-muted-foreground">Saldos actuales de todas las cuentas</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Moneda</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Total en USD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuentas?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No hay cuentas financieras registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {cuentas?.map((cuenta) => (
                        <TableRow key={cuenta.id}>
                          <TableCell>{cuenta.nombre.includes("Caja") ? "Caja" : "Bancos"}</TableCell>
                          <TableCell>{cuenta.moneda}</TableCell>
                          <TableCell
                            className={cn(cuenta.saldo && cuenta.saldo >= 0 ? "text-green-amount" : "text-red-600")}
                          >
                            {cuenta.moneda === "NIO" ? "C$" : "USD "}
                            {cuenta.saldo?.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={cn(cuenta.saldo && cuenta.saldo >= 0 ? "text-green-amount" : "text-red-600")}
                          >
                            USD{" "}
                            {(cuenta.moneda === "NIO"
                              ? (cuenta.saldo || 0) / tipoCambioUSDNIO
                              : cuenta.saldo || 0
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell colSpan={3}>Gran Total</TableCell>
                        <TableCell className={cn(granTotalConsolidadoUSD >= 0 ? "text-green-amount" : "text-red-600")}>
                          USD {granTotalConsolidadoUSD.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold">Total en Caja</h3>
              <div className="flex justify-between">
                <span>Caja Córdobas</span>
                <span className={cn(totalCajaNIO >= 0 ? "text-green-amount" : "text-red-600")}>
                  C${totalCajaNIO.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Caja Dólares</span>
                <span className={cn(totalCajaUSD >= 0 ? "text-green-amount" : "text-red-600")}>
                  USD {totalCajaUSD.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total USD:</span>
                <span className={cn(totalCajaUSD_Converted >= 0 ? "text-green-amount" : "text-red-600")}>
                  USD {totalCajaUSD_Converted.toFixed(2)}
                </span>
              </div>

              <h3 className="text-lg font-semibold mt-4">Total en Bancos</h3>
              <div className="flex justify-between">
                <span>Bancos Córdobas</span>
                <span className={cn(totalBancosNIO >= 0 ? "text-green-amount" : "text-red-600")}>
                  C${totalBancosNIO.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Bancos Dólares</span>
                <span className={cn(totalBancosUSD >= 0 ? "text-green-amount" : "text-red-600")}>
                  USD {totalBancosUSD.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total USD:</span>
                <span className={cn(totalBancosUSD_Converted >= 0 ? "text-green-amount" : "text-red-600")}>
                  USD {totalBancosUSD_Converted.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Información de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-lg font-semibold">
                <span>Tipo de Cambio Actual</span>
                <span>1 USD = {tipoCambioUSDNIO} NIO</span>
              </div>
              <div className="flex justify-between text-2xl font-bold mt-4">
                <span>Gran Total Consolidado</span>
                <span className={cn(granTotalConsolidadoUSD >= 0 ? "text-green-amount" : "text-red-600")}>
                  USD {granTotalConsolidadoUSD.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarInset>
  )
}
