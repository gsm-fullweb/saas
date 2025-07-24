"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { Send, Paperclip, Phone, Mail, ArrowLeft, MessageSquare, Lock, MessageCircle, StickyNote } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversationAssignment } from "@/components/admin/conversation-assignment"

interface Contato {
  id: string
  empresa_id: string
  telefone: string
  nome: string
  email?: string
  qualificacao: "lead" | "cliente" | "prospect" | "spam"
  observacoes?: string
  criado_em: string
  atualizado_em: string
}

interface Usuario {
  id: string
  empresa_id: string
  email: string
  nome: string
  tipo_usuario: "gestor" | "agente"
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

interface Conversa {
  id: string
  empresa_id: string
  contato_id: string
  agente_id?: string
  numero_ticket: string
  assunto: string
  status: "aberta" | "em_andamento" | "aguardando" | "fechada"
  prioridade: "baixa" | "media" | "alta" | "urgente"
  canal: "whatsapp" | "email" | "chat"
  primeira_mensagem_em: string
  ultima_mensagem_em: string
  criado_em: string
  atualizado_em: string
  contato?: Contato
  agente?: Usuario
  agentes_atribuidos?: Usuario[]
  time_atribuido?: {
    id: string
    nome: string
    cor: string
    ativo: boolean
    gestor_nome: string
  }
}

interface Mensagem {
  id: string
  conversa_id: string
  remetente_tipo: "cliente" | "agente" | "sistema"
  remetente_id?: string
  conteudo: string
  tipo_mensagem: "texto" | "imagem" | "audio" | "video" | "documento" | "sistema" | "nota_interna"
  enviada?: boolean
  lida?: boolean
  criado_em: string
  autor_nome?: string
}

export default function ConversaDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const conversaId = params.id as string

