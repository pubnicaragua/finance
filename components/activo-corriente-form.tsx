"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addCurrentAsset, updateCurrentAsset } from "@/actions/asset-liability-actions"
import type { TablesUpdate } from "@/lib/database.types"

interface ActivoCorrienteFormProps {
  initialData?: TablesUpdate<"activos_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ActivoCorrienteForm({ initialData, onSuccess, onCancel }: ActivoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateCurrentAsset : addCurrentAsset
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
          placeholder="Ej: Efectivo, Cuentas por Cobrar"
          defaultValue={initialData?.nombre || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">
          Tipo
        </Label>
        <Select name="tipo" defaultValue={initialData?.tipo || "Efectivo"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Efectivo">Efectivo</SelectItem>
            <SelectItem value="Cuentas por Cobrar">Cuentas por Cobrar</SelectItem>
            <SelectItem value="Inventario">Inventario</SelectItem>
            <SelectItem value="Inversiones a Corto Plazo">Inversiones a Corto Plazo</SelectItem>
            <SelectItem value="Otros">Otros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="monto" className="text-right">
          Monto (USD)
        </Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.monto?.toString() || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_adquisicion" className="text-right">
          Fecha Adquisición
        </Label>
        <Input
          id="fecha_adquisicion"
          name="fecha_adquisicion"
          type="date"
          defaultValue={initialData?.fecha_adquisicion || new Date().toISOString().split("T")[0]}
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
          placeholder="Detalles adicionales del activo"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
        />
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
              ? "Actualizar Activo"
              : "Añadir Activo"}
        </Button>
      </div>
    </form>
  )
}
