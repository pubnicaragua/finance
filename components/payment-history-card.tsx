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
import { PaymentForm } from "@/components/payment-form"
import { deletePayment } from "@/actions/payment-projection-actions"
import { useState } from "react"

interface PaymentHistoryCardProps {
  clienteId: string
  payments: Array<{ fecha: string; monto: number; descripcion?: string }> // Cambiado a 'payments'
}

export function PaymentHistoryCard({ clienteId, payments }: PaymentHistoryCardProps) {
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false)
  const [isEditPaymentDialogOpen, setIsEditPaymentDialogOpen] = useState<{
    open: boolean
    data: { fecha: string; monto: number; descripcion?: string; index: number } | null
  }>({ open: false, data: null })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historial de Pagos</CardTitle>
        <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Pago</DialogTitle>
            </DialogHeader>
            <PaymentForm clienteId={clienteId} onSuccess={() => setIsAddPaymentDialogOpen(false)} />
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
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? ( // Usando 'payments'
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay historial de pagos.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map(
                  (
                    pago,
                    index, // Usando 'payments'
                  ) => (
                    <TableRow key={index}>
                      <TableCell>{pago.fecha}</TableCell>
                      <TableCell className="text-green-amount">USD {pago.monto?.toFixed(2)}</TableCell>
                      <TableCell>{pago.descripcion || "N/A"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog
                          open={isEditPaymentDialogOpen.open && isEditPaymentDialogOpen.data?.index === index}
                          onOpenChange={(open) =>
                            setIsEditPaymentDialogOpen({ open, data: open ? { ...pago, index } : null })
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar Pago</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Editar Pago</DialogTitle>
                            </DialogHeader>
                            <PaymentForm
                              clienteId={clienteId}
                              initialData={{ ...pago, index }}
                              onSuccess={() => setIsEditPaymentDialogOpen({ open: false, data: null })}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar Pago</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente este pago.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await deletePayment(clienteId, index)
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
