"use client"

import type React from "react"

import { useState } from "react"
import { AdminGuard } from "@/components/auth/admin-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Edit, Trash2, Calendar, UserCheck, Clock, Target, TrendingUp, Shield } from "lucide-react"

interface Membro {
  id: string
  nome: string
  email: string
  tipo: "gestor" | "agente"
  ativo: boolean
}

interface Time {
  id: string
  nome: string
  descricao: string
  cor: string
  ativo: boolean
  data_criacao: string
  gestor_id: string
  gestor_nome: string
  membros: Membro[]
  conversas_ativas: number
  conversas_total: number
  tempo_resposta_medio: string
  taxa_resolucao: number
}

// Dados mockados
const timesMock: Time[] = [
  {
    id: "1",
    nome: "Vendas",
    descricao: "Equipe responsável por vendas e prospecção de novos clientes",
    cor: "#10B981",
    ativo: true,
    data_criacao: "2024-01-15",
    gestor_id: "1",
    gestor_nome: "João Silva",
    membros: [
      { id: "1", nome: "João Silva", email: "joao@empresa.com", tipo: "gestor", ativo: true },
      { id: "2", nome: "Maria Santos", email: "maria@empresa.com", tipo: "agente", ativo: true },
      { id: "3", nome: "Pedro Costa", email: "pedro@empresa.com", tipo: "agente", ativo: true },
    ],
    conversas_ativas: 15,
    conversas_total: 234,
    tempo_resposta_medio: "2m 15s",
    taxa_resolucao: 92,
  },
  {
    id: "2",
    nome: "Suporte Técnico",
    descricao: "Equipe especializada em suporte técnico e resolução de problemas",
    cor: "#3B82F6",
    ativo: true,
    data_criacao: "2024-01-10",
    gestor_id: "4",
    gestor_nome: "Ana Oliveira",
    membros: [
      { id: "4", nome: "Ana Oliveira", email: "ana@empresa.com", tipo: "gestor", ativo: true },
      { id: "5", nome: "Carlos Lima", email: "carlos@empresa.com", tipo: "agente", ativo: true },
    ],
    conversas_ativas: 8,
    conversas_total: 156,
    tempo_resposta_medio: "1m 45s",
    taxa_resolucao: 95,
  },
  {
    id: "3",
    nome: "Atendimento Geral",
    descricao: "Equipe para atendimento geral e triagem de clientes",
    cor: "#F59E0B",
    ativo: false,
    data_criacao: "2024-01-05",
    gestor_id: "6",
    gestor_nome: "Roberto Santos",
    membros: [{ id: "6", nome: "Roberto Santos", email: "roberto@empresa.com", tipo: "gestor", ativo: false }],
    conversas_ativas: 0,
    conversas_total: 89,
    tempo_resposta_medio: "3m 20s",
    taxa_resolucao: 87,
  },
]

const gestoresMock = [
  { id: "1", nome: "João Silva", email: "joao@empresa.com" },
  { id: "4", nome: "Ana Oliveira", email: "ana@empresa.com" },
  { id: "6", nome: "Roberto Santos", email: "roberto@empresa.com" },
  { id: "7", nome: "Fernanda Costa", email: "fernanda@empresa.com" },
]

const agentesMock = [
  { id: "2", nome: "Maria Santos", email: "maria@empresa.com" },
  { id: "3", nome: "Pedro Costa", email: "pedro@empresa.com" },
  { id: "5", nome: "Carlos Lima", email: "carlos@empresa.com" },
  { id: "8", nome: "Juliana Alves", email: "juliana@empresa.com" },
  { id: "9", nome: "Ricardo Pereira", email: "ricardo@empresa.com" },
]

const coresDisponiveis = [
  { nome: "Verde", valor: "#10B981" },
  { nome: "Azul", valor: "#3B82F6" },
  { nome: "Roxo", valor: "#8B5CF6" },
  { nome: "Rosa", valor: "#EC4899" },
  { nome: "Amarelo", valor: "#F59E0B" },
  { nome: "Vermelho", valor: "#EF4444" },
  { nome: "Indigo", valor: "#6366F1" },
  { nome: "Teal", valor: "#14B8A6" },
]

