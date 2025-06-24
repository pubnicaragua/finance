"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { createClient } from "@/lib/supabase/server"
import { ActivoCorrienteForm } from "@/components/activo-corriente-form"
import { deleteActivoCorriente } from "@/actions/asset-liability-actions"

export default async function ActivosCorrientesPage() {
  const supabase = createClient()
  const { data: activos, error } = await supabase
    .from("activos_corrientes")
    .select("*, cuentas_financieras(nombre, moneda)")
    .order("created_at", { ascending: false })

  const { data: cuentasFinancieras, error: cuentasError } = await supabase
    .from("cuentas_financieras")
    .select("id, nombre, moneda")

  if (error || cuentasError) {
    console.error("Error fetching activos corrientes or cuentas financieras:", error || cuentasError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-red-500">
        Error al cargar los activos corrientes: {error?.message || cuentasError?.message}
      </div>
    )
  }

  const totalValor = activos?.reduce((sum, a) => sum + (a.valor || 0), 0) || 0

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Activos Corrientes</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Activos Corrientes</h2>
        <p className="text-muted-foreground">
          Recursos y bienes de la empresa que se esperan convertir en efectivo en un año.
        </p>

        <div className="flex items-center justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Activo Corriente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Activo Corriente</DialogTitle>
              </DialogHeader>
              <ActivoCorrienteForm cuentasFinancieras={cuentasFinancieras || []} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Activos Corrientes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gestiona tus activos que se esperan convertir en efectivo a corto plazo.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Cuenta Asociada</TableHead>
                    <TableHead>Fecha Adquisición</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activos?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No hay activos corrientes registrados aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    activos?.map((activo) => (
                      <TableRow key={activo.id}>
                        <TableCell>{activo.descripcion}</TableCell>
                        <TableCell className="text-green-amount">${activo.valor?.toFixed(2)}</TableCell>
                        <TableCell>{(activo.cuentas_financieras as any)?.nombre || "N/A"}</TableCell>
                        <TableCell>{activo.fecha_adquisicion || "N/A"}</TableCell>
                        <TableCell className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar Activo</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Editar Activo Corriente</DialogTitle>
                              </DialogHeader>
                              <ActivoCorrienteForm initialData={activo} cuentasFinancieras={cuentasFinancieras || []} />
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar Activo</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente este activo.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={async () => await deleteActivoCorriente(activo.id)}>
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

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Activos Corrientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Valor Activos Corrientes</span>
              <span className="text-green-amount">USD {totalValor.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </SidebarInset>
  )
}
