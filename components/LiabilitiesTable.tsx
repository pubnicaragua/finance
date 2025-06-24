"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PasivoCorrienteForm from "./pasivo-corriente-form" // Importación por defecto
import { deletePasivoCorriente } from "@/actions/asset-liability-actions"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import type { Tables } from "@/lib/database.types"

interface LiabilitiesTableProps {
  liabilities: Tables<"pasivos_corrientes">[] | Tables<"pasivos_no_corrientes">[]
  type?: "corriente" | "no-corriente"
}

export function LiabilitiesTable({ liabilities, type = "corriente" }: LiabilitiesTableProps) {
  // Exportado como named export
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedLiability, setSelectedLiability] = useState<
    Tables<"pasivos_corrientes"> | Tables<"pasivos_no_corrientes"> | null
  >(null)

  const handleDelete = async (id: string, liabilityType: "corriente" | "no-corriente") => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este pasivo ${liabilityType}?`)) {
      let result
      if (liabilityType === "corriente") {
        result = await deletePasivoCorriente(id)
      } else {
        // Si tienes una acción de borrado para pasivos_no_corrientes, úsala aquí.
        // Por ahora, se asume que solo se borrarán pasivos corrientes o que la acción para no corrientes se manejará por separado.
        toast({
          title: "Error",
          description: "Acción de eliminación para pasivos no corrientes no implementada en esta tabla.",
          variant: "destructive",
        })
        return
      }

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleEditClick = (liability: Tables<"pasivos_corrientes"> | Tables<"pasivos_no_corrientes">) => {
    setSelectedLiability(liability)
    setOpenDialog(true)
  }

  const handleFormSuccess = () => {
    setOpenDialog(false)
    setSelectedLiability(null)
  }

  const FormComponent = PasivoCorrienteForm // Asumimos que PasivoCorrienteForm se usará para ambos tipos por ahora, o crear PasivoNoCorrienteForm

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Saldo</TableHead>
            {type === "no-corriente" && <TableHead>Fecha Vencimiento</TableHead>}
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {liabilities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={type === "corriente" ? 4 : 5} className="text-center text-muted-foreground">
                No hay pasivos registrados.
              </TableCell>
            </TableRow>
          ) : (
            liabilities.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell>{liability.descripcion}</TableCell>
                <TableCell>${liability.saldo?.toFixed(2)}</TableCell>
                {type === "no-corriente" && (
                  <TableCell>
                    {(liability as Tables<"pasivos_no_corrientes">).fecha_vencimiento
                      ? new Date((liability as Tables<"pasivos_no_corrientes">).fecha_vencimiento).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                )}
                <TableCell>{new Date(liability.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(liability)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(liability.id, type)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedLiability
                ? `Editar Pasivo ${type === "corriente" ? "Corriente" : "No Corriente"}`
                : `Añadir Pasivo ${type === "corriente" ? "Corriente" : "No Corriente"}`}
            </DialogTitle>
          </DialogHeader>
          {FormComponent && <FormComponent initialData={selectedLiability as any} onSuccess={handleFormSuccess} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
