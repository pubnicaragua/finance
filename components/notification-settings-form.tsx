"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getNotificationSettings, updateNotificationSettings } from "@/actions/team-calendar-actions"
import type { Tables } from "@/lib/database.types"

interface NotificationSettingsFormProps {
  teamMembers: Tables<"miembros_equipo">[]
}

export function NotificationSettingsForm({ teamMembers }: NotificationSettingsFormProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [settings, setSettings] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSettings() {
      if (!selectedMember) {
        setSettings(null)
        return
      }
      
      setLoading(true)
      try {
        const memberSettings = await getNotificationSettings(selectedMember)
        setSettings(memberSettings)
      } catch (error) {
        console.error("Error fetching notification settings:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las configuraciones de notificación",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [selectedMember, toast])

  const handleSubmit = async (formData: FormData) => {
    const result = await updateNotificationSettings(null, formData)
    
    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  if (!teamMembers.length) {
    return (
      <div className="text-center p-4">
        <p>No hay miembros del equipo registrados.</p>
        <p className="text-muted-foreground">Añade miembros al equipo para configurar las notificaciones.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="miembro_id">Selecciona un miembro del equipo</Label>
        <Select 
          value={selectedMember || ""} 
          onValueChange={(value) => setSelectedMember(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un miembro" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.nombre} - {member.cargo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedMember && (
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center p-4">Cargando configuraciones...</div>
            ) : (
              <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="miembro_id" value={selectedMember} />
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notificaciones_activas" 
                    name="notificaciones_activas" 
                    defaultChecked={settings?.notificaciones_activas !== false}
                  />
                  <Label htmlFor="notificaciones_activas">Notificaciones activas</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notificar_sin_asignacion" 
                    name="notificar_sin_asignacion" 
                    defaultChecked={settings?.notificar_sin_asignacion !== false}
                  />
                  <Label htmlFor="notificar_sin_asignacion">
                    Notificar cuando no tenga asignaciones
                  </Label>
                </div>
                
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="tiempo_sin_asignacion">
                    Tiempo sin asignación (horas)
                  </Label>
                  <Input
                    id="tiempo_sin_asignacion"
                    name="tiempo_sin_asignacion"
                    type="number"
                    min="1"
                    defaultValue={settings?.tiempo_sin_asignacion?.replace(' hour', '') || "1"}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notificar_por_email" 
                    name="notificar_por_email" 
                    defaultChecked={settings?.notificar_por_email === true}
                  />
                  <Label htmlFor="notificar_por_email">
                    Enviar notificaciones por email
                  </Label>
                </div>
                
                <Button type="submit" className="w-full">
                  Guardar Configuración
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}