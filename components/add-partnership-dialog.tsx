"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PartnershipForm } from "@/components/partnership-form"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export function AddPartnershipDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setIsOpen(false)
    router.refresh()
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