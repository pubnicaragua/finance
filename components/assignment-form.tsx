"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addAssignment, updateAssignment } from "@/actions/team-calendar-actions"
import type { Tables } from "@/lib/database.types"
import { format } from "date-fns"

interface AssignmentFormProps {
  initialData?: any | null
  teamMembers: Tables<"miembros_equipo">[]
  clients: Tables<"clientes">[]
  initialDate?: Date
  onSuccess?: () => void
  onCancel?: () => void
}

export function AssignmentForm({ 
  initialData, 
  teamMembers, 
  clients, 
  initialDate,
  onSuccess, 
  onCancel 
}: AssignmentFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateAssignment : addAssignment
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  // Preparar fecha inicial y final por defecto
  const today = initialDate || new Date()
  const defaultStartDate = format(today, 'yyyy-MM-dd\'T\'HH:mm')
  
  // Fecha final por defecto: mismo día a las 18:00
  const endDate = new Date(today)
  endDate.setHours(18, 0, 0, 0)
  const defaultEndDate = format(endDate, 'yyyy-MM-dd\'T\'HH:mm')

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
        <Label htmlFor="miembro_id" className="text-right">
          Miembro
        </Label>
        <Select 
          name="miembro_id" 
          defaultValue={initialData?.miembro_id || ""}
          required
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un miembro" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.nombre} - {member.cargo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="titulo" className="text-right">
          Título
        </Label>
        <Input
          id="titulo"
          name="titulo"
          placeholder="Título de la asignación"
          defaultValue={initialData?.titulo || ""}
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
          placeholder="Descripción detallada de la asignación"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_inicio" className="text-right">
          Fecha Inicio
        </Label>
        <Input
          id="fecha_inicio"
          name="fecha_inicio"
          type="datetime-local"
          defaultValue={initialData?.fecha_inicio || defaultStartDate}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_fin" className="text-right">
          Fecha Fin
        </Label>
        <Input
          id="fecha_fin"
          name="fecha_fin"
          type="datetime-local"
          defaultValue={initialData?.fecha_fin || defaultEndDate}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estado" className="text-right">
          Estado
        </Label>
        <Select name="estado" defaultValue={initialData?.estado || "pendiente"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_progreso">En Progreso</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="prioridad" className="text-right">
          Prioridad
        </Label>
        <Select name="prioridad" defaultValue={initialData?.prioridad || "media"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona una prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baja">Baja</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="proyecto_id" className="text-right">
          Proyecto
        </Label>
        <Select name="proyecto_id" defaultValue={initialData?.proyecto_id || ""}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un proyecto (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin proyecto</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.cliente} - {client.proyecto}
              </SelectItem>
            ))}
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
              ? "Actualizar Asignación"
              : "Añadir Asignación"}
        </Button>
      </div>
    </form>
  )
}