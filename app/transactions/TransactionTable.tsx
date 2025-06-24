"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import TransactionForm from "@/components/transaction-form" // Importación por defecto
import { deleteTransaction } from "@/actions/transaction-actions"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import type { Tables } from "@/lib/database.types"

interface TransactionTableProps {
  transactions: Tables<"transacciones">[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  // Exportado como named export
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Tables<"transacciones"> | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
      const result = await deleteTransaction(id)
      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleEditClick = (transaction: Tables<"transacciones">) => {
    setSelectedTransaction(transaction)
    setOpenDialog(true)
  }

  const handleFormSuccess = () => {
    setOpenDialog(false)
    setSelectedTransaction(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo Ingreso/Egreso</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Comisión</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-muted-foreground">
                No hay transacciones registradas.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.tipo}</TableCell>
                <TableCell>${transaction.monto?.toFixed(2)}</TableCell>
                <TableCell>{new Date(transaction.fecha).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.cuenta_id}</TableCell>
                <TableCell>{transaction.detalle || "N/A"}</TableCell>
                <TableCell>{(transaction as any).clientes?.cliente || "N/A"}</TableCell>
                <TableCell>{transaction.tipo_ingreso || transaction.tipo_egreso || "N/A"}</TableCell>
                <TableCell>{transaction.vendedor_comision || "N/A"}</TableCell>
                <TableCell>${transaction.comision_aplicada?.toFixed(2) || "0.00"}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditClick(transaction)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTransaction ? "Editar Transacción" : "Añadir Transacción"}</DialogTitle>
          </DialogHeader>
          <TransactionForm initialData={selectedTransaction || undefined} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
