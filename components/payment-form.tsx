"use client"

import type React from "react"

import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addPayment, updatePayment } from "@/actions/payment-projection-actions"
import type { Tables } from "@/lib/database.types"

interface PaymentFormProps {
  clienteId: string // Aseguramos que clienteId se reciba como prop
  initialData?: Tables<"clientes">["historial_pagos"][number] & { index?: number }
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentForm({ clienteId, initialData, onSuccess, onCancel }: PaymentFormProps) {
  const isEditing = initialData && typeof initialData.index === "number"
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
    const data = {
      cliente_id: clienteId, // Aseguramos que clienteId se envíe
      fecha,
      monto: Number.parseFloat(monto),
      descripcion,
      ...(isEditing && { index: initialData?.index }),
    }
    console.log("Client: Submitting payment data:", data) // Log para depuración
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" name="fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto">Monto</Label>
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
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          name="descripcion"
          placeholder="Descripción del pago"
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
