"use client"

import { useActionState, useEffect } from "react"
import { addActivoCorriente, updateActivoCorriente } from "@/actions/asset-liability-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import type { Tables } from "@/lib/database.types"

interface ActivoCorrienteFormProps {
  initialData?: Tables<"activos_corrientes">
  onSuccess?: () => void
}

export function ActivoCorrienteForm({ initialData, onSuccess }: ActivoCorrienteFormProps) {
  // Exportado como named export
  const isEditing = !!initialData
  const action = isEditing ? updateActivoCorriente : addActivoCorriente
  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Éxito",
        description: state.message,
        variant: "default",
      })
      onSuccess?.()
    } else if (state?.success === false) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, onSuccess])

  return (
    <form action={formAction} className="grid gap-4 py-4">
      {isEditing && <Input type="hidden" name="id" defaultValue={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descripcion" className="text-right">
          Descripción
        </Label>
        <Input
          id="descripcion"
          name="descripcion"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="valor" className="text-right">
          Valor
        </Label>
        <Input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          defaultValue={initialData?.valor || 0}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cuenta_id" className="text-right">
          Cuenta ID
        </Label>
        <Input
          id="cuenta_id"
          name="cuenta_id"
          defaultValue={initialData?.cuenta_id || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_adquisicion" className="text-right">
          Fecha Adquisición
        </Label>
        <Input
          id="fecha_adquisicion"
          name="fecha_adquisicion"
          type="date"
          defaultValue={
            initialData?.fecha_adquisicion
              ? new Date(initialData.fecha_adquisicion).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          className="col-span-3"
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : isEditing ? "Actualizar Activo" : "Añadir Activo"}
        </Button>
      </DialogFooter>
    </form>
  )
}
