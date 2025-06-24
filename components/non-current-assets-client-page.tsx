"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
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
import { ActivoNoCorrienteForm } from "@/components/activo-no-corriente-form"
import { deleteActivoNoCorriente } from "@/actions/asset-liability-actions"
import type { Database } from "@/lib/database.types"

type ActivoNoCorriente = Database["public"]["Tables"]["activos_no_corrientes"]["Row"]

interface NonCurrentAssetsClientPageProps {
  activos: ActivoNoCorriente[]
  valorOriginalTotal: number
  depreciacionAcumulada: number
  valorNetoTotal: number
}

export function NonCurrentAssetsClientPage({
  activos,
  valorOriginalTotal,
  depreciacionAcumulada,
  valorNetoTotal,
}: NonCurrentAssetsClientPageProps) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Activos No Corrientes</h2>
      <p className="text-muted-foreground">Bienes de uso y activos intangibles de la empresa</p>

      <div className="flex items-center justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Activo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Activo No Corriente</DialogTitle>
            </DialogHeader>
            <ActivoNoCorrienteForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Activos No Corrientes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Haz clic en cualquier celda para editarla. Los datos se guardan automáticamente.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Valor Original</TableHead>
                  <TableHead>Depreciación Acumulada</TableHead>
                  <TableHead>Valor Neto</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activos?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No hay activos no corrientes registrados aún.
                    </TableCell>
                  </TableRow>
                ) : (
                  activos?.map((activo) => (
                    <TableRow key={activo.id}>
                      <TableCell>{activo.descripcion}</TableCell>
                      <TableCell className="text-green-amount">${activo.valor?.toFixed(2)}</TableCell>
                      <TableCell className="text-red-600">${activo.depreciacion?.toFixed(2)}</TableCell>
                      <TableCell className="text-green-amount">${activo.valor_neto?.toFixed(2)}</TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar Activo</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Editar Activo No Corriente</DialogTitle>
                            </DialogHeader>
                            <ActivoNoCorrienteForm initialData={activo} />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar Activo</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente este activo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={async () => await deleteActivoNoCorriente(activo.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Activos No Corrientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-lg font-semibold">
            <span>Valor Original Total</span>
            <span className="text-green-amount">USD {valorOriginalTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Depreciación Acumulada</span>
            <span className="text-red-600">USD {depreciacionAcumulada.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Valor Neto Total</span>
            <span className="text-green-amount">USD {valorNetoTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
