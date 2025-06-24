"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { TransactionForm } from "@/components/transaction-form"
import { deleteTransaction } from "@/actions/transaction-actions"
import type { Database } from "@/lib/database.types"

type CuentaFinanciera = Database["public"]["Tables"]["cuentas_financieras"]["Row"]
type Cliente = Database["public"]["Tables"]["clientes"]["Row"]
type Transaccion = Database["public"]["Tables"]["transacciones"]["Row"] & {
  cuentas_financieras?: { nombre: string; moneda: string } | null
}

interface TransactionsClientPageProps {
  cuentas: CuentaFinanciera[]
  clientes: Cliente[]
  tipoCambioUSDNIO: number
  ingresos: Transaccion[]
  egresos: Transaccion[]
  totalIngresos: number
  totalEgresos: number
  saldoNeto: number
}

export function TransactionsClientPage({
  cuentas,
  clientes,
  tipoCambioUSDNIO,
  ingresos,
  egresos,
  totalIngresos,
  totalEgresos,
  saldoNeto,
}: TransactionsClientPageProps) {
  const getClientName = (clientId: string | null) => {
    return clientes?.find((c) => c.id === clientId)?.cliente || "N/A"
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Ingresos y Egresos</h2>
      <p className="text-muted-foreground">Control avanzado de flujo de efectivo con comisiones automáticas</p>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Tipo de Cambio: {tipoCambioUSDNIO}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Transacción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Nueva Transacción</DialogTitle>
            </DialogHeader>
            <TransactionForm cuentasFinancieras={cuentas || []} clientes={clientes || []} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Selection (Placeholder for now) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cuentas?.map((cuenta) => (
          <Button key={cuenta.id} variant="outline" className="justify-start">
            {cuenta.nombre}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos</CardTitle>
          <p className="text-sm text-muted-foreground">Entradas de dinero</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Tipo Ingreso</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingresos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No hay ingresos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  ingresos.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.fecha}</TableCell>
                      <TableCell>{t.concepto}</TableCell>
                      <TableCell>{t.tipo_ingreso || "N/A"}</TableCell>
                      <TableCell>{getClientName(t.cliente_id)}</TableCell>
                      <TableCell>{(t.cuentas_financieras as any)?.nombre || "N/A"}</TableCell>
                      <TableCell className="text-green-amount">${t.monto?.toFixed(2)}</TableCell>
                      <TableCell>{t.vendedor_comision || "N/A"}</TableCell>
                      <TableCell className="text-red-600">
                        {t.comision_aplicada ? `$${t.comision_aplicada.toFixed(2)}` : "N/A"}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Editar Transacción</DialogTitle>
                            </DialogHeader>
                            <TransactionForm
                              initialData={t}
                              cuentasFinancieras={cuentas || []}
                              clientes={clientes || []}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente esta transacción.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={async () => await deleteTransaction(t.id)}>
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
          <div className="mt-4 text-right text-lg font-semibold">
            Total Ingresos: <span className="text-green-amount">${totalIngresos.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Egresos</CardTitle>
          <p className="text-sm text-muted-foreground">Salidas de dinero</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Tipo Egreso</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {egresos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No hay egresos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  egresos.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.fecha}</TableCell>
                      <TableCell>{t.concepto}</TableCell>
                      <TableCell>{t.tipo_egreso || "N/A"}</TableCell>
                      <TableCell>{(t.cuentas_financieras as any)?.nombre || "N/A"}</TableCell>
                      <TableCell className="text-red-600">${t.monto?.toFixed(2)}</TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Editar Transacción</DialogTitle>
                            </DialogHeader>
                            <TransactionForm
                              initialData={t}
                              cuentasFinancieras={cuentas || []}
                              clientes={clientes || []}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente esta transacción.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={async () => await deleteTransaction(t.id)}>
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
          <div className="mt-4 text-right text-lg font-semibold">
            Total Egresos: <span className="text-red-600">${totalEgresos.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen Neto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-lg font-semibold">
            <span>Saldo Neto</span>
            <span className={cn(saldoNeto >= 0 ? "text-green-amount" : "text-red-600")}>${saldoNeto.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