function TimesPageContent() {
  const [times, setTimes] = useState<Time[]>(timesMock)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [modalAberto, setModalAberto] = useState(false)
  const [timeEditando, setTimeEditando] = useState<Time | null>(null)

  // Filtrar times
  const timesFiltrados = times.filter((time) => {
    const matchBusca =
      time.nome.toLowerCase().includes(busca.toLowerCase()) ||
      time.descricao.toLowerCase().includes(busca.toLowerCase())
    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "ativo" && time.ativo) ||
      (filtroStatus === "inativo" && !time.ativo)

    return matchBusca && matchStatus
  })

  // Estatísticas
  const totalTimes = times.length
  const timesAtivos = times.filter((t) => t.ativo).length
  const timesInativos = times.filter((t) => !t.ativo).length
  const totalMembros = times.reduce((acc, time) => acc + time.membros.length, 0)

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const handleSalvarTime = (dadosTime: any) => {
    if (timeEditando) {
      // Editar time existente
      setTimes((prev) => prev.map((t) => (t.id === timeEditando.id ? { ...t, ...dadosTime } : t)))
    } else {
      // Criar novo time
      const novoTime: Time = {
        id: Date.now().toString(),
        data_criacao: new Date().toISOString().split("T")[0],
        conversas_ativas: 0,
        conversas_total: 0,
        tempo_resposta_medio: "0m 0s",
        taxa_resolucao: 0,
        membros: [],
        ...dadosTime,
      }
      setTimes((prev) => [...prev, novoTime])
    }

    setModalAberto(false)
    setTimeEditando(null)
  }

  const handleExcluirTime = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.")) {
      setTimes((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const abrirModalEdicao = (time: Time) => {
    setTimeEditando(time)
    setModalAberto(true)
  }

  const abrirModalCriacao = () => {
    setTimeEditando(null)
    setModalAberto(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestão de Times</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize sua equipe em times especializados</p>
        </div>
        <Button onClick={abrirModalCriacao} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Time
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Times</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalTimes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Times Ativos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{timesAtivos}</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Times Inativos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{timesInativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Membros</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalMembros}</p>
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
                  placeholder="Buscar por nome ou descrição..."
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
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {timesFiltrados.map((time) => (
          <Card key={time.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: time.cor }} />
                  <div>
                    <CardTitle className="text-lg">{time.nome}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{time.descricao}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={time.ativo ? "default" : "destructive"}>{time.ativo ? "Ativo" : "Inativo"}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Gestor */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Gestor:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{time.gestor_nome}</span>
              </div>

              {/* Membros */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Membros ({time.membros.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {time.membros.slice(0, 4).map((membro) => (
                    <div key={membro.id} className="flex items-center space-x-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                          {membro.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{membro.nome.split(" ")[0]}</span>
                    </div>
                  ))}
                  {time.membros.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{time.membros.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{time.conversas_ativas}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Ativas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-4 h-4 text-blue-600 mr-1" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{time.taxa_resolucao}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Resolução</p>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Criado em {formatarData(time.data_criacao)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Tempo médio: {time.tempo_resposta_medio}
                </div>
              </div>

              {/* Ações */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => abrirModalEdicao(time)} className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExcluirTime(time.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {timesFiltrados.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Nenhum time encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {busca || filtroStatus !== "todos"
                ? "Tente ajustar os filtros para encontrar times."
                : "Comece criando o primeiro time da sua empresa."}
            </p>
            {!busca && filtroStatus === "todos" && (
              <Button onClick={abrirModalCriacao} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Time
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Criação/Edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{timeEditando ? "Editar Time" : "Novo Time"}</DialogTitle>
          </DialogHeader>
          <FormularioTime time={timeEditando} onSalvar={handleSalvarTime} onCancelar={() => setModalAberto(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente do formulário
function FormularioTime({
  time,
  onSalvar,
  onCancelar,
}: {
  time: Time | null
  onSalvar: (dados: any) => void
  onCancelar: () => void
}) {
  const [dados, setDados] = useState({
    nome: time?.nome || "",
    descricao: time?.descricao || "",
    cor: time?.cor || "#10B981",
    ativo: time?.ativo ?? true,
    gestor_id: time?.gestor_id || "",
    gestor_nome: time?.gestor_nome || "",
    membros_selecionados: time?.membros.map((m) => m.id) || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dados.nome || !dados.gestor_id) return

    const gestorSelecionado = gestoresMock.find((g) => g.id === dados.gestor_id)
    const membrosTime = [
      // Incluir o gestor como membro
      {
        id: dados.gestor_id,
        nome: gestorSelecionado?.nome || "",
        email: gestorSelecionado?.email || "",
        tipo: "gestor" as const,
        ativo: true,
      },
      // Incluir agentes selecionados
      ...agentesMock
        .filter((a) => dados.membros_selecionados.includes(a.id))
        .map((a) => ({
          id: a.id,
          nome: a.nome,
          email: a.email,
          tipo: "agente" as const,
          ativo: true,
        })),
    ]

    onSalvar({
      ...dados,
      gestor_nome: gestorSelecionado?.nome || "",
      membros: membrosTime,
    })
  }

  const toggleMembro = (membroId: string) => {
    setDados((prev) => ({
      ...prev,
      membros_selecionados: prev.membros_selecionados.includes(membroId)
        ? prev.membros_selecionados.filter((id) => id !== membroId)
        : [...prev.membros_selecionados, membroId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Time *</Label>
          <Input
            id="nome"
            value={dados.nome}
            onChange={(e) => setDados((prev) => ({ ...prev, nome: e.target.value }))}
            placeholder="Ex: Vendas, Suporte, Atendimento..."
            required
          />
        </div>

        <div>
          <Label htmlFor="cor">Cor do Time</Label>
          <div className="flex space-x-2 mt-2">
            {coresDisponiveis.map((cor) => (
              <button
                key={cor.valor}
                type="button"
                onClick={() => setDados((prev) => ({ ...prev, cor: cor.valor }))}
                className={`w-8 h-8 rounded-full border-2 ${
                  dados.cor === cor.valor ? "border-gray-900 dark:border-gray-100" : "border-gray-300"
                }`}
                style={{ backgroundColor: cor.valor }}
                title={cor.nome}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={dados.descricao}
          onChange={(e) => setDados((prev) => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva a função e responsabilidades deste time..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="gestor">Gestor do Time *</Label>
        <Select value={dados.gestor_id} onValueChange={(value) => setDados((prev) => ({ ...prev, gestor_id: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um gestor" />
          </SelectTrigger>
          <SelectContent>
            {gestoresMock.map((gestor) => (
              <SelectItem key={gestor.id} value={gestor.id}>
                {gestor.nome} - {gestor.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Membros do Time (Agentes)</Label>
        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
          {agentesMock.map((agente) => (
            <div key={agente.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`agente-${agente.id}`}
                checked={dados.membros_selecionados.includes(agente.id)}
                onChange={() => toggleMembro(agente.id)}
                className="rounded"
              />
              <label htmlFor={`agente-${agente.id}`} className="text-sm cursor-pointer">
                {agente.nome} - {agente.email}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">O gestor será automaticamente incluído como membro do time</p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="ativo"
          checked={dados.ativo}
          onCheckedChange={(checked) => setDados((prev) => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="ativo">Time ativo</Label>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancelar} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {time ? "Salvar Alterações" : "Criar Time"}
        </Button>
      </div>
    </form>
  )
}

export default function TimesPage() {
  return (
    <AdminGuard>
      <TimesPageContent />
    </AdminGuard>
  )
}
