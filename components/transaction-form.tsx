"use client"

import type React from "react"

import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addTransaction, updateTransaction } from "@/actions/transaction-actions" // CAMBIO: createTransaction a addTransaction
import type { Tables } from "@/lib/database.types"

interface TransactionFormProps {
  initialData?: Tables<"transacciones"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function TransactionForm({ initialData, onSuccess, onCancel }: TransactionFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateTransaction : addTransaction // CAMBIO: createTransaction a addTransaction
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [fecha, setFecha] = useState(initialData?.fecha || new Date().toISOString().split("T")[0])
  const [tipo, setTipo] = useState<Tables<"transacciones">["tipo"]>(initialData?.tipo || "ingreso")
  const [monto, setMonto] = useState(initialData?.monto?.toString() || "")
  const [descripcion, setDescripcion] = useState(initialData?.detalle || "") // Mapear a 'detalle'
  const [concepto, setConcepto] = useState(initialData?.concepto || "") // Nuevo campo 'concepto'
  const [categoria, setCategoria] = useState(initialData?.tipo_ingreso || initialData?.tipo_egreso || "") // Mapear a tipo_ingreso/egreso
  const [aplicarComision, setAplicarComision] = useState(initialData?.aplicar_comision || false)
  const [vendedorComision, setVendedorComision] = useState(initialData?.vendedor_comision || "")
  const [comisionAplicada, setComisionAplicada] = useState(initialData?.comision_aplicada?.toString() || "")

  const vendedores = ["Ileana", "Edxel", "Nahuel"] // Lista de vendedores

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
      fecha,
      tipo,
      monto: Number.parseFloat(monto),
      descripcion, // Se mapea a 'detalle' en la Server Action
      concepto, // Nuevo campo
      categoria, // Se mapea a 'tipo_ingreso' o 'tipo_egreso' en la Server Action
      aplicar_comision: aplicarComision,
      vendedor_comision: aplicarComision ? vendedorComision : null,
      comision_aplicada: aplicarComision ? Number.parseFloat(comisionAplicada) : null,
      ...(isEditing && { id: initialData?.id }),
    }
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
        <Label htmlFor="tipo">Tipo de Transacción</Label>
        <Select name="tipo" value={tipo} onValueChange={(value: Tables<"transacciones">["tipo"]) => setTipo(value)}>
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
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
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
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (Detalle)</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Detalles adicionales de la transacción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoría</Label>
        <Input
          id="categoria"
          name="categoria"
          placeholder="Ej: Desarrollo Web, Gastos Operativos"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
      </div>

      {tipo === "ingreso" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="aplicar_comision"
              checked={aplicarComision}
              onCheckedChange={(checked) => setAplicarComision(!!checked)}
            />
            <Label htmlFor="aplicar_comision">Aplicar Comisión</Label>
          </div>

          {aplicarComision && (
            <>
              <div className="space-y-2">
                <Label htmlFor="vendedor_comision">Vendedor</Label>
                <Select name="vendedor_comision" value={vendedorComision} onValueChange={setVendedorComision}>
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
                  value={comisionAplicada}
                  onChange={(e) => setComisionAplicada(e.target.value)}
                />
              </div>
            </>
          )}
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
