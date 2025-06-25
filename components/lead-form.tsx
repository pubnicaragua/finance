"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addLead, updateLead } from "@/actions/lead-actions"
import type { Tables } from "@/lib/database.types"

interface LeadFormProps {
  initialData?: Tables<"leads"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function LeadForm({ initialData, onSuccess, onCancel }: LeadFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateLead : addLead
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre" className="text-right">
          Nombre
        </Label>
        <Input
          id="nombre"
          name="nombre"
          placeholder="Nombre del lead"
          defaultValue={initialData?.nombre || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          defaultValue={initialData?.email || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="telefono" className="text-right">
          Teléfono
        </Label>
        <Input
          id="telefono"
          name="telefono"
          placeholder="Ej: +505 8888-8888"
          defaultValue={initialData?.telefono || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="interes" className="text-right">
          Interés
        </Label>
        <Input
          id="interes"
          name="interes"
          placeholder="Producto o servicio de interés"
          defaultValue={initialData?.interes || ""}
          className="col-span-3"
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
            <SelectItem value="Contactado">Contactado</SelectItem>
            <SelectItem value="Calificado">Calificado</SelectItem>
            <SelectItem value="No Calificado">No Calificado</SelectItem>
            <SelectItem value="Convertido">Convertido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_contacto" className="text-right">
          Fecha Contacto
        </Label>
        <Input
          id="fecha_contacto"
          name="fecha_contacto"
          type="date"
          defaultValue={initialData?.fecha_contacto || new Date().toISOString().split("T")[0]}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fuente" className="text-right">
          Fuente
        </Label>
        <Input
          id="fuente"
          name="fuente"
          placeholder="Ej: Web, Referido, Campaña"
          defaultValue={initialData?.fuente || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="comentarios" className="text-right">
          Comentarios
        </Label>
        <Textarea
          id="comentarios"
          name="comentarios"
          placeholder="Notas adicionales sobre el lead"
          defaultValue={initialData?.comentarios || ""}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? "Actualizando..." : "Añadiendo...") : isEditing ? "Actualizar Lead" : "Añadir Lead"}
        </Button>
      </div>
    </form>
  )
}
