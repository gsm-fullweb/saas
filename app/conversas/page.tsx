"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { MessageSquare, Search, Phone, Clock, User, Users, UserCog } from "lucide-react"

interface Agente {
  id: string
  nome: string
  email: string
  tipo_usuario: "gestor" | "agente"
}

interface Time {
  id: string
  nome: string
  cor: string
}

interface Conversa {
  id: string
  numero_ticket: string
  contato: {
    nome: string
    telefone: string
  }
  assunto: string
  status: "aberta" | "em_andamento" | "aguardando" | "fechada"
  prioridade: "baixa" | "media" | "alta" | "urgente"
  agentes_atribuidos: Agente[]
  time_atribuido?: Time
  ultima_mensagem: string
  tempo_espera: string
  criado_em: string
}

// Dados mockados com atribuições
const conversasMock: Conversa[] = [
  {
    id: "1",
    numero_ticket: "TK-001",
    contato: {
      nome: "Maria Silva",
      telefone: "+5511999999999",
    },
    assunto: "Dúvida sobre produto",
    status: "aberta",
    prioridade: "alta",
    agentes_atribuidos: [{ id: "2", nome: "Maria Santos", email: "maria@empresa.com", tipo_usuario: "agente" }],
    time_atribuido: { id: "1", nome: "Vendas", cor: "#10B981" },
    ultima_mensagem: "Preciso de mais informações sobre o produto X",
    tempo_espera: "5 min",
    criado_em: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    numero_ticket: "TK-002",
    contato: {
      nome: "João Santos",
      telefone: "+5511888888888",
    },
    assunto: "Problema com entrega",
    status: "em_andamento",
    prioridade: "media",
    agentes_atribuidos: [
      { id: "3", nome: "Pedro Costa", email: "pedro@empresa.com", tipo_usuario: "agente" },
      { id: "5", nome: "Carlos Lima", email: "carlos@empresa.com", tipo_usuario: "agente" },
    ],
    time_atribuido: { id: "2", nome: "Suporte Técnico", cor: "#3B82F6" },
    ultima_mensagem: "Meu pedido ainda não chegou",
    tempo_espera: "20 min",
    criado_em: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    numero_ticket: "TK-003",
    contato: {
      nome: "Ana Costa",
      telefone: "+5511777777777",
    },
    assunto: "Solicitação de reembolso",
    status: "aguardando",
    prioridade: "baixa",
    agentes_atribuidos: [],
    ultima_mensagem: "Gostaria de solicitar o reembolso",
    tempo_espera: "1h 30min",
    criado_em: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    numero_ticket: "TK-004",
    contato: {
      nome: "Roberto Lima",
      telefone: "+5511666666666",
    },
    assunto: "Informações sobre planos",
    status: "fechada",
    prioridade: "media",
    agentes_atribuidos: [{ id: "1", nome: "João Silva", email: "joao@empresa.com", tipo_usuario: "gestor" }],
    time_atribuido: { id: "1", nome: "Vendas", cor: "#10B981" },
    ultima_mensagem: "Obrigado pelas informações!",
    tempo_espera: "0 min",
    criado_em: "2024-01-14T16:20:00Z",
  },
]

