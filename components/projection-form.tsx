"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addProjection, updateProjection } from "@/actions/payment-projection-actions"

interface ProjectionFormProps {
  clientId: string
  initialData?: {
    index: number
    fecha: string
    monto: number
    descripcion?: string
    estado?: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectionForm({ clientId, initialData, onSuccess, onCancel }: ProjectionFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateProjection : addProjection
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [estado, setEstado] = useState(initialData?.estado || "Pendiente")

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
    // Ya no es necesario formData.append("cliente_id", clientId) aquí si usamos el input hidden
    if (isEditing && initialData?.index !== undefined) {
      formData.append("index", initialData.index.toString())
    }
    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Campo oculto para cliente_id */}
      <input type="hidden" name="cliente_id" value={clientId} />
      {/* ... (el resto de tu formulario de proyección) ... */}
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto">Monto</Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (Opcional)</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Comentarios adicionales"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger id="estado">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Pagado">Pagado</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
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
