"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProjectionForm } from "./projection-form"
import { TrashIcon, PencilIcon } from "lucide-react"
import { deleteProjection } from "@/actions/payment-projection-actions"
import { useToast } from "@/hooks/use-toast"
import type { Tables } from "@/lib/database.types"
import { Checkbox } from "@/components/ui/checkbox"

interface ProjectionHistoryCardProps {
  proyeccionPagos: Tables<"clientes">["proyeccion_pagos"]
  clienteId: string
  onProjectionUpdated: (message: string) => void
}

export function ProjectionHistoryCard({ proyeccionPagos, clienteId, onProjectionUpdated }: ProjectionHistoryCardProps) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectionToDelete, setProjectionToDelete] = useState<{ index: number; monto: number } | null>(null)

  const handleDeleteClick = (index: number, monto: number) => {
    setProjectionToDelete({ index, monto })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (projectionToDelete !== null) {
      const { success, message } = await deleteProjection(clienteId, projectionToDelete.index)
      if (success) {
        onProjectionUpdated(message)
        toast({
          title: "Éxito",
          description: message,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      }
      setIsDeleteDialogOpen(false)
      setProjectionToDelete(null)
    }
  }

  const totalProyectado = proyeccionPagos?.reduce((sum, proj) => sum + (proj?.monto || 0), 0) || 0
  const totalPagado =
    proyeccionPagos?.filter((proj) => proj?.pagado).reduce((sum, proj) => sum + (proj?.monto || 0), 0) || 0
  const totalPendiente = totalProyectado - totalPagado

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Total Proyectado: <span className="text-blue-600">${totalProyectado.toFixed(2)}</span> | Total Pagado:{" "}
          <span className="text-green-600">${totalPagado.toFixed(2)}</span> | Total Pendiente:{" "}
          <span className="text-red-600">${totalPendiente.toFixed(2)}</span>
        </h3>
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Pagado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proyeccionPagos && proyeccionPagos.length > 0 ? (
              proyeccionPagos.map((projection, index) => (
                <TableRow key={index}>
                  <TableCell>{projection?.fecha}</TableCell>
                  <TableCell>${projection?.monto?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Checkbox checked={projection?.pagado} disabled />
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2">
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Editar Proyección</DialogTitle>
                        </DialogHeader>
                        <ProjectionForm
                          clienteId={clienteId}
                          initialData={{ ...projection, index }}
                          onSuccess={onProjectionUpdated}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(index, projection?.monto || 0)}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay proyecciones registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que quieres eliminar esta proyección de ${projectionToDelete?.monto?.toFixed(2)}?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
