"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addAvance, updateAvance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"

interface AvanceFormProps {
  clientId: string
  initialData?: Tables<"avances_proyecto">
  onSuccess?: () => void
  onCancel?: () => void
}

export function AvanceForm({ clientId, initialData, onSuccess, onCancel }: AvanceFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateAvance : addAvance
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [porcentajeAvance, setPorcentajeAvance] = useState(initialData?.porcentaje_avance?.toString() || "")
  const [comentariosCliente, setComentariosCliente] = useState(initialData?.comentarios_cliente || "")

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
    const formData = new FormData(event.currentTarget)
    // Campo oculto para cliente_id
    formData.append("cliente_id", clientId) // Asegura que clientId se envía
    if (isEditing && initialData?.id) {
      formData.append("id", initialData.id)
    }
    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Campo oculto para cliente_id */}
      <input type="hidden" name="cliente_id" value={clientId} />
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción del Avance</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Detalles del avance realizado"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="porcentaje_avance">Porcentaje de Avance (%)</Label>
        <Input
          id="porcentaje_avance"
          name="porcentaje_avance"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Ej: 75.50"
          value={porcentajeAvance}
          onChange={(e) => setPorcentajeAvance(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="comentarios_cliente">Comentarios del Cliente (Opcional)</Label>
        <Textarea
          id="comentarios_cliente"
          name="comentarios_cliente"
          placeholder="Feedback o solicitudes del cliente"
          value={comentariosCliente}
          onChange={(e) => setComentariosCliente(e.target.value)}
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
              ? "Actualizar Avance"
              : "Añadir Avance"}
        </Button>
      </div>
    </form>
  )
}
