// NO "use client" here, this is a Server Component
import { createClient } from "@/lib/supabase/server" // This is the server client
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Wifi } from "lucide-react"
import { notFound } from "next/navigation"

// Import the new client components
import { ClientDetailHeader } from "@/components/client-detail-header"
import { ClientInfoCard } from "@/components/client-info-card"
import { PaymentHistoryCard } from "@/components/payment-history-card"
import { ProjectionHistoryCard } from "@/components/projection-history-card"
import { AvancesCard } from "@/components/avances-card"
import { AlcancesCard } from "@/components/alcances-card"

// This function will be called only on the server
async function getServerSideData(clientId: string) {
  const supabase = createClient() // This call is now safely inside a server-only function

  const { data: client, error: clientError } = await supabase
    .from("clientes")
    .select("*, historial_pagos, proyeccion_pagos")
    .eq("id", clientId)
    .single()

  const { data: avances, error: avancesError } = await supabase
    .from("avances_proyecto")
    .select("*")
    .eq("cliente_id", clientId)
    .order("fecha", { ascending: false })

  const { data: alcances, error: alcancesError } = await supabase
    .from("alcances_desarrollo")
    .select("*")
    .eq("cliente_id", clientId)
    .order("created_at", { ascending: false })

  if (clientError || !client) {
    console.error("Error fetching client details:", clientError)
    return null // Indicate that client was not found or error occurred
  }

  if (avancesError) {
    console.error("Error fetching project advances:", avancesError)
  }
  if (alcancesError) {
    console.error("Error fetching development scopes:", alcancesError)
  }

  return { client, avances, alcances }
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const data = await getServerSideData(params.id)

  if (!data) {
    notFound() // Show 404 page if client not found or error occurred during fetching
  }

  const { client, avances, alcances } = data

  // Ensure historial_pagos and proyeccion_pagos are arrays, even if null from DB
  const historialPagos = (client.historial_pagos || []) as Array<{ fecha: string; monto: number; descripcion?: string }>
  const proyeccionPagos = (client.proyeccion_pagos || []) as Array<{ fecha: string; monto: number; pagado?: boolean }>

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Detalle del Cliente</h1>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <ClientDetailHeader client={client} />
        <p className="text-muted-foreground">Detalles completos y gestión de {client.cliente}</p>

        <ClientInfoCard client={client} />
        <PaymentHistoryCard clienteId={client.id} historialPagos={historialPagos} />
        <ProjectionHistoryCard clienteId={client.id} proyeccionPagos={proyeccionPagos} />
        <AvancesCard clienteId={client.id} avances={avances || []} />
        <AlcancesCard clienteId={client.id} alcances={alcances || []} />
      </main>
    </SidebarInset>
  )
}
