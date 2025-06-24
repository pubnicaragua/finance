"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addClient, updateClient } from "@/actions/client-actions"
import type { Tables } from "@/lib/database.types"

interface ClientFormProps {
  initialData?: Tables<"clientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ClientForm({ initialData, onSuccess, onCancel }: ClientFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateClient : addClient
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [cliente, setCliente] = useState(initialData?.cliente || "")
  const [proyecto, setProyecto] = useState(initialData?.proyecto || "")
  const [tipoSoftware, setTipoSoftware] = useState(initialData?.tipo_software || "")
  const [estado, setEstado] = useState(initialData?.estado || "")
  const [pais, setPais] = useState(initialData?.pais || "")
  const [costoProyecto, setCostoProyecto] = useState(initialData?.costo_proyecto?.toString() || "")
  const [abonado, setAbonado] = useState(initialData?.abonado?.toString() || "")
  const [deuda, setDeuda] = useState(initialData?.deuda?.toString() || "")
  const [fechaVencimiento, setFechaVencimiento] = useState(initialData?.fecha_vencimiento || "")

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
          <Label htmlFor="cliente">Cliente</Label>
          <Input
            id="cliente"
            name="cliente"
            placeholder="Nombre del cliente"
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
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pais">País</Label>
          <Input
            id="pais"
            name="pais"
            placeholder="País del cliente"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
          <Input
            id="fecha_vencimiento"
            name="fecha_vencimiento"
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="costo_proyecto">Costo del Proyecto (USD)</Label>
          <Input
            id="costo_proyecto"
            name="costo_proyecto"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={costoProyecto}
            onChange={(e) => setCostoProyecto(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="abonado">Abonado (USD)</Label>
          <Input
            id="abonado"
            name="abonado"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={abonado}
            onChange={(e) => setAbonado(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deuda">Deuda (USD)</Label>
          <Input
            id="deuda"
            name="deuda"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={deuda}
            onChange={(e) => setDeuda(e.target.value)}
          />
        </div>
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
              ? "Actualizar Cliente"
              : "Añadir Cliente"}
        </Button>
      </div>
    </form>
  )
}
