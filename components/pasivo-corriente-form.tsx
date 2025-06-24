"use client"

import { useActionState, useEffect } from "react"
import { addPasivoCorriente, updatePasivoCorriente } from "@/actions/asset-liability-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import type { Tables } from "@/lib/database.types"

interface PasivoCorrienteFormProps {
  initialData?: Tables<"pasivos_corrientes">
  onSuccess?: () => void
}

export default function PasivoCorrienteForm({ initialData, onSuccess }: PasivoCorrienteFormProps) {
  // Restablecido a exportación por defecto
  const isEditing = !!initialData
  const action = isEditing ? updatePasivoCorriente : addPasivoCorriente
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
        <Label htmlFor="saldo" className="text-right">
          Saldo
        </Label>
        <Input
          id="saldo"
          name="saldo"
          type="number"
          step="0.01"
          defaultValue={initialData?.saldo || 0}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_vencimiento" className="text-right">
          Fecha de Vencimiento
        </Label>
        <Input
          id="fecha_vencimiento"
          name="fecha_vencimiento"
          type="date"
          defaultValue={initialData?.fecha_vencimiento || new Date().toISOString().split("T")[0]}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : isEditing ? "Actualizar Pasivo" : "Añadir Pasivo"}
        </Button>
      </DialogFooter>
    </form>
  )
}
