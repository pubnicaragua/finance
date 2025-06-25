"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { deleteTransaction } from "@/actions/transaction-actions"
import { useToast } from "@/hooks/use-toast"
import type { Tables } from "@/lib/database.types"
import { useEffect, useState } from "react"
import { getTransactions } from "@/actions/transaction-actions" // Importar la función de obtención de datos

interface TransactionTableProps {
  onEdit: (transaction: Tables<"transacciones">) => void
}

export function TransactionTable({ onEdit }: TransactionTableProps) {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Tables<"transacciones">[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTransactions()
      setTransactions(data || []) // Asegurar que siempre sea un array
    } catch (err: any) {
      console.error("Error fetching transactions:", err)
      setError("Error al cargar transacciones: " + err.message)
      setTransactions([]) // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
      const { success, message } = await deleteTransaction(id)
      toast({
        title: success ? "Éxito" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      })
      if (success) {
        fetchTransactions() // Revalidar datos después de eliminar
      }
    }
  }

  const columns: ColumnDef<Tables<"transacciones">>[] = [
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("fecha"))
        return date.toLocaleDateString()
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
    },
    {
      accessorKey: "monto",
      header: () => <div className="text-right">Monto</div>,
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("monto"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(transaction)}>Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(transaction.id)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (loading) {
    return <div>Cargando transacciones...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return <DataTable columns={columns} data={transactions} />
}
