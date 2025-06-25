"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DataTable } from "@/components/ui/data-table" // Asegúrate de que este componente exista
import { deleteCurrentLiability } from "@/actions/asset-liability-actions" // Importar la Server Action
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PasivoCorrienteForm } from "@/components/pasivo-corriente-form"
import type { Tables } from "@/lib/database.types"

interface LiabilitiesTableProps {
  liabilities: Tables<"pasivos_corrientes">[]
  onLiabilityOperation: () => void // Callback para revalidar datos
}

export function LiabilitiesTable({ liabilities, onLiabilityOperation }: LiabilitiesTableProps) {
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLiability, setEditingLiability] = useState<Tables<"pasivos_corrientes"> | null>(null)

  const handleDelete = async (id: string) => {
    const result = await deleteCurrentLiability(id)
    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      })
      onLiabilityOperation() // Revalidar datos
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (liability: Tables<"pasivos_corrientes">) => {
    setEditingLiability(liability)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingLiability(null)
    onLiabilityOperation() // Revalidar datos
  }

  const columns: ColumnDef<Tables<"pasivos_corrientes">>[] = [
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
      accessorKey: "fecha_vencimiento",
      header: "Fecha Vencimiento",
    },
    {
      accessorKey: "estado",
      header: "Estado",
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
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
              <DropdownMenuItem onClick={() => handleEdit(liability)}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(liability.id)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={liabilities} />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Pasivo Corriente</DialogTitle>
          </DialogHeader>
          <PasivoCorrienteForm
            initialData={editingLiability}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
