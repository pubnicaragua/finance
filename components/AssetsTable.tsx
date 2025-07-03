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
      accessorKey: "descripcion",
      header: "Descripción",
    },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("valor"))
        const formatted = new Intl.NumberFormat("es-NI", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    ...(type === "no_corriente" ? [
      {
        accessorKey: "depreciacion",
        header: "Depreciación",
        cell: ({ row }: any) => {
          const amount = Number.parseFloat(row.getValue("depreciacion") || 0)
          const formatted = new Intl.NumberFormat("es-NI", {
            style: "currency",
            currency: "USD",
          }).format(amount)
          return <div className="font-medium text-red-600">{formatted}</div>
        },
      },
      {
        accessorKey: "valor_neto",
        header: "Valor Neto",
        cell: ({ row }: any) => {
          const valor = Number.parseFloat(row.getValue("valor") || 0)
          const depreciacion = Number.parseFloat(row.getValue("depreciacion") || 0)
          const valorNeto = valor - depreciacion
          const formatted = new Intl.NumberFormat("es-NI", {
            style: "currency",
            currency: "USD",
          }).format(valorNeto)
          return <div className="font-medium text-green-600">{formatted}</div>
        },
      },
    ] : []),
    {
      accessorKey: "fecha_adquisicion",
      header: "Fecha",
      cell: ({ row }) => {
        const date = row.getValue("fecha_adquisicion")
        if (!date) return "N/A"
        return new Date(date as string).toLocaleDateString()
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