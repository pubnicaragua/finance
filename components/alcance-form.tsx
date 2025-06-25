"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addAlcance, updateAlcance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"

interface AlcanceFormProps {
  initialData?: Tables<"alcances_desarrollo"> | null
  clienteId: string // Aseguramos que clienteId siempre se pase
  onSuccess?: () => void
  onCancel?: () => void
}

export function AlcanceForm({ initialData, clienteId, onSuccess, onCancel }: AlcanceFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateAlcance : addAlcance
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
        <Label htmlFor="nombre_modulo" className="text-right">
          Nombre Módulo
        </Label>
        <Input
          id="nombre_modulo"
          name="nombre_modulo"
          placeholder="Ej: Módulo de Facturación"
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
          placeholder="Descripción detallada del alcance"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_implementacion" className="text-right">
          Fecha Implementación
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
        <Select name="estado" defaultValue={initialData?.estado || "En Desarrollo"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En Desarrollo">En Desarrollo</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
            <SelectItem value="En Pruebas">En Pruebas</SelectItem>
            <SelectItem value="Desplegado">Desplegado</SelectItem>
          </SelectContent>
        </Select>
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
              ? "Actualizar Alcance"
              : "Añadir Alcance"}
        </Button>
      </div>
    </form>
  )
}
