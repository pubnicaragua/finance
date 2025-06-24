"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  const [tipoAcuerdo, setTipoAcuerdo] = useState(initialData?.tipo_acuerdo || "")
  const [fechaInicio, setFechaInicio] = useState(initialData?.fecha_inicio || "")
  const [fechaFin, setFechaFin] = useState(initialData?.fecha_fin || "")
  const [estado, setEstado] = useState(initialData?.estado || "Activo")
  const [montoFinanciado, setMontoFinanciado] = useState(initialData?.monto_financiado?.toString() || "")
  const [responsabilidades, setResponsabilidades] = useState(JSON.stringify(initialData?.responsabilidades || []))
  const [expectativas, setExpectativas] = useState(JSON.stringify(initialData?.expectativas || []))
  const [historialInteracciones, setHistorialInteracciones] = useState(
    JSON.stringify(initialData?.historial_interacciones || []),
  )

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
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Partnership</Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Nombre del partner"
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
            placeholder="Ej: Colaboración, Inversión"
            value={tipoAcuerdo}
            onChange={(e) => setTipoAcuerdo(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
          <Input
            id="fecha_inicio"
            name="fecha_inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_fin">Fecha Fin</Label>
          <Input
            id="fecha_fin"
            name="fecha_fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="responsabilidades">Responsabilidades (JSON Array)</Label>
        <Textarea
          id="responsabilidades"
          name="responsabilidades"
          placeholder='Ej: ["Marketing Conjunto", "Desarrollo de Producto"]'
          value={responsabilidades}
          onChange={(e) => setResponsabilidades(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expectativas">Expectativas (JSON Array)</Label>
        <Textarea
          id="expectativas"
          name="expectativas"
          placeholder='Ej: ["Aumento de Ventas 10%", "Expansión de Mercado"]'
          value={expectativas}
          onChange={(e) => setExpectativas(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="historial_interacciones">Historial de Interacciones (JSON Array)</Label>
        <Textarea
          id="historial_interacciones"
          name="historial_interacciones"
          placeholder='Ej: [{"fecha": "2023-01-15", "nota": "Reunión inicial"}]'
          value={historialInteracciones}
          onChange={(e) => setHistorialInteracciones(e.target.value)}
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
