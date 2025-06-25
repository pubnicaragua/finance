"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { deleteLead } from "@/actions/lead-actions"
import { TrashIcon } from "lucide-react"

interface DeleteLeadButtonProps {
  leadId: string
  onSuccess?: () => void
}

export function DeleteLeadButton({ leadId, onSuccess }: DeleteLeadButtonProps) {
  const [state, formAction, isPending] = useActionState(async (prevState, payload) => {
    return deleteLead(payload as string)
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
    if (window.confirm("¿Estás seguro de que quieres eliminar este lead?")) {
      formAction(leadId)
    }
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending}>
      <TrashIcon className="h-4 w-4" />
      <span className="sr-only">Eliminar Lead</span>
    </Button>
  )
}
