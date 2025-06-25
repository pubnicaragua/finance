"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon } from "lucide-react"
import { ActivoNoCorrienteForm } from "@/components/activo-no-corriente-form" // Importación corregida
import { AssetsTable } from "@/components/AssetsTable"
import type { Tables } from "@/lib/database.types"

export default function NonCurrentAssetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Tables<"activos_no_corrientes"> | null>(null)

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingAsset(null)
  }

  const handleEdit = (asset: Tables<"activos_no_corrientes">) => {
    setEditingAsset(asset)
    setIsFormOpen(true)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Activos No Corrientes</h1>
        <div className="ml-auto flex items-center gap-2">
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
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <AssetsTable onEdit={handleEdit} />
      </main>
    </SidebarInset>
  )
}
