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
import { deleteActivoNoCorriente } from "@/actions/asset-liability-actions"
import { useToast } from "@/hooks/use-toast"
import type { Tables } from "@/lib/database.types"

interface AssetsTableProps {
  onEdit: (asset: Tables<"activos_no_corrientes">) => void
  assets: Tables<"activos_no_corrientes">[] // Recibir assets como prop
}

export function AssetsTable({ onEdit, assets }: AssetsTableProps) {
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este activo no corriente?")) {
      const { success, message } = await deleteActivoNoCorriente(id)
      toast({
        title: success ? "Éxito" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      })
    }
  }

  const columns: ColumnDef<Tables<"activos_no_corrientes">>[] = [
    {
      accessorKey: "descripcion",
      header: "Descripción",
    },
    {
      accessorKey: "valor",
      header: () => <div className="text-right">Valor</div>,
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("valor"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "depreciacion",
      header: () => <div className="text-right">Depreciación</div>,
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("depreciacion"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "valor_neto",
      header: () => <div className="text-right">Valor Neto</div>,
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("valor_neto"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "NIO",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
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
        const asset = row.original
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
              <DropdownMenuItem onClick={() => onEdit(asset)}>Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(asset.id)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={assets} />
}
