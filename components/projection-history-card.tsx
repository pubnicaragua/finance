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
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ProjectionHistoryCardProps {
  clienteId: string
  proyeccionPagos: Array<{ fecha: string; monto: number; pagado?: boolean }>
}

export function ProjectionHistoryCard({ clienteId, proyeccionPagos }: ProjectionHistoryCardProps) {
  const [isAddProjectionDialogOpen, setIsAddProjectionDialogOpen] = useState(false)
  const [isEditProjectionDialogOpen, setIsEditProjectionDialogOpen] = useState<{
    open: boolean
    data: { fecha: string; monto: number; pagado?: boolean; index: number } | null
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
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proyeccionPagos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay proyecciones de pagos.
                  </TableCell>
                </TableRow>
              ) : (
                proyeccionPagos.map((pago, index) => (
                  <TableRow key={index}>
                    <TableCell>{pago.fecha}</TableCell>
                    <TableCell className="text-green-amount">USD {pago.monto?.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          pago.pagado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700",
                        )}
                      >
                        {pago.pagado ? "Pagado" : "Pendiente"}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog
                        open={isEditProjectionDialogOpen.open && isEditProjectionDialogOpen.data?.index === index}
                        onOpenChange={(open) =>
                          setIsEditProjectionDialogOpen({ open, data: open ? { ...pago, index } : null })
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
                            initialData={{ ...pago, index }}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
