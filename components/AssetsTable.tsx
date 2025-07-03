"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { deleteNonCurrentAsset, deleteCurrentAsset } from "@/actions/asset-liability-actions"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivoNoCorrienteForm } from "@/components/activo-no-corriente-form"
import { ActivoCorrienteForm } from "@/components/activo-corriente-form"
import type { Tables } from "@/lib/database.types"

interface AssetsTableProps {
  assets: Tables<"activos_no_corrientes">[] | Tables<"activos_corrientes">[]
  onAssetOperation: () => void
  type: "corriente" | "no_corriente"
}

export function AssetsTable({ assets, onAssetOperation, type }: AssetsTableProps) {
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<any>(null)

  const handleDelete = async (id: string) => {
    const deleteFunction = type === "corriente" ? deleteCurrentAsset : deleteNonCurrentAsset
    const result = await deleteFunction(id)
    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      })
      onAssetOperation()
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (asset: any) => {
    setEditingAsset(asset)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingAsset(null)
    onAssetOperation()
  }

  const columns: ColumnDef<any>[] = [
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
    ...(type === "no_corriente" ? [
      {
        accessorKey: "vida_util_anios",
        header: "Vida Útil (Años)",
      },
      {
        accessorKey: "valor_residual",
        header: "Valor Residual",
        cell: ({ row }: any) => {
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
        cell: ({ row }: any) => {
          const amount = Number.parseFloat(row.getValue("depreciacion_acumulada"))
          const formatted = new Intl.NumberFormat("es-NI", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return <div className="font-medium">{formatted}</div>
        },
      },
    ] : []),
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
            <DialogTitle>
              {type === "corriente" ? "Editar Activo Corriente" : "Editar Activo No Corriente"}
            </DialogTitle>
          </DialogHeader>
          {type === "corriente" ? (
            <ActivoCorrienteForm
              initialData={editingAsset}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          ) : (
            <ActivoNoCorrienteForm
              initialData={editingAsset}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}