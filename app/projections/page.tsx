import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ProjectionsPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from("clientes")
    .select("cliente, proyecto, proyeccion_pagos")
    .not("proyeccion_pagos", "is", null) // Only fetch clients with projections

  if (error) {
    console.error("Error fetching projections:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Proyecciones</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Proyecciones de Pagos</h2>
          <p className="text-red-500">Error al cargar las proyecciones.</p>
        </main>
      </SidebarInset>
    )
  }

  const allProjections = (clients || []).flatMap((client) =>
    ((client.proyeccion_pagos || []) as Array<any>).map((proj) => ({
      cliente: client.cliente,
      proyecto: client.proyecto,
      ...proj,
    })),
  )

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Proyecciones</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Proyecciones de Pagos</h2>
        <p className="text-muted-foreground">Aquí puedes ver todas las proyecciones de pagos de tus clientes.</p>

        <Card>
          <CardHeader>
            <CardTitle>Todas las Proyecciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Pagado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProjections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No hay proyecciones de pagos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allProjections.map((proj, index) => (
                      <TableRow key={index}>
                        <TableCell>{proj.cliente}</TableCell>
                        <TableCell>{proj.proyecto}</TableCell>
                        <TableCell>{proj.fecha}</TableCell>
                        <TableCell className={proj.pagado ? "text-green-amount" : "text-red-amount"}>
                          USD {proj.monto?.toFixed(2)}
                        </TableCell>
                        <TableCell>{proj.pagado ? "Sí" : "No"}</TableCell>
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
