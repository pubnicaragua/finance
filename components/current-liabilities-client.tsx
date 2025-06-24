"use client"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PasivoCorrienteForm } from "@/components/pasivo-corriente-form"
import { deletePasivoCorriente } from "@/actions/asset-liability-actions"

type Pasivo = {
  id: string
  descripcion: string
  debe: number | null
  saldo: number | null
}

export default function CurrentLiabilitiesClient({
  pasivos,
}: {
  pasivos: Pasivo[]
}) {
  const totalDebe = pasivos.reduce((s, p) => s + (p.debe ?? 0), 0) ?? 0
  const totalSaldo = pasivos.reduce((s, p) => s + (p.saldo ?? 0), 0) ?? 0

  return (
    <SidebarInset className="flex-1">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Pasivos Corrientes</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Pasivos Corrientes</h2>
        <p className="text-muted-foreground">Obligaciones y deudas a corto plazo de la empresa</p>

        {/* Botón agregar */}
        <div className="flex items-center justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Pasivo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Pasivo Corriente</DialogTitle>
              </DialogHeader>
              <PasivoCorrienteForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pasivos Corrientes</CardTitle>
            <p className="text-sm text-muted-foreground">Gestiona tus obligaciones y deudas a corto plazo.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Debe</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pasivos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No hay pasivos corrientes registrados aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pasivos.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.descripcion}</TableCell>
                        <TableCell className="text-red-600">USD {p.debe?.toFixed(2)}</TableCell>
                        <TableCell className="text-red-600">USD {p.saldo?.toFixed(2)}</TableCell>
                        <TableCell className="flex gap-2">
                          {/* Editar */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar Pasivo</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Editar Pasivo Corriente</DialogTitle>
                              </DialogHeader>
                              <PasivoCorrienteForm initialData={p} />
                            </DialogContent>
                          </Dialog>

                          {/* Eliminar */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar Pasivo</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer y eliminará el pasivo de forma permanente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={async () => await deletePasivoCorriente(p.id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {/* Totales */}
                  <TableRow className="font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-red-600">USD {totalDebe.toFixed(2)}</TableCell>
                    <TableCell className="text-red-600">USD {totalSaldo.toFixed(2)}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Pasivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Debe</span>
              <span className="text-red-600">USD {totalDebe.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Saldo Pendiente</span>
              <span className="text-red-600">USD {totalSaldo.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
