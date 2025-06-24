import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"

export default function MonthlyTransactionsPage({ params }: { params: { month: string } }) {
  const monthName = new Date(params.month).toLocaleString("es-ES", { month: "long", year: "numeric" })

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Ingresos y Egresos Mensual</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Detalle de Transacciones para {monthName}</h2>
        <p className="text-muted-foreground">
          Aquí se mostrarán los ingresos y egresos detallados para el mes seleccionado.
        </p>
        <div className="min-h-[300px] rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
          Contenido de transacciones mensuales (próximamente)
        </div>
      </main>
    </SidebarInset>
  )
}
