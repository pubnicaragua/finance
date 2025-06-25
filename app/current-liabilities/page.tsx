"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon } from "lucide-react"
import { PasivoCorrienteForm } from "@/components/pasivo-corriente-form"
import { LiabilitiesTable } from "@/components/LiabilitiesTable"
import type { Tables } from "@/lib/database.types"
import { getPasivosCorrientes } from "@/actions/asset-liability-actions" // Asumiendo que esta función existe

export default function CurrentLiabilitiesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLiability, setEditingLiability] = useState<Tables<"pasivos_corrientes"> | null>(null)
  const [liabilities, setLiabilities] = useState<Tables<"pasivos_corrientes">[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLiabilities = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPasivosCorrientes()
      setLiabilities(data || []) // Asegurar que siempre sea un array
    } catch (err: any) {
      console.error("Error fetching current liabilities:", err)
      setError("Error al cargar pasivos corrientes: " + err.message)
      setLiabilities([]) // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiabilities()
  }, [])

  const handleSuccess = () => {
    setIsFormOpen(false)
    setEditingLiability(null)
    fetchLiabilities() // Revalidar datos después de una operación exitosa
  }

  const handleEdit = (liability: Tables<"pasivos_corrientes">) => {
    setEditingLiability(liability)
    setIsFormOpen(true)
  }

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Pasivos Corrientes</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">Cargando pasivos corrientes...</main>
      </SidebarInset>
    )
  }

  if (error) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Pasivos Corrientes</h1>
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
        <h1 className="text-lg font-semibold">Pasivos Corrientes</h1>
        <div className="ml-auto flex items-center gap-2">
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
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <LiabilitiesTable liabilities={liabilities} onEdit={handleEdit} />
      </main>
    </SidebarInset>
  )
}
