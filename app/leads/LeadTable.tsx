import { createClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default async function LeadTable() {
  const supabase = await createClient()
  const { data: leads, error } = await supabase.from("leads").select("*")

  if (error) {
    console.error("Error fetching leads:", error)
    return <p>Error al cargar leads: {error.message}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.nombre}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.telefono}</TableCell>
                <TableCell>{lead.estado}</TableCell>
                <TableCell>
                  {lead.fecha_creacion ? format(new Date(lead.fecha_creacion), "dd/MM/yyyy") : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
