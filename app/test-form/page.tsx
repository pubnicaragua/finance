"use client"

import type React from "react"
import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addProjection } from "@/actions/payment-projection-actions" // Usamos una acción existente para la prueba

export default function TestForm() {
  const [state, formAction, isPending] = useActionState(addProjection, null)
  const { toast } = useToast()

  const [testValue, setTestValue] = useState("")

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Éxito",
        description: state.message,
        variant: "default",
      })
    } else if (state?.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      clienteId: "test-client-id-123", // ID de cliente de prueba
      fecha: new Date().toISOString().split("T")[0],
      monto: Number.parseFloat(testValue) || 0,
      pagado: false,
    }
    console.log("Client: Submitting test data:", data)
    formAction(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Formulario de Prueba de Server Action</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="testInput">Valor de Prueba</Label>
            <Input
              id="testInput"
              name="testInput"
              type="text"
              placeholder="Introduce un valor"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar Prueba"}
          </Button>
        </form>
        {state && (
          <div className={`mt-4 text-center ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</div>
        )}
      </div>
    </div>
  )
}
