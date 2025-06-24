"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addActivoNoCorriente, updateActivoNoCorriente } from "@/actions/asset-liability-actions"
import type { Tables } from "@/lib/database.types"

interface ActivoNoCorrienteFormProps {
  initialData?: Tables<"activos_no_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ActivoNoCorrienteForm({ initialData, onSuccess, onCancel }: ActivoNoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateActivoNoCorriente : addActivoNoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [valor, setValor] = useState(initialData?.valor?.toString() || "")
  const [depreciacion, setDepreciacion] = useState(initialData?.depreciacion?.toString() || "0")
  const [valorNeto, setValorNeto] = useState(initialData?.valor_neto?.toString() || "")

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

  useEffect(() => {
    const val = Number.parseFloat(valor) || 0
    const dep = Number.parseFloat(depreciacion) || 0
    setValorNeto((val - dep).toFixed(2))
  }, [valor, depreciacion])

  return (
    <form action={formAction} className="grid gap-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          name="descripcion"
          placeholder="Ej: Equipo de oficina, Vehículo"
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valor">Valor Original (USD)</Label>
        <Input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="depreciacion">Depreciación Acumulada (USD)</Label>
        <Input
          id="depreciacion"
          name="depreciacion"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={depreciacion}
          onChange={(e) => setDepreciacion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valor_neto">Valor Neto (USD)</Label>
        <Input
          id="valor_neto"
          name="valor_neto"
          type="number"
          step="0.01"
          placeholder="0.00"
          readOnly
          value={valorNeto}
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
              ? "Actualizar Activo"
              : "Añadir Activo"}
        </Button>
      </div>
    </form>
  )
}
