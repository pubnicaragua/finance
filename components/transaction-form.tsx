"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react" // Importar startTransition
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createTransaction, updateTransaction } from "@/actions/transaction-actions"
import type { Tables } from "@/lib/database.types"

interface TransactionFormProps {
  initialData?: Tables<"transacciones"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function TransactionForm({ initialData, onSuccess, onCancel }: TransactionFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateTransaction : createTransaction
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [tipo, setTipo] = useState<"ingreso" | "egreso">(initialData?.tipo || "ingreso")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [vendedor, setVendedor] = useState(initialData?.vendedor || "")
  const [comision, setComision] = useState(initialData?.comision?.toString() || "")

  const showComisionFields = tipo === "ingreso"

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
      fecha: formData.get("fecha") as string,
      tipo: formData.get("tipo") as "ingreso" | "egreso",
      monto: Number.parseFloat(formData.get("monto") as string),
      descripcion: formData.get("descripcion") as string,
      categoria: formData.get("categoria") as string,
      vendedor: showComisionFields ? (formData.get("vendedor") as string) : null,
      comision: showComisionFields ? Number.parseFloat(formData.get("comision") as string) : null,
    }
    console.log("Client: Submitting data:", data)
    startTransition(() => {
      // Envuelve la llamada a formAction en startTransition
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          required
          defaultValue={initialData?.fecha || new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select name="tipo" value={tipo} onValueChange={(value) => setTipo(value as "ingreso" | "egreso")}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="descripcion">Descripción</Label>
        <Input id="descripcion" name="descripcion" required defaultValue={initialData?.descripcion || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoría</Label>
        <Input id="categoria" name="categoria" required defaultValue={initialData?.categoria || ""} />
      </div>

      {showComisionFields && (
        <>
          <div className="space-y-2">
            <Label htmlFor="vendedor">Vendedor</Label>
            <Select name="vendedor" value={vendedor} onValueChange={setVendedor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ileana">Ileana</SelectItem>
                <SelectItem value="Edxel">Edxel</SelectItem>
                <SelectItem value="Nahuel">Nahuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comision">Comisión (%)</Label>
            <Input
              id="comision"
              name="comision"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={comision}
              onChange={(e) => setComision(e.target.value)}
            />
          </div>
        </>
      )}

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
              ? "Actualizar Transacción"
              : "Añadir Transacción"}
        </Button>
      </div>
    </form>
  )
}

export default TransactionForm // Añadido export default
