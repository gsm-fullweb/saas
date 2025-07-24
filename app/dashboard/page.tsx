"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Users, Clock, TrendingUp, Phone, User } from "lucide-react"

// Dados mockados para demonstração
const estatisticas = [
  {
    titulo: "Conversas Abertas",
    valor: "24",
    descricao: "Aguardando atendimento",
    icone: MessageSquare,
    cor: "text-orange-600 dark:text-orange-400",
  },
  {
    titulo: "Sendo Atendidas",
    valor: "18",
    descricao: "+12% que ontem",
    icone: Clock,
    cor: "text-blue-600 dark:text-blue-400",
  },
  {
    titulo: "Tempo de Resposta",
    valor: "2.5min",
    descricao: "Tempo médio",
    icone: TrendingUp,
    cor: "text-green-600 dark:text-green-400",
  },
]

const conversasRecentes = [
  {
    id: "1",
    nome: "Maria Silva",
    telefone: "+5511999999999",
    ultimaMensagem: "Preciso de ajuda com meu pedido",
    tempo: "2 min",
    status: "aberta" as const,
    avatar: "MS",
  },
  {
    id: "2",
    nome: "João Santos",
    telefone: "+5511888888888",
    ultimaMensagem: "Obrigado pelo atendimento!",
    tempo: "15 min",
    status: "em_andamento" as const,
    agente: "Ana Costa",
    avatar: "JS",
  },
  {
    id: "3",
    nome: "Pedro Oliveira",
    telefone: "+5511777777777",
    ultimaMensagem: "Quando vai chegar meu produto?",
    tempo: "1h",
    status: "aguardando" as const,
    avatar: "PO",
  },
]

const agentesOnline = [
  { nome: "Ana Costa", conversas: 3, avatar: "AC", status: "online" },
  { nome: "Bruno Silva", conversas: 2, avatar: "BS", status: "online" },
  { nome: "Carla Santos", conversas: 1, avatar: "CS", status: "online" },
]

export default function DashboardPage() {
  const router = useRouter()

  const abrirConversa = (id: string) => {
    router.push(`/conversas/${id}`)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      aberta: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      em_andamento: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      aguardando: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    }

    const labels = {
      aberta: "Aberta",
      em_andamento: "Em Andamento",
      aguardando: "Aguardando",
    }

    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral do atendimento via WhatsApp</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {estatisticas.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.titulo}</CardTitle>
              <stat.icone className={`h-4 w-4 ${stat.cor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.valor}</div>
              <p className="text-xs text-muted-foreground">{stat.descricao}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversas Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversas Recentes
            </CardTitle>
            <p className="text-sm text-muted-foreground">Últimas interações com clientes</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversasRecentes.map((conversa) => (
              <div
                key={conversa.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">{conversa.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{conversa.nome}</h4>
                      {getStatusBadge(conversa.status)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {conversa.telefone}
                    </div>
                    <p className="text-sm text-muted-foreground">{conversa.ultimaMensagem}</p>
                    {conversa.agente && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <User className="h-3 w-3" />
                        Atendido por: {conversa.agente}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{conversa.tempo}</p>
                  <Button size="sm" onClick={() => abrirConversa(conversa.id)} className="mt-2">
                    Abrir
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipe Online */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipe Online
            </CardTitle>
            <p className="text-sm text-muted-foreground">Status dos agentes</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Agentes Online</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {agentesOnline.length} online
                </Badge>
              </div>

              {agentesOnline.map((agente, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {agente.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{agente.nome}</p>
                      <p className="text-xs text-muted-foreground">{agente.conversas} conversas ativas</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Total de mensagens hoje</p>
                  <p className="text-2xl font-bold text-primary">156</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
