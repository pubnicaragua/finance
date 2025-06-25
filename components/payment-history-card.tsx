"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PaymentForm } from "./payment-form"
import { TrashIcon, PencilIcon } from "lucide-react"
import { deletePayment } from "@/actions/payment-projection-actions"
import { useToast } from "@/hooks/use-toast"
import type { Tables } from "@/lib/database.types"

interface PaymentHistoryCardProps {
  historialPagos: Tables<"clientes">["historial_pagos"]
  clienteId: string
  onPaymentUpdated: (message: string) => void
}

export function PaymentHistoryCard({ historialPagos, clienteId, onPaymentUpdated }: PaymentHistoryCardProps) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<{ index: number; monto: number } | null>(null)

  const handleDeleteClick = (index: number, monto: number) => {
    setPaymentToDelete({ index, monto })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (paymentToDelete !== null) {
      const { success, message } = await deletePayment(clienteId, paymentToDelete.index)
      if (success) {
        onPaymentUpdated(message)
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
      setPaymentToDelete(null)
    }
  }

  const totalAbonado = historialPagos?.reduce((sum, payment) => sum + (payment?.monto || 0), 0) || 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Total Abonado: <span className="text-green-600">${totalAbonado.toFixed(2)}</span>
        </h3>
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historialPagos && historialPagos.length > 0 ? (
              historialPagos.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment?.fecha}</TableCell>
                  <TableCell>${payment?.monto?.toFixed(2)}</TableCell>
                  <TableCell>{payment?.descripcion}</TableCell>
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
                          <DialogTitle>Editar Pago</DialogTitle>
                        </DialogHeader>
                        <PaymentForm
                          clienteId={clienteId}
                          initialData={{ ...payment, index }}
                          onSuccess={onPaymentUpdated}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(index, payment?.monto || 0)}>
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay pagos registrados.
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
          <p>¿Estás seguro de que quieres eliminar este pago de ${paymentToDelete?.monto?.toFixed(2)}?</p>
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
