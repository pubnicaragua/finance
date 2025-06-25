"use client"

import type React from "react"

import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addAlcance, updateAlcance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"

interface AlcanceFormProps {
  clienteId: string
  initialData?: Tables<"alcances_desarrollo"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function AlcanceForm({ clienteId, initialData, onSuccess, onCancel }: AlcanceFormProps) {
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
    const data = {
      cliente_id: clienteId,
      nombre_modulo: nombreModulo,
      descripcion,
      fecha_implementacion: fechaImplementacion,
      estado,
      ...(isEditing && { id: initialData?.id }), // Añadir ID solo si estamos editando
    }
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre_modulo">Nombre del Módulo</Label>
        <Input
          id="nombre_modulo"
          name="nombre_modulo"
          placeholder="Ej: Módulo de Facturación"
          required
          value={nombreModulo}
          onChange={(e) => setNombreModulo(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción del Alcance</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Detalle de las funcionalidades incluidas en este alcance"
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En Desarrollo">En Desarrollo</SelectItem>
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
