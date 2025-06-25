"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addLead, updateLead } from "@/actions/lead-actions"
import type { Tables } from "@/lib/database.types"

interface LeadFormProps {
  initialData?: Tables<"leads">
  onSuccess?: () => void
  onCancel?: () => void
}

export function LeadForm({ initialData, onSuccess, onCancel }: LeadFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateLead : addLead
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [cliente, setCliente] = useState(initialData?.cliente || "")
  const [proyecto, setProyecto] = useState(initialData?.proyecto || "")
  const [estado, setEstado] = useState(initialData?.estado || "Nuevo")
  const [proyeccionUsd, setProyeccionUsd] = useState(initialData?.proyeccion_usd?.toString() || "")
  const [canalContacto, setCanalContacto] = useState(initialData?.canal_contacto || "")
  const [fechaUltimoContacto, setFechaUltimoContacto] = useState(initialData?.fecha_ultimo_contacto || "")
  const [tipoSoftware, setTipoSoftware] = useState(initialData?.tipo_software || "")

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
    if (isEditing && initialData?.id) {
      formData.append("id", initialData.id)
    }
    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="cliente">Cliente / Lead</Label>
        <Input
          id="cliente"
          name="cliente"
          placeholder="Nombre del cliente o lead"
          required
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proyecto">Proyecto</Label>
        <Input
          id="proyecto"
          name="proyecto"
          placeholder="Nombre del proyecto"
          required
          value={proyecto}
          onChange={(e) => setProyecto(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo_software">Tipo de Software</Label>
        <Input
          id="tipo_software"
          name="tipo_software"
          placeholder="Ej: Web, Móvil, Escritorio"
          value={tipoSoftware}
          onChange={(e) => setTipoSoftware(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger id="estado">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nuevo">Nuevo</SelectItem>
            <SelectItem value="Contactado">Contactado</SelectItem>
            <SelectItem value="Calificado">Calificado</SelectItem>
            <SelectItem value="Propuesta Enviada">Propuesta Enviada</SelectItem>
            <SelectItem value="Negociación">Negociación</SelectItem>
            <SelectItem value="Ganado">Ganado</SelectItem>
            <SelectItem value="Perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="proyeccion_usd">Proyección USD</Label>
        <Input
          id="proyeccion_usd"
          name="proyeccion_usd"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={proyeccionUsd}
          onChange={(e) => setProyeccionUsd(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="canal_contacto">Canal de Contacto</Label>
        <Input
          id="canal_contacto"
          name="canal_contacto"
          placeholder="Ej: Web, Referido, Redes Sociales"
          value={canalContacto}
          onChange={(e) => setCanalContacto(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_ultimo_contacto">Fecha Último Contacto</Label>
        <Input
          id="fecha_ultimo_contacto"
          name="fecha_ultimo_contacto"
          type="date"
          value={fechaUltimoContacto}
          onChange={(e) => setFechaUltimoContacto(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? "Actualizando..." : "Añadiendo...") : isEditing ? "Actualizar Lead" : "Añadir Lead"}
        </Button>
      </div>
    </form>
  )
}
