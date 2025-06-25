"use client"

import { useState, useEffect } from "react" // Importar useEffect
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon } from "lucide-react"
import { ActivoNoCorrienteForm } from "@/components/activo-no-corriente-form"
import { AssetsTable } from "@/components/AssetsTable"
import type { Tables } from "@/lib/database.types"
import { getActivosNoCorrientes } from "@/actions/asset-liability-actions" // Asumiendo que esta función existe

export default function NonCurrentAssetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Tables<"activos_no_corrientes"> | null>(null)
  const [assets, setAssets] = useState<Tables<"activos_no_corrientes">[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getActivosNoCorrientes()
      setAssets(data || []) // Asegurar que siempre sea un array
    } catch (err: any) {
      console.error("Error fetching non-current assets:", err)
      setError("Error al cargar activos no corrientes: " + err.message)
      setAssets([]) // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingAsset(null)
    fetchAssets() // Revalidar datos después de una operación exitosa
  }

  const handleEdit = (asset: Tables<"activos_no_corrientes">) => {
    setEditingAsset(asset)
    setIsFormOpen(true)
  }

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Activos No Corrientes</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">Cargando activos no corrientes...</main>
      </SidebarInset>
    )
  }

  if (error) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Activos No Corrientes</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 text-red-500">{error}</main>
      </SidebarInset>
    )
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
        <AssetsTable assets={assets} onEdit={handleEdit} />
      </main>
    </SidebarInset>
  )
}
