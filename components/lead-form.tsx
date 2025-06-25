"use client"

import { useActionState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addLead, updateLead } from "@/actions/lead-actions"
import { useToast } from "@/hooks/use-toast"
import type { TablesUpdate } from "@/lib/database.types"

interface LeadFormProps {
  initialData?: TablesUpdate<"leads"> | null
  onSuccess: () => void
  onCancel: () => void
}

export function LeadForm({ initialData, onSuccess, onCancel }: LeadFormProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  // Determinar la acción a usar (añadir o actualizar)
  const actionToUse = initialData ? updateLead : addLead

  // useActionState para manejar el estado de la acción del servidor
  const [state, formAction, isPending] = useActionState(actionToUse, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        onSuccess()
        formRef.current?.reset() // Resetear el formulario al éxito
      }
    }
  }, [state, toast, onSuccess])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 py-4">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nombre" className="text-right">
          Nombre
        </Label>
        <Input id="nombre" name="nombre" defaultValue={initialData?.nombre || ""} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input id="email" name="email" type="email" defaultValue={initialData?.email || ""} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="telefono" className="text-right">
          Teléfono
        </Label>
        <Input id="telefono" name="telefono" defaultValue={initialData?.telefono || ""} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="empresa" className="text-right">
          Empresa
        </Label>
        <Input id="empresa" name="empresa" defaultValue={initialData?.empresa || ""} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estado" className="text-right">
          Estado
        </Label>
        <Select name="estado" defaultValue={initialData?.estado || "Nuevo"}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nuevo">Nuevo</SelectItem>
            <SelectItem value="Contactado">Contactado</SelectItem>
            <SelectItem value="Calificado">Calificado</SelectItem>
            <SelectItem value="No Calificado">No Calificado</SelectItem>
            <SelectItem value="Convertido">Convertido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fuente" className="text-right">
          Fuente
        </Label>
        <Input id="fuente" name="fuente" defaultValue={initialData?.fuente || ""} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notas" className="text-right">
          Notas
        </Label>
        <Textarea id="notas" name="notas" defaultValue={initialData?.notas || ""} className="col-span-3" />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : initialData ? "Actualizar Lead" : "Añadir Lead"}
        </Button>
      </div>
    </form>
  )
}
