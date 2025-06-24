import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import AuthButtonServer from "@/components/AuthButtonServer"
import Link from "next/link"

export default async function ActivosCorrientesPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Activos Corrientes</h1>
      <p className="mt-3 text-2xl">Esta es la página de Activos Corrientes.</p>
      <div className="mt-5">
        <AuthButtonServer />
      </div>
      <Link href="/cuentas-por-cobrar">Cuentas por Cobrar</Link>
    </div>
  )
}
