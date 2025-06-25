"use client"

import type React from "react"

import { useActionState, useState, useEffect, startTransition } from "react"
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

export default function ActivoNoCorrienteForm({ initialData, onSuccess, onCancel }: ActivoNoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateActivoNoCorriente : addActivoNoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [fechaAdquisicion, setFechaAdquisicion] = useState(initialData?.fecha_adquisicion || "")
  const [vidaUtilAnios, setVidaUtilAnios] = useState(initialData?.vida_util_anios?.toString() || "")

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = {
      nombre,
      monto: Number.parseFloat(monto),
      fecha_adquisicion: fechaAdquisicion,
      vida_util_anios: Number.parseInt(vidaUtilAnios),
      ...(isEditing && { id: initialData?.id }), // Añadir ID solo si estamos editando
    }
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Activo No Corriente</Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Ej: Edificio de Oficinas"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto">Monto</Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_adquisicion">Fecha de Adquisición</Label>
        <Input
          id="fecha_adquisicion"
          name="fecha_adquisicion"
          type="date"
          value={fechaAdquisicion}
          onChange={(e) => setFechaAdquisicion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vida_util_anios">Vida Útil (Años)</Label>
        <Input
          id="vida_util_anios"
          name="vida_util_anios"
          type="number"
          min="1"
          placeholder="Ej: 10"
          required
          value={vidaUtilAnios}
          onChange={(e) => setVidaUtilAnios(e.target.value)}
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

// --- Named export requerido por otros módulos ---
export { default as ActivoNoCorrienteForm } from "./activo-no-corriente-form"
