"use client"

import type React from "react"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addPayment, updatePayment } from "@/actions/payment-projection-actions"

interface PaymentFormProps {
  clientId: string
  initialData?: {
    index: number
    fecha: string
    monto: number
    descripcion?: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentForm({ clientId, initialData, onSuccess, onCancel }: PaymentFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePayment : addPayment
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // Ya no es necesario formData.append("cliente_id", clientId) aquí si usamos el input hidden
    if (isEditing && initialData?.index !== undefined) {
      formData.append("index", initialData.index.toString())
    }
    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Campo oculto para cliente_id */}
      <input type="hidden" name="cliente_id" value={clientId} />
      {/* ... (el resto de tu formulario de pago) ... */}
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto">Monto</Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (Opcional)</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Comentarios adicionales"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? "Actualizando..." : "Añadiendo...") : isEditing ? "Actualizar Pago" : "Añadir Pago"}
        </Button>
      </div>
    </form>
  )
}
