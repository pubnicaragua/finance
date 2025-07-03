export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { PlusIcon } from "lucide-react"
import { ActivoCorrienteForm } from "@/components/activo-corriente-form"
import { AssetsTable } from "@/components/AssetsTable"
import { getCurrentAssets } from "@/actions/asset-liability-actions"
import { revalidatePath } from "next/cache"

export default async function CurrentAssetsPage() {
  const assets = await getCurrentAssets()

  const handleAssetOperation = async () => {
    "use server"
    revalidatePath("/activos-corrientes")
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Activos Corrientes</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Activo Corriente</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Activo Corriente</DialogTitle>
              </DialogHeader>
              <ActivoCorrienteForm
                onSuccess={handleAssetOperation}
                onCancel={() => {}}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <AssetsTable assets={assets} onAssetOperation={handleAssetOperation} type="corriente" />
      </main>
    </SidebarInset>
  )
}