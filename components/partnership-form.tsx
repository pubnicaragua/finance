"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { addPartnership, updatePartnership } from "@/actions/partnership-actions"
import { toast } from "@/hooks/use-toast"
import type { Tables } from "@/lib/database.types"

interface PartnershipFormProps {
  initialData?: Tables<"partnerships">
  onSuccess?: () => void
  onCancel?: () => void
}

export function PartnershipForm({ initialData, onSuccess, onCancel }: PartnershipFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePartnership : addPartnership

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await action(formData)
    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      })
      onSuccess?.() // Llamar al callback de éxito
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
    return result
  }, null)

  return (
    <form action={formAction} className="grid gap-4 py-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre" className="text-right">
          Nombre Partnership
        </Label>
        <Input id="nombre" name="nombre" defaultValue={initialData?.nombre || ""} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo_colaboracion" className="text-right">
          Tipo Colaboración
        </Label>
        <Input
          id="tipo_colaboracion"
          name="tipo_colaboracion"
          defaultValue={initialData?.tipo_colaboracion || ""}
          className="col-span-3"
          required
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
          </SelectContent>
        </Select>
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
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contacto_principal" className="text-right">
          Contacto Principal
        </Label>
        <Input
          id="contacto_principal"
          name="contacto_principal"
          defaultValue={initialData?.contacto_principal || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notas" className="text-right">
          Notas
        </Label>
        <Textarea id="notas" name="notas" defaultValue={initialData?.notas || ""} className="col-span-3" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : isEditing ? "Guardar Cambios" : "Añadir Partnership"}
        </Button>
      </div>
    </form>
  )
}
