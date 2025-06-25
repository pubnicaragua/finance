"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PartnershipForm } from "@/components/partnership-form"

interface AddPartnershipDialogProps {
  onPartnershipAdded: () => void // Callback para cuando se añade un partnership con éxito
}

export function AddPartnershipDialog({ onPartnershipAdded }: AddPartnershipDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false) // Cerrar el diálogo
    onPartnershipAdded() // Notificar al padre que un partnership fue añadido
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Añadir Partnership</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Partnership</DialogTitle>
        </DialogHeader>
        <PartnershipForm onSuccess={handleSuccess} onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
