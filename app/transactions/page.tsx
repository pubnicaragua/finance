// REMOVE THE "use client" DIRECTIVE FROM HERE
// import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
// import { Separator } from "@/components/ui/separator"
// import { Wifi } from 'lucide-react'
import { createClient } from "@/lib/supabase/server"
import { TransactionsClientPage } from "@/components/transactions-client-page"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar" // Re-add imports if removed by mistake
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"

export default async function TransactionsPage() {
  const supabase = createClient()
  const { data: cuentas, error: cuentasError } = await supabase.from("cuentas_financieras").select("id, nombre, moneda")
  const { data: tipoCambio, error: tipoCambioError } = await supabase.from("tipo_cambio").select("valor").maybeSingle()
  const { data: clientes, error: clientesError } = await supabase.from("clientes").select("id, cliente")

  if (cuentasError || tipoCambioError || clientesError) {
    console.error("Error fetching data for transactions page:", { cuentasError, tipoCambioError, clientesError })
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar la página de Ingresos y Egresos.
      </div>
    )
  }

  const tipoCambioUSDNIO = tipoCambio?.valor || 36.5 // Default value if not found

  const { data: allTransactions, error: allTransactionsError } = await supabase
    .from("transacciones")
    .select(
      "id, concepto, tipo, cliente_id, fecha, monto, comision_aplicada, tipo_ingreso, tipo_egreso, vendedor_comision, cuentas_financieras(nombre, moneda)",
    )
    .order("fecha", { ascending: false })

  if (allTransactionsError) {
    console.error("Error fetching all transactions:", allTransactionsError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar las transacciones.
      </div>
    )
  }

  const ingresos = allTransactions?.filter((t) => t.tipo === "ingreso") || []
  const egresos = allTransactions?.filter((t) => t.tipo === "egreso") || []

  const totalIngresos = ingresos.reduce((sum, t) => sum + (t.monto || 0), 0)
  const totalEgresos = egresos.reduce((sum, t) => sum + (t.monto || 0), 0)
  const saldoNeto = totalIngresos - totalEgresos

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Ingresos y Egresos</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <TransactionsClientPage
        cuentas={cuentas || []}
        clientes={clientes || []}
        tipoCambioUSDNIO={tipoCambioUSDNIO}
        ingresos={ingresos}
        egresos={egresos}
        totalIngresos={totalIngresos}
        totalEgresos={totalEgresos}
        saldoNeto={saldoNeto}
      />
    </SidebarInset>
  )
}
