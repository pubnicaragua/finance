"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { addTeamMember, updateTeamMember } from "@/actions/team-calendar-actions"
import type { Tables } from "@/lib/database.types"

interface TeamMemberFormProps {
  initialData?: Tables<"miembros_equipo"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function TeamMemberForm({ initialData, onSuccess, onCancel }: TeamMemberFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateTeamMember : addTeamMember
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
          placeholder="Nombre completo"
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
          placeholder="correo@ejemplo.com"
          defaultValue={initialData?.email || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cargo" className="text-right">
          Cargo
        </Label>
        <Input
          id="cargo"
          name="cargo"
          placeholder="Ej: Desarrollador, Diseñador"
          defaultValue={initialData?.cargo || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="departamento" className="text-right">
          Departamento
        </Label>
        <Select name="departamento" defaultValue={initialData?.departamento || "Desarrollo"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Desarrollo">Desarrollo</SelectItem>
            <SelectItem value="Diseño">Diseño</SelectItem>
            <SelectItem value="Ventas">Ventas</SelectItem>
            <SelectItem value="Administración">Administración</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isEditing && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="activo" className="text-right">
            Activo
          </Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Checkbox 
              id="activo" 
              name="activo" 
              defaultChecked={initialData?.activo !== false}
            />
            <Label htmlFor="activo">Miembro activo</Label>
          </div>
        </div>
      )}
      
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
              ? "Actualizar Miembro"
              : "Añadir Miembro"}
        </Button>
      </div>
    </form>
  )
}