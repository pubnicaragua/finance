import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import TransactionForm from "@/components/transaction-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import TransactionTable from "./TransactionTable" // Importar el nuevo componente de tabla

export default async function TransactionsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ingresos y Egresos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Agregar Transacción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Transacción</DialogTitle>
              <DialogDescription>Completa los detalles para añadir un nuevo ingreso o egreso.</DialogDescription>
            </DialogHeader>
            <TransactionForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Usar el componente TransactionTable aquí */}
      <TransactionTable />
    </div>
  )
}