export default function ConversasPage() {
  const router = useRouter()
  const [conversas, setConversas] = useState<Conversa[]>(conversasMock)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todas")
  const [filtroTime, setFiltroTime] = useState<string>("todos")
  const [userType, setUserType] = useState<string>("admin")

  useEffect(() => {
    // Detectar tipo de usuário
    const getUserType = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("userType") || "admin"
      }
      return "admin"
    }
    setUserType(getUserType())

    // Se for agente, filtrar apenas conversas atribuídas a ele
    if (getUserType() === "agente") {
      const userData = localStorage.getItem("userData")
      if (userData) {
        const user = JSON.parse(userData)
        const conversasFiltradas = conversasMock.filter((conversa) =>
          conversa.agentes_atribuidos.some((agente) => agente.id === user.id),
        )
        setConversas(conversasFiltradas)
      }
    }
  }, [])

  // Filtrar conversas
  const conversasFiltradas = conversas.filter((conversa) => {
    const matchBusca =
      conversa.numero_ticket.toLowerCase().includes(busca.toLowerCase()) ||
      conversa.contato.nome.toLowerCase().includes(busca.toLowerCase()) ||
      conversa.assunto.toLowerCase().includes(busca.toLowerCase())

    const matchStatus = filtroStatus === "todas" || conversa.status === filtroStatus
    const matchTime = filtroTime === "todos" || conversa.time_atribuido?.id === filtroTime

    return matchBusca && matchStatus && matchTime
  })

  const abrirConversa = (id: string) => {
    router.push(`/conversas/${id}`)
  }

  const formatarTempo = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Times únicos para filtro
  const timesUnicos = Array.from(new Set(conversas.map((c) => c.time_atribuido).filter(Boolean)))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {userType === "admin" ? "Todas as Conversas" : "Minhas Conversas"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userType === "admin" ? "Gerencie todas as conversas da empresa" : "Conversas atribuídas a você"}
          </p>
        </div>
        {userType === "admin" && (
          <Button onClick={() => router.push("/atribuicoes")} className="bg-blue-600 hover:bg-blue-700">
            <UserCog className="w-4 h-4 mr-2" />
            Gerenciar Atribuições
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{conversas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Abertas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {conversas.filter((c) => c.status === "aberta").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sem Atribuição</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {conversas.filter((c) => c.agentes_atribuidos.length === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Atribuídas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {conversas.filter((c) => c.agentes_atribuidos.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por ticket, cliente ou assunto..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos os status</SelectItem>
                <SelectItem value="aberta">Abertas</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="fechada">Fechadas</SelectItem>
              </SelectContent>
            </Select>
            {userType === "admin" && (
              <Select value={filtroTime} onValueChange={setFiltroTime}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os times</SelectItem>
                  {timesUnicos.map((time) => (
                    <SelectItem key={time!.id} value={time!.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: time!.cor }} />
                        {time!.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conversas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversas ({conversasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conversasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma conversa encontrada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {busca || filtroStatus !== "todas" || filtroTime !== "todos"
                  ? "Tente ajustar os filtros de busca"
                  : userType === "admin"
                    ? "Não há conversas no sistema"
                    : "Você não tem conversas atribuídas"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversasFiltradas.map((conversa) => (
                <div
                  key={conversa.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => abrirConversa(conversa.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{conversa.numero_ticket}</Badge>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{conversa.contato.nome}</h4>
                        <StatusBadge status={conversa.status} />
                        <PriorityBadge priority={conversa.prioridade} />
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Phone className="w-3 h-3" />
                        {conversa.contato.telefone}
                      </div>

                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{conversa.assunto}</p>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{conversa.ultima_mensagem}</p>

                      {/* Time Atribuído */}
                      {conversa.time_atribuido && (
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: conversa.time_atribuido.cor }}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Time: {conversa.time_atribuido.nome}
                          </span>
                        </div>
                      )}

                      {/* Agentes Atribuídos */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Agentes ({conversa.agentes_atribuidos.length}):
                        </span>
                        {conversa.agentes_atribuidos.length > 0 ? (
                          <div className="flex gap-1">
                            {conversa.agentes_atribuidos.slice(0, 3).map((agente) => (
                              <Avatar key={agente.id} className="w-6 h-6">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                  {agente.nome
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {conversa.agentes_atribuidos.length > 3 && (
                              <Badge variant="secondary" className="text-xs h-6">
                                +{conversa.agentes_atribuidos.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            Sem atribuição
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      <p>Aguardando: {conversa.tempo_espera}</p>
                      <p>{formatarTempo(conversa.criado_em)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
