"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addAlcance, updateAlcance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"

interface AlcanceFormProps {
  clientId: string
  initialData?: Tables<"alcances_desarrollo">
  onSuccess?: () => void
  onCancel?: () => void
}

export function AlcanceForm({ clientId, initialData, onSuccess, onCancel }: AlcanceFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateAlcance : addAlcance
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombreModulo, setNombreModulo] = useState(initialData?.nombre_modulo || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [fechaImplementacion, setFechaImplementacion] = useState(initialData?.fecha_implementacion || "")
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
        <Label htmlFor="nombre_modulo">Nombre del Módulo</Label>
        <Input
          id="nombre_modulo"
          name="nombre_modulo"
          placeholder="Ej: Módulo de Facturación"
          value={nombreModulo}
          onChange={(e) => setNombreModulo(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Detalles del alcance del módulo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_implementacion">Fecha de Implementación</Label>
        <Input
          id="fecha_implementacion"
          name="fecha_implementacion"
          type="date"
          value={fechaImplementacion}
          onChange={(e) => setFechaImplementacion(e.target.value)}
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
            <SelectItem value="En Progreso">En Progreso</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
            <SelectItem value="En Revisión">En Revisión</SelectItem>
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
              ? "Actualizar Alcance"
              : "Añadir Alcance"}
        </Button>
      </div>
    </form>
  )
}
