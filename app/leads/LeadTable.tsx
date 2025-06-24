"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LeadForm } from "@/components/lead-form"
import { deleteLead } from "@/actions/lead-actions"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import type { Tables } from "@/lib/database.types"

interface LeadTableProps {
  leads: Tables<"leads">[]
}

export function LeadTable({ leads }: LeadTableProps) {
  // Exportado como named export
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Tables<"leads"> | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este lead?")) {
      const result = await deleteLead(id)
      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleEditClick = (lead: Tables<"leads">) => {
    setSelectedLead(lead)
    setOpenDialog(true)
  }

  const handleFormSuccess = () => {
    setOpenDialog(false)
    setSelectedLead(null)
  }

  return (
    <>
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
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No hay leads registrados.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.cliente}</TableCell>
                <TableCell>{lead.proyecto}</TableCell>
                <TableCell>{lead.tipo_software || "N/A"}</TableCell>
                <TableCell>{lead.pais || "N/A"}</TableCell>
                <TableCell>${lead.proyeccion_usd?.toFixed(2)}</TableCell>
                <TableCell>{lead.estado}</TableCell>
                <TableCell>{lead.canal_contacto || "N/A"}</TableCell>
                <TableCell>{new Date(lead.fecha_ultimo_contacto).toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(lead)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(lead.id)}>
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedLead ? "Editar Lead" : "Añadir Lead"}</DialogTitle>
          </DialogHeader>
          <LeadForm initialData={selectedLead || undefined} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
