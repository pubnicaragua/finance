"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addNonCurrentAsset, updateNonCurrentAsset } from "@/actions/asset-liability-actions"
import type { TablesUpdate } from "@/lib/database.types"

interface ActivoNoCorrienteFormProps {
  initialData?: TablesUpdate<"activos_no_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ActivoNoCorrienteForm({ initialData, onSuccess, onCancel }: ActivoNoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateNonCurrentAsset : addNonCurrentAsset
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
          placeholder="Ej: Edificios, Maquinaria"
          defaultValue={initialData?.nombre || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">
          Tipo
        </Label>
        <Select name="tipo" defaultValue={initialData?.tipo || "Propiedad, Planta y Equipo"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Propiedad, Planta y Equipo">Propiedad, Planta y Equipo</SelectItem>
            <SelectItem value="Activos Intangibles">Activos Intangibles</SelectItem>
            <SelectItem value="Inversiones a Largo Plazo">Inversiones a Largo Plazo</SelectItem>
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
        <Label htmlFor="vida_util_anios" className="text-right">
          Vida Útil (Años)
        </Label>
        <Input
          id="vida_util_anios"
          name="vida_util_anios"
          type="number"
          step="1"
          placeholder="Ej: 10"
          defaultValue={initialData?.vida_util_anios?.toString() || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="valor_residual" className="text-right">
          Valor Residual (USD)
        </Label>
        <Input
          id="valor_residual"
          name="valor_residual"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.valor_residual?.toString() || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="depreciacion_acumulada" className="text-right">
          Depreciación Acumulada (USD)
        </Label>
        <Input
          id="depreciacion_acumulada"
          name="depreciacion_acumulada"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.depreciacion_acumulada?.toString() || ""}
          className="col-span-3"
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
