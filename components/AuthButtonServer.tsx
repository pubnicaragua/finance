import Link from "next/link"
import { createClient } from "@/lib/supabase/server" // Importación directa del cliente de servidor
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function AuthButtonServer() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect("/login") // Redirigir a login después de cerrar sesión
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <Button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  )
}