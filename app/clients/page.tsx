import { createServerSupabase } from "@/lib/supabase/server"
import { ClientForm } from "@/components/client-form" // Importación nombrada
import { DeleteClientButton } from "@/components/delete-client-button" // Importación nombrada
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export const revalidate = 0

export default async function ClientsPage() {
  const supabase = createServerSupabase()

  const { data: clients, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching clients:", error)
    return <div>Error al cargar los clientes: {error.message}</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Añadir Cliente</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
              <DialogDescription>Rellena los campos para añadir un nuevo cliente a la base de datos.</DialogDescription>
            </DialogHeader>
            <ClientForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes</CardTitle>
          <CardDescription>Visualiza y gestiona todos los clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Tipo Software</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Costo Proyecto</TableHead>
                <TableHead>Abonado</TableHead>
                <TableHead>Deuda</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link href={`/clients/${client.id}`} className="text-blue-600 hover:underline">
                      {client.cliente}
                    </Link>
                  </TableCell>
                  <TableCell>{client.proyecto}</TableCell>
                  <TableCell>{client.tipo_software}</TableCell>
                  <TableCell>{client.estado}</TableCell>
                  <TableCell>
                    $
                    {client.costo_proyecto?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    ${client.abonado?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    ${client.deuda?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Editar Cliente</DialogTitle>
                          <DialogDescription>Modifica los campos del cliente seleccionado.</DialogDescription>
                        </DialogHeader>
                        <ClientForm initialData={client} />
                      </DialogContent>
                    </Dialog>
                    <DeleteClientButton clientId={client.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
