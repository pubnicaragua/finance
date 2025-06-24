"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { AlcanceForm } from "@/components/alcance-form"
import { deleteAlcance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AlcancesCardProps {
  clienteId: string
  alcances: Tables<"alcances_desarrollo">[]
}

export function AlcancesCard({ clienteId, alcances }: AlcancesCardProps) {
  const [isAddAlcanceDialogOpen, setIsAddAlcanceDialogOpen] = useState(false)
  const [isEditAlcanceDialogOpen, setIsEditAlcanceDialogOpen] = useState<{
    open: boolean
    data: Tables<"alcances_desarrollo"> | null
  }>({ open: false, data: null })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Alcances de Desarrollos</CardTitle>
        <Dialog open={isAddAlcanceDialogOpen} onOpenChange={setIsAddAlcanceDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Alcance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Alcance</DialogTitle>
            </DialogHeader>
            <AlcanceForm clienteId={clienteId} onSuccess={() => setIsAddAlcanceDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Módulo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha Implementación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alcances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay alcances de desarrollo registrados.
                  </TableCell>
                </TableRow>
              ) : (
                alcances.map((alcance) => (
                  <TableRow key={alcance.id}>
                    <TableCell>{alcance.nombre_modulo}</TableCell>
                    <TableCell>{alcance.descripcion}</TableCell>
                    <TableCell>{alcance.fecha_implementacion || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          alcance.estado === "Completado"
                            ? "bg-green-100 text-green-700"
                            : alcance.estado === "En Desarrollo"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700",
                        )}
                      >
                        {alcance.estado}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog
                        open={isEditAlcanceDialogOpen.open && isEditAlcanceDialogOpen.data?.id === alcance.id}
                        onOpenChange={(open) => setIsEditAlcanceDialogOpen({ open, data: open ? alcance : null })}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar Alcance</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Editar Alcance</DialogTitle>
                          </DialogHeader>
                          <AlcanceForm
                            clienteId={clienteId}
                            initialData={alcance}
                            onSuccess={() => setIsEditAlcanceDialogOpen({ open: false, data: null })}
                          />
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar Alcance</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente este alcance.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await deleteAlcance(alcance.id, clienteId)
                              }}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
