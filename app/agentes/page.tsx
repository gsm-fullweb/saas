"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react"

interface Agente {
  id: string
  nome: string
  email: string
  telefone?: string
  tipo_usuario: "gestor" | "agente"
  ativo: boolean
  data_criacao: string
  ultimo_acesso?: string
  conversas_ativas: number
  conversas_total: number
  tempo_resposta_medio: string
  observacoes?: string
}

// Dados mockados
const agentesMock: Agente[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@empresa.com",
    telefone: "(11) 99999-1111",
    tipo_usuario: "gestor",
    ativo: true,
    data_criacao: "2024-01-15",
    ultimo_acesso: "2024-01-23T10:30:00",
    conversas_ativas: 5,
    conversas_total: 150,
    tempo_resposta_medio: "2m 30s",
    observacoes: "Gestor principal da equipe",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria@empresa.com",
    telefone: "(11) 99999-2222",
    tipo_usuario: "agente",
    ativo: true,
    data_criacao: "2024-01-10",
    ultimo_acesso: "2024-01-23T09:15:00",
    conversas_ativas: 8,
    conversas_total: 89,
    tempo_resposta_medio: "1m 45s",
    observacoes: "Especialista em vendas",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@empresa.com",
    tipo_usuario: "agente",
    ativo: true,
    data_criacao: "2024-01-20",
    ultimo_acesso: "2024-01-23T08:45:00",
    conversas_ativas: 3,
    conversas_total: 45,
    tempo_resposta_medio: "3m 10s",
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana@empresa.com",
    telefone: "(11) 99999-4444",
    tipo_usuario: "agente",
    ativo: false,
    data_criacao: "2024-01-05",
    ultimo_acesso: "2024-01-20T16:20:00",
    conversas_ativas: 0,
    conversas_total: 67,
    tempo_resposta_medio: "2m 15s",
    observacoes: "Agente em férias",
  },
]

