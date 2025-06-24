"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivoCorrienteForm } from "./activo-corriente-form" // Importación nombrada
import ActivoNoCorrienteForm from "./activo-no-corriente-form" // Importación por defecto
import { deleteActivoCorriente, deleteActivoNoCorriente } from "@/actions/asset-liability-actions"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import type { Tables } from "@/lib/database.types"

interface AssetsTableProps {
  assets: (Tables<"activos_corrientes"> | Tables<"activos_no_corrientes">)[]
  type?: "corriente" | "no-corriente"
}

export function AssetsTable({ assets, type }: AssetsTableProps) {
  // Exportado como named export
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<
    Tables<"activos_corrientes"> | Tables<"activos_no_corrientes"> | null
  >(null)

  const handleDelete = async (id: string, assetType: "corriente" | "no-corriente") => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este activo ${assetType}?`)) {
      let result
      if (assetType === "corriente") {
        result = await deleteActivoCorriente(id)
      } else {
        result = await deleteActivoNoCorriente(id)
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

  const handleEditClick = (asset: Tables<"activos_corrientes"> | Tables<"activos_no_corrientes">) => {
    setSelectedAsset(asset)
    setOpenDialog(true)
  }

  const handleFormSuccess = () => {
    setOpenDialog(false)
    setSelectedAsset(null)
  }

  const FormComponent = type === "corriente" ? ActivoCorrienteForm : ActivoNoCorrienteForm

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Valor</TableHead>
            {type === "no-corriente" && (
              <>
                <TableHead>Depreciación</TableHead>
                <TableHead>Valor Neto</TableHead>
              </>
            )}
            {type === "corriente" && (
              <>
                <TableHead>Cuenta ID</TableHead>
                <TableHead>Fecha Adquisición</TableHead>
              </>
            )}
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={type === "corriente" ? 6 : 7} className="text-center text-muted-foreground">
                No hay activos registrados.
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.descripcion}</TableCell>
                <TableCell>${asset.valor?.toFixed(2)}</TableCell>
                {type === "no-corriente" && (
                  <>
                    <TableCell>${(asset as Tables<"activos_no_corrientes">).depreciacion?.toFixed(2)}</TableCell>
                    <TableCell>${(asset as Tables<"activos_no_corrientes">).valor_neto?.toFixed(2)}</TableCell>
                  </>
                )}
                {type === "corriente" && (
                  <>
                    <TableCell>{(asset as Tables<"activos_corrientes">).cuenta_id || "N/A"}</TableCell>
                    <TableCell>
                      {(asset as Tables<"activos_corrientes">).fecha_adquisicion
                        ? new Date((asset as Tables<"activos_corrientes">).fecha_adquisicion).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </>
                )}
                <TableCell>{new Date(asset.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(asset)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(asset.id, type || "corriente")}
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
              {selectedAsset
                ? `Editar Activo ${type === "corriente" ? "Corriente" : "No Corriente"}`
                : `Añadir Activo ${type === "corriente" ? "Corriente" : "No Corriente"}`}
            </DialogTitle>
          </DialogHeader>
          {FormComponent && <FormComponent initialData={selectedAsset as any} onSuccess={handleFormSuccess} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
