import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { PartnershipActions } from "@/components/partnership-actions-client"

export default async function PartnershipsPage() {
  const supabase = createClient()
  const { data: partnerships, error } = await supabase
    .from("partnerships")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching partnerships:", error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar los partnerships: {error.message}
      </div>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Partnerships</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Partnerships</h2>
        <p className="text-muted-foreground">Gestión de acuerdos y colaboraciones estratégicas</p>

        <div className="flex items-center justify-end">
          <PartnershipActions type="add" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Partnerships</CardTitle>
          </CardHeader>
          <CardContent>
            {partnerships?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No hay partnerships registrados aún.</p>
                <p>Haz clic en "Añadir Partnership" para empezar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo de Acuerdo</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Monto Financiado</TableHead>
                      <TableHead>Responsabilidades</TableHead>
                      <TableHead>Expectativas</TableHead>
                      <TableHead>Historial Interacciones</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnerships?.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.nombre}</TableCell>
                        <TableCell>{p.tipo_acuerdo || "N/A"}</TableCell>
                        <TableCell>{p.fecha_inicio || "N/A"}</TableCell>
                        <TableCell>{p.fecha_fin || "N/A"}</TableCell>
                        <TableCell>{p.estado || "N/A"}</TableCell>
                        <TableCell className="text-green-amount">${p.monto_financiado?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                          {((p.responsabilidades as any[]) || []).map((r, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              {r}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          {((p.expectativas as any[]) || []).map((e, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              {e}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          {((p.historial_interacciones as any[]) || []).map((h, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              {h.fecha}: {h.nota}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <PartnershipActions type="edit" partnership={p} />
                          <PartnershipActions type="delete" partnership={p} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
