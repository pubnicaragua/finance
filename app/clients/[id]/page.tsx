import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ClientDetailHeader } from "@/components/client-detail-header"
import { ClientInfoCard } from "@/components/client-info-card"
import { AvancesCard } from "@/components/avances-card"
import { AlcancesCard } from "@/components/alcances-card"
import { PaymentHistoryCard } from "@/components/payment-history-card"
import { ProjectionHistoryCard } from "@/components/projection-history-card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Params {
  id: string
}

export default async function ClientPage({ params }: { params: Params }) {
  const { id } = params

  const supabase = await createClient()

  // Fetch client details
  const { data: client, error: clientError } = await supabase.from("clientes").select("*").eq("id", id).single()

  // Fetch related advances
  const { data: avances, error: avancesError } = await supabase
    .from("avances_proyecto")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha", { ascending: false })

  // Fetch related scopes
  const { data: alcances, error: alcancesError } = await supabase
    .from("alcances_desarrollo")
    .select("*")
    .eq("cliente_id", id)
    .order("fecha_implementacion", { ascending: false })

  if (clientError || !client) {
    console.error("Error fetching client:", clientError)
    return notFound()
  }

  if (avancesError) {
    console.error("Error fetching advances:", avancesError)
    // Decide how to handle this: show partial data or error
  }

  if (alcancesError) {
    console.error("Error fetching scopes:", alcancesError)
    // Decide how to handle this: show partial data or error
  }

  // Ensure historial_pagos and proyeccion_pagos are arrays
  const historialPagos = (client.historial_pagos || []) as Array<any>
  const proyeccionPagos = (client.proyeccion_pagos || []) as Array<any>

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Detalles del Cliente</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <ClientDetailHeader client={client} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ClientInfoCard client={client} />
          <AvancesCard avances={avances || []} clientId={client.id} />
          <AlcancesCard alcances={alcances || []} clientId={client.id} />
        </div>

        <Tabs defaultValue="payment-history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-history">Historial de Pagos</TabsTrigger>
            <TabsTrigger value="payment-projections">Proyecciones de Pagos</TabsTrigger>
          </TabsList>
          <TabsContent value="payment-history">
            <PaymentHistoryCard payments={historialPagos} clienteId={client.id} /> {/* Prop 'payments' */}
          </TabsContent>
          <TabsContent value="payment-projections">
            <ProjectionHistoryCard projections={proyeccionPagos} clienteId={client.id} /> {/* Prop 'projections' */}
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  )
}
