"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PayrollForm } from "@/components/payroll-form"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Tables } from "@/lib/database.types"

interface EmployeePaymentHistoryProps {
  empleado: Tables<"empleados">
  pagos: Tables<"nomina">[]
}

export function EmployeePaymentHistory({ empleado, pagos }: EmployeePaymentHistoryProps) {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  
  // Ordenar pagos por fecha (más reciente primero)
  const sortedPagos = [...pagos].sort((a, b) => {
    return new Date(b.periodo_fin).getTime() - new Date(a.periodo_fin).getTime()
  })
  
  // Calcular totales
  const totalPagado = pagos
    .filter(p => p.estado === 'Pagado')
    .reduce((sum, p) => sum + (p.salario_neto || 0), 0)
  
  const totalPendiente = pagos
    .filter(p => p.estado === 'Pendiente')
    .reduce((sum, p) => sum + (p.salario_neto || 0), 0)
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{empleado.nombre} {empleado.apellido}</h3>
          <p className="text-sm text-muted-foreground">{empleado.puesto} - {empleado.departamento}</p>
        </div>
        
        <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
          <DialogTrigger asChild>
            <Button>Registrar Nuevo Pago</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
            </DialogHeader>
            <PayrollForm 
              initialData={{ empleado_id: empleado.id, salario_base: empleado.salario_base }}
              onSuccess={() => setIsAddPaymentOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Salario Base:</span>
                <span className="font-medium">{formatCurrency(empleado.salario_base)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pagado:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalPagado)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pendiente:</span>
                <span className="font-medium text-amber-600">{formatCurrency(totalPendiente)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pagos Registrados:</span>
                <span className="font-medium">{pagos.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Información Bancaria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Banco:</span>
                <span className="font-medium">{empleado.banco || "No registrado"}</span>
              </div>
              <div className="flex justify-between">
                <span>Número de Cuenta:</span>
                <span className="font-medium">{empleado.numero_cuenta || "No registrado"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Salario Base</TableHead>
                <TableHead>Bonificaciones</TableHead>
                <TableHead>Deducciones</TableHead>
                <TableHead>Salario Neto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Pago</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPagos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No hay pagos registrados para este empleado.
                  </TableCell>
                </TableRow>
              ) : (
                sortedPagos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell>
                      {format(new Date(pago.periodo_inicio), 'dd/MM/yyyy', { locale: es })} - 
                      {format(new Date(pago.periodo_fin), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>{formatCurrency(pago.salario_base)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(pago.bonificaciones || 0)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(pago.deducciones || 0)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(pago.salario_neto || 0)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pago.estado === 'Pagado' ? 'bg-green-100 text-green-700' :
                        pago.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pago.estado}
                      </span>
                    </TableCell>
                    <TableCell>{pago.fecha_pago || 'N/A'}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Editar</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Editar Pago</DialogTitle>
                          </DialogHeader>
                          <PayrollForm initialData={pago} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}