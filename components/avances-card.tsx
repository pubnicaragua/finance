"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Edit, Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { AvanceForm } from "@/components/avance-form"
import { deleteAvance } from "@/actions/project-updates-actions"
import type { Tables } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AvancesCardProps {
  clienteId: string
  avances: Tables<"avances_proyecto">[]
}

export function AvancesCard({ clienteId, avances }: AvancesCardProps) {
  const [isAddAvanceDialogOpen, setIsAddAvanceDialogOpen] = useState(false)
  const [isEditAvanceDialogOpen, setIsEditAvanceDialogOpen] = useState<{
    open: boolean
    data: Tables<"avances_proyecto"> | null
  }>({ open: false, data: null })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historial de Avances</CardTitle>
        <Dialog open={isAddAvanceDialogOpen} onOpenChange={setIsAddAvanceDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Avance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Avance</DialogTitle>
            </DialogHeader>
            <AvanceForm clienteId={clienteId} onSuccess={() => setIsAddAvanceDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Avance (%)</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Backlog</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>Comentarios Cliente</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {avances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No hay avances registrados.
                  </TableCell>
                </TableRow>
              ) : (
                avances.map((avance) => (
                  <TableRow key={avance.id}>
                    <TableCell>{avance.fecha}</TableCell>
                    <TableCell className="max-w-xs truncate">{avance.descripcion}</TableCell>
                    <TableCell className="text-green-amount">{avance.porcentaje_avance?.toFixed(2)}%</TableCell>
                    <TableCell>
                      {avance.completado ? (
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {avance.backlog_url ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={avance.backlog_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {avance.firma_virtual ? (
                        <div className="text-sm">
                          <div className="font-medium">{avance.firma_virtual}</div>
                          <div className="text-xs text-muted-foreground">Firmado digitalmente</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin firma</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{avance.comentarios_cliente || "N/A"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog
                        open={isEditAvanceDialogOpen.open && isEditAvanceDialogOpen.data?.id === avance.id}
                        onOpenChange={(open) => setIsEditAvanceDialogOpen({ open, data: open ? avance : null })}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar Avance</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Editar Avance</DialogTitle>
                          </DialogHeader>
                          <AvanceForm
                            clienteId={clienteId}
                            initialData={avance}
                            onSuccess={() => setIsEditAvanceDialogOpen({ open: false, data: null })}
                          />
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar Avance</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente este avance.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await deleteAvance(avance.id, clienteId)
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