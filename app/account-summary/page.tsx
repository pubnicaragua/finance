export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AccountSummaryPage() {
  const supabase = createClient()

  const { data: cuentas, error } = await supabase.from("cuentas_financieras").select("*")

  if (error) {
    console.error("Error fetching account summary:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Resumen de Cuentas</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Resumen de Cuentas</h2>
          <p className="text-red-500">Error al cargar el resumen de cuentas.</p>
        </main>
      </SidebarInset>
    )
  }

  const totalSaldo = (cuentas || []).reduce((sum, cuenta) => sum + (cuenta.saldo || 0), 0)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Resumen de Cuentas</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Resumen de Cuentas</h2>
        <p className="text-muted-foreground">Vista general de todas tus cuentas financieras.</p>

        <Card>
          <CardHeader>
            <CardTitle>Cuentas Financieras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Moneda</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(cuentas || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No hay cuentas financieras registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (cuentas || []).map((cuenta) => (
                      <TableRow key={cuenta.id}>
                        <TableCell>{cuenta.nombre}</TableCell>
                        <TableCell>{cuenta.moneda}</TableCell>
                        <TableCell className="text-right text-green-amount">{cuenta.saldo?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow className="font-bold">
                    <TableCell colSpan={2}>Total Saldo:</TableCell>
                    <TableCell className="text-right text-green-amount">USD {totalSaldo.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}