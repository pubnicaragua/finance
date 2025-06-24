"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Tables } from "@/lib/database.types"

interface ClientInfoCardProps {
  client: Tables<"clientes">
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Proyecto:</p>
          <p className="font-medium">{client.proyecto}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tipo de Software:</p>
          <p className="font-medium">{client.tipo_software || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Estado:</p>
          <p className="font-medium">{client.estado || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">País:</p>
          <p className="font-medium">{client.pais || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Costo del Proyecto:</p>
          <p className="font-medium text-green-amount">USD {client.costo_proyecto?.toFixed(2) || "0.00"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Abonado:</p>
          <p className="font-medium text-green-amount">USD {client.abonado?.toFixed(2) || "0.00"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Deuda Pendiente:</p>
          <p className={cn("font-medium", client.deuda && client.deuda > 0 ? "text-red-600" : "text-green-amount")}>
            USD {client.deuda?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fecha de Vencimiento:</p>
          <p className="font-medium">{client.fecha_vencimiento || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