  const [conversa, setConversa] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [novaMensagem, setNovaMensagem] = useState("")
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [modoNotaInterna, setModoNotaInterna] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Obter dados do usuário logado
  const getUserData = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) {
        return JSON.parse(userData)
      }
    }
    return { nome: "Admin", email: "admin@empresa.com", id: "1" }
  }

  const isAdmin = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userType") === "admin"
    }
    return false
  }

  const usuarioLogado = getUserData()

  // Mock data para demonstração
  const mockConversa: Conversa = {
    id: conversaId,
    empresa_id: "1",
    contato_id: "1",
    agente_id: "1",
    numero_ticket: "TK-001",
    assunto: "Dúvida sobre produto",
    status: "em_andamento",
    prioridade: "alta",
    canal: "whatsapp",
    primeira_mensagem_em: "2024-01-15T10:30:00Z",
    ultima_mensagem_em: "2024-01-15T14:20:00Z",
    criado_em: "2024-01-15T10:30:00Z",
    atualizado_em: "2024-01-15T14:20:00Z",
    contato: {
      id: "1",
      empresa_id: "1",
      telefone: "+5511999999999",
      nome: "Maria Silva",
      email: "maria@email.com",
      qualificacao: "cliente",
      observacoes: "Cliente VIP, sempre muito educada",
      criado_em: "2024-01-10T00:00:00Z",
      atualizado_em: "2024-01-10T00:00:00Z",
    },
    agente: {
      id: "1",
      empresa_id: "1",
      email: "ana@empresa.com",
      nome: "Ana Costa",
      tipo_usuario: "agente",
      ativo: true,
      criado_em: "2024-01-01T00:00:00Z",
      atualizado_em: "2024-01-01T00:00:00Z",
    },
    agentes_atribuidos: [
      {
        id: "1",
        empresa_id: "1",
        email: "ana@empresa.com",
        nome: "Ana Costa",
        tipo_usuario: "agente",
        ativo: true,
        criado_em: "2024-01-01T00:00:00Z",
        atualizado_em: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        empresa_id: "1",
        email: "maria@empresa.com",
        nome: "Maria Santos",
        tipo_usuario: "agente",
        ativo: true,
        criado_em: "2024-01-01T00:00:00Z",
        atualizado_em: "2024-01-01T00:00:00Z",
      },
    ],
    time_atribuido: {
      id: "1",
      nome: "Vendas",
      cor: "#10B981",
      ativo: true,
      gestor_nome: "João Silva",
    },
  }

  const mockMensagens: Mensagem[] = [
    {
      id: "1",
      conversa_id: conversaId,
      remetente_tipo: "cliente",
      remetente_id: "1",
      conteudo: "Olá! Preciso de ajuda com meu pedido",
      tipo_mensagem: "texto",
      enviada: true,
      lida: true,
      criado_em: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      conversa_id: conversaId,
      remetente_tipo: "sistema",
      conteudo: "Conversa atribuída para Ana Costa",
      tipo_mensagem: "sistema",
      criado_em: "2024-01-15T10:31:00Z",
    },
    {
      id: "3",
      conversa_id: conversaId,
      remetente_tipo: "agente",
      remetente_id: "1",
      conteudo: "Olá Maria! Claro, vou te ajudar. Qual é o número do seu pedido?",
      tipo_mensagem: "texto",
      enviada: true,
      lida: true,
      criado_em: "2024-01-15T10:32:00Z",
      autor_nome: "Ana Costa",
    },
    {
      id: "4",
      conversa_id: conversaId,
      remetente_tipo: "agente",
      remetente_id: "1",
      conteudo: "Cliente parece estar com pressa, vou priorizar este atendimento.",
      tipo_mensagem: "nota_interna",
      criado_em: "2024-01-15T10:33:00Z",
      autor_nome: "Ana Costa",
    },
    {
      id: "5",
      conversa_id: conversaId,
      remetente_tipo: "cliente",
      remetente_id: "1",
      conteudo: "É o pedido #12345. Fiz ontem mas ainda não recebi confirmação",
      tipo_mensagem: "texto",
      enviada: true,
      lida: true,
      criado_em: "2024-01-15T10:35:00Z",
    },
    {
      id: "6",
      conversa_id: conversaId,
      remetente_tipo: "agente",
      remetente_id: "2",
      conteudo: "Verifiquei no sistema, o pedido está em processamento. Prazo de entrega: 2 dias úteis.",
      tipo_mensagem: "nota_interna",
      criado_em: "2024-01-15T10:36:00Z",
      autor_nome: "João Santos",
    },
    {
      id: "7",
      conversa_id: conversaId,
      remetente_tipo: "agente",
      remetente_id: "1",
      conteudo: "Deixe-me verificar o status do seu pedido. Um momento por favor...",
      tipo_mensagem: "texto",
      enviada: true,
      lida: false,
      criado_em: "2024-01-15T10:37:00Z",
      autor_nome: "Ana Costa",
    },
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setConversa(mockConversa)
      setMensagens(mockMensagens)
      setLoading(false)
    }, 1000)
  }, [conversaId])

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return

    setEnviando(true)

    const novaMensagemObj: Mensagem = {
      id: Date.now().toString(),
      conversa_id: conversaId,
      remetente_tipo: "agente",
      remetente_id: usuarioLogado.id,
      conteudo: novaMensagem,
      tipo_mensagem: modoNotaInterna ? "nota_interna" : "texto",
      enviada: !modoNotaInterna,
      lida: false,
      criado_em: new Date().toISOString(),
      autor_nome: usuarioLogado.nome,
    }

    // Simular envio
    setTimeout(() => {
      setMensagens((prev) => [...prev, novaMensagemObj])
      setNovaMensagem("")
      setEnviando(false)

      // Se não for nota interna, adicionar mensagem de sistema
      if (!modoNotaInterna) {
        const mensagemSistema: Mensagem = {
          id: (Date.now() + 1).toString(),
          conversa_id: conversaId,
          remetente_tipo: "sistema",
          conteudo: "Mensagem enviada via WhatsApp",
          tipo_mensagem: "sistema",
          criado_em: new Date().toISOString(),
        }
        setTimeout(() => {
          setMensagens((prev) => [...prev, mensagemSistema])
        }, 1000)
      }
    }, 500)
  }

  const alterarStatus = async (novoStatus: string) => {
    if (!conversa) return

    setConversa((prev) => (prev ? { ...prev, status: novoStatus as any } : null))

    const mensagemSistema: Mensagem = {
      id: Date.now().toString(),
      conversa_id: conversaId,
      remetente_tipo: "sistema",
      conteudo: `Status alterado para: ${novoStatus}`,
      tipo_mensagem: "sistema",
      criado_em: new Date().toISOString(),
    }

    setMensagens((prev) => [...prev, mensagemSistema])
  }

  const alterarPrioridade = async (novaPrioridade: string) => {
    if (!conversa) return

    setConversa((prev) => (prev ? { ...prev, prioridade: novaPrioridade as any } : null))

    const mensagemSistema: Mensagem = {
      id: Date.now().toString(),
      conversa_id: conversaId,
      remetente_tipo: "sistema",
      conteudo: `Prioridade alterada para: ${novaPrioridade}`,
      tipo_mensagem: "sistema",
      criado_em: new Date().toISOString(),
    }

    setMensagens((prev) => [...prev, mensagemSistema])
  }

  const handleUpdateAssignment = (novosAgentes: any[], novoTime?: any) => {
    if (!conversa) return

    setConversa((prev) =>
      prev
        ? {
            ...prev,
            agentes_atribuidos: novosAgentes,
            time_atribuido: novoTime,
          }
        : null,
    )

    const mensagemSistema = {
      id: Date.now().toString(),
      conversa_id: conversaId,
      remetente_tipo: "sistema" as const,
      conteudo: `Atribuições atualizadas: ${novosAgentes.length} agente(s)${novoTime ? `, Time: ${novoTime.nome}` : ""}`,
      tipo_mensagem: "sistema" as const,
      criado_em: new Date().toISOString(),
    }

    setMensagens((prev) => [...prev, mensagemSistema])
  }

  const formatarTempo = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderMensagem = (mensagem: Mensagem) => {
    const isAgente = mensagem.remetente_tipo === "agente"
    const isCliente = mensagem.remetente_tipo === "cliente"
    const isSystem = mensagem.remetente_tipo === "sistema"
    const isNotaInterna = mensagem.tipo_mensagem === "nota_interna"

    if (isSystem) {
      return (
        <div key={mensagem.id} className="flex justify-center my-4">
          <Badge variant="secondary" className="text-xs">
            {mensagem.conteudo}
          </Badge>
        </div>
      )
    }

    if (isNotaInterna) {
      return (
        <div key={mensagem.id} className="my-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600"
                  >
                    <StickyNote className="w-3 h-3 mr-1" />
                    Nota Interna
                  </Badge>
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    {mensagem.autor_nome}
                  </span>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                    {formatarTempo(mensagem.criado_em)}
                  </span>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">{mensagem.conteudo}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={mensagem.id} className={`flex mb-4 ${isAgente ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isAgente ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          }`}
        >
          <div className="mb-1">
            {isAgente && mensagem.autor_nome && <p className="text-xs opacity-70 mb-1">{mensagem.autor_nome}</p>}
            <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">{formatarTempo(mensagem.criado_em)}</span>
            {isAgente && (
              <div className="flex items-center gap-1">
                {mensagem.enviada ? (
                  <span className="text-xs opacity-70">✓</span>
                ) : (
                  <span className="text-xs opacity-70">⏳</span>
                )}
                {mensagem.lida && <span className="text-xs opacity-70">✓</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!conversa) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Conversa não encontrada</h1>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{conversa.contato?.nome}</h1>
            <p className="text-muted-foreground">{conversa.numero_ticket}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={conversa.status} />
          <PriorityBadge priority={conversa.prioridade} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Área de mensagens */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-2 p-2">
                {mensagens.map(renderMensagem)}
                <div ref={messagesEndRef} />
              </div>

              {/* Seletor de modo de mensagem */}
              <div className="mb-3">
                <Tabs
                  value={modoNotaInterna ? "nota" : "cliente"}
                  onValueChange={(value) => setModoNotaInterna(value === "nota")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cliente" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Responder Cliente
                    </TabsTrigger>
                    <TabsTrigger value="nota" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Nota Interna
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Campo de envio */}
              <div className="space-y-2">
                {modoNotaInterna && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-300">
                      <Lock className="w-3 h-3" />
                      <span>Modo Nota Interna - Mensagem visível apenas para a equipe</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Input
                    placeholder={
                      modoNotaInterna
                        ? "Digite uma nota interna para a equipe..."
                        : "Digite sua mensagem para o cliente..."
                    }
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        enviarMensagem()
                      }
                    }}
                    disabled={enviando}
                    className={`flex-1 ${
                      modoNotaInterna
                        ? "border-yellow-300 dark:border-yellow-600 focus:border-yellow-500 dark:focus:border-yellow-400"
                        : ""
                    }`}
                  />

                  <Button
                    onClick={enviarMensagem}
                    disabled={enviando || !novaMensagem.trim()}
                    size="icon"
                    className={`shrink-0 ${
                      modoNotaInterna
                        ? "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                        : ""
                    }`}
                  >
                    {modoNotaInterna ? <StickyNote className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Informações do Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${conversa.contato?.nome?.charAt(0)}`} />
                  <AvatarFallback>{conversa.contato?.nome?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{conversa.contato?.nome}</h3>
                  <Badge variant="outline">{conversa.contato?.qualificacao}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{conversa.contato?.telefone}</span>
                </div>
                {conversa.contato?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{conversa.contato.email}</span>
                  </div>
                )}
              </div>

              {conversa.contato?.observacoes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{conversa.contato.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agente Responsável */}
          {conversa.agente && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agente Responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${conversa.agente.nome.charAt(0)}`} />
                    <AvatarFallback>{conversa.agente.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{conversa.agente.nome}</h3>
                    <p className="text-sm text-muted-foreground">{conversa.agente.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={conversa.status} onValueChange={alterarStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberta">Aberta</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="fechada">Fechada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prioridade</label>
                <Select value={conversa.prioridade} onValueChange={alterarPrioridade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Atribuições (apenas para admins) */}
          {isAdmin() && (
            <ConversationAssignment
              conversaId={conversaId}
              agentesAtribuidos={conversa.agentes_atribuidos || []}
              timeAtribuido={conversa.time_atribuido}
              onUpdateAssignment={handleUpdateAssignment}
              isAdmin={isAdmin()}
            />
          )}
        </div>
      </div>
    </div>
  )
}
