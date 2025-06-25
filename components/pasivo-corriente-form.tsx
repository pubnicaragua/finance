"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addPasivoCorriente, updatePasivoCorriente } from "@/actions/asset-liability-actions"
import type { Tables } from "@/lib/database.types"

interface CurrentLiabilityFormProps {
  initialData?: Tables<"pasivos_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

// Cambiado de export default function a export function
export function CurrentLiabilityForm({ initialData, onSuccess, onCancel }: CurrentLiabilityFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePasivoCorriente : addPasivoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [montoOriginal, setMontoOriginal] = useState(initialData?.monto_original?.toString() || "")
  const [fechaEmision, setFechaEmision] = useState(initialData?.fecha_emision || "")
  const [fechaVencimiento, setFechaVencimiento] = useState(initialData?.fecha_vencimiento || "")
  const [tasaInteres, setTasaInteres] = useState(initialData?.tasa_interes?.toString() || "")
  const [saldoPendiente, setSaldoPendiente] = useState(initialData?.saldo_pendiente?.toString() || "")
  const [acreedor, setAcreedor] = useState(initialData?.acreedor || "")
  const [tipoPasivo, setTipoPasivo] = useState(initialData?.tipo_pasivo || "")
  const [estado, setEstado] = useState(initialData?.estado || "")
  const [documentosAdjuntos, setDocumentosAdjuntos] = useState(JSON.stringify(initialData?.documentos_adjuntos || []))
  const [notas, setNotas] = useState(initialData?.notas || "")

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
      nombre,
      descripcion,
      monto_original: Number.parseFloat(montoOriginal),
      fecha_emision: fechaEmision,
      fecha_vencimiento: fechaVencimiento,
      tasa_interes: Number.parseFloat(tasaInteres),
      saldo_pendiente: Number.parseFloat(saldoPendiente),
      acreedor,
      tipo_pasivo: tipoPasivo,
      estado,
      documentos_adjuntos: JSON.parse(documentosAdjuntos),
      notas,
      ...(isEditing && { id: initialData?.id }),
    }
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Descripción del pasivo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monto_original">Monto Original</Label>
        <Input
          id="monto_original"
          name="monto_original"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={montoOriginal}
          onChange={(e) => setMontoOriginal(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_emision">Fecha de Emisión</Label>
        <Input
          id="fecha_emision"
          name="fecha_emision"
          type="date"
          required
          value={fechaEmision}
          onChange={(e) => setFechaEmision(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
        <Input
          id="fecha_vencimiento"
          name="fecha_vencimiento"
          type="date"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tasa_interes">Tasa de Interés (%)</Label>
        <Input
          id="tasa_interes"
          name="tasa_interes"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={tasaInteres}
          onChange={(e) => setTasaInteres(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="saldo_pendiente">Saldo Pendiente</Label>
        <Input
          id="saldo_pendiente"
          name="saldo_pendiente"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={saldoPendiente}
          onChange={(e) => setSaldoPendiente(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="acreedor">Acreedor</Label>
        <Input
          id="acreedor"
          name="acreedor"
          placeholder="Nombre del acreedor"
          value={acreedor}
          onChange={(e) => setAcreedor(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo_pasivo">Tipo de Pasivo</Label>
        <Select name="tipo_pasivo" value={tipoPasivo} onValueChange={setTipoPasivo}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cuentas por Pagar">Cuentas por Pagar</SelectItem>
            <SelectItem value="Prestamos Corto Plazo">Préstamos a Corto Plazo</SelectItem>
            <SelectItem value="Impuestos por Pagar">Impuestos por Pagar</SelectItem>
            <SelectItem value="Salarios por Pagar">Salarios por Pagar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Pagado">Pagado</SelectItem>
            <SelectItem value="Vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="documentos_adjuntos">Documentos Adjuntos (JSON)</Label>
        <Textarea
          id="documentos_adjuntos"
          name="documentos_adjuntos"
          placeholder='Ej: [{"nombre": "Contrato", "url": "http://ejemplo.com/contrato.pdf"}]'
          value={documentosAdjuntos}
          onChange={(e) => setDocumentosAdjuntos(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          name="notas"
          placeholder="Notas adicionales sobre el pasivo"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />
      </div>
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
              ? "Actualizar Pasivo"
              : "Añadir Pasivo"}
        </Button>
      </div>
    </form>
  )
}

export function PasivoCorrienteForm(props: CurrentLiabilityFormProps) {
  return CurrentLiabilityForm(props) // re-use existing implementation
}

// 👇 add to bottom
export default PasivoCorrienteForm
