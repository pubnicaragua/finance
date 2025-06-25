"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addPartnership, updatePartnership } from "@/actions/partnership-actions"
import { useToast } from "@/hooks/use-toast"
import type { TablesUpdate } from "@/lib/database.types"

interface PartnershipFormProps {
  initialData?: TablesUpdate<"partnerships"> | null
  onSuccess: () => void
  onCancel: () => void
}

export function PartnershipForm({ initialData, onSuccess, onCancel }: PartnershipFormProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const actionToUse = initialData ? updatePartnership : addPartnership

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
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre_socio" className="text-right">
          Nombre del Socio
        </Label>
        <Input
          id="nombre_socio"
          name="nombre_socio"
          defaultValue={initialData?.nombre_socio || ""}
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
          defaultValue={initialData?.tipo_acuerdo || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_inicio" className="text-right">
          Fecha de Inicio
        </Label>
        <Input
          id="fecha_inicio"
          name="fecha_inicio"
          type="date"
          defaultValue={initialData?.fecha_inicio || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_fin" className="text-right">
          Fecha de Fin
        </Label>
        <Input
          id="fecha_fin"
          name="fecha_fin"
          type="date"
          defaultValue={initialData?.fecha_fin || ""}
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
        <Label htmlFor="descripcion" className="text-right">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : initialData ? "Actualizar Partnership" : "Añadir Partnership"}
        </Button>
      </div>
    </form>
  )
}
