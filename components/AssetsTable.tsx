"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DataTable } from "@/components/ui/data-table" // Asegúrate de que este componente exista
import { deleteNonCurrentAsset } from "@/actions/asset-liability-actions" // Importar la Server Action
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivoNoCorrienteForm } from "@/components/activo-no-corriente-form"
import type { Tables } from "@/lib/database.types"

interface AssetsTableProps {
  assets: Tables<"activos_no_corrientes">[]
  onAssetOperation: () => void // Callback para revalidar datos
}

export function AssetsTable({ assets, onAssetOperation }: AssetsTableProps) {
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Tables<"activos_no_corrientes"> | null>(null)

  const handleDelete = async (id: string) => {
    const result = await deleteNonCurrentAsset(id)
    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      })
      onAssetOperation() // Revalidar datos
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (asset: Tables<"activos_no_corrientes">) => {
    setEditingAsset(asset)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingAsset(null)
    onAssetOperation() // Revalidar datos
  }

  const columns: ColumnDef<Tables<"activos_no_corrientes">>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("monto"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "fecha_adquisicion",
      header: "Fecha Adquisición",
    },
    {
      accessorKey: "vida_util_anios",
      header: "Vida Útil (Años)",
    },
    {
      accessorKey: "valor_residual",
      header: "Valor Residual",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("valor_residual"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "depreciacion_acumulada",
      header: "Depreciación Acumulada",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("depreciacion_acumulada"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
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
              <DropdownMenuItem onClick={() => handleEdit(asset)}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(asset.id)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={assets} />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Activo No Corriente</DialogTitle>
          </DialogHeader>
          <ActivoNoCorrienteForm
            initialData={editingAsset}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
