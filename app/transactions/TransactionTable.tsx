"use client"

import { useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { TransactionForm } from "@/components/transaction-form" // Corrected import
import { DeleteTransactionButton } from "@/components/delete-transaction-button" // Assuming this component exists
import { formatCurrency } from "@/lib/utils" // Assuming this utility exists
import type { Database } from "@/lib/database.types"

type Transaction = Database["public"]["Tables"]["transacciones"]["Row"]

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setCurrentTransaction(null)
    setIsFormOpen(true)
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>Añadir Transacción</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentTransaction ? "Editar Transacción" : "Añadir Nueva Transacción"}</DialogTitle>
            </DialogHeader>
            <TransactionForm initialData={currentTransaction || undefined} onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Comisión</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.tipo}</TableCell>
              <TableCell>{transaction.concepto}</TableCell>
              <TableCell className={transaction.tipo === "ingreso" ? "text-green-600" : "text-red-600"}>
                {formatCurrency(transaction.monto || 0)}
              </TableCell>
              <TableCell>{new Date(transaction.fecha).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.cuenta_id}</TableCell> {/* This should ideally show account name */}
              <TableCell>{transaction.cliente_id}</TableCell> {/* This should ideally show client name */}
              <TableCell>
                {transaction.tipo === "ingreso" ? transaction.tipo_ingreso : transaction.tipo_egreso}
              </TableCell>
              <TableCell>{transaction.vendedor_comision}</TableCell>
              <TableCell>{formatCurrency(transaction.comision_aplicada || 0)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(transaction)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem>
                      <DeleteTransactionButton transactionId={transaction.id} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
