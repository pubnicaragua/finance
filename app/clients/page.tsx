import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClientForm } from "@/components/client-form"
import { DeleteClientButton } from "@/components/delete-client-button" // New component for delete action

export default async function ClientsPage() {
  const supabase = createClient()
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select(
      "id, cliente, proyecto, tipo_software, estado, pais, costo_proyecto, abonado, deuda, fecha_vencimiento, historial_pagos, proyeccion_pagos",
    )
    .order("created_at", { ascending: false }) // Order by creation date

  if (error) {
    console.error("Error fetching clients:", error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar los clientes: {error.message}
      </div>
    )
  }

  const totalPendiente = clientes?.reduce((sum, c) => sum + (c.deuda || 0), 0) || 0
  const clientesActivos = clientes?.length || 0

  const today = new Date()
  const saldosVencidos =
    clientes
      ?.filter((c) => c.fecha_vencimiento && new Date(c.fecha_vencimiento) < today && (c.deuda || 0) > 0)
      .reduce((sum, c) => sum + (c.deuda || 0), 0) || 0
  const clientesVencidosCount =
    clientes?.filter((c) => c.fecha_vencimiento && new Date(c.fecha_vencimiento) < today && (c.deuda || 0) > 0)
      .length || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Clientes</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <p className="text-muted-foreground">Gestión completa de proyectos, pagos y proyecciones</p>

        <div className="flex items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <ClientForm />
            </DialogContent>
          </Dialog>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <CardTitle className="text-sm font-medium">Total Pendiente</CardTitle>
              <div className="text-2xl font-bold text-red-600">USD {totalPendiente.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Por cobrar total</p>
            </Card>
            <Card className="p-4">
              <CardTitle className="text-sm font-medium">Saldos Vencidos</CardTitle>
              <div className="text-2xl font-bold text-red-600">USD {saldosVencidos.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{clientesVencidosCount} clientes</p>
            </Card>
            <Card className="p-4">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <div className="text-2xl font-bold text-green-amount">{clientesActivos}</div>
              <p className="text-xs text-muted-foreground">Total registrados</p>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista Completa de Clientes</CardTitle>
            <p className="text-sm text-muted-foreground">Haz clic en el nombre del cliente para ver el detalle.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Tipo Software</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Costo Total</TableHead>
                    <TableHead>Pagos Realizados</TableHead>
                    <TableHead>Saldo Pendiente</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">
                        No hay clientes registrados aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientes?.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <Link href={`/clients/${cliente.id}`} className="font-medium hover:underline">
                            {cliente.cliente}
                          </Link>
                        </TableCell>
                        <TableCell>{cliente.proyecto}</TableCell>
                        <TableCell>{cliente.tipo_software || "N/A"}</TableCell>
                        <TableCell>{cliente.estado || "N/A"}</TableCell>
                        <TableCell>{cliente.pais || "N/A"}</TableCell>
                        <TableCell className="text-green-amount">
                          USD {cliente.costo_proyecto?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell className="text-green-amount">
                          {cliente.historial_pagos ? (cliente.historial_pagos as any[]).length : 0} pagos
                        </TableCell>
                        <TableCell
                          className={cn(cliente.deuda && cliente.deuda > 0 ? "text-red-600" : "text-green-amount")}
                        >
                          USD {cliente.deuda?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell
                          className={cn(
                            cliente.fecha_vencimiento &&
                              new Date(cliente.fecha_vencimiento) < today &&
                              (cliente.deuda || 0) > 0
                              ? "text-red-600"
                              : "",
                          )}
                        >
                          {cliente.fecha_vencimiento || "N/A"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Link href={`/clients/${cliente.id}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </Link>
                          <DeleteClientButton clientId={cliente.id} />
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
