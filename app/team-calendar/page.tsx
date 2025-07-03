export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon, Calendar, Users, Bell } from "lucide-react"
import { TeamCalendar } from "@/components/team-calendar"
import { TeamMemberForm } from "@/components/team-member-form"
import { AssignmentForm } from "@/components/assignment-form"
import { getTeamMembers, getAssignments } from "@/actions/team-calendar-actions"
import { getClients } from "@/actions/client-actions"

export default async function TeamCalendarPage() {
  const supabase = await createClient()
  
  // Obtener la fecha actual y calcular el inicio y fin del mes
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  // Formatear fechas para la consulta
  const startDate = startOfMonth.toISOString()
  const endDate = endOfMonth.toISOString()
  
  // Obtener datos
  const teamMembers = await getTeamMembers()
  const assignments = await getAssignments(startDate, endDate)
  const clients = await getClients()
  
  // Obtener notificaciones no leídas
  const { data: unreadNotifications, error: notificationsError } = await supabase
    .from("notificaciones")
    .select("*")
    .eq("leida", false)
    .order("fecha_creacion", { ascending: false })
  
  const notificationCount = unreadNotifications?.length || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Calendario del Equipo</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Añadir Miembro</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Miembro</DialogTitle>
              </DialogHeader>
              <TeamMemberForm />
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <Calendar className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Añadir Asignación</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Asignación</DialogTitle>
              </DialogHeader>
              <AssignmentForm teamMembers={teamMembers} clients={clients} />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros del Equipo</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">Miembros activos en el equipo</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asignaciones Activas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.filter(a => a.estado !== 'completada' && a.estado !== 'cancelada').length}</div>
              <p className="text-xs text-muted-foreground">Tareas pendientes o en progreso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationCount}</div>
              <p className="text-xs text-muted-foreground">Notificaciones sin leer</p>
            </CardContent>
          </Card>
        </div>
        
        <TeamCalendar 
          teamMembers={teamMembers} 
          assignments={assignments} 
          clients={clients}
        />
      </main>
    </SidebarInset>
  )
}