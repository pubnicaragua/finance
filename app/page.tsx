import { createClient } from "@/lib/supabase/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Banknote, Users, TrendingUp, DollarSign, ArrowDownRight, Wifi, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default async function HomePage() {
  const supabase = createClient()

  // Fetch data for summary cards
  const { data: cuentasFinancieras, error: cuentasError } = await supabase
    .from("cuentas_financieras")
    .select("id, nombre, moneda, saldo")

  const { data: clientes, error: clientesError } = await supabase
    .from("clientes")
    .select("id, costo_proyecto, abonado, deuda, pais")

  const { data: transacciones, error: transaccionesError } = await supabase
    .from("transacciones")
    .select("id, monto, tipo, fecha") // Fetch fecha for monthly grouping

  if (cuentasError || clientesError || transaccionesError) {
    console.error("Error fetching dashboard data:", {
      cuentasError,
      clientesError,
      transaccionesError,
    })
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar los datos del dashboard.
      </div>
    )
  }

  // Calculate summary metrics
  const totalCajaUSD = cuentasFinancieras?.find((c) => c.nombre === "Caja Dólares")?.saldo || 0
  const totalBancosUSD = cuentasFinancieras?.find((c) => c.nombre === "Banco Lafise USD")?.saldo || 0
  const totalDeudaClientes = clientes?.reduce((sum, c) => sum + (c.deuda || 0), 0) || 0

  const totalIngresosGlobal =
    transacciones?.filter((t) => t.tipo === "ingreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
  const totalEgresosGlobal =
    transacciones?.filter((t) => t.tipo === "egreso").reduce((sum, t) => sum + (t.monto || 0), 0) || 0
  const utilidadNeta = totalIngresosGlobal - totalEgresosGlobal // Simplificado, la fórmula completa se verá en Utilidad Neta

  // Clients by country (basic aggregation)
  const clientsByCountry: { [key: string]: number } = {}
  clientes?.forEach((client) => {
    if (client.pais) {
      clientsByCountry[client.pais] = (clientsByCountry[client.pais] || 0) + 1
    }
  })

  // Monthly Income vs Expenses Data for Chart
  const monthlyDataMap = new Map<string, { ingresos: number; egresos: number }>()

  transacciones?.forEach((t) => {
    if (t.fecha && t.monto !== null) {
      const date = new Date(t.fecha)
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

      if (!monthlyDataMap.has(monthYear)) {
        monthlyDataMap.set(monthYear, { ingresos: 0, egresos: 0 })
      }

      const currentMonthData = monthlyDataMap.get(monthYear)!
      if (t.tipo === "ingreso") {
        currentMonthData.ingresos += t.monto
      } else if (t.tipo === "egreso") {
        currentMonthData.egresos += t.monto
      }
    }
  })

  const monthlyChartData = Array.from(monthlyDataMap.entries())
    .map(([monthYear, data]) => ({
      month: monthYear,
      Ingresos: data.ingresos,
      Egresos: data.egresos,
    }))
    .sort((a, b) => a.month.localeCompare(b.month)) // Sort by month

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
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Dashboard General</h2>
        <p className="text-muted-foreground">Resumen financiero de Software Nicaragua</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total en Caja USD</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCajaUSD.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Efectivo disponible</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total en Bancos USD</CardTitle>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBancosUSD.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Fondos bancarios</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deuda Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDeudaClientes.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Pendiente por cobrar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", utilidadNeta >= 0 ? "text-green-amount" : "text-red-600")}>
                ${utilidadNeta.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Ganancia/Pérdida</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">${totalIngresosGlobal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ingresos totales</p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalEgresosGlobal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Gastos totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary Section - Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen Mensual de Ingresos vs Egresos</CardTitle>
            <p className="text-sm text-muted-foreground">Comparación de flujo de efectivo por mes</p>
          </CardHeader>
          <CardContent>
            {monthlyChartData.length === 0 ? (
              <div className="h-[200px] rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                No hay datos de transacciones para mostrar el gráfico mensual.
              </div>
            ) : (
              <ChartContainer
                config={{
                  Ingresos: {
                    label: "Ingresos",
                    color: "hsl(var(--green-amount))",
                  },
                  Egresos: {
                    label: "Egresos",
                    color: "hsl(var(--destructive))",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="Ingresos" stroke="var(--color-Ingresos)" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Egresos" stroke="var(--color-Egresos)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos vs Egresos (Total)</CardTitle>
              <p className="text-sm text-muted-foreground">Comparación global</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-lg font-semibold">
                <span>Ingresos</span>
                <span className="text-green-amount">${totalIngresosGlobal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Egresos</span>
                <span className="text-red-600">${totalEgresosGlobal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clientes por País</CardTitle>
              <p className="text-sm text-muted-foreground">Distribución geográfica</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {Object.entries(clientsByCountry).map(([country, count]) => (
                    <TableRow key={country}>
                      <TableCell>{country}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                  {Object.keys(clientsByCountry).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No hay datos de clientes por país.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fluctuación de Caja</CardTitle>
              <p className="text-sm text-muted-foreground">Tendencia mensual</p>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCajaUSD.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Saldo actual en caja</p>
              <div className="h-[100px] w-full rounded-md bg-muted/50 mt-4 flex items-center justify-center text-muted-foreground">
                {/* Placeholder for chart */}
                Gráfico de tendencia (próximamente)
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarInset>
  )
}
