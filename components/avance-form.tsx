"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addAvance, updateAvance } from "@/actions/project-updates-actions"
import { useToast } from "@/hooks/use-toast"
import type { TablesUpdate } from "@/lib/database.types"

interface AvanceFormProps {
  clientId: string
  initialData?: TablesUpdate<"avances_proyecto"> | null
  onSuccess: () => void
  onCancel: () => void
}

export function AvanceForm({ clientId, initialData, onSuccess, onCancel }: AvanceFormProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const actionToUse = initialData ? updateAvance : addAvance

  const [state, formAction, isPending] = useActionState(actionToUse, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        onSuccess()
        formRef.current?.reset()
      }
    }
  }, [state, toast, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
      <input type="hidden" name="cliente_id" value={clientId} />
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha" className="text-right">
          Fecha
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
        <Label htmlFor="descripcion" className="text-right">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="porcentaje_avance" className="text-right">
          % Avance
        </Label>
        <Input
          id="porcentaje_avance"
          name="porcentaje_avance"
          type="number"
          step="0.01"
          defaultValue={initialData?.porcentaje_avance || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="comentarios_cliente" className="text-right">
          Comentarios Cliente
        </Label>
        <Textarea
          id="comentarios_cliente"
          name="comentarios_cliente"
          defaultValue={initialData?.comentarios_cliente || ""}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : initialData ? "Actualizar Avance" : "Añadir Avance"}
        </Button>
      </div>
    </form>
  )
}
