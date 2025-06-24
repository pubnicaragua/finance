"use client"

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { addTransaction, updateTransaction } from "@/actions/transaction-actions"
import type { Tables } from "@/lib/database.types"

interface TransactionFormProps {
  initialData?: Tables<"transacciones"> | null
  cuentasFinancieras: Array<{ id: string; nombre: string; moneda: string }>
  clientes: Array<{ id: string; cliente: string }>
  onSuccess?: () => void
  onCancel?: () => void
}

const expenseCategories = [
  "Salarios",
  "Alquiler",
  "Servicios Públicos",
  "Materiales de Oficina",
  "Marketing",
  "Viajes",
  "Mantenimiento",
  "Software/Suscripciones",
  "Impuestos",
  "Depreciación",
  "Intereses",
  "Otros Gastos Operativos",
]

const incomeCategories = [
  "Venta de Software",
  "Servicios de Consultoría",
  "Licencias",
  "Mantenimiento y Soporte",
  "Desarrollo a Medida",
  "Otros Ingresos",
]

const vendedores = ["Ileana", "Edxel", "Nahuel"]

export function TransactionForm({
  initialData,
  cuentasFinancieras,
  clientes,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateTransaction : addTransaction
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [tipo, setTipo] = useState(initialData?.tipo || "ingreso")
  const [concepto, setConcepto] = useState(initialData?.concepto || "")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [cuentaId, setCuentaId] = useState(initialData?.cuenta_id || "")
  const [detalle, setDetalle] = useState(initialData?.detalle || "")
  const [clienteId, setClienteId] = useState(initialData?.cliente_id || "")
  const [tipoIngreso, setTipoIngreso] = useState(initialData?.tipo_ingreso || "")
  const [tipoEgreso, setTipoEgreso] = useState(initialData?.tipo_egreso || "")
  const [aplicarComision, setAplicarComision] = useState(initialData?.aplicar_comision || false)
  const [vendedorComision, setVendedorComision] = useState(initialData?.vendedor_comision || "N/A")
  const [comisionAplicada, setComisionAplicada] = useState(initialData?.comision_aplicada?.toString() || "")

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

  useEffect(() => {
    if (aplicarComision && tipo === "ingreso") {
      const calculatedCommission = (Number.parseFloat(monto) || 0) * 0.04 // 4% commission
      setComisionAplicada(calculatedCommission.toFixed(2))
    } else {
      setComisionAplicada("")
    }
  }, [aplicarComision, monto, tipo])

  return (
    <form action={formAction} className="grid gap-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Transacción</Label>
        <Select name="tipo" value={tipo} onValueChange={setTipo}>
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
        <Label htmlFor="concepto">Concepto</Label>
        <Input
          id="concepto"
          name="concepto"
          placeholder="Concepto de la transacción"
          required
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <Label htmlFor="fecha">Fecha</Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            required
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cuenta_id">Cuenta Financiera</Label>
        <Select name="cuenta_id" value={cuentaId} onValueChange={setCuentaId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una cuenta" />
          </SelectTrigger>
          <SelectContent>
            {cuentasFinancieras.map((cuenta) => (
              <SelectItem key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre} ({cuenta.moneda})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detalle">Detalle (Opcional)</Label>
        <Textarea
          id="detalle"
          name="detalle"
          placeholder="Detalles adicionales de la transacción"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
        />
      </div>

      {tipo === "ingreso" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente (Opcional)</Label>
            <Select name="cliente_id" value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">N/A</SelectItem>
                {clientes.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo_ingreso">Tipo de Ingreso</Label>
            <Select name="tipo_ingreso" value={tipoIngreso} onValueChange={setTipoIngreso}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo de ingreso" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="aplicar_comision"
              name="aplicar_comision"
              checked={aplicarComision}
              onCheckedChange={(checked) => setAplicarComision(checked as boolean)}
            />
            <Label htmlFor="aplicar_comision">Aplicar Comisión (4%)</Label>
          </div>
          {aplicarComision && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vendedor_comision">Vendedor</Label>
                <Select name="vendedor_comision" value={vendedorComision} onValueChange={setVendedorComision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendedores.map((vendedor) => (
                      <SelectItem key={vendedor} value={vendedor}>
                        {vendedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comision_aplicada">Comisión Aplicada (USD)</Label>
                <Input
                  id="comision_aplicada"
                  name="comision_aplicada"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  readOnly
                  value={comisionAplicada}
                />
              </div>
            </div>
          )}
        </>
      )}

      {tipo === "egreso" && (
        <div className="space-y-2">
          <Label htmlFor="tipo_egreso">Tipo de Egreso</Label>
          <Select name="tipo_egreso" value={tipoEgreso} onValueChange={setTipoEgreso}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tipo de egreso" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
