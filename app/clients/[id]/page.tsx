"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import { ClientDetailHeader } from "@/components/client-detail-header"
import { ClientInfoCard } from "@/components/client-info-card"
import { PaymentHistoryCard } from "@/components/payment-history-card"
import { ProjectionHistoryCard } from "@/components/projection-history-card"
import { AvancesCard } from "@/components/avances-card"
import { AlcancesCard } from "@/components/alcances-card"
import { PaymentForm } from "@/components/payment-form"
import { ProjectionForm } from "@/components/projection-form"
import { AvanceForm } from "@/components/avance-form"
import { AlcanceForm } from "@/components/alcance-form"
import type { Tables } from "@/lib/database.types"
import { getPaymentsByClientId, getProjectionsByClientId } from "@/actions/payment-projection-actions"
import { getAvancesByClientId, getAlcancesByClientId } from "@/actions/project-updates-actions"
import { getClientById } from "@/actions/client-actions"

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Tables<"clientes"> | null>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [projections, setProjections] = useState<any[]>([])
  const [avances, setAvances] = useState<Tables<"avances_proyecto">[]>([])
  const [alcances, setAlcances] = useState<Tables<"alcances_desarrollo">[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClientData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const clientResult = await getClientById(clientId)
      if (clientResult.success && clientResult.data) {
        setClient(clientResult.data)
      } else {
        setError(clientResult.message || "Cliente no encontrado.")
      }

      const paymentsData = await getPaymentsByClientId(clientId)
      setPayments(paymentsData || [])

      const projectionsData = await getProjectionsByClientId(clientId)
      setProjections(projectionsData || [])

      const avancesData = await getAvancesByClientId(clientId)
      setAvances(avancesData || [])

      const alcancesData = await getAlcancesByClientId(clientId)
      setAlcances(alcancesData || [])
    } catch (err: any) {
      console.error("Error fetching client detail data:", err)
      setError("Error al cargar los datos del cliente: " + err.message)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    if (clientId) {
      fetchClientData()
    }
  }, [clientId, fetchClientData])

  const handleDataRefresh = () => {
    fetchClientData()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando datos del cliente...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!client) {
    return <div className="flex justify-center items-center h-screen">Cliente no encontrado.</div>
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <ClientDetailHeader client={client} onClientDeleted={handleDataRefresh} />

      <ClientInfoCard client={client} />

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="projections">Proyecciones</TabsTrigger>
          <TabsTrigger value="avances">Avances</TabsTrigger>
          <TabsTrigger value="alcances">Alcances</TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Historial de Pagos</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Pago</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Pago</DialogTitle>
                  </DialogHeader>
                  <PaymentForm
                    clienteId={clientId}
                    onSuccess={handleDataRefresh}
                    onCancel={() => {}}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <PaymentHistoryCard 
                historialPagos={client.historial_pagos as any[]} 
                clienteId={clientId}
                onPaymentUpdated={handleDataRefresh}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projections">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Historial de Proyecciones</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Proyección</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nueva Proyección</DialogTitle>
                  </DialogHeader>
                  <ProjectionForm
                    clienteId={clientId}
                    onSuccess={handleDataRefresh}
                    onCancel={() => {}}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ProjectionHistoryCard 
                proyeccionPagos={client.proyeccion_pagos as any[]} 
                clienteId={clientId}
                onProjectionUpdated={handleDataRefresh}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="avances">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avances del Proyecto</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Avance</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Avance</DialogTitle>
                  </DialogHeader>
                  <AvanceForm
                    clienteId={clientId}
                    onSuccess={handleDataRefresh}
                    onCancel={() => {}}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <AvancesCard avances={avances} clienteId={clientId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alcances">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alcances de Desarrollo</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Alcance</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Alcance</DialogTitle>
                  </DialogHeader>
                  <AlcanceForm
                    clienteId={clientId}
                    onSuccess={handleDataRefresh}
                    onCancel={() => {}}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <AlcancesCard alcances={alcances} clienteId={clientId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}