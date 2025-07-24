"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Clock, CheckCircle, Star, Phone, Search, Filter } from "lucide-react"

// Dados mockados do agente logado
const agenteLogado = {
  nome: "João Santos",
  email: "agente@empresa.com",
  avatar: "JS",
  status: "online",
}

// Métricas pessoais do agente
const metricas = [
  {
    titulo: "Conversas Ativas",
    valor: "3",
    descricao: "Em andamento agora",
    icone: MessageSquare,
    cor: "text-blue-600 dark:text-blue-400",
  },
  {
    titulo: "Atendimentos Hoje",
    valor: "12",
    descricao: "+3 que ontem",
    icone: CheckCircle,
    cor: "text-green-600 dark:text-green-400",
  },
  {
    titulo: "Tempo Médio",
    valor: "3.2min",
    descricao: "Resposta média",
    icone: Clock,
    cor: "text-orange-600 dark:text-orange-400",
  },
  {
    titulo: "Satisfação",
    valor: "4.8",
    descricao: "Avaliação média",
    icone: Star,
    cor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    titulo: "Resolvidas",
    valor: "89",
    descricao: "Este mês",
    icone: CheckCircle,
    cor: "text-purple-600 dark:text-purple-400",
  },
]

// Conversas atribuídas ao agente
const conversasAtribuidas = [
  {
    id: "1",
    ticket: "#001",
    nome: "Maria Silva",
    telefone: "+5511999999999",
    assunto: "Dúvida sobre produto",
    ultimaMensagem: "Preciso de mais informações sobre o produto X",
    tempo: "2 min",
    tempoEspera: "5 min",
    status: "aberta" as const,
    prioridade: "alta" as const,
    avatar: "MS",
  },
  {
    id: "2",
    ticket: "#002",
    nome: "João Santos",
    telefone: "+5511888888888",
    assunto: "Problema com entrega",
    ultimaMensagem: "Meu pedido ainda não chegou",
    tempo: "15 min",
    tempoEspera: "20 min",
    status: "em_andamento" as const,
    prioridade: "media" as const,
    avatar: "JS",
  },
  {
    id: "3",
    ticket: "#003",
    nome: "Ana Costa",
    telefone: "+5511777777777",
    assunto: "Solicitação de reembolso",
    ultimaMensagem: "Gostaria de solicitar o reembolso",
    tempo: "1h",
    tempoEspera: "1h 30min",
    status: "aguardando" as const,
    prioridade: "baixa" as const,
    avatar: "AC",
  },
]

export default function AgenteDashboardPage() {
  const router = useRouter()
  const [filtroStatus, setFiltroStatus] = useState("todas")
  const [busca, setBusca] = useState("")
  const [conversasFiltradas, setConversasFiltradas] = useState(conversasAtribuidas)

  useEffect(() => {
    let resultado = conversasAtribuidas

    // Filtrar por status
    if (filtroStatus !== "todas") {
      resultado = resultado.filter((conversa) => conversa.status === filtroStatus)
    }

    // Filtrar por busca
    if (busca) {
      resultado = resultado.filter(
        (conversa) =>
          conversa.nome.toLowerCase().includes(busca.toLowerCase()) ||
          conversa.telefone.includes(busca) ||
          conversa.ticket.toLowerCase().includes(busca.toLowerCase()) ||
          conversa.assunto.toLowerCase().includes(busca.toLowerCase()),
      )
    }

    setConversasFiltradas(resultado)
  }, [filtroStatus, busca])

  const abrirConversa = (id: string) => {
    router.push(`/conversas/${id}`)
  }

  const marcarComoResolvida = (id: string) => {
    // Simular marcação como resolvida
    alert(`Conversa ${id} marcada como resolvida!`)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      aberta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      em_andamento: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      aguardando: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      fechada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }

    const labels = {
      aberta: "Aberta",
      em_andamento: "Em Andamento",
      aguardando: "Aguardando",
      fechada: "Fechada",
    }

    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getPriorityBadge = (prioridade: string) => {
    const variants = {
      baixa: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      alta: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      urgente: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }

    const labels = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
      urgente: "Urgente",
    }

    return (
      <Badge variant="outline" className={variants[prioridade as keyof typeof variants]}>
        {labels[prioridade as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com Status do Agente */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Dashboard</h1>
          <p className="text-muted-foreground">Suas conversas e métricas pessoais</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">Online</span>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">{agenteLogado.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{agenteLogado.nome}</p>
            <p className="text-sm text-muted-foreground">Agente</p>
          </div>
        </div>
      </div>

      {/* Métricas Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {metricas.map((metrica, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metrica.titulo}</CardTitle>
              <metrica.icone className={`h-4 w-4 ${metrica.cor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrica.valor}</div>
              <p className="text-xs text-muted-foreground">{metrica.descricao}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversas Atribuídas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Minhas Conversas ({conversasFiltradas.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground">Conversas atribuídas a você</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, telefone, ticket ou assunto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="aberta">Abertas</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="fechada">Fechadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {conversasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma conversa encontrada</h3>
              <p className="text-muted-foreground">
                {busca || filtroStatus !== "todas"
                  ? "Tente ajustar os filtros de busca"
                  : "Você não tem conversas atribuídas no momento"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversasFiltradas.map((conversa) => (
                <div
                  key={conversa.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">{conversa.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {conversa.ticket}
                        </Badge>
                        <h4 className="font-medium text-foreground">{conversa.nome}</h4>
                        {getStatusBadge(conversa.status)}
                        {getPriorityBadge(conversa.prioridade)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <Phone className="h-3 w-3" />
                        {conversa.telefone}
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{conversa.assunto}</p>
                      <p className="text-sm text-muted-foreground">{conversa.ultimaMensagem}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Última mensagem: {conversa.tempo}</span>
                        <span className="text-orange-600 dark:text-orange-400">Aguardando: {conversa.tempoEspera}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => abrirConversa(conversa.id)}>
                      Abrir Chat
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => marcarComoResolvida(conversa.id)}>
                      Resolver
                    </Button>
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
