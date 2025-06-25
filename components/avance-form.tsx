"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addAvance, updateAvance } from "@/actions/project-updates-actions"
import { useToast } from "@/hooks/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import type { TablesUpdate } from "@/lib/database.types"

interface AvanceFormProps {
  initialData?: TablesUpdate<"avances_proyecto"> & { id: string }
  clienteId: string
  onSuccess: (message: string) => void
}

export function AvanceForm({ initialData, clienteId, onSuccess }: AvanceFormProps) {
  const [state, formAction] = useActionState(initialData ? updateAvance : addAvance, { success: false, message: "" })
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [porcentajeAvance, setPorcentajeAvance] = useState(initialData?.porcentaje_avance?.toString() || "")
  const [comentariosCliente, setComentariosCliente] = useState(initialData?.comentarios_cliente || "")

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        onSuccess(state.message)
      }
    }
  }, [state, toast, onSuccess])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const dataToSend = {
      cliente_id: clienteId, // Aseguramos que cliente_id siempre se envíe
      fecha,
      descripcion,
      porcentaje_avance: Number.parseFloat(porcentajeAvance),
      comentarios_cliente: comentariosCliente,
      ...(initialData && { id: initialData.id }), // Solo si es una actualización
    }
    console.log("Data to send from AvanceForm:", dataToSend) // Depuración
    startTransition(() => {
      formAction(dataToSend)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input type="hidden" name="cliente_id" value={clienteId} /> {/* Hidden input for cliente_id */}
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fecha" className="text-right">
          Fecha
        </Label>
        <Input
          id="fecha"
          name="fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
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
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="porcentaje_avance" className="text-right">
          % Avance
        </Label>
        <Input
          id="porcentaje_avance"
          name="porcentaje_avance"
          type="number"
          step="0.01"
          value={porcentajeAvance}
          onChange={(e) => setPorcentajeAvance(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="comentarios_cliente" className="text-right">
          Comentarios Cliente
        </Label>
        <Textarea
          id="comentarios_cliente"
          name="comentarios_cliente"
          value={comentariosCliente}
          onChange={(e) => setComentariosCliente(e.target.value)}
          className="col-span-3"
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : initialData ? "Actualizar Avance" : "Añadir Avance"}
        </Button>
      </DialogFooter>
    </form>
  )
}
