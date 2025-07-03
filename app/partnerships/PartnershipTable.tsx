import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PartnershipForm } from "@/components/partnership-form"
import { DeletePartnershipButton } from "@/components/delete-partnership-button"
import type { Tables } from "@/lib/database.types"

export default async function PartnershipTable() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: partnerships, error } = await supabase
    .from("partnerships")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching partnerships:", error)
    return <div className="text-red-500">Error al cargar los partnerships.</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del Socio</TableHead>
            <TableHead>Tipo de Acuerdo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Monto Financiado</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partnerships.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No hay partnerships registrados.
              </TableCell>
            </TableRow>
          ) : (
            partnerships.map((partnership: Tables<"partnerships">) => (
              <TableRow key={partnership.id}>
                <TableCell className="font-medium">{partnership.nombre}</TableCell>
                <TableCell>{partnership.tipo_acuerdo}</TableCell>
                <TableCell>{partnership.estado}</TableCell>
                <TableCell>${partnership.monto_financiado?.toFixed(2) || "0.00"}</TableCell>
                <TableCell>{partnership.fecha_inicio}</TableCell>
                <TableCell>{partnership.fecha_fin}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Editar Partnership</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Partnership</DialogTitle>
                      </DialogHeader>
                      <PartnershipForm initialData={partnership} onSuccess={() => {}} />
                    </DialogContent>
                  </Dialog>
                  <DeletePartnershipButton partnershipId={partnership.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}