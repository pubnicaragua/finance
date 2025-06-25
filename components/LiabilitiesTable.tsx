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
import { deletePasivoCorriente } from "@/actions/asset-liability-actions"
import { useToast } from "@/hooks/use-toast"
import type { Tables } from "@/lib/database.types"

interface LiabilitiesTableProps {
  onEdit: (liability: Tables<"pasivos_corrientes">) => void
  liabilities: Tables<"pasivos_corrientes">[] // Recibir liabilities como prop
}

export function LiabilitiesTable({ onEdit, liabilities }: LiabilitiesTableProps) {
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este pasivo corriente?")) {
      const { success, message } = await deletePasivoCorriente(id)
      toast({
        title: success ? "Éxito" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      })
    }
  }

  const columns: ColumnDef<Tables<"pasivos_corrientes">>[] = [
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
      accessorKey: "fecha_vencimiento",
      header: "Fecha Vencimiento",
      cell: ({ row }) => {
        const date = new Date(row.getValue("fecha_vencimiento"))
        return date.toLocaleDateString()
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
    },
    {
      accessorKey: "created_at",
      header: "Fecha Creación",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const liability = row.original
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
              <DropdownMenuItem onClick={() => onEdit(liability)}>Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(liability.id)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={liabilities} />
}
