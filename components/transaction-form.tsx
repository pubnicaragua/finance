"use client"

import { useActionState, useEffect, useState } from "react"
import { createTransaction, updateTransaction } from "@/actions/transaction-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client"
import type { Tables } from "@/lib/database.types"

interface TransactionFormProps {
  initialData?: Tables<"transacciones">
  onSuccess?: () => void
}

export function TransactionForm({ initialData, onSuccess }: TransactionFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateTransaction : createTransaction
  const [state, formAction, isPending] = useActionState(action, null)
  const [transactionType, setTransactionType] = useState<"ingreso" | "egreso">(initialData?.tipo ?? "ingreso")
  const [applyCommission, setApplyCommission] = useState(initialData?.aplicar_comision ?? false)
  const [clientes, setClientes] = useState<Tables<"clientes">[]>([])
  const [cuentas, setCuentas] = useState<Tables<"cuentas_financieras">[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createBrowserSupabaseClient()
      const { data: cData } = await supabase.from("clientes").select("id, cliente")
      const { data: aData } = await supabase.from("cuentas_financieras").select("id, nombre")
      setClientes(cData ?? [])
      setCuentas(aData ?? [])
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Éxito", description: state.message })
      onSuccess?.()
    } else if (state?.success === false) {
      toast({ title: "Error", description: state.message, variant: "destructive" })
    }
  }, [state, onSuccess])

  return (
    <form action={formAction} className="grid gap-4 py-4">
      {isEditing && <Input type="hidden" name="id" defaultValue={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">
          Tipo
        </Label>
        <Select
          name="tipo"
          defaultValue={transactionType}
          onValueChange={(value) => setTransactionType(value as "ingreso" | "egreso")}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="concepto" className="text-right">
          Concepto
        </Label>
        <Input
          id="concepto"
          name="concepto"
          defaultValue={initialData?.concepto ?? ""}
          className="col-span-3"
          required
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
          defaultValue={initialData?.monto ?? 0}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha" className="text-right">
          Fecha
        </Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          defaultValue={initialData?.fecha ?? new Date().toISOString().split("T")[0]}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cuenta_id" className="text-right">
          Cuenta
        </Label>
        <Select name="cuenta_id" defaultValue={initialData?.cuenta_id ?? ""}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Cuenta" />
          </SelectTrigger>
          <SelectContent>
            {cuentas.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="detalle" className="text-right">
          Detalle
        </Label>
        <Textarea id="detalle" name="detalle" defaultValue={initialData?.detalle ?? ""} className="col-span-3" />
      </div>

      {transactionType === "ingreso" && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cliente_id" className="text-right">
              Cliente
            </Label>
            <Select name="cliente_id" defaultValue={initialData?.cliente_id ?? "N/A"}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">N/A</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="aplicar_comision" className="text-right">
              Aplicar Comisión
            </Label>
            <Checkbox
              id="aplicar_comision"
              name="aplicar_comision"
              checked={applyCommission}
              onCheckedChange={setApplyCommission}
              className="col-span-3"
            />
          </div>
        </>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : isEditing ? "Actualizar" : "Añadir"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default TransactionForm
