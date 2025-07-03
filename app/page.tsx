export const dynamic = "force-dynamic"
import { createClient } from "@/lib/supabase/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Banknote, Users, TrendingUp, DollarSign, ArrowDownRight, Wifi, Landmark, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function HomePage() {
  try {
    const supabase = await createClient()

    // Fetch data for summary cards with error handling
    const [
      { data: cuentasFinancieras, error: cuentasError },
      { data: clientes, error: clientesError },
      { data: transacciones, error: transaccionesError },
      { data: empleados, error: empleadosError }
    ] = await Promise.all([
      supabase.from("cuentas_financieras").select("id, nombre, moneda, saldo"),
      supabase.from("clientes").select("id, costo_proyecto, abonado, deuda, pais"),
      supabase.from("transacciones").select("id, monto, tipo, created_at"),
      supabase.from("empleados").select("id, salario_base, estado")
    ])

    // Check for errors
    const errors = [
      cuentasError && `Cuentas: ${cuentasError.message}`,
      clientesError && `Clientes: ${clientesError.message}`,
      transaccionesError && `Transacciones: ${transaccionesError.message}`,
      empleadosError && `Empleados: ${empleadosError.message}`
    ].filter(Boolean)

    if (errors.length > 0) {
      return (
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Sistema Financiero</h1>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Errores de conexión a la base de datos:
                <ul className="mt-2 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </main>
        </SidebarInset>
      )
    }

    // Calculate summary metrics
    const totalCajaUSD = cuentasFinancieras?.find((c) => c.nombre === "Caja Dólares")?.saldo || 0
    const totalBancosUSD = cuentasFinancieras?.find((c) => c.nombre === "Banco Lafise USD")?.saldo || 0
    const totalDeudaClientes = clientes?.reduce((sum, c) => sum + (c.deuda || 0), 0) || 0
    const totalNominaActiva = empleados?.filter(e => e.estado === 'Activo').reduce((sum, e) => sum + (e.salario_base || 0), 0) || 0

    const totalIngresos = transacciones?.filter((t) => t.tipo === "ingreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
    const totalEgresos = transacciones?.filter((t) => t.tipo === "egreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
    const utilidadNeta = totalIngresos - totalEgresos

    // Clients by country
    const clientsByCountry: { [key: string]: number } = {}
    clientes?.forEach((client) => {
      if (client.pais) {
        clientsByCountry[client.pais] = (clientsByCountry[client.pais] || 0) + 1
      }
    })

    // Monthly data
    const monthlyData: { [key: string]: { ingresos: number; egresos: number } } = {}
    transacciones?.forEach((t) => {
      const date = new Date(t.created_at)
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { ingresos: 0, egresos: 0 }
      }

      if (t.tipo === "ingreso") {
        monthlyData[monthYear].ingresos += t.monto || 0
      } else if (t.tipo === "egreso") {
        monthlyData[monthYear].egresos += t.monto || 0
      }
    })

    const sortedMonths = Object.keys(monthlyData).sort()

    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Sistema Financiero</h1>
          <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <Wifi className="h-3 w-3" />
            <span>Conectado</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-hidden">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Dashboard General</h2>
            <p className="text-muted-foreground">Resumen financiero de Software Nicaragua</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total en Caja USD</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalCajaUSD.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Efectivo disponible</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total en Bancos USD</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalBancosUSD.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Fondos bancarios</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deuda Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">${totalDeudaClientes.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Pendiente por cobrar</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", utilidadNeta >= 0 ? "text-green-600" : "text-red-600")}>
                  ${utilidadNeta.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Ganancia/Pérdida</p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalIngresos.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Ingresos totales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${totalEgresos.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Gastos totales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nómina Mensual</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${totalNominaActiva.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Empleados activos</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Details */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Monthly Summary Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Resumen Mensual</CardTitle>
                <p className="text-sm text-muted-foreground">Ingresos y Egresos por mes</p>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] w-full items-end justify-around rounded-md bg-muted/50 p-4 overflow-x-auto">
                  {sortedMonths.length === 0 ? (
                    <div className="text-muted-foreground">No hay datos de transacciones para mostrar.</div>
                  ) : (
                    sortedMonths.map((month) => {
                      const data = monthlyData[month]
                      const maxAmount = Math.max(data.ingresos, data.egresos, 1)
                      const ingresosHeight = (data.ingresos / maxAmount) * 150
                      const egresosHeight = (data.egresos / maxAmount) * 150

                      return (
                        <div key={month} className="flex flex-col items-center gap-2 min-w-[60px]">
                          <div className="flex h-[150px] items-end gap-1">
                            <div
                              className="w-6 rounded-t-lg bg-green-600"
                              style={{ height: `${ingresosHeight}px` }}
                              title={`Ingresos ${month}: $${data.ingresos.toFixed(2)}`}
                            />
                            <div
                              className="w-6 rounded-t-lg bg-red-600"
                              style={{ height: `${egresosHeight}px` }}
                              title={`Egresos ${month}: $${data.egresos.toFixed(2)}`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{month.slice(5)}</span>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Clients by Country */}
            <Card>
              <CardHeader>
                <CardTitle>Clientes por País</CardTitle>
                <p className="text-sm text-muted-foreground">Distribución geográfica</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(clientsByCountry).length === 0 ? (
                    <p className="text-center text-muted-foreground">No hay datos de clientes por país.</p>
                  ) : (
                    Object.entries(clientsByCountry).map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center">
                        <span className="text-sm">{country}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Sistema Financiero</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error crítico en el dashboard: {error instanceof Error ? error.message : 'Error desconocido'}
            </AlertDescription>
          </Alert>
        </main>
      </SidebarInset>
    )
  }
}