"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Shield, User } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const handleLogin = (userType: "admin" | "agente") => {
    // Salvar tipo de usuário no localStorage
    localStorage.setItem("userType", userType)

    // Salvar dados do usuário mockados
    const userData =
      userType === "admin"
        ? { nome: "Admin", email: "admin@empresa.com", tipo: "admin" }
        : { nome: "João Santos", email: "agente@empresa.com", tipo: "agente" }

    localStorage.setItem("userData", JSON.stringify(userData))

    // Redirecionar baseado no tipo
    if (userType === "admin") {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/agente-dashboard"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (email === "admin@empresa.com" && senha === "123456") {
      handleLogin("admin")
    } else if (email === "agente@empresa.com" && senha === "123456") {
      handleLogin("agente")
    } else {
      alert("Credenciais inválidas!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">WhatsApp SaaS</CardTitle>
          <CardDescription>Faça login para acessar a plataforma de atendimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou acesso rápido para demonstração</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleLogin("admin")}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Shield className="w-5 h-5" />
              <div className="text-center">
                <div className="font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">Gestor</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleLogin("agente")}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <User className="w-5 h-5" />
              <div className="text-center">
                <div className="font-medium">Agente</div>
                <div className="text-xs text-muted-foreground">Atendente</div>
              </div>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">Credenciais de teste:</p>
            <p>
              <strong>Admin:</strong> admin@empresa.com / 123456
            </p>
            <p>
              <strong>Agente:</strong> agente@empresa.com / 123456
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
