"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addTransaction, updateTransaction } from "@/actions/transaction-actions"
import type { TablesUpdate } from "@/lib/database.types"

interface TransactionFormProps {
  initialData?: TablesUpdate<"transacciones"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function TransactionForm({ initialData, onSuccess, onCancel }: TransactionFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateTransaction : addTransaction
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

  const vendedores = ["Ileana", "Edxel", "Nahuel"] // Lista de vendedores

  // Valores por defecto para los campos controlados si no hay initialData
  const defaultTipo = initialData?.tipo || "ingreso"
  const defaultCategoria = initialData?.tipo_ingreso || initialData?.tipo_egreso || ""
  const defaultAplicarComision = initialData?.aplicar_comision || false
  const defaultVendedorComision = initialData?.vendedor_comision || ""
  const defaultComisionAplicada = initialData?.comision_aplicada?.toString() || ""

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}
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
        <Label htmlFor="tipo">Tipo de Transacción</Label>
        <Select name="tipo" defaultValue={defaultTipo}>
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
          placeholder="Ej: Venta de Software, Salario, Alquiler"
          required
          defaultValue={initialData?.concepto || ""}
        />
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
          defaultValue={initialData?.monto?.toString() || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (Detalle)</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Detalles adicionales de la transacción"
          defaultValue={initialData?.detalle || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoría</Label>
        <Input
          id="categoria"
          name="categoria"
          placeholder="Ej: Desarrollo Web, Gastos Operativos"
          defaultValue={defaultCategoria}
        />
      </div>

      {/* Lógica de comisión basada en el tipo de transacción (asumiendo que solo aplica a ingresos) */}
      {defaultTipo === "ingreso" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox id="aplicar_comision" name="aplicar_comision" defaultChecked={defaultAplicarComision} />
            <Label htmlFor="aplicar_comision">Aplicar Comisión</Label>
          </div>

          {defaultAplicarComision && ( // Esto es un problema, el estado de la checkbox no es reactivo aquí
            <>
              <div className="space-y-2">
                <Label htmlFor="vendedor_comision">Vendedor</Label>
                <Select name="vendedor_comision" defaultValue={defaultVendedorComision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un vendedor" />
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
                <Label htmlFor="comision_aplicada">Monto de Comisión</Label>
                <Input
                  id="comision_aplicada"
                  name="comision_aplicada"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue={defaultComisionAplicada}
                />
              </div>
            </>
          )}
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
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
