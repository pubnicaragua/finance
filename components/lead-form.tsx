"use client"

import type React from "react"
import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createLead, updateLead } from "@/actions/lead-actions"
import type { Tables } from "@/lib/database.types"

interface LeadFormProps {
  initialData?: Tables<"leads"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function LeadForm({ initialData, onSuccess, onCancel }: LeadFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateLead : createLead
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [telefono, setTelefono] = useState(initialData?.telefono || "")
  const [estado, setEstado] = useState(initialData?.estado || "Nuevo")

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      ...(isEditing && { id: initialData.id }),
      nombre: formData.get("nombre") as string,
      email: formData.get("email") as string,
      telefono: formData.get("telefono") as string,
      estado: formData.get("estado") as string,
    }
    console.log("Client: Submitting data:", data)
    formAction(data)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input id="telefono" name="telefono" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nuevo">Nuevo</SelectItem>
            <SelectItem value="Contactado">Contactado</SelectItem>
            <SelectItem value="Calificado">Calificado</SelectItem>
            <SelectItem value="Convertido">Convertido</SelectItem>
            <SelectItem value="Perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? "Actualizando..." : "Añadiendo...") : isEditing ? "Actualizar Lead" : "Añadir Lead"}
        </Button>
      </div>
    </form>
  )
}
