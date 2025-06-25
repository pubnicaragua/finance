"use client"

import type React from "react"

import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addProjection, updateProjection } from "@/actions/payment-projection-actions"

interface ProjectionFormProps {
  clienteId: string
  initialData?: { fecha: string; monto: number; pagado?: boolean; index?: number } | null
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
  const [pagado, setPagado] = useState(initialData?.pagado ? "true" : "false")

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
      clienteId: clienteId, // Ya lo tenemos como prop
      fecha: formData.get("fecha") as string,
      monto: Number.parseFloat(formData.get("monto") as string),
      pagado: formData.get("pagado") === "true",
      ...(isEditing && { index: initialData.index }), // Añadir index solo si estamos editando
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
      <div className="space-y-2">
        <Label htmlFor="pagado">Estado</Label>
        <Select name="pagado" value={pagado} onValueChange={setPagado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Pendiente</SelectItem>
            <SelectItem value="true">Pagado</SelectItem>
          </SelectContent>
        </Select>
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
