import { createServerSupabase } from "@/lib/supabase/server"
import TransactionForm from "@/components/transaction-form" // Importación por defecto
import { TransactionTable } from "./TransactionTable" // Importación nombrada
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from 'lucide-react'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export const revalidate = 0

export default async function TransactionsPage() {
  const supabase = createServerSupabase()
  const { data: transactions, error } = await supabase
    .from("transacciones")
    .select("*")
    .order("fecha", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Gestión de Transacciones</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <h2 className="text-2xl font-bold">Gestión de Transacciones</h2>
          <p className="text-red-500">Error al cargar transacciones: {error.message}</p>
        </main>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestión de Transacciones</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Gestión de Transacciones</h2>
        <p className="text-muted-foreground">Registra y administra todas las transacciones financieras.</p>

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Lista de Transacciones</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Añadir Transacción</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Transacción</DialogTitle>
                <DialogDescription>
                  Rellena los campos para añadir una nueva transacción a la base de datos.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm />
            </DialogContent>
          </Dialog>
        </div>

        <TransactionTable transactions={transactions || []} />
      </main>
    </SidebarInset>
  )
}
