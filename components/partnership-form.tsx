"use client"

import type React from "react"

import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addPartnership, updatePartnership } from "@/actions/partnership-actions"
import type { Tables } from "@/lib/database.types"

interface PartnershipFormProps {
  initialData?: Tables<"partnerships"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PartnershipForm({ initialData, onSuccess, onCancel }: PartnershipFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePartnership : addPartnership
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [contacto, setContacto] = useState(initialData?.contacto || "")
  const [tipo, setTipo] = useState(initialData?.tipo || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [fechaInicio, setFechaInicio] = useState(initialData?.fecha_inicio || "")
  const [estado, setEstado] = useState(initialData?.estado || "Activo")

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
      contacto,
      tipo,
      descripcion,
      fecha_inicio: fechaInicio,
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
        <Label htmlFor="nombre">Nombre de la Asociación</Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Nombre de la asociación"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contacto">Contacto</Label>
        <Input
          id="contacto"
          name="contacto"
          placeholder="Contacto de la asociación"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Asociación</Label>
        <Input
          id="tipo"
          name="tipo"
          placeholder="Ej: Proveedor, Cliente, Estratégico"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Descripción de la asociación"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
        <Input
          id="fecha_inicio"
          name="fecha_inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
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
              ? "Actualizar Asociación"
              : "Añadir Asociación"}
        </Button>
      </div>
    </form>
  )
}
