"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addAlcance, updateAlcance } from "@/actions/project-updates-actions"
import { useToast } from "@/hooks/use-toast"
import { DialogFooter } from "@/components/ui/dialog"
import type { TablesUpdate } from "@/lib/database.types"

interface AlcanceFormProps {
  initialData?: TablesUpdate<"alcances_desarrollo"> & { id: string }
  clienteId: string
  onSuccess: (message: string) => void
}

export function AlcanceForm({ initialData, clienteId, onSuccess }: AlcanceFormProps) {
  const [state, formAction] = useActionState(initialData ? updateAlcance : addAlcance, { success: false, message: "" })
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [nombreModulo, setNombreModulo] = useState(initialData?.nombre_modulo || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [fechaImplementacion, setFechaImplementacion] = useState(initialData?.fecha_implementacion || "")
  const [estado, setEstado] = useState(initialData?.estado || "Pendiente")

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
      nombre_modulo: nombreModulo,
      descripcion,
      fecha_implementacion: fechaImplementacion,
      estado,
      ...(initialData && { id: initialData.id }), // Solo si es una actualización
    }
    console.log("Data to send from AlcanceForm:", dataToSend) // Depuración
    startTransition(() => {
      formAction(dataToSend)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input type="hidden" name="cliente_id" value={clienteId} /> {/* Hidden input for cliente_id */}
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre_modulo" className="text-right">
          Módulo
        </Label>
        <Input
          id="nombre_modulo"
          name="nombre_modulo"
          value={nombreModulo}
          onChange={(e) => setNombreModulo(e.target.value)}
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
        <Label htmlFor="fecha_implementacion" className="text-right">
          Fecha Implementación
        </Label>
        <Input
          id="fecha_implementacion"
          name="fecha_implementacion"
          type="date"
          value={fechaImplementacion}
          onChange={(e) => setFechaImplementacion(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estado" className="text-right">
          Estado
        </Label>
        <Select value={estado} onValueChange={setEstado} name="estado">
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En Progreso">En Progreso</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : initialData ? "Actualizar Alcance" : "Añadir Alcance"}
        </Button>
      </DialogFooter>
    </form>
  )
}
