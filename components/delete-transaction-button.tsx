"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteTransaction } from "@/actions/transaction-actions"
import { startTransition } from "react"

interface Props {
  id: string
  onDeleted?: () => void
}

/**
 * Named export (required) — simple inline icon button that deletes a transaction.
 */
export function DeleteTransactionButton({ id, onDeleted }: Props) {
  const handleDelete = () =>
    startTransition(async () => {
      await deleteTransaction(id)
      onDeleted?.()
    })

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} aria-label="Eliminar transacción">
      <Trash2 className="h-4 w-4 text-red-600" />
    </Button>
  )
}

export default DeleteTransactionButton
