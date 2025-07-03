export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react"
import { PayrollForm } from "@/components/payroll-form"
import { formatCurrency } from "@/lib/utils"

export default async function PayrollPage() {
  const supabase = await createClient()

  const { data: nomina, error } = await supabase
    .from("nomina")
    .select(`
      *,
      empleados (
        nombre,
        apellido,
        puesto
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payroll:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Gestión de Nómina</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="text-red-500">Error al cargar nómina: {error.message}</div>
        </main>
      </SidebarInset>
    )
  }

  const totalNomina = nomina?.reduce((sum, n) => sum + (n.salario_neto || 0), 0) || 0
  const nominaPagada = nomina?.filter(n => n.estado === 'Pagado').reduce((sum, n) => sum + (n.salario_neto || 0), 0) || 0
  const nominaPendiente = nomina?.filter(n => n.estado === 'Pendiente').reduce((sum, n) => sum + (n.salario_neto || 0), 0) || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestión de Nómina</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Procesar Nómina</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Procesar Nueva Nómina</DialogTitle>
              </DialogHeader>
              <PayrollForm />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nómina</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalNomina)}</div>
              <p className="text-xs text-muted-foreground">Todos los períodos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Pagada</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(nominaPagada)}</div>
              <p className="text-xs text-muted-foreground">Pagos completados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Pendiente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(nominaPendiente)}</div>
              <p className="text-xs text-muted-foreground">Por pagar</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Nómina</CardTitle>
            <CardDescription>Historial de pagos de nómina por empleado y período.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Salario Base</TableHead>
                  <TableHead>Bonificaciones</TableHead>
                  <TableHead>Deducciones</TableHead>
                  <TableHead>Salario Neto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Pago</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nomina && nomina.length > 0 ? (
                  nomina.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell className="font-medium">
                        {registro.empleados?.nombre} {registro.empleados?.apellido}
                      </TableCell>
                      <TableCell>{registro.empleados?.puesto}</TableCell>
                      <TableCell>
                        {registro.periodo_inicio} - {registro.periodo_fin}
                      </TableCell>
                      <TableCell>{formatCurrency(registro.salario_base)}</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(registro.bonificaciones || 0)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(registro.deducciones || 0)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(registro.salario_neto || 0)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          registro.estado === 'Pagado' ? 'bg-green-100 text-green-700' :
                          registro.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {registro.estado}
                        </span>
                      </TableCell>
                      <TableCell>{registro.fecha_pago || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Editar Registro de Nómina</DialogTitle>
                            </DialogHeader>
                            <PayrollForm initialData={registro} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground">
                      No hay registros de nómina.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}