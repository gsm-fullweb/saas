"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthorization = () => {
      if (typeof window !== "undefined") {
        const storedUserType = localStorage.getItem("userType")
        setUserType(storedUserType)

        if (storedUserType === "admin") {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      }
    }

    checkAuthorization()
  }, [])

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta página é restrita apenas para administradores.
              {userType === "agente" && " Você está logado como agente."}
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.back()} className="w-full" variant="outline">
                Voltar
              </Button>
              <Button onClick={() => router.push(userType === "agente" ? "/agente-dashboard" : "/")} className="w-full">
                Ir para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authorized
  return <div>{children}</div>
}
