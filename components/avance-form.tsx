"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addAvance, updateAvance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"

interface AvanceFormProps {
  clienteId: string
  initialData?: Tables<"avances_proyecto"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function AvanceForm({ clienteId, initialData, onSuccess, onCancel }: AvanceFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateAvance : addAvance
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [porcentajeAvance, setPorcentajeAvance] = useState(initialData?.porcentaje_avance?.toString() || "0")
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

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="cliente_id" value={clienteId} />
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}

      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción del Avance</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Detalle del avance realizado"
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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
          placeholder="0.00"
          required
          value={porcentajeAvance}
          onChange={(e) => setPorcentajeAvance(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="comentarios_cliente">Comentarios del Cliente</Label>
        <Textarea
          id="comentarios_cliente"
          name="comentarios_cliente"
          placeholder="Comentarios o feedback del cliente (opcional)"
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
