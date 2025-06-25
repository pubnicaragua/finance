"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon } from "lucide-react"
import { TransactionTable } from "./TransactionTable"
import { TransactionForm } from "@/components/transaction-form"
import type { Tables } from "@/lib/database.types"

export default function TransactionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Tables<"transacciones"> | null>(null)

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
    // TransactionTable ya tiene su propio useEffect para revalidar
  }

  const handleEdit = (transaction: Tables<"transacciones">) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Transacciones</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1" onClick={() => setEditingTransaction(null)}>
                <PlusIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Transacción</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingTransaction ? "Editar Transacción" : "Añadir Transacción"}</DialogTitle>
              </DialogHeader>
              <TransactionForm
                initialData={editingTransaction}
                onSuccess={handleSuccess}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <TransactionTable onEdit={handleEdit} />
      </main>
    </SidebarInset>
  )
}
