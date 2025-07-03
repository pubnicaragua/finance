"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
        if (onSuccess) onSuccess()
        formRef.current?.reset()
      }
    }
  }, [state, toast, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre" className="text-right">
          Nombre
        </Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Nombre del socio"
          defaultValue={initialData?.nombre || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo_acuerdo" className="text-right">
          Tipo de Acuerdo
        </Label>
        <Input
          id="tipo_acuerdo"
          name="tipo_acuerdo"
          placeholder="Ej: Colaboración, Financiamiento"
          defaultValue={initialData?.tipo_acuerdo || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estado" className="text-right">
          Estado
        </Label>
        <Select name="estado" defaultValue={initialData?.estado || "Activo"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Finalizado">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="monto_financiado" className="text-right">
          Monto Financiado (USD)
        </Label>
        <Input
          id="monto_financiado"
          name="monto_financiado"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.monto_financiado?.toString() || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_inicio" className="text-right">
          Fecha Inicio
        </Label>
        <Input
          id="fecha_inicio"
          name="fecha_inicio"
          type="date"
          defaultValue={initialData?.fecha_inicio || new Date().toISOString().split("T")[0]}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_fin" className="text-right">
          Fecha Fin
        </Label>
        <Input
          id="fecha_fin"
          name="fecha_fin"
          type="date"
          defaultValue={initialData?.fecha_fin || ""}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
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