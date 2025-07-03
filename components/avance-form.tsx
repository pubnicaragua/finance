"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { addAvance, updateAvance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"

interface AvanceFormProps {
  initialData?: Tables<"avances_proyecto"> | null
  clienteId: string // Aseguramos que clienteId siempre se pase
  onSuccess?: () => void
  onCancel?: () => void
}

export function AvanceForm({ initialData, clienteId, onSuccess, onCancel }: AvanceFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateAvance : addAvance
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
      <input type="hidden" name="cliente_id" value={clienteId} />
      
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
          placeholder="Descripción del avance"
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
          placeholder="0.00"
          defaultValue={initialData?.porcentaje_avance?.toString() || ""}
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
          placeholder="Comentarios del cliente sobre el avance"
          defaultValue={initialData?.comentarios_cliente || ""}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="backlog_url" className="text-right">
          URL Backlog
        </Label>
        <Input
          id="backlog_url"
          name="backlog_url"
          type="url"
          placeholder="https://ejemplo.com/backlog"
          defaultValue={initialData?.backlog_url || ""}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firma_virtual" className="text-right">
          Firma Virtual
        </Label>
        <Input
          id="firma_virtual"
          name="firma_virtual"
          placeholder="Nombre completo para firma"
          defaultValue={initialData?.firma_virtual || ""}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="completado" className="text-right">
          Completado
        </Label>
        <div className="col-span-3">
          <Checkbox
            id="completado"
            name="completado"
            defaultChecked={initialData?.completado || false}
          />
        </div>
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
              ? "Actualizar Avance"
              : "Añadir Avance"}
        </Button>
      </div>
    </form>
  )
}