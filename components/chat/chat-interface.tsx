"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, Lock, StickyNote, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Mensagem {
  id: string
  tipo: "enviada" | "recebida" | "nota_interna"
  conteudo: string
  timestamp: string
  autor?: string
  lida?: boolean
}

interface ChatInterfaceProps {
  contato: {
    id: string
    nome: string
    telefone: string
    avatar?: string
    status: "online" | "offline" | "digitando"
  }
  mensagens: Mensagem[]
  onEnviarMensagem: (mensagem: string, tipo: "cliente" | "nota_interna") => void
}

export function ChatInterface({ contato, mensagens, onEnviarMensagem }: ChatInterfaceProps) {
  const [novaMensagem, setNovaMensagem] = useState("")
  const [modoMensagem, setModoMensagem] = useState<"cliente" | "nota_interna">("cliente")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const handleEnviar = () => {
    if (!novaMensagem.trim()) return

    onEnviarMensagem(novaMensagem, modoMensagem)
    setNovaMensagem("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const formatarHora = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header do Chat */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contato.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {contato.nome
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{contato.nome}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">{contato.telefone}</p>
              <Badge variant={contato.status === "online" ? "default" : "secondary"} className="text-xs">
                {contato.status === "online" ? "Online" : contato.status === "digitando" ? "Digitando..." : "Offline"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem) => (
          <div key={mensagem.id}>
            {mensagem.tipo === "nota_interna" ? (
              // Nota Interna
              <div className="flex justify-center mb-4">
                <Card className="max-w-md bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-2">
                      <div className="p-1 bg-yellow-200 dark:bg-yellow-800 rounded">
                        <Lock className="h-3 w-3 text-yellow-700 dark:text-yellow-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700"
                          >
                            <StickyNote className="h-3 w-3 mr-1" />
                            Nota Interna
                          </Badge>
                          <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                            {mensagem.autor}
                          </span>
                        </div>
                        <p className="text-sm text-yellow-900 dark:text-yellow-100">{mensagem.conteudo}</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          {formatarHora(mensagem.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Mensagem Normal
              <div className={cn("flex", mensagem.tipo === "enviada" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                    mensagem.tipo === "enviada"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <p className="text-sm">{mensagem.conteudo}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <p className="text-xs opacity-70">{formatarHora(mensagem.timestamp)}</p>
                    {mensagem.tipo === "enviada" && (
                      <div className="text-xs opacity-70">{mensagem.lida ? "✓✓" : "✓"}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Input */}
      <div className="border-t bg-background p-4">
        {/* Tabs para alternar modo */}
        <Tabs
          value={modoMensagem}
          onValueChange={(value) => setModoMensagem(value as "cliente" | "nota_interna")}
          className="mb-3"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cliente" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Responder Cliente</span>
            </TabsTrigger>
            <TabsTrigger
              value="nota_interna"
              className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300"
            >
              <Lock className="h-4 w-4" />
              <span>Nota Interna</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Aviso visual quando no modo nota interna */}
        {modoMensagem === "nota_interna" && (
          <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Modo Nota Interna - Esta mensagem não será enviada ao cliente</span>
            </div>
          </div>
        )}

        {/* Input de mensagem */}
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="icon" className="mb-2">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                modoMensagem === "cliente" ? "Digite sua mensagem..." : "Adicionar nota interna para a equipe..."
              }
              className={cn(
                "min-h-[40px]",
                modoMensagem === "nota_interna" &&
                  "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950",
              )}
            />
          </div>

          <Button variant="ghost" size="icon" className="mb-2">
            <Smile className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleEnviar}
            size="icon"
            className={cn(
              "mb-2",
              modoMensagem === "nota_interna" &&
                "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600",
            )}
          >
            {modoMensagem === "cliente" ? <Send className="h-4 w-4" /> : <StickyNote className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
