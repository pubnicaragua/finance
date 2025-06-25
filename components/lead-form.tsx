"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { addLead, updateLead } from "@/actions/lead-actions"
import { toast } from "@/hooks/use-toast"
import type { Tables } from "@/lib/database.types"

interface LeadFormProps {
  initialData?: Tables<"leads">
  onSuccess?: () => void
  onCancel?: () => void
}

export function LeadForm({ initialData, onSuccess, onCancel }: LeadFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateLead : addLead

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
        <Label htmlFor="cliente" className="text-right">
          Cliente / Lead
        </Label>
        <Input id="cliente" name="cliente" defaultValue={initialData?.cliente || ""} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="proyecto" className="text-right">
          Proyecto
        </Label>
        <Input
          id="proyecto"
          name="proyecto"
          defaultValue={initialData?.proyecto || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo_software" className="text-right">
          Tipo Software
        </Label>
        <Input
          id="tipo_software"
          name="tipo_software"
          defaultValue={initialData?.tipo_software || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estado" className="text-right">
          Estado
        </Label>
        <Select name="estado" defaultValue={initialData?.estado || "Nuevo"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nuevo">Nuevo</SelectItem>
            <SelectItem value="En Contacto">En Contacto</SelectItem>
            <SelectItem value="Propuesta Enviada">Propuesta Enviada</SelectItem>
            <SelectItem value="Negociación">Negociación</SelectItem>
            <SelectItem value="Ganado">Ganado</SelectItem>
            <SelectItem value="Perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="proyeccion_usd" className="text-right">
          Proyección USD
        </Label>
        <Input
          id="proyeccion_usd"
          name="proyeccion_usd"
          type="number"
          step="0.01"
          defaultValue={initialData?.proyeccion_usd?.toString() || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="canal_contacto" className="text-right">
          Canal Contacto
        </Label>
        <Input
          id="canal_contacto"
          name="canal_contacto"
          defaultValue={initialData?.canal_contacto || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_ultimo_contacto" className="text-right">
          Último Contacto
        </Label>
        <Input
          id="fecha_ultimo_contacto"
          name="fecha_ultimo_contacto"
          type="date"
          defaultValue={initialData?.fecha_ultimo_contacto || new Date().toISOString().split("T")[0]}
          className="col-span-3"
          required
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
          {isPending ? "Guardando..." : isEditing ? "Guardar Cambios" : "Añadir Lead"}
        </Button>
      </div>
    </form>
  )
}
