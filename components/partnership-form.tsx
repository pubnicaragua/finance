"use client"

import type React from "react"
import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createPartnership, updatePartnership } from "@/actions/partnership-actions"
import type { Tables } from "@/lib/database.types"

interface PartnershipFormProps {
  initialData?: Tables<"asociaciones"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PartnershipForm({ initialData, onSuccess, onCancel }: PartnershipFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePartnership : createPartnership
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [tipo, setTipo] = useState(initialData?.tipo || "Proveedor")
  const [fechaInicio, setFechaInicio] = useState(initialData?.fecha_inicio || new Date().toISOString().split("T")[0])
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      ...(isEditing && { id: initialData.id }),
      nombre: formData.get("nombre") as string,
      tipo: formData.get("tipo") as string,
      fecha_inicio: formData.get("fecha_inicio") as string,
      estado: formData.get("estado") as string,
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
        <Label htmlFor="tipo">Tipo</Label>
        <Select name="tipo" value={tipo} onValueChange={setTipo}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Proveedor">Proveedor</SelectItem>
            <SelectItem value="Cliente">Cliente</SelectItem>
            <SelectItem value="Socio">Socio</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
        <Input
          id="fecha_inicio"
          name="fecha_inicio"
          type="date"
          required
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona estado" />
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
