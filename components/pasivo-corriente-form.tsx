"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addPasivoCorriente, updatePasivoCorriente } from "@/actions/asset-liability-actions"
import type { Tables } from "@/lib/database.types"

interface PasivoCorrienteFormProps {
  initialData?: Tables<"pasivos_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PasivoCorrienteForm({ initialData, onSuccess, onCancel }: PasivoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePasivoCorriente : addPasivoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [debe, setDebe] = useState(initialData?.debe?.toString() || "")
  const [saldo, setSaldo] = useState(initialData?.saldo?.toString() || "")

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Éxito",
        description: state.message,
        variant: "default",
      })
      onSuccess?.()
    } else if (state?.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast, onSuccess])

  return (
    <form action={formAction} className="grid gap-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          name="descripcion"
          placeholder="Ej: Cuentas por pagar, Préstamos a corto plazo"
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="debe">Debe (USD)</Label>
        <Input
          id="debe"
          name="debe"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={debe}
          onChange={(e) => setDebe(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="saldo">Saldo (USD)</Label>
        <Input
          id="saldo"
          name="saldo"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
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
