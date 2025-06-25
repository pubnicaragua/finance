"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { deletePartnership } from "@/actions/partnership-actions"
import { TrashIcon } from "lucide-react"

interface DeletePartnershipButtonProps {
  partnershipId: string
  onSuccess?: () => void
}

export function DeletePartnershipButton({ partnershipId, onSuccess }: DeletePartnershipButtonProps) {
  const [state, formAction, isPending] = useActionState(async (prevState, payload) => {
    return deletePartnership(payload as string)
  }, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Éxito",
        description: state.message,
        variant: "default",
      })
      onSuccess?.()
    } else if (state?.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast, onSuccess])

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este partnership?")) {
      formAction(partnershipId)
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending}>
      <TrashIcon className="h-4 w-4" />
      <span className="sr-only">Eliminar Partnership</span>
    </Button>
  )
}
