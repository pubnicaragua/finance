import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LeadActions } from "@/components/lead-actions-client"

export default async function LeadsPage() {
  const supabase = createClient()
  const { data: leads, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar los leads: {error.message}
      </div>
    )
  }

  const totalProyeccion = leads?.reduce((sum, lead) => sum + (lead.proyeccion_usd || 0), 0) || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Leads</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Leads</h2>
        <p className="text-muted-foreground">Gestión de oportunidades de negocio y seguimiento de prospectos</p>

        <div className="flex items-center justify-between">
          <LeadActions type="add" />
          <div className="text-lg font-semibold">
            Proyección total: <span className="text-green-amount">${totalProyeccion.toFixed(2)}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Leads</CardTitle>
            <p className="text-sm text-muted-foreground">Gestiona tus leads y su estado de seguimiento.</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Tipo Software</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Proyección USD</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Canal Contacto</TableHead>
                    <TableHead>Último Contacto</TableHead>
                    <TableHead>Seguimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">
                        No hay leads registrados aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads?.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{lead.cliente}</TableCell>
                        <TableCell>{lead.proyecto}</TableCell>
                        <TableCell>{lead.tipo_software || "N/A"}</TableCell>
                        <TableCell>{lead.pais || "N/A"}</TableCell>
                        <TableCell className="text-green-amount">
                          ${lead.proyeccion_usd?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>{lead.estado || "N/A"}</TableCell>
                        <TableCell>{lead.canal_contacto || "N/A"}</TableCell>
                        <TableCell>{lead.fecha_ultimo_contacto || "N/A"}</TableCell>
                        <TableCell>
                          {((lead.seguimiento as any[]) || []).map((s, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              {s.fecha}: {s.nota}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <LeadActions type="edit" lead={lead} />
                          <LeadActions type="delete" lead={lead} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
