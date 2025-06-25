"use client"

import { useActionState, useEffect } from "react"
import { addActivoNoCorriente, updateActivoNoCorriente } from "@/actions/asset-liability-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import type { Tables } from "@/lib/database.types"

interface ActivoNoCorrienteFormProps {
  initialData?: Tables<"activos_no_corrientes">
  onSuccess?: () => void
}

export function ActivoNoCorrienteForm({ initialData, onSuccess }: ActivoNoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateActivoNoCorriente : addActivoNoCorriente
  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Éxito", description: state.message })
      onSuccess?.()
    } else if (state?.success === false) {
      toast({ title: "Error", description: state.message, variant: "destructive" })
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
          defaultValue={initialData?.descripcion ?? ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="valor" className="text-right">
          Valor Original
        </Label>
        <Input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          defaultValue={initialData?.valor ?? 0}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="depreciacion" className="text-right">
          Depreciación Acumulada
        </Label>
        <Input
          id="depreciacion"
          name="depreciacion"
          type="number"
          step="0.01"
          defaultValue={initialData?.depreciacion ?? 0}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="valor_neto" className="text-right">
          Valor Neto
        </Label>
        <Input
          id="valor_neto"
          name="valor_neto"
          type="number"
          step="0.01"
          defaultValue={initialData?.valor_neto ?? 0}
          className="col-span-3"
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

export default ActivoNoCorrienteForm
