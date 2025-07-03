export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { NotificationSettingsForm } from "@/components/notification-settings-form"
import { getTeamMembers } from "@/actions/team-calendar-actions"

export default async function NotificationSettingsPage() {
  const teamMembers = await getTeamMembers()
  
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Configuración de Notificaciones</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationSettingsForm teamMembers={teamMembers} />
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}