"use client"

import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClientInfoCard } from "@/components/client-info-card"
import { AvancesCard } from "@/components/avances-card"
import { AlcancesCard } from "@/components/alcances-card"
import { PaymentHistoryCard } from "@/components/payment-history-card"
import { ProjectionHistoryCard } from "@/components/projection-history-card"
import { PaymentForm } from "@/components/payment-form"
import { ProjectionForm } from "@/components/projection-form"
import { AvanceForm } from "@/components/avance-form"
import { AlcanceForm } from "@/components/alcance-form"
import { getClientById } from "@/actions/client-actions"
import { getPaymentsByClientId } from "@/actions/payment-projection-actions"
import { getAvancesByClientId } from "@/actions/project-updates-actions"
import { getAlcancesByClientId } from "@/actions/project-updates-actions"
import { getProjectionsByClientId } from "@/actions/payment-projection-actions"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id: clientId } = params
  const { toast } = useToast()
  const [client, setClient] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [projections, setProjections] = useState<any[]>([])
  const [avances, setAvances] = useState<any[]>([])
  const [alcances, setAlcances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const clientData = await getClientById(clientId)
        if (!clientData) {
          notFound()
        }
        setClient(clientData)

        const paymentsData = await getPaymentsByClientId(clientId)
        setPayments(paymentsData || [])

        const projectionsData = await getProjectionsByClientId(clientId)
        setProjections(projectionsData || [])

        const avancesData = await getAvancesByClientId(clientId)
        setAvances(avancesData || [])

        const alcancesData = await getAlcancesByClientId(clientId)
        setAlcances(alcancesData || [])
      } catch (err) {
        console.error("Failed to fetch client data:", err)
        setError("Failed to load client data. Please try again.")
        toast({
          title: "Error",
          description: "No se pudo cargar la información del cliente.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [clientId, toast])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }

  if (!client) {
    return notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <ClientInfoCard client={client} />

      <Tabs defaultValue="payments" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="projections">Proyecciones</TabsTrigger>
          <TabsTrigger value="avances">Avances</TabsTrigger>
          <TabsTrigger value="alcances">Alcances</TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Historial de Pagos</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Añadir Pago</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Pago</DialogTitle>
                  </DialogHeader>
                  <PaymentForm clientId={clientId} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Cargando historial de pagos...</div>}>
                <PaymentHistoryCard payments={payments} clientId={clientId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projections" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyecciones de Pagos</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Añadir Proyección</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nueva Proyección</DialogTitle>
                  </DialogHeader>
                  <ProjectionForm clientId={clientId} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Cargando proyecciones...</div>}>
                <ProjectionHistoryCard projections={projections} clientId={clientId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="avances" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avances del Proyecto</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Añadir Avance</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Avance</DialogTitle>
                  </DialogHeader>
                  <AvanceForm clientId={clientId} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Cargando avances...</div>}>
                <AvancesCard avances={avances} clientId={clientId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alcances" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alcances de Desarrollo</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Añadir Alcance</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Añadir Nuevo Alcance</DialogTitle>
                  </DialogHeader>
                  <AlcanceForm clientId={clientId} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Cargando alcances...</div>}>
                <AlcancesCard alcances={alcances} clientId={clientId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
