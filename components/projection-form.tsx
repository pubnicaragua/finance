"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addProjection, updateProjection } from "@/actions/payment-projection-actions"
import type { Tables } from "@/lib/database.types"

interface ProjectionFormProps {
  initialData?: Tables<"proyecciones"> | null
  clienteId: string // Aseguramos que clienteId siempre se pase
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectionForm({ initialData, clienteId, onSuccess, onCancel }: ProjectionFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateProjection : addProjection
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
        formRef.current?.reset()
      }
    }
  }, [state, toast, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="cliente_id" value={clienteId} /> {/* CAMBIO: Añadir cliente_id oculto */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_proyeccion" className="text-right">
          Fecha de Proyección
        </Label>
        <Input
          id="fecha_proyeccion"
          name="fecha_proyeccion"
          type="date"
          defaultValue={initialData?.fecha_proyeccion || new Date().toISOString().split("T")[0]}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="monto_proyectado" className="text-right">
          Monto Proyectado (USD)
        </Label>
        <Input
          id="monto_proyectado"
          name="monto_proyectado"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.monto_proyectado?.toString() || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descripcion" className="text-right">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Descripción de la proyección"
          defaultValue={initialData?.descripcion || ""}
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
              ? "Actualizar Proyección"
              : "Añadir Proyección"}
        </Button>
      </div>
    </form>
  )
}
