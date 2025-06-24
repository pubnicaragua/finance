"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { Plus, Edit, Trash2 } from "lucide-react"
import { ProjectionForm } from "@/components/projection-form"
import { deleteProjection } from "@/actions/payment-projection-actions"
import { useState } from "react"

interface ProjectionHistoryCardProps {
  clienteId: string
  projections: Array<{ fecha: string; monto: number; pagado: boolean }> // Cambiado a 'projections'
}

export function ProjectionHistoryCard({ clienteId, projections }: ProjectionHistoryCardProps) {
  const [isAddProjectionDialogOpen, setIsAddProjectionDialogOpen] = useState(false)
  const [isEditProjectionDialogOpen, setIsEditProjectionDialogOpen] = useState<{
    open: boolean
    data: { fecha: string; monto: number; pagado: boolean; index: number } | null
  }>({ open: false, data: null })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Proyecciones de Pagos</CardTitle>
        <Dialog open={isAddProjectionDialogOpen} onOpenChange={setIsAddProjectionDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Proyección
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Nueva Proyección</DialogTitle>
            </DialogHeader>
            <ProjectionForm clienteId={clienteId} onSuccess={() => setIsAddProjectionDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projections.length === 0 ? ( // Usando 'projections'
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay proyecciones de pagos.
                  </TableCell>
                </TableRow>
              ) : (
                projections.map(
                  (
                    proyeccion,
                    index, // Usando 'projections'
                  ) => (
                    <TableRow key={index}>
                      <TableCell>{proyeccion.fecha}</TableCell>
                      <TableCell className={proyeccion.pagado ? "text-green-amount" : "text-red-amount"}>
                        USD {proyeccion.monto?.toFixed(2)}
                      </TableCell>
                      <TableCell>{proyeccion.pagado ? "Sí" : "No"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog
                          open={isEditProjectionDialogOpen.open && isEditProjectionDialogOpen.data?.index === index}
                          onOpenChange={(open) =>
                            setIsEditProjectionDialogOpen({ open, data: open ? { ...proyeccion, index } : null })
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar Proyección</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Editar Proyección</DialogTitle>
                            </DialogHeader>
                            <ProjectionForm
                              clienteId={clienteId}
                              initialData={{ ...proyeccion, index }}
                              onSuccess={() => setIsEditProjectionDialogOpen({ open: false, data: null })}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar Proyección</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente esta proyección.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await deleteProjection(clienteId, index)
                                }}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ),
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
