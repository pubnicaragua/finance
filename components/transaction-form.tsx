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

export default function TransactionForm({ initialData, onSuccess }: TransactionFormProps) {
  // Restablecido a exportación por defecto
  const isEditing = !!initialData
  const action = isEditing ? updateTransaction : createTransaction
  const [state, formAction, isPending] = useActionState(action, null)
  const [transactionType, setTransactionType] = useState(initialData?.tipo || "ingreso")
  const [applyCommission, setApplyCommission] = useState(initialData?.aplicar_comision || false)
  const [clientes, setClientes] = useState<Tables<"clientes">[]>([])
  const [cuentas, setCuentas] = useState<Tables<"cuentas_financieras">[]>([])

  useEffect(() => {
    const fetchDependencies = async () => {
      const supabase = createBrowserSupabaseClient()
      const { data: clientesData, error: clientesError } = await supabase.from("clientes").select("id, cliente")
      const { data: cuentasData, error: cuentasError } = await supabase.from("cuentas_financieras").select("id, nombre")

      if (clientesError) console.error("Error fetching clients:", clientesError)
      if (cuentasError) console.error("Error fetching accounts:", cuentasError)

      setClientes(clientesData || [])
      setCuentas(cuentasData || [])
    }
    fetchDependencies()
  }, [])

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Éxito",
        description: state.message,
        variant: "default",
      })
      onSuccess?.()
    } else if (state?.success === false) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
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
          defaultValue={initialData?.tipo || "ingreso"}
          onValueChange={(value: "ingreso" | "egreso") => setTransactionType(value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona tipo" />
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
          defaultValue={initialData?.concepto || ""}
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
          defaultValue={initialData?.monto || 0}
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
          defaultValue={initialData?.fecha || new Date().toISOString().split("T")[0]}
          className="col-span-3"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cuenta_id" className="text-right">
          Cuenta
        </Label>
        <Select name="cuenta_id" defaultValue={initialData?.cuenta_id || ""}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona cuenta" />
          </SelectTrigger>
          <SelectContent>
            {cuentas.map((cuenta) => (
              <SelectItem key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="detalle" className="text-right">
          Detalle
        </Label>
        <Textarea id="detalle" name="detalle" defaultValue={initialData?.detalle || ""} className="col-span-3" />
      </div>

      {transactionType === "ingreso" && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cliente_id" className="text-right">
              Cliente (Opcional)
            </Label>
            <Select name="cliente_id" defaultValue={initialData?.cliente_id || "N/A"}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">N/A</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipo_ingreso" className="text-right">
              Tipo Ingreso
            </Label>
            <Select name="tipo_ingreso" defaultValue={initialData?.tipo_ingreso || "Venta de Software"}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona tipo de ingreso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Venta de Software">Venta de Software</SelectItem>
                <SelectItem value="Servicios de Consultoría">Servicios de Consultoría</SelectItem>
                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
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
              onCheckedChange={(checked) => setApplyCommission(!!checked)}
              className="col-span-3"
            />
          </div>
          {applyCommission && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vendedor_comision" className="text-right">
                Vendedor Comisión
              </Label>
              <Select name="vendedor_comision" defaultValue={initialData?.vendedor_comision || "N/A"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="Ileana">Ileana</SelectItem>
                  <SelectItem value="Edxel">Edxel</SelectItem>
                  <SelectItem value="Nahuel">Nahuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {applyCommission && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comision_aplicada" className="text-right">
                Comisión Aplicada
              </Label>
              <Input
                id="comision_aplicada"
                name="comision_aplicada"
                type="number"
                step="0.01"
                defaultValue={initialData?.comision_aplicada || 0}
                className="col-span-3"
              />
            </div>
          )}
        </>
      )}

      {transactionType === "egreso" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tipo_egreso" className="text-right">
            Tipo Egreso
          </Label>
          <Select name="tipo_egreso" defaultValue={initialData?.tipo_egreso || "Salarios"}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecciona tipo de egreso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Salarios">Salarios</SelectItem>
              <SelectItem value="Herramientas">Herramientas</SelectItem>
              <SelectItem value="Servidores">Servidores</SelectItem>
              <SelectItem value="Dominios">Dominios</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Oficina">Oficina</SelectItem>
              <SelectItem value="Viajes">Viajes</SelectItem>
              <SelectItem value="Impuestos">Impuestos</SelectItem>
              <SelectItem value="Otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : isEditing ? "Actualizar Transacción" : "Añadir Transacción"}
        </Button>
      </DialogFooter>
    </form>
  )
}
