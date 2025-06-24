import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FolderKanban, DollarSign, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export const revalidate = 0

export default async function ProjectSummaryPage() {
  const supabase = await createClient()

  const { data: projects, error: projectsError } = await supabase
    .from("proyectos")
    .select("*, clientes(cliente)") // Fetch related client name
    .order("fecha_inicio", { ascending: false })

  const { data: avances, error: avancesError } = await supabase.from("avances_proyecto").select("*")
  const { data: alcances, error: alcancesError } = await supabase.from("alcances_desarrollo").select("*")

  if (projectsError || avancesError || alcancesError) {
    console.error("Error fetching project summary data:", projectsError || avancesError || alcancesError)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Resumen de Proyectos</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Resumen de Proyectos</h2>
          <p className="text-red-500">Error al cargar el resumen de proyectos.</p>
        </main>
      </SidebarInset>
    )
  }

  const projectData = (projects || []).map((project) => {
    const projectAvances = (avances || []).filter((avance) => avance.cliente_id === project.cliente_id)
    const projectAlcances = (alcances || []).filter((alcance) => alcance.cliente_id === project.cliente_id)

    const totalAvance =
      projectAvances.length > 0
        ? projectAvances.reduce((sum, avance) => sum + avance.porcentaje_avance, 0) / projectAvances.length
        : 0

    return {
      ...project,
      totalAvance: totalAvance.toFixed(2),
      numAlcances: projectAlcances.length,
      clientName: project.clientes?.cliente || "N/A", // Get client name
    }
  })

  const totalCostoProyectos = projectData.reduce((sum, p) => sum + (p.costo_total || 0), 0)
  const proyectosActivos = projectData.filter((p) => p.estado === "Activo").length
  const proyectosCompletados = projectData.filter((p) => p.estado === "Completado").length

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Resumen de Proyectos</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Visión General de Proyectos</h2>
        <p className="text-muted-foreground">Estado y costos de los proyectos de desarrollo.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectData.length}</div>
              <p className="text-xs text-muted-foreground">Número total de proyectos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Costo Total Proyectos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCostoProyectos.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Suma de costos de todos los proyectos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proyectosActivos}</div>
              <p className="text-xs text-muted-foreground">Proyectos en curso</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado Detallado de Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead className="text-right">Costo Total</TableHead>
                    <TableHead className="text-right">Avance Promedio (%)</TableHead>
                    <TableHead className="text-right">Alcances</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No hay proyectos registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projectData.map((proyecto) => (
                      <TableRow key={proyecto.id}>
                        <TableCell>{proyecto.nombre}</TableCell>
                        <TableCell>{proyecto.clientName}</TableCell> {/* Display client name */}
                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              proyecto.estado === "Activo" && "bg-blue-100 text-blue-800",
                              proyecto.estado === "Completado" && "bg-green-100 text-green-800",
                              proyecto.estado === "Pendiente" && "bg-yellow-100 text-yellow-800",
                              proyecto.estado === "Cancelado" && "bg-red-100 text-red-800",
                            )}
                          >
                            {proyecto.estado}
                          </span>
                        </TableCell>
                        <TableCell>
                          {proyecto.fecha_inicio ? format(new Date(proyecto.fecha_inicio), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell>
                          {proyecto.fecha_fin ? format(new Date(proyecto.fecha_fin), "dd/MM/yyyy") : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">${proyecto.costo_total?.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{proyecto.totalAvance}</TableCell>
                        <TableCell className="text-right">{proyecto.numAlcances}</TableCell>
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
