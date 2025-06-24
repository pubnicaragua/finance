"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClientForm } from "@/components/client-form"
import { DeleteClientButton } from "@/components/delete-client-button"
import { Edit } from "lucide-react"
import type { Tables } from "@/lib/database.types"
import { useState } from "react"

interface ClientDetailHeaderProps {
  client: Tables<"clientes">
}

export function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{client.cliente}</h2>
      <div className="flex gap-2">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm initialData={client} onSuccess={() => setIsEditDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        <DeleteClientButton clientId={client.id} />
      </div>
    </div>
  )
}
