"use client"

import { useActionState, useEffect, useRef } from "react"
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
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        onSuccess?.()
        formRef.current?.reset() // Reset form on success
      }
    }
  }, [state, toast, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Input
            id="cliente"
            name="cliente"
            placeholder="Nombre del cliente"
            required
            defaultValue={initialData?.cliente || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proyecto">Proyecto</Label>
          <Input
            id="proyecto"
            name="proyecto"
            placeholder="Nombre del proyecto"
            required
            defaultValue={initialData?.proyecto || ""}
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
            defaultValue={initialData?.tipo_software || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select name="estado" defaultValue={initialData?.estado || ""}>
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
          <Input id="pais" name="pais" placeholder="País del cliente" defaultValue={initialData?.pais || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
          <Input
            id="fecha_vencimiento"
            name="fecha_vencimiento"
            type="date"
            defaultValue={initialData?.fecha_vencimiento || ""}
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
            defaultValue={initialData?.costo_proyecto?.toString() || ""}
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
            defaultValue={initialData?.abonado?.toString() || ""}
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
            defaultValue={initialData?.deuda?.toString() || ""}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
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
