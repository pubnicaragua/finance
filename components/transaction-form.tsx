"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTransaction, updateTransaction } from "@/actions/transaction-actions"
import { useToast } from "@/hooks/use-toast"
import type { TablesUpdate } from "@/lib/database.types"

interface TransactionFormProps {
  initialData?: TablesUpdate<"transacciones"> | null
  onSuccess: () => void
  onCancel: () => void
}

export function TransactionForm({ initialData, onSuccess, onCancel }: TransactionFormProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const actionToUse = initialData ? updateTransaction : addTransaction

  const [state, formAction, isPending] = useActionState(actionToUse, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        onSuccess()
        formRef.current?.reset()
      }
    }
  }, [state, toast, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha" className="text-right">
          Fecha
        </Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          defaultValue={initialData?.fecha || new Date().toISOString().split("T")[0]}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">
          Tipo
        </Label>
        <Select name="tipo" defaultValue={initialData?.tipo || "Ingreso"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ingreso">Ingreso</SelectItem>
            <SelectItem value="Egreso">Egreso</SelectItem>
            <SelectItem value="Transferencia">Transferencia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoria" className="text-right">
          Categoría
        </Label>
        <Input
          id="categoria"
          name="categoria"
          defaultValue={initialData?.categoria || ""}
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
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="monto" className="text-right">
          Monto
        </Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          defaultValue={initialData?.monto || ""}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cuenta_origen_id" className="text-right">
          Cuenta Origen
        </Label>
        <Input
          id="cuenta_origen_id"
          name="cuenta_origen_id"
          defaultValue={initialData?.cuenta_origen_id || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cuenta_destino_id" className="text-right">
          Cuenta Destino
        </Label>
        <Input
          id="cuenta_destino_id"
          name="cuenta_destino_id"
          defaultValue={initialData?.cuenta_destino_id || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cliente_id" className="text-right">
          ID Cliente
        </Label>
        <Input id="cliente_id" name="cliente_id" defaultValue={initialData?.cliente_id || ""} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="proyecto_id" className="text-right">
          ID Proyecto
        </Label>
        <Input
          id="proyecto_id"
          name="proyecto_id"
          defaultValue={initialData?.proyecto_id || ""}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : initialData ? "Actualizar Transacción" : "Añadir Transacción"}
        </Button>
      </div>
    </form>
  )
}
