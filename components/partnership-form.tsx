"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react" // Importar startTransition
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addPartnership, updatePartnership } from "@/actions/partnership-actions"
import type { Tables } from "@/lib/database.types"

interface PartnershipFormProps {
  initialData?: Tables<"partnerships"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function PartnershipForm({ initialData, onSuccess, onCancel }: PartnershipFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updatePartnership : addPartnership
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [contacto, setContacto] = useState(initialData?.contacto || "")
  const [tipo, setTipo] = useState(initialData?.tipo || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")

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
      contacto: formData.get("contacto") as string,
      tipo: formData.get("tipo") as string,
      descripcion: formData.get("descripcion") as string,
    }
    console.log("Client: Submitting partnership data:", data)
    startTransition(() => {
      // Envuelve la llamada a formAction en startTransition
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
        <Label htmlFor="contacto">Contacto</Label>
        <Input id="contacto" name="contacto" required value={contacto} onChange={(e) => setContacto(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Input id="tipo" name="tipo" required value={tipo} onChange={(e) => setTipo(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
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
              ? "Actualizar Partnership"
              : "Añadir Partnership"}
        </Button>
      </div>
    </form>
  )
}
