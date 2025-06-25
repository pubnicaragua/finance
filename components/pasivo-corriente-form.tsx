"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react" // Importar startTransition
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addPasivoCorriente, updatePasivoCorriente } from "@/actions/asset-liability-actions"
import type { Tables } from "@/lib/database.types"

interface PasivoCorrienteFormProps {
  initialData?: Tables<"pasivos_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PasivoCorrienteForm({ initialData, onSuccess, onCancel }: PasivoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePasivoCorriente : addPasivoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [fechaVencimiento, setFechaVencimiento] = useState(initialData?.fecha_vencimiento || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")

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
      fecha_vencimiento: fechaVencimiento,
      ...(isEditing && { id: initialData?.id }), // Añadir ID solo si estamos editando
    }
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Pasivo Corriente</Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Ej: Cuentas por Pagar"
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
        <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
        <Input
          id="fecha_vencimiento"
          name="fecha_vencimiento"
          type="date"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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

// --- Named exports requeridos por otros módulos ---
export { default as PasivoCorrienteForm } from "./pasivo-corriente-form"
export { default as CurrentLiabilityForm } from "./pasivo-corriente-form"
