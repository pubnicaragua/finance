"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addTransaction, updateTransaction } from "@/actions/transaction-actions"
import type { TablesUpdate } from "@/lib/database.types"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  
  // State for form fields that need reactivity
  const [tipo, setTipo] = useState(initialData?.tipo || "ingreso")
  const [aplicarComision, setAplicarComision] = useState(initialData?.aplicar_comision || false)

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

  const vendedores = ["Ileana", "Edxel", "Alejandro", "Nahuel", "Antonella", "Maria", "Carlos", "Pejota", "Gorrasnic", "Alba", "Roni"] 

  return (
    <ScrollArea className="max-h-[70vh]">
      <form ref={formRef} action={formAction} className="grid gap-4 py-4 px-1">
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
          <Select 
            name="tipo" 
            defaultValue={tipo}
            onValueChange={(value) => setTipo(value as "ingreso" | "egreso")}
          >
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
          {tipo === "ingreso" ? (
            <Select name="categoria" defaultValue={initialData?.tipo_ingreso || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bono_inicial">Bono Inicial</SelectItem>
                <SelectItem value="abono_cliente">Abono Cliente</SelectItem>
                <SelectItem value="soporte">Soporte</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select name="categoria" defaultValue={initialData?.tipo_egreso || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasto">Gasto</SelectItem>
                <SelectItem value="costo_operativo">Costo Operativo</SelectItem>
                <SelectItem value="salario">Salario</SelectItem>
                <SelectItem value="viatico">Viático</SelectItem>
                <SelectItem value="gasto_oficina">Gasto Oficina</SelectItem>
                <SelectItem value="comisiones">Comisiones</SelectItem>
                <SelectItem value="anticipo">Anticipo</SelectItem>
                <SelectItem value="prestamo">Préstamo</SelectItem>
                <SelectItem value="publicidad">Publicidad</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {tipo === "ingreso" && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="aplicar_comision" 
                name="aplicar_comision" 
                checked={aplicarComision}
                onCheckedChange={(checked) => setAplicarComision(checked as boolean)}
              />
              <Label htmlFor="aplicar_comision">Aplicar Comisión</Label>
            </div>

            {aplicarComision && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="vendedor_comision">Vendedor</Label>
                  <Select name="vendedor_comision" defaultValue={initialData?.vendedor_comision || ""}>
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
                    defaultValue={initialData?.comision_aplicada?.toString() || ""}
                  />
                </div>
              </>
            )}
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
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
    </ScrollArea>
  )
}