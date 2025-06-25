"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addPayment, updatePayment } from "@/actions/payment-projection-actions"
import type { Tables } from "@/lib/database.types"

interface PaymentFormProps {
  initialData?: Tables<"pagos"> | null
  clienteId: string // Aseguramos que clienteId siempre se pase
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentForm({ initialData, clienteId, onSuccess, onCancel }: PaymentFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePayment : addPayment
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
      <input type="hidden" name="cliente_id" value={clienteId} /> {/* CAMBIO: Añadir cliente_id oculto */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha_pago" className="text-right">
          Fecha de Pago
        </Label>
        <Input
          id="fecha_pago"
          name="fecha_pago"
          type="date"
          defaultValue={initialData?.fecha_pago || new Date().toISOString().split("T")[0]}
          className="col-span-3"
          required
        />
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
        <Label htmlFor="metodo_pago" className="text-right">
          Método de Pago
        </Label>
        <Input
          id="metodo_pago"
          name="metodo_pago"
          placeholder="Ej: Transferencia, Efectivo"
          defaultValue={initialData?.metodo_pago || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="referencia" className="text-right">
          Referencia
        </Label>
        <Input
          id="referencia"
          name="referencia"
          placeholder="Número de transacción, factura"
          defaultValue={initialData?.referencia || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notas" className="text-right">
          Notas
        </Label>
        <Textarea
          id="notas"
          name="notas"
          placeholder="Notas adicionales sobre el pago"
          defaultValue={initialData?.notas || ""}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? "Actualizando..." : "Añadiendo...") : isEditing ? "Actualizar Pago" : "Añadir Pago"}
        </Button>
      </div>
    </form>
  )
}
