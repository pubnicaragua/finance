"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react" // Importar startTransition
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addActivoNoCorriente, updateActivoNoCorriente } from "@/actions/asset-liability-actions"
import type { Tables } from "@/lib/database.types"

interface ActivoNoCorrienteFormProps {
  initialData?: Tables<"activos_no_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function ActivoNoCorrienteForm({ initialData, onSuccess, onCancel }: ActivoNoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateActivoNoCorriente : addActivoNoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [fechaAdquisicion, setFechaAdquisicion] = useState(initialData?.fecha_adquisicion || "")
  const [vidaUtilAnios, setVidaUtilAnios] = useState(initialData?.vida_util_anios?.toString() || "")
  const [valorResidual, setValorResidual] = useState(initialData?.valor_residual?.toString() || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      ...(isEditing && { id: initialData.id }),
      nombre: formData.get("nombre") as string,
      monto: Number.parseFloat(formData.get("monto") as string),
      fecha_adquisicion: formData.get("fecha_adquisicion") as string,
      vida_util_anios: Number.parseInt(formData.get("vida_util_anios") as string),
      valor_residual: Number.parseFloat(formData.get("valor_residual") as string),
      descripcion: formData.get("descripcion") as string,
    }
    console.log("Client: Submitting activo no corriente data:", data)
    startTransition(() => {
      // Envuelve la llamada a formAction en startTransition
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto">Monto (USD)</Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_adquisicion">Fecha de Adquisición</Label>
        <Input
          id="fecha_adquisicion"
          name="fecha_adquisicion"
          type="date"
          required
          value={fechaAdquisicion}
          onChange={(e) => setFechaAdquisicion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vida_util_anios">Vida Útil (años)</Label>
        <Input
          id="vida_util_anios"
          name="vida_util_anios"
          type="number"
          required
          value={vidaUtilAnios}
          onChange={(e) => setVidaUtilAnios(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valor_residual">Valor Residual (USD)</Label>
        <Input
          id="valor_residual"
          name="valor_residual"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={valorResidual}
          onChange={(e) => setValorResidual(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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

export default ActivoNoCorrienteForm
