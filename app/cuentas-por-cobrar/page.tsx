import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon, DollarSign, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { CuentasPorCobrarForm } from "@/components/cuentas-por-cobrar-form"

export const revalidate = 0

export default async function CuentasPorCobrarPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from("clientes")
    .select("id, cliente, proyecto, proyeccion_pagos")
    .not("proyeccion_pagos", "is", null) // Solo clientes con proyecciones

  if (error) {
    console.error("Error fetching accounts receivable:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Cuentas Por Cobrar</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Cuentas Por Cobrar</h2>
          <p className="text-red-500">Error al cargar las cuentas por cobrar: {error.message}</p>
        </main>
      </SidebarInset>
    )
  }

  const allProjections = (clients || []).flatMap((client) =>
    ((client.proyeccion_pagos || []) as Array<any>).map((proj) => ({
      cliente_id: client.id,
      cliente: client.cliente,
      proyecto: client.proyecto,
      ...proj,
    })),
  )

  const totalProjectedRevenue = allProjections.reduce((sum, p) => sum + p.monto, 0)
  const totalPaid = allProjections.filter((p) => p.estado === "Pagado").reduce((sum, p) => sum + p.monto, 0)
  const totalPending = allProjections.filter((p) => p.estado !== "Pagado").reduce((sum, p) => sum + p.monto, 0)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Cuentas Por Cobrar</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Cuenta por Cobrar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Cuenta por Cobrar</DialogTitle>
              </DialogHeader>
              <CuentasPorCobrarForm clients={clients || []} />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Cuentas Por Cobrar</h2>
        <p className="text-muted-foreground">Aquí puedes ver todas las proyecciones de pagos de tus clientes.</p>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proyectado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">{formatCurrency(totalProjectedRevenue)}</div>
              <p className="text-xs text-muted-foreground">Suma de todos los montos proyectados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-amount">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">Monto total de proyecciones pagadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendiente</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-amount">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">Monto total de proyecciones pendientes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalle de Cuentas Por Cobrar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProjections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No hay cuentas por cobrar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allProjections.map((proj, index) => (
                      <TableRow key={`${proj.cliente_id}-${index}`}>
                        <TableCell>{proj.cliente}</TableCell>
                        <TableCell>{proj.proyecto}</TableCell>
                        <TableCell>{proj.fecha}</TableCell>
                        <TableCell className={proj.estado === "Pagado" ? "text-green-amount" : "text-red-amount"}>
                          {formatCurrency(proj.monto)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              proj.estado === "Pagado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {proj.estado || "Pendiente"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Editar</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Cuenta por Cobrar</DialogTitle>
                                </DialogHeader>
                                <CuentasPorCobrarForm 
                                  clients={clients || []} 
                                  initialData={{
                                    cliente_id: proj.cliente_id,
                                    index: index,
                                    fecha: proj.fecha,
                                    monto: proj.monto,
                                    estado: proj.estado || "Pendiente",
                                    descripcion: proj.descripcion
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                            
                            <form action={async () => {
                              "use server"
                              const supabase = await createClient()
                              
                              // Obtener proyecciones actuales
                              const { data: client } = await supabase
                                .from("clientes")
                                .select("proyeccion_pagos")
                                .eq("id", proj.cliente_id)
                                .single()
                              
                              if (client && client.proyeccion_pagos) {
                                // Eliminar la proyección en el índice especificado
                                const updatedProjections = [...client.proyeccion_pagos]
                                updatedProjections.splice(index, 1)
                                
                                // Actualizar el cliente
                                await supabase
                                  .from("clientes")
                                  .update({ proyeccion_pagos: updatedProjections })
                                  .eq("id", proj.cliente_id)
                              }
                              
                              // Revalidar rutas
                              revalidatePath("/cuentas-por-cobrar")
                              revalidatePath(`/clients/${proj.cliente_id}`)
                            }}>
                              <Button variant="destructive" size="sm" type="submit">
                                Eliminar
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}