"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addEmployee, updateEmployee } from "@/actions/employee-actions"
import type { Tables } from "@/lib/database.types"

interface EmployeeFormProps {
  initialData?: Tables<"empleados"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function EmployeeForm({ initialData, onSuccess, onCancel }: EmployeeFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateEmployee : addEmployee
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
    <form ref={formRef} action={formAction} className="grid gap-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Nombre del empleado"
            required
            defaultValue={initialData?.nombre || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            name="apellido"
            placeholder="Apellido del empleado"
            required
            defaultValue={initialData?.apellido || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@ejemplo.com"
            defaultValue={initialData?.email || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            placeholder="+505 8888-8888"
            defaultValue={initialData?.telefono || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="puesto">Puesto</Label>
          <Input
            id="puesto"
            name="puesto"
            placeholder="Desarrollador, Diseñador, etc."
            required
            defaultValue={initialData?.puesto || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento</Label>
          <Input
            id="departamento"
            name="departamento"
            placeholder="Desarrollo, Diseño, Administración"
            defaultValue={initialData?.departamento || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="salario_base">Salario Base (USD)</Label>
          <Input
            id="salario_base"
            name="salario_base"
            type="number"
            step="0.01"
            placeholder="0.00"
            required
            defaultValue={initialData?.salario_base?.toString() || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_contratacion">Fecha de Contratación</Label>
          <Input
            id="fecha_contratacion"
            name="fecha_contratacion"
            type="date"
            defaultValue={initialData?.fecha_contratacion || new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" defaultValue={initialData?.estado || "Activo"}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Vacaciones">Vacaciones</SelectItem>
            <SelectItem value="Licencia">Licencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numero_cuenta">Número de Cuenta</Label>
          <Input
            id="numero_cuenta"
            name="numero_cuenta"
            placeholder="Número de cuenta bancaria"
            defaultValue={initialData?.numero_cuenta || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banco">Banco</Label>
          <Input
            id="banco"
            name="banco"
            placeholder="Nombre del banco"
            defaultValue={initialData?.banco || ""}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Actualizando..."
              : "Añadiendo..."
            : isEditing
              ? "Actualizar Empleado"
              : "Añadir Empleado"}
        </Button>
      </div>
    </form>
  )
}