export default function AgentesPage() {
  const [agentes, setAgentes] = useState<Agente[]>(agentesMock)
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [modalAberto, setModalAberto] = useState(false)
  const [agenteEditando, setAgenteEditando] = useState<Agente | null>(null)

  // Filtrar agentes
  const agentesFiltrados = agentes.filter((agente) => {
    const matchBusca =
      agente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      agente.email.toLowerCase().includes(busca.toLowerCase())
    const matchTipo = filtroTipo === "todos" || agente.tipo_usuario === filtroTipo
    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "ativo" && agente.ativo) ||
      (filtroStatus === "inativo" && !agente.ativo)

    return matchBusca && matchTipo && matchStatus
  })

  // Estatísticas
  const totalAgentes = agentes.length
  const agentesAtivos = agentes.filter((a) => a.ativo).length
  const agentesInativos = agentes.filter((a) => !a.ativo).length
  const gestores = agentes.filter((a) => a.tipo_usuario === "gestor").length

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const formatarUltimoAcesso = (data?: string) => {
    if (!data) return "Nunca"
    const agora = new Date()
    const acesso = new Date(data)
    const diffMs = agora.getTime() - acesso.getTime()
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHoras < 1) return "Agora"
    if (diffHoras < 24) return `${diffHoras}h atrás`
    const diffDias = Math.floor(diffHoras / 24)
    return `${diffDias}d atrás`
  }

  const handleSalvarAgente = (dadosAgente: any) => {
    if (agenteEditando) {
      // Editar agente existente
      setAgentes((prev) => prev.map((a) => (a.id === agenteEditando.id ? { ...a, ...dadosAgente } : a)))
    } else {
      // Criar novo agente
      const novoAgente: Agente = {
        id: Date.now().toString(),
        data_criacao: new Date().toISOString().split("T")[0],
        conversas_ativas: 0,
        conversas_total: 0,
        tempo_resposta_medio: "0m 0s",
        ...dadosAgente,
      }
      setAgentes((prev) => [...prev, novoAgente])
    }

    setModalAberto(false)
    setAgenteEditando(null)
  }

  const handleExcluirAgente = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este agente?")) {
      setAgentes((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const abrirModalEdicao = (agente: Agente) => {
    setAgenteEditando(agente)
    setModalAberto(true)
  }

  const abrirModalCriacao = () => {
    setAgenteEditando(null)
    setModalAberto(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Agentes</h1>
          <p className="text-gray-600">Gerencie sua equipe de atendimento</p>
        </div>
        <Button onClick={abrirModalCriacao} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalAgentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{agentesAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-900">{agentesInativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gestores</p>
                <p className="text-2xl font-bold text-gray-900">{gestores}</p>
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
                  placeholder="Buscar por nome ou email..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="gestor">Gestores</SelectItem>
                <SelectItem value="agente">Agentes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agentesFiltrados.map((agente) => (
          <Card key={agente.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {agente.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agente.nome}</h3>
                    <p className="text-sm text-gray-600">{agente.email}</p>
                    {agente.telefone && <p className="text-sm text-gray-500">{agente.telefone}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={agente.tipo_usuario === "gestor" ? "default" : "secondary"}>
                    {agente.tipo_usuario === "gestor" ? (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Gestor
                      </>
                    ) : (
                      "Agente"
                    )}
                  </Badge>
                  <Badge variant={agente.ativo ? "default" : "destructive"}>{agente.ativo ? "Ativo" : "Inativo"}</Badge>
                </div>
              </div>

              {/* Estatísticas do Agente */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-600 mr-1" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{agente.conversas_ativas}</p>
                  <p className="text-xs text-gray-600">Ativas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{agente.conversas_total}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-orange-600 mr-1" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{agente.tempo_resposta_medio}</p>
                  <p className="text-xs text-gray-600">Resposta</p>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Criado em {formatarData(agente.data_criacao)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Último acesso: {formatarUltimoAcesso(agente.ultimo_acesso)}
                </div>
              </div>

              {agente.observacoes && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700">{agente.observacoes}</p>
                </div>
              )}

              {/* Ações */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => abrirModalEdicao(agente)} className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExcluirAgente(agente.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agentesFiltrados.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum agente encontrado</h3>
            <p className="text-gray-600 mb-4">
              {busca || filtroTipo !== "todos" || filtroStatus !== "todos"
                ? "Tente ajustar os filtros para encontrar agentes."
                : "Comece adicionando o primeiro agente da sua equipe."}
            </p>
            {!busca && filtroTipo === "todos" && filtroStatus === "todos" && (
              <Button onClick={abrirModalCriacao} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Agente
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Criação/Edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{agenteEditando ? "Editar Agente" : "Novo Agente"}</DialogTitle>
          </DialogHeader>
          <FormularioAgente
            agente={agenteEditando}
            onSalvar={handleSalvarAgente}
            onCancelar={() => setModalAberto(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente do formulário
function FormularioAgente({
  agente,
  onSalvar,
  onCancelar,
}: {
  agente: Agente | null
  onSalvar: (dados: any) => void
  onCancelar: () => void
}) {
  const [dados, setDados] = useState({
    nome: agente?.nome || "",
    email: agente?.email || "",
    telefone: agente?.telefone || "",
    tipo_usuario: agente?.tipo_usuario || "agente",
    ativo: agente?.ativo ?? true,
    observacoes: agente?.observacoes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dados.nome || !dados.email) return
    onSalvar(dados)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          value={dados.nome}
          onChange={(e) => setDados((prev) => ({ ...prev, nome: e.target.value }))}
          placeholder="Nome completo"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={dados.email}
          onChange={(e) => setDados((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="email@empresa.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          value={dados.telefone}
          onChange={(e) => setDados((prev) => ({ ...prev, telefone: e.target.value }))}
          placeholder="(11) 99999-9999"
        />
      </div>

      <div>
        <Label htmlFor="tipo_usuario">Tipo de Usuário</Label>
        <Select
          value={dados.tipo_usuario}
          onValueChange={(value) => setDados((prev) => ({ ...prev, tipo_usuario: value as "gestor" | "agente" }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agente">Agente</SelectItem>
            <SelectItem value="gestor">Gestor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="ativo"
          checked={dados.ativo}
          onCheckedChange={(checked) => setDados((prev) => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="ativo">Usuário ativo</Label>
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={dados.observacoes}
          onChange={(e) => setDados((prev) => ({ ...prev, observacoes: e.target.value }))}
          placeholder="Observações sobre o agente..."
          rows={3}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancelar} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {agente ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}
