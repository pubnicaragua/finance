"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addAlcance, updateAlcance } from "@/actions/project-updates-actions"
import { useToast } from "@/hooks/use-toast"
import type { TablesUpdate } from "@/lib/database.types"

interface AlcanceFormProps {
  clientId: string
  initialData?: TablesUpdate<"alcances_desarrollo"> | null
  onSuccess: () => void
  onCancel: () => void
}

export function AlcanceForm({ clientId, initialData, onSuccess, onCancel }: AlcanceFormProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const actionToUse = initialData ? updateAlcance : addAlcance

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
        <Label htmlFor="nombre_modulo" className="text-right">
          Nombre del Módulo
        </Label>
        <Input
          id="nombre_modulo"
          name="nombre_modulo"
          defaultValue={initialData?.nombre_modulo || ""}
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
        <Label htmlFor="fecha_implementacion" className="text-right">
          Fecha de Implementación
        </Label>
        <Input
          id="fecha_implementacion"
          name="fecha_implementacion"
          type="date"
          defaultValue={initialData?.fecha_implementacion || new Date().toISOString().split("T")[0]}
          className="col-span-3"
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
            <SelectItem value="En Progreso">En Progreso</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
            <SelectItem value="En Revisión">En Revisión</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : initialData ? "Actualizar Alcance" : "Añadir Alcance"}
        </Button>
      </div>
    </form>
  )
}
