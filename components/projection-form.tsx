"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addProjection, updateProjection } from "@/actions/payment-projection-actions"

interface ProjectionFormProps {
  initialData?: any | null
  clienteId: string
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
      {isEditing && <input type="hidden" name="index" value={initialData.index} />}
      <input type="hidden" name="cliente_id" value={clienteId} />
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha" className="text-right">
          Fecha de Proyección
        </Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          defaultValue={initialData?.fecha || new Date().toISOString().split("T")[0]}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="monto" className="text-right">
          Monto Proyectado (USD)
        </Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.monto?.toString() || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estado" className="text-right">
          Estado
        </Label>
        <Select name="estado" defaultValue={initialData?.estado || "Pendiente"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Pagado">Pagado</SelectItem>
            <SelectItem value="Vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
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