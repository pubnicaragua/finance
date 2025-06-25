"use client"

import type React from "react"
import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { testAction } from "./actions" // ← ahora importamos la Server Action

export default function TestFormPage() {
  const [state, formAction, isPending] = useActionState(testAction, null)
  const { toast } = useToast()
  const [testInput, setTestInput] = useState("")

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Éxito", description: state.message, variant: "default" })
    } else if (state?.message) {
      toast({ title: "Error", description: state.message, variant: "destructive" })
    }
  }, [state, toast])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startTransition(() => {
      formAction({ testInput })
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Formulario de Prueba de Server Action</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="testInput">Entrada de Prueba</Label>
              <Input
                id="testInput"
                placeholder="Escribe algo"
                required
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enviando…" : "Enviar Prueba"}
            </Button>
            {state && (
              <p className={`mt-2 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
