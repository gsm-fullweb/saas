"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UsersRound,
  UserCog,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userType, setUserType] = useState<string>("admin")

  // Detectar tipo de usuário do localStorage
  useEffect(() => {
    const getUserType = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("userType") || "admin"
      }
      return "admin"
    }
    setUserType(getUserType())
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userData")
    window.location.href = "/"
  }

  // Itens de navegação baseados no tipo de usuário
  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Conversas",
        href: "/conversas",
        icon: MessageSquare,
        allowedFor: ["admin", "agente"],
      },
      {
        title: "Contatos",
        href: "/contatos",
        icon: Users,
        allowedFor: ["admin", "agente"],
      },
    ]

    if (userType === "admin") {
      return [
        {
          title: "Dashboard Admin",
          href: "/dashboard",
          icon: LayoutDashboard,
          allowedFor: ["admin"],
        },
        ...baseItems,
        {
          title: "Agentes",
          href: "/agentes",
          icon: UserCheck,
          allowedFor: ["admin"],
        },
        {
          title: "Times",
          href: "/times",
          icon: UsersRound,
          allowedFor: ["admin"],
        },
        {
          title: "Atribuições",
          href: "/atribuicoes",
          icon: UserCog,
          allowedFor: ["admin"],
        },
        {
          title: "Bots",
          href: "/bots",
          icon: Bot,
          allowedFor: ["admin"],
        },
        {
          title: "Configurações",
          href: "/configuracoes",
          icon: Settings,
          allowedFor: ["admin"],
        },
      ]
    } else {
      return [
        {
          title: "Meu Dashboard",
          href: "/agente-dashboard",
          icon: LayoutDashboard,
          allowedFor: ["agente"],
        },
        ...baseItems,
      ]
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-logo.svg" />
              <AvatarFallback>WS</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">WhatsApp SaaS</h2>
              <p className="text-xs text-muted-foreground">Empresa Demo</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed && "px-2", isActive && "bg-secondary")}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
            collapsed && "px-2",
          )}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  )
}
