"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addActivoCorriente, updateActivoCorriente } from "@/actions/asset-liability-actions"
import type { Tables } from "@/lib/database.types"

interface ActivoCorrienteFormProps {
  initialData?: Tables<"activos_corrientes"> | null
  cuentasFinancieras: Array<{ id: string; nombre: string; moneda: string }>
  onSuccess?: () => void
  onCancel?: () => void
}

export function ActivoCorrienteForm({
  initialData,
  cuentasFinancieras,
  onSuccess,
  onCancel,
}: ActivoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateActivoCorriente : addActivoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [valor, setValor] = useState(initialData?.valor?.toString() || "")
  const [cuentaId, setCuentaId] = useState(initialData?.cuenta_id || "")
  const [fechaAdquisicion, setFechaAdquisicion] = useState(initialData?.fecha_adquisicion || "")

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Éxito",
        description: state.message,
        variant: "default",
      })
      onSuccess?.()
    } else if (state?.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast, onSuccess])

  return (
    <form action={formAction} className="grid gap-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          name="descripcion"
          placeholder="Ej: Efectivo en caja, Cuentas por cobrar"
          required
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valor">Valor (USD)</Label>
        <Input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cuenta_id">Cuenta Asociada</Label>
        <Select name="cuenta_id" value={cuentaId} onValueChange={setCuentaId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una cuenta" />
          </SelectTrigger>
          <SelectContent>
            {cuentasFinancieras.map((cuenta) => (
              <SelectItem key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre} ({cuenta.moneda})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_adquisicion">Fecha de Adquisición</Label>
        <Input
          id="fecha_adquisicion"
          name="fecha_adquisicion"
          type="date"
          value={fechaAdquisicion}
          onChange={(e) => setFechaAdquisicion(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Actualizando..."
              : "Añadiendo..."
            : isEditing
              ? "Actualizar Activo"
              : "Añadir Activo"}
        </Button>
      </div>
    </form>
  )
}
