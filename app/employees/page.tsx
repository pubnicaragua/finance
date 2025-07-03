export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, Users, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react"
import { EmployeeForm } from "@/components/employee-form"
import { EmployeePaymentHistory } from "@/components/employee-payment-history"
import { formatCurrency } from "@/lib/utils"

export default async function EmployeesPage() {
  const supabase = await createClient()

  const { data: empleados, error } = await supabase
    .from("empleados")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching employees:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Gestión de Empleados</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="text-red-500">Error al cargar empleados: {error.message}</div>
        </main>
      </SidebarInset>
    )
  }

  // Obtener datos de nómina para cada empleado
  const { data: nomina } = await supabase
    .from("nomina")
    .select("*")
    .order("created_at", { ascending: false })

  const totalEmpleados = empleados?.length || 0
  const empleadosActivos = empleados?.filter(e => e.estado === 'Activo').length || 0
  const totalNomina = empleados?.filter(e => e.estado === 'Activo').reduce((sum, e) => sum + (e.salario_base || 0), 0) || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestión de Empleados</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Añadir Empleado</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
              </DialogHeader>
              <EmployeeForm />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmpleados}</div>
              <p className="text-xs text-muted-foreground">Empleados registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{empleadosActivos}</div>
              <p className="text-xs text-muted-foreground">Actualmente trabajando</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nómina Total Mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalNomina)}</div>
              <p className="text-xs text-muted-foreground">Salarios base activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Listado de Empleados</CardTitle>
            <CardDescription>Gestiona la información de todos los empleados.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Salario Base</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Contratación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleados && empleados.length > 0 ? (
                  empleados.map((empleado) => (
                    <TableRow key={empleado.id}>
                      <TableCell className="font-medium">
                        {empleado.nombre} {empleado.apellido}
                      </TableCell>
                      <TableCell>{empleado.email}</TableCell>
                      <TableCell>{empleado.puesto}</TableCell>
                      <TableCell>{empleado.departamento}</TableCell>
                      <TableCell>{formatCurrency(empleado.salario_base)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          empleado.estado === 'Activo' ? 'bg-green-100 text-green-700' :
                          empleado.estado === 'Inactivo' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {empleado.estado}
                        </span>
                      </TableCell>
                      <TableCell>{empleado.fecha_contratacion}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Editar Empleado</DialogTitle>
                              </DialogHeader>
                              <EmployeeForm initialData={empleado} />
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Historial de Pagos
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px]">
                              <DialogHeader>
                                <DialogTitle>Historial de Pagos - {empleado.nombre} {empleado.apellido}</DialogTitle>
                              </DialogHeader>
                              <EmployeePaymentHistory 
                                empleado={empleado} 
                                pagos={nomina?.filter(n => n.empleado_id === empleado.id) || []}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No hay empleados registrados.
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