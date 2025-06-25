"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addPartnership, updatePartnership } from "@/actions/partnership-actions"
import type { Tables } from "@/lib/database.types"

interface PartnershipFormProps {
  initialData?: Tables<"partnerships">
  onSuccess?: () => void
  onCancel?: () => void
}

export function PartnershipForm({ initialData, onSuccess, onCancel }: PartnershipFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePartnership : addPartnership
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [tipoAcuerdo, setTipoAcuerdo] = useState(initialData?.tipo_acuerdo || "")
  const [estado, setEstado] = useState(initialData?.estado || "Activo")
  const [montoFinanciado, setMontoFinanciado] = useState(initialData?.monto_financiado?.toString() || "")
  const [fechaInicio, setFechaInicio] = useState(initialData?.fecha_inicio || "")
  const [fechaFin, setFechaFin] = useState(initialData?.fecha_fin || "")

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
        <Label htmlFor="nombre">Nombre del Socio</Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Nombre del socio"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo_acuerdo">Tipo de Acuerdo</Label>
        <Input
          id="tipo_acuerdo"
          name="tipo_acuerdo"
          placeholder="Ej: Colaboración, Financiamiento"
          value={tipoAcuerdo}
          onChange={(e) => setTipoAcuerdo(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger id="estado">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Negociación">Negociación</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto_financiado">Monto Financiado (USD)</Label>
        <Input
          id="monto_financiado"
          name="monto_financiado"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={montoFinanciado}
          onChange={(e) => setMontoFinanciado(e.target.value)}
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
        <Label htmlFor="fecha_fin">Fecha de Fin</Label>
        <Input
          id="fecha_fin"
          name="fecha_fin"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
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
              ? "Actualizar Partnership"
              : "Añadir Partnership"}
        </Button>
      </div>
    </form>
  )
}
