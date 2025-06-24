"use client"
import Link from "next/link"
import {
  LayoutDashboard,
  Upload,
  Users,
  UserPlus,
  BarChart,
  Handshake,
  DollarSign,
  Calendar,
  Percent,
  Wallet,
  Scale,
  Landmark,
  TrendingUp,
  Search,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Datos de navegación
const navItems = [
  {
    label: "Navegación",
    items: [
      { title: "Dashboard General", href: "/", icon: LayoutDashboard },
      { title: "Cargador de Datos", href: "/data-loader", icon: Upload },
      { title: "Clientes", href: "/clients", icon: Users },
      { title: "Leads", href: "/leads", icon: UserPlus },
      { title: "Resumen de Proyectos", href: "/project-summary", icon: BarChart },
      { title: "Partnerships", href: "/partnerships", icon: Handshake },
      { title: "Ingresos y Egresos", href: "/transactions", icon: DollarSign },
      { title: "Proyecciones", href: "/projections", icon: Calendar },
      { title: "Comisiones", href: "/commissions", icon: Percent },
      { title: "Resumen de Cuentas", href: "/account-summary", icon: Wallet },
      { title: "Balance General", href: "/balance-sheet", icon: Scale },
      { title: "Activos No Corrientes", href: "/non-current-assets", icon: Landmark },
      { title: "Pasivos Corrientes", href: "/current-liabilities", icon: TrendingUp },
      { title: "Utilidad Neta", href: "/net-profit", icon: DollarSign },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/software-nicaragua-logo.png" alt="Software Nicaragua Logo" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Software Nicaragua</span>
            <span className="text-xs text-muted-foreground">Sistema Financiero</span>
          </div>
        </div>
        <form className="px-2">
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Buscar
              </Label>
              <SidebarInput id="search" placeholder="Buscar..." className="pl-8" />
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2 text-xs text-muted-foreground">© 2024 Software Nicaragua</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
