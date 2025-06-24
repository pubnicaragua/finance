import { createClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils" // Asumiendo que tienes una función de formato de moneda
import { format } from "date-fns"

export default async function TransactionTable() {
  const supabase = await createClient()
  const { data: transactions, error } = await supabase
    .from("transacciones")
    .select("*")
    .order("fecha", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return <p>Error al cargar transacciones: {error.message}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Transacciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Comisión</TableHead>
              <TableHead>Vendedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.fecha ? format(new Date(transaction.fecha), "dd/MM/yyyy") : "N/A"}</TableCell>
                <TableCell>{transaction.descripcion}</TableCell>
                <TableCell>{transaction.tipo}</TableCell>
                <TableCell>{transaction.categoria}</TableCell>
                <TableCell className={transaction.tipo === "ingreso" ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(transaction.monto || 0)}
                </TableCell>
                <TableCell>{transaction.comision ? formatCurrency(transaction.comision) : "N/A"}</TableCell>
                <TableCell>{transaction.vendedor || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
