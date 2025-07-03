"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addPayroll, updatePayroll, getActiveEmployees } from "@/actions/payroll-actions"
import type { Tables } from "@/lib/database.types"

interface PayrollFormProps {
  initialData?: any | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PayrollForm({ initialData, onSuccess, onCancel }: PayrollFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePayroll : addPayroll
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [employees, setEmployees] = useState<Tables<"empleados">[]>([])

  useEffect(() => {
    const fetchEmployees = async () => {
      const activeEmployees = await getActiveEmployees()
      setEmployees(activeEmployees)
    }
    fetchEmployees()
  }, [])

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
      
      <div className="space-y-2">
        <Label htmlFor="empleado_id">Empleado</Label>
        <Select name="empleado_id" defaultValue={initialData?.empleado_id || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un empleado" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.nombre} {employee.apellido} - {employee.puesto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="periodo_inicio">Período Inicio</Label>
          <Input
            id="periodo_inicio"
            name="periodo_inicio"
            type="date"
            required
            defaultValue={initialData?.periodo_inicio || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="periodo_fin">Período Fin</Label>
          <Input
            id="periodo_fin"
            name="periodo_fin"
            type="date"
            required
            defaultValue={initialData?.periodo_fin || ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <Label htmlFor="bonificaciones">Bonificaciones (USD)</Label>
          <Input
            id="bonificaciones"
            name="bonificaciones"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={initialData?.bonificaciones?.toString() || "0"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deducciones">Deducciones (USD)</Label>
          <Input
            id="deducciones"
            name="deducciones"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={initialData?.deducciones?.toString() || "0"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select name="estado" defaultValue={initialData?.estado || "Pendiente"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Pagado">Pagado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fecha_pago">Fecha de Pago</Label>
          <Input
            id="fecha_pago"
            name="fecha_pago"
            type="date"
            defaultValue={initialData?.fecha_pago || ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          name="notas"
          placeholder="Notas adicionales sobre este período de nómina"
          defaultValue={initialData?.notas || ""}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Actualizando..."
              : "Procesando..."
            : isEditing
              ? "Actualizar Nómina"
              : "Procesar Nómina"}
        </Button>
      </div>
    </form>
  )
}