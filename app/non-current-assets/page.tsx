// NO "use client" aquí, es un Server Component
export const dynamic = "force-dynamic" // Asegura que la página se renderice dinámicamente

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon } from "lucide-react"
import { ActivoNoCorrienteForm } from "@/components/activo-no-corriente-form"
import { AssetsTable } from "@/components/AssetsTable"
import { getNonCurrentAssets } from "@/actions/asset-liability-actions" // Importar la Server Action
import { revalidatePath } from "next/cache" // Para revalidar después de operaciones

export default async function NonCurrentAssetsPage() {
  const assets = await getNonCurrentAssets() // Obtener datos directamente en el Server Component

  // Server Action para revalidar la ruta después de una operación de formulario
  const handleAssetOperation = async () => {
    "use server"
    revalidatePath("/non-current-assets")
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Activos No Corrientes</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Dialogo para añadir/editar, que es un Client Component */}
          <NonCurrentAssetsDialog onAssetOperation={handleAssetOperation} />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        {/* Pasar los datos como prop al Client Component AssetsTable */}
        <AssetsTable assets={assets} onAssetOperation={handleAssetOperation} />
      </main>
    </SidebarInset>
  )
}

// Componente de diálogo para añadir/editar (Client Component)
// Se separa para manejar el estado del diálogo y pasar la Server Action de revalidación
import { useState } from "react"
import type { Tables } from "@/lib/database.types"

interface NonCurrentAssetsDialogProps {
  onAssetOperation: () => void
  initialData?: Tables<"activos_no_corrientes"> | null
}

function NonCurrentAssetsDialog({ onAssetOperation, initialData = null }: NonCurrentAssetsDialogProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Tables<"activos_no_corrientes"> | null>(initialData)

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingAsset(null)
    onAssetOperation() // Llama a la Server Action para revalidar
  }

  const handleEdit = (asset: Tables<"activos_no_corrientes">) => {
    setEditingAsset(asset)
    setIsFormOpen(true)
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1" onClick={() => setEditingAsset(null)}>
          <PlusIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Activo No Corriente</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingAsset ? "Editar Activo No Corriente" : "Añadir Activo No Corriente"}</DialogTitle>
        </DialogHeader>
        <ActivoNoCorrienteForm
          initialData={editingAsset}
          onSuccess={handleSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
