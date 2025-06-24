import { createClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils" // Asumiendo que tienes una función de formato de moneda

export default async function LiabilitiesTable() {
  const supabase = await createClient()
  const { data: liabilities, error } = await supabase.from("pasivos_corrientes").select("*")

  if (error) {
    console.error("Error fetching liabilities:", error)
    return <p>Error al cargar pasivos: {error.message}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pasivos Corrientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha de Vencimiento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liabilities.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell>{liability.descripcion}</TableCell>
                <TableCell>{formatCurrency(liability.monto || 0)}</TableCell>
                <TableCell>{new Date(liability.fecha_vencimiento).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
