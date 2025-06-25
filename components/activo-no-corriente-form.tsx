"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addActivoNoCorriente, updateActivoNoCorriente } from "@/actions/asset-liability-actions"
import type { Tables } from "@/lib/database.types"

interface ActivoNoCorrienteFormProps {
  initialData?: Tables<"activos_no_corrientes"> | null
  onSuccess?: () => void
  onCancel?: () => void
}

// Cambiado de export default function a export function
export function ActivoNoCorrienteForm({ initialData, onSuccess, onCancel }: ActivoNoCorrienteFormProps) {
  const isEditing = !!initialData
  const action = isEditing ? updateActivoNoCorriente : addActivoNoCorriente
  const [state, formAction, isPending] = useActionState(action, null)
  const { toast } = useToast()

  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [valorAdquisicion, setValorAdquisicion] = useState(initialData?.valor_adquisicion?.toString() || "")
  const [fechaAdquisicion, setFechaAdquisicion] = useState(initialData?.fecha_adquisicion || "")
  const [vidaUtilAnios, setVidaUtilAnios] = useState(initialData?.vida_util_anios?.toString() || "")
  const [valorResidual, setValorResidual] = useState(initialData?.valor_residual?.toString() || "")
  const [metodoDepreciacion, setMetodoDepreciacion] = useState(initialData?.metodo_depreciacion || "")
  const [depreciacionAcumulada, setDepreciacionAcumulada] = useState(
    initialData?.depreciacion_acumulada?.toString() || "",
  )
  const [valorEnLibros, setValorEnLibros] = useState(initialData?.valor_en_libros?.toString() || "")
  const [estado, setEstado] = useState(initialData?.estado || "")
  const [ubicacion, setUbicacion] = useState(initialData?.ubicacion || "")
  const [numeroSerie, setNumeroSerie] = useState(initialData?.numero_serie || "")
  const [responsable, setResponsable] = useState(initialData?.responsable || "")
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
      valor_adquisicion: Number.parseFloat(valorAdquisicion),
      fecha_adquisicion: fechaAdquisicion,
      vida_util_anios: Number.parseInt(vidaUtilAnios),
      valor_residual: Number.parseFloat(valorResidual),
      metodo_depreciacion: metodoDepreciacion,
      depreciacion_acumulada: Number.parseFloat(depreciacionAcumulada),
      valor_en_libros: Number.parseFloat(valorEnLibros),
      estado,
      ubicacion,
      numero_serie: numeroSerie,
      responsable,
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
          placeholder="Descripción del activo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valor_adquisicion">Valor de Adquisición</Label>
        <Input
          id="valor_adquisicion"
          name="valor_adquisicion"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          value={valorAdquisicion}
          onChange={(e) => setValorAdquisicion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha_adquisicion">Fecha de Adquisición</Label>
        <Input
          id="fecha_adquisicion"
          name="fecha_adquisicion"
          type="date"
          required
          value={fechaAdquisicion}
          onChange={(e) => setFechaAdquisicion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vida_util_anios">Vida Útil (Años)</Label>
        <Input
          id="vida_util_anios"
          name="vida_util_anios"
          type="number"
          step="1"
          placeholder="0"
          value={vidaUtilAnios}
          onChange={(e) => setVidaUtilAnios(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valor_residual">Valor Residual</Label>
        <Input
          id="valor_residual"
          name="valor_residual"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={valorResidual}
          onChange={(e) => setValorResidual(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="metodo_depreciacion">Método de Depreciación</Label>
        <Select name="metodo_depreciacion" value={metodoDepreciacion} onValueChange={setMetodoDepreciacion}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Linea Recta">Línea Recta</SelectItem>
            <SelectItem value="Unidades de Produccion">Unidades de Producción</SelectItem>
            <SelectItem value="Suma de Digitos">Suma de Dígitos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="depreciacion_acumulada">Depreciación Acumulada</Label>
        <Input
          id="depreciacion_acumulada"
          name="depreciacion_acumulada"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={depreciacionAcumulada}
          onChange={(e) => setDepreciacionAcumulada(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valor_en_libros">Valor en Libros</Label>
        <Input
          id="valor_en_libros"
          name="valor_en_libros"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={valorEnLibros}
          onChange={(e) => setValorEnLibros(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Select name="estado" value={estado} onValueChange={setEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Vendido">Vendido</SelectItem>
            <SelectItem value="Dado de Baja">Dado de Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ubicacion">Ubicación</Label>
        <Input
          id="ubicacion"
          name="ubicacion"
          placeholder="Ubicación física del activo"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="numero_serie">Número de Serie</Label>
        <Input
          id="numero_serie"
          name="numero_serie"
          placeholder="Número de serie o identificación"
          value={numeroSerie}
          onChange={(e) => setNumeroSerie(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="responsable">Responsable</Label>
        <Input
          id="responsable"
          name="responsable"
          placeholder="Persona o departamento responsable"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="documentos_adjuntos">Documentos Adjuntos (JSON)</Label>
        <Textarea
          id="documentos_adjuntos"
          name="documentos_adjuntos"
          placeholder='Ej: [{"nombre": "Factura", "url": "http://ejemplo.com/factura.pdf"}]'
          value={documentosAdjuntos}
          onChange={(e) => setDocumentosAdjuntos(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          name="notas"
          placeholder="Notas adicionales sobre el activo"
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
              ? "Actualizar Activo"
              : "Añadir Activo"}
        </Button>
      </div>
    </form>
  )
}

export default ActivoNoCorrienteForm
