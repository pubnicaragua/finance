import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LeadForm } from "@/components/lead-form"
import { DeleteLeadButton } from "@/components/delete-lead-button"
import type { Tables } from "@/lib/database.types"

export default async function LeadTable() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: leads, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    return <div className="text-red-500">Error al cargar los leads.</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Interés</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Contacto</TableHead>
            <TableHead>Fuente</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No hay leads registrados.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead: Tables<"leads">) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.nombre}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.telefono}</TableCell>
                <TableCell>{lead.interes}</TableCell>
                <TableCell>{lead.estado}</TableCell>
                <TableCell>{lead.fecha_contacto}</TableCell>
                <TableCell>{lead.fuente}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Editar Lead</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Lead</DialogTitle>
                      </DialogHeader>
                      <LeadForm initialData={lead} onSuccess={() => {}} />
                    </DialogContent>
                  </Dialog>
                  <DeleteLeadButton leadId={lead.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}