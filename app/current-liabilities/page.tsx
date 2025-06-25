// NO "use client" aquí, es un Server Component
export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon } from "lucide-react"
import { PasivoCorrienteForm } from "@/components/pasivo-corriente-form"
import { LiabilitiesTable } from "@/components/LiabilitiesTable"
import { getCurrentLiabilities } from "@/actions/asset-liability-actions" // Importar la Server Action
import { revalidatePath } from "next/cache" // Para revalidar después de operaciones

export default async function CurrentLiabilitiesPage() {
  const liabilities = await getCurrentLiabilities() // Obtener datos directamente en el Server Component

  // Server Action para revalidar la ruta después de una operación de formulario
  const handleLiabilityOperation = async () => {
    "use server"
    revalidatePath("/current-liabilities")
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Pasivos Corrientes</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Dialogo para añadir/editar, que es un Client Component */}
          <CurrentLiabilitiesDialog onLiabilityOperation={handleLiabilityOperation} />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        {/* Pasar los datos como prop al Client Component LiabilitiesTable */}
        <LiabilitiesTable liabilities={liabilities} onLiabilityOperation={handleLiabilityOperation} />
      </main>
    </SidebarInset>
  )
}

// Componente de diálogo para añadir/editar (Client Component)
// Se separa para manejar el estado del diálogo y pasar la Server Action de revalidación
import { useState } from "react"
import type { Tables } from "@/lib/database.types"

interface CurrentLiabilitiesDialogProps {
  onLiabilityOperation: () => void
  initialData?: Tables<"pasivos_corrientes"> | null
}

function CurrentLiabilitiesDialog({ onLiabilityOperation, initialData = null }: CurrentLiabilitiesDialogProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLiability, setEditingLiability] = useState<Tables<"pasivos_corrientes"> | null>(initialData)

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingLiability(null)
    onLiabilityOperation() // Llama a la Server Action para revalidar
  }

  const handleEdit = (liability: Tables<"pasivos_corrientes">) => {
    setEditingLiability(liability)
    setIsFormOpen(true)
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1" onClick={() => setEditingLiability(null)}>
          <PlusIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Pasivo Corriente</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingLiability ? "Editar Pasivo Corriente" : "Añadir Pasivo Corriente"}</DialogTitle>
        </DialogHeader>
        <PasivoCorrienteForm
          initialData={editingLiability}
          onSuccess={handleSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
