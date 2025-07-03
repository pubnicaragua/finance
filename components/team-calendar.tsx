"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AssignmentForm } from "@/components/assignment-form"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { Tables } from "@/lib/database.types"

interface TeamCalendarProps {
  teamMembers: Tables<"miembros_equipo">[]
  assignments: any[] // Incluye relaciones anidadas
  clients: Tables<"clientes">[]
}

export function TeamCalendar({ teamMembers, assignments, clients }: TeamCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [view, setView] = useState<"calendar" | "list">("calendar")
  
  // Filtrar asignaciones por miembro si hay uno seleccionado
  const filteredAssignments = selectedMember 
    ? assignments.filter(a => a.miembro_id === selectedMember)
    : assignments
  
  // Navegar entre meses
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  
  // Obtener días del mes actual
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })
  
  // Función para obtener asignaciones de un día específico
  const getAssignmentsForDay = (day: Date) => {
    return filteredAssignments.filter(assignment => {
      const start = new Date(assignment.fecha_inicio)
      const end = new Date(assignment.fecha_fin)
      
      // Comprobar si el día está dentro del rango de la asignación
      return day >= start && day <= end
    })
  }
  
  // Función para obtener el color de prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baja': return 'bg-blue-100 text-blue-800'
      case 'media': return 'bg-green-100 text-green-800'
      case 'alta': return 'bg-orange-100 text-orange-800'
      case 'urgente': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Función para obtener el color de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'en_progreso': return 'bg-blue-100 text-blue-800'
      case 'completada': return 'bg-green-100 text-green-800'
      case 'cancelada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendario de Asignaciones</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="calendar" onValueChange={(value) => setView(value as "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <select 
            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={selectedMember || ""}
            onChange={(e) => setSelectedMember(e.target.value || null)}
          >
            <option value="">Todos los miembros</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.nombre}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {view === "calendar" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
              
              {/* Días vacíos al inicio del mes */}
              {Array.from({ length: (daysInMonth[0].getDay() + 6) % 7 }).map((_, i) => (
                <div key={`empty-start-${i}`} className="h-24 border rounded-md bg-muted/20"></div>
              ))}
              
              {/* Días del mes */}
              {daysInMonth.map((day) => {
                const dayAssignments = getAssignmentsForDay(day)
                const isToday = isSameDay(day, new Date())
                
                return (
                  <div 
                    key={day.toString()} 
                    className={`h-24 border rounded-md p-1 overflow-hidden ${
                      isToday ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Añadir Asignación para {format(day, 'PPP', { locale: es })}</DialogTitle>
                          </DialogHeader>
                          <AssignmentForm 
                            teamMembers={teamMembers} 
                            clients={clients}
                            initialDate={day}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="space-y-1 overflow-y-auto max-h-16">
                      {dayAssignments.slice(0, 2).map((assignment) => (
                        <div 
                          key={assignment.id} 
                          className="text-xs p-1 rounded bg-blue-50 truncate"
                          title={`${assignment.titulo} - ${assignment.miembros_equipo?.nombre || 'Sin asignar'}`}
                        >
                          {assignment.titulo}
                        </div>
                      ))}
                      {dayAssignments.length > 2 && (
                        <div className="text-xs text-center text-muted-foreground">
                          +{dayAssignments.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {/* Días vacíos al final del mes */}
              {Array.from({ length: (7 - daysInMonth[daysInMonth.length - 1].getDay()) % 7 }).map((_, i) => (
                <div key={`empty-end-${i}`} className="h-24 border rounded-md bg-muted/20"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Miembro</th>
                    <th className="p-2 text-left">Tarea</th>
                    <th className="p-2 text-left">Proyecto</th>
                    <th className="p-2 text-left">Fechas</th>
                    <th className="p-2 text-left">Estado</th>
                    <th className="p-2 text-left">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No hay asignaciones para mostrar
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <tr key={assignment.id} className="border-b">
                        <td className="p-2">
                          {assignment.miembros_equipo?.nombre || 'Sin asignar'}
                        </td>
                        <td className="p-2 font-medium">{assignment.titulo}</td>
                        <td className="p-2">
                          {assignment.clientes?.proyecto || 'Sin proyecto'}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {format(new Date(assignment.fecha_inicio), 'dd/MM/yyyy')} - 
                          {format(new Date(assignment.fecha_fin), 'dd/MM/yyyy')}
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(assignment.estado)}>
                            {assignment.estado.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={getPriorityColor(assignment.prioridad || "media")}>
                            {assignment.prioridad || "media"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}