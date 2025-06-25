"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react" // Importar startTransition
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { addProjection, updateProjection } from "@/actions/payment-projection-actions"

interface ProjectionFormProps {
  clienteId: string
  initialData?: { fecha: string; monto: number; pagado: boolean; index?: number } | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectionForm({ clienteId, initialData, onSuccess, onCancel }: ProjectionFormProps) {
  const isEditing = initialData && typeof initialData.index === "number"
  const action = isEditing ? updateProjection : addProjection
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [pagado, setPagado] = useState(initialData?.pagado || false)

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
      clienteId: clienteId,
      fecha: formData.get("fecha") as string,
      monto: Number.parseFloat(formData.get("monto") as string),
      pagado: formData.get("pagado") === "on", // Checkbox value is "on" when checked
      ...(isEditing && { index: initialData.index }),
    }
    console.log("Client: Submitting data:", data)
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="pagado"
          name="pagado"
          checked={pagado}
          onCheckedChange={(checked) => setPagado(checked as boolean)}
        />
        <Label htmlFor="pagado">Pagado</Label>
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
              ? "Actualizar Proyección"
              : "Añadir Proyección"}
        </Button>
      </div>
    </form>
  )
}
