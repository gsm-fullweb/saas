"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { UserPlus, X, Crown, User, Settings } from "lucide-react"

interface Usuario {
  id: string
  nome: string
  email: string
  tipo_usuario: "gestor" | "agente"
  ativo: boolean
  time_padrao?: string
}

interface Time {
  id: string
  nome: string
  cor: string
  ativo: boolean
  gestor_nome: string
}

interface ConversationAssignmentProps {
  conversaId: string
  agentesAtribuidos: Usuario[]
  timeAtribuido?: Time
  onUpdateAssignment: (agentes: Usuario[], time?: Time) => void
  isAdmin: boolean
}

// Dados mockados
const usuariosMock: Usuario[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@empresa.com",
    tipo_usuario: "gestor",
    ativo: true,
    time_padrao: "Vendas",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria@empresa.com",
    tipo_usuario: "agente",
    ativo: true,
    time_padrao: "Vendas",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@empresa.com",
    tipo_usuario: "agente",
    ativo: true,
    time_padrao: "Vendas",
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana@empresa.com",
    tipo_usuario: "gestor",
    ativo: true,
    time_padrao: "Suporte",
  },
  {
    id: "5",
    nome: "Carlos Lima",
    email: "carlos@empresa.com",
    tipo_usuario: "agente",
    ativo: true,
    time_padrao: "Suporte",
  },
]

const timesMock: Time[] = [
  { id: "1", nome: "Vendas", cor: "#10B981", ativo: true, gestor_nome: "João Silva" },
  { id: "2", nome: "Suporte Técnico", cor: "#3B82F6", ativo: true, gestor_nome: "Ana Oliveira" },
  { id: "3", nome: "Atendimento Geral", cor: "#F59E0B", ativo: false, gestor_nome: "Roberto Santos" },
]

export function ConversationAssignment({
  conversaId,
  agentesAtribuidos,
  timeAtribuido,
  onUpdateAssignment,
  isAdmin,
}: ConversationAssignmentProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const [timeSelecionado, setTimeSelecionado] = useState<string>(timeAtribuido?.id || "default")
  const [agentesMultiplos, setAgentesMultiplos] = useState<string[]>(agentesAtribuidos.map((a) => a.id))

  const handleSalvarAtribuicao = () => {
    const novosAgentes = agentesMultiplos.map((agenteId) => usuariosMock.find((u) => u.id === agenteId)!)
    const novoTime = timeSelecionado ? timesMock.find((t) => t.id === timeSelecionado) : undefined

    onUpdateAssignment(novosAgentes, novoTime)
    setModalAberto(false)
  }

  const handleRemoverAgente = (agenteId: string) => {
    const novosAgentes = agentesAtribuidos.filter((a) => a.id !== agenteId)
    onUpdateAssignment(novosAgentes, timeAtribuido)
  }

  const toggleAgenteMultiplo = (agenteId: string) => {
    setAgentesMultiplos((prev) =>
      prev.includes(agenteId) ? prev.filter((id) => id !== agenteId) : [...prev, agenteId],
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Atribuições
          </div>
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Gerenciar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Gerenciar Atribuições da Conversa</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Selecionar Time */}
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Select value={timeSelecionado} onValueChange={setTimeSelecionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Nenhum time</SelectItem>
                      {timesMock
                        .filter((t) => t.ativo)
                        .map((time) => (
                          <SelectItem key={time.id} value={time.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: time.cor }} />
                              {time.nome}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Seleção de Agentes */}
                <div>
                  <Label>Agentes Atribuídos</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {usuariosMock
                      .filter((u) => u.ativo)
                      .map((usuario) => (
                        <div key={usuario.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`agente-${usuario.id}`}
                            checked={agentesMultiplos.includes(usuario.id)}
                            onCheckedChange={() => toggleAgenteMultiplo(usuario.id)}
                          />
                          <Label htmlFor={`agente-${usuario.id}`} className="flex items-center gap-2 cursor-pointer">
                            {usuario.tipo_usuario === "gestor" ? (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <User className="w-4 h-4 text-gray-500" />
                            )}
                            {usuario.nome} - {usuario.email}
                            {usuario.time_padrao && (
                              <Badge variant="outline" className="text-xs">
                                {usuario.time_padrao}
                              </Badge>
                            )}
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setModalAberto(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSalvarAtribuicao} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Salvar Atribuições
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Atribuído */}
        {timeAtribuido && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Time</Label>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: timeAtribuido.cor }} />
              <span className="text-sm font-medium">{timeAtribuido.nome}</span>
              <Badge variant="outline" className="text-xs">
                Gestor: {timeAtribuido.gestor_nome}
              </Badge>
            </div>
          </div>
        )}

        {/* Agentes Atribuídos */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Agentes Atribuídos ({agentesAtribuidos.length})</Label>
          {agentesAtribuidos.length > 0 ? (
            <div className="space-y-2">
              {agentesAtribuidos.map((agente) => (
                <div
                  key={agente.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                        {agente.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{agente.nome}</span>
                    {agente.tipo_usuario === "gestor" && <Crown className="w-3 h-3 text-yellow-500" />}
                    {agente.time_padrao && (
                      <Badge variant="outline" className="text-xs">
                        {agente.time_padrao}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoverAgente(agente.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              Nenhum agente atribuído
            </div>
          )}
        </div>

        {/* Ação Rápida */}
        {agentesAtribuidos.length === 0 && (
          <Button
            onClick={() => setModalAberto(true)}
            variant="outline"
            className="w-full border-dashed border-2 text-gray-500 hover:text-gray-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Atribuir Agente
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
