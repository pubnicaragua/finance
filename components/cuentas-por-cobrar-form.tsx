"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { revalidatePath } from "next/cache"
import type { Tables } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/server"

interface CuentasPorCobrarFormProps {
  clients: Tables<"clientes">[]
  initialData?: {
    cliente_id: string
    index?: number
    fecha?: string
    monto?: number
    estado?: string
    descripcion?: string
  } | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function CuentasPorCobrarForm({ clients, initialData, onSuccess, onCancel }: CuentasPorCobrarFormProps) {
  const isEditing = !!initialData?.index !== undefined
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    try {
      const cliente_id = formData.get("cliente_id") as string
      const fecha = formData.get("fecha") as string
      const monto = Number.parseFloat(formData.get("monto") as string)
      const estado = formData.get("estado") as string
      const descripcion = formData.get("descripcion") as string
      const index = formData.get("index") ? Number.parseInt(formData.get("index") as string) : undefined
      
      if (!cliente_id || !fecha || isNaN(monto)) {
        toast({
          title: "Error",
          description: "Todos los campos son obligatorios",
          variant: "destructive",
        })
        return
      }
      
      const supabase = await createClient()
      
      // Obtener proyecciones actuales
      const { data: client } = await supabase
        .from("clientes")
        .select("proyeccion_pagos")
        .eq("id", cliente_id)
        .single()
      
      if (!client) {
        toast({
          title: "Error",
          description: "Cliente no encontrado",
          variant: "destructive",
        })
        return
      }
      
      const currentProjections = (client.proyeccion_pagos || []) as Array<any>
      let updatedProjections = [...currentProjections]
      
      const newProjection = { 
        fecha, 
        monto, 
        estado: estado || "Pendiente",
        descripcion: descripcion || null 
      }
      
      if (isEditing && index !== undefined) {
        // Actualizar proyección existente
        updatedProjections[index] = newProjection
      } else {
        // Añadir nueva proyección
        updatedProjections.push(newProjection)
      }
      
      // Actualizar el cliente
      const { error } = await supabase
        .from("clientes")
        .update({ proyeccion_pagos: updatedProjections })
        .eq("id", cliente_id)
      
      if (error) {
        toast({
          title: "Error",
          description: `Error al ${isEditing ? 'actualizar' : 'añadir'} cuenta por cobrar: ${error.message}`,
          variant: "destructive",
        })
        return
      }
      
      toast({
        title: "Éxito",
        description: `Cuenta por cobrar ${isEditing ? 'actualizada' : 'añadida'} exitosamente.`,
      })
      
      // Revalidar rutas
      revalidatePath("/cuentas-por-cobrar")
      revalidatePath(`/clients/${cliente_id}`)
      
      if (onSuccess) {
        onSuccess()
      }
      
      if (!isEditing) {
        formRef.current?.reset()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error inesperado: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4 py-4">
      {initialData?.index !== undefined && (
        <input type="hidden" name="index" value={initialData.index} />
      )}
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cliente_id" className="text-right">
          Cliente
        </Label>
        <Select 
          name="cliente_id" 
          defaultValue={initialData?.cliente_id || ""}
          disabled={isEditing}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.cliente} - {client.proyecto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Label htmlFor="monto" className="text-right">
          Monto (USD)
        </Label>
        <Input
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue={initialData?.monto?.toString() || ""}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estado" className="text-right">
          Estado
        </Label>
        <Select name="estado" defaultValue={initialData?.estado || "Pendiente"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Pagado">Pagado</SelectItem>
            <SelectItem value="Vencido">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descripcion" className="text-right">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          placeholder="Descripción de la cuenta por cobrar"
          defaultValue={initialData?.descripcion || ""}
          className="col-span-3"
        />
      </div>
      
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
              ? "Actualizar Cuenta"
              : "Añadir Cuenta"}
        </Button>
      </div>
    </form>
  )
}