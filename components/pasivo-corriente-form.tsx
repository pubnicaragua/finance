"use client"

import type React from "react"
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

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [fechaVencimiento, setFechaVencimiento] = useState(
    initialData?.fecha_vencimiento || new Date().toISOString().split("T")[0],
  )

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      ...(isEditing && { id: initialData.id }),
      nombre: formData.get("nombre") as string,
      monto: Number.parseFloat(formData.get("monto") as string),
      fecha_vencimiento: formData.get("fecha_vencimiento") as string,
    }
    console.log("Client: Submitting data:", data)
    formAction(data)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto">Monto (USD)</Label>
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
          required
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
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
