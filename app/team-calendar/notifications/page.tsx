export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getNotifications, markNotificationAsRead } from "@/actions/team-calendar-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function NotificationsPage() {
  const notifications = await getNotifications()
  
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Notificaciones</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay notificaciones para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notification) => (
                    <TableRow key={notification.id} className={notification.leida ? "" : "bg-blue-50"}>
                      <TableCell>
                        {format(new Date(notification.fecha_creacion), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </TableCell>
                      <TableCell>{notification.miembros_equipo?.nombre || 'Desconocido'}</TableCell>
                      <TableCell>
                        <Badge variant={notification.tipo === 'sin_asignacion' ? "destructive" : "default"}>
                          {notification.tipo === 'sin_asignacion' ? 'Sin Asignación' : 
                           notification.tipo === 'recordatorio' ? 'Recordatorio' : 'Sistema'}
                        </Badge>
                      </TableCell>
                      <TableCell>{notification.mensaje}</TableCell>
                      <TableCell>
                        <Badge variant={notification.leida ? "outline" : "secondary"}>
                          {notification.leida ? 'Leída' : 'No leída'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!notification.leida && (
                          <form action={async () => {
                            "use server"
                            await markNotificationAsRead(notification.id)
                          }}>
                            <Button type="submit" variant="outline" size="sm">
                              Marcar como leída
                            </Button>
                          </form>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}