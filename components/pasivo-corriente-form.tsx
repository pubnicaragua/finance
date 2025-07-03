"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addCurrentLiability, updateCurrentLiability } from "@/actions/asset-liability-actions"
import type { TablesUpdate } from "@/lib/database.types"

interface PasivoCorrienteFormProps {
  initialData?: TablesUpdate<"pasivos_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PasivoCorrienteForm({ initialData, onSuccess, onCancel }: PasivoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateCurrentLiability : addCurrentLiability
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        onSuccess?.()
        formRef.current?.reset()
      }
    }
  }, [state, toast, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descripcion" className="text-right">
          Descripción
        </Label>
        <Input
          id="descripcion"
          name="descripcion"
          placeholder="Ej: Cuentas por pagar, Préstamos a corto plazo"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="debe" className="text-right">
          Debe (USD)
        </Label>
        <Input
          id="debe"
          name="debe"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.debe?.toString() || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="saldo" className="text-right">
          Saldo (USD)
        </Label>
        <Input
          id="saldo"
          name="saldo"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.saldo?.toString() || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Actualizando..."
              : "Añadiendo..."
            : isEditing
              ? "Actualizar Pasivo"
              : "Añadir Pasivo"}
        </Button>
      </div>
    </form>
  )
}