"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { UserPlus, Users, MessageSquare, X, Crown, User, AlertCircle, CheckCircle2 } from "lucide-react"

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

interface Conversa {
  id: string
  numero_ticket: string
  contato_nome: string
  status: string
  agentes_atribuidos: Usuario[]
  time_atribuido?: Time
}

interface Atribuicao {
  id: string
  conversa_id: string
  usuario_id: string
  time_id?: string
  tipo_atribuicao: "principal" | "colaborador"
  ativo: boolean
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

const conversasMock: Conversa[] = [
  {
    id: "1",
    numero_ticket: "TK-001",
    contato_nome: "Maria Silva",
    status: "aberta",
    agentes_atribuidos: [usuariosMock[1]],
    time_atribuido: timesMock[0],
  },
  {
    id: "2",
    numero_ticket: "TK-002",
    contato_nome: "João Santos",
    status: "em_andamento",
    agentes_atribuidos: [usuariosMock[2], usuariosMock[4]],
    time_atribuido: timesMock[1],
  },
  {
    id: "3",
    numero_ticket: "TK-003",
    contato_nome: "Ana Costa",
    status: "aguardando",
    agentes_atribuidos: [],
  },
]

interface AssignmentManagerProps {
  tipo: "conversa" | "time"
  itemId?: string
  onClose?: () => void
}

export function AssignmentManager({ tipo, itemId, onClose }: AssignmentManagerProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const [conversaSelecionada, setConversaSelecionada] = useState<string>("")
  const [timeSelecionado, setTimeSelecionado] = useState<string>("")
  const [agenteSelecionado, setAgenteSelecionado] = useState<string>("")
  const [agentesMultiplos, setAgentesMultiplos] = useState<string[]>([])
  const [tipoAtribuicao, setTipoAtribuicao] = useState<"unico" | "multiplos">("unico")
  const [conversas, setConversas] = useState<Conversa[]>(conversasMock)

  const handleAtribuirAgente = () => {
    if (!conversaSelecionada || (!agenteSelecionado && agentesMultiplos.length === 0)) return

    const agentesParaAtribuir = tipoAtribuicao === "unico" ? [agenteSelecionado] : agentesMultiplos

    // Simular atribuição
    setConversas((prev) =>
      prev.map((conversa) => {
        if (conversa.id === conversaSelecionada) {
          const novosAgentes = agentesParaAtribuir.map((agenteId) => usuariosMock.find((u) => u.id === agenteId)!)
          return {
            ...conversa,
            agentes_atribuidos: [...conversa.agentes_atribuidos, ...novosAgentes],
            time_atribuido: timeSelecionado ? timesMock.find((t) => t.id === timeSelecionado) : conversa.time_atribuido,
          }
        }
        return conversa
      }),
    )

    // Reset form
    setConversaSelecionada("")
    setAgenteSelecionado("")
    setAgentesMultiplos([])
    setTimeSelecionado("")
    setModalAberto(false)
  }

  const handleRemoverAtribuicao = (conversaId: string, agenteId: string) => {
    setConversas((prev) =>
      prev.map((conversa) => {
        if (conversa.id === conversaId) {
          return {
            ...conversa,
            agentes_atribuidos: conversa.agentes_atribuidos.filter((a) => a.id !== agenteId),
          }
        }
        return conversa
      }),
    )
  }

  const toggleAgenteMultiplo = (agenteId: string) => {
    setAgentesMultiplos((prev) =>
      prev.includes(agenteId) ? prev.filter((id) => id !== agenteId) : [...prev, agenteId],
    )
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gerenciar Atribuições</h2>
          <p className="text-gray-600 dark:text-gray-400">Atribua agentes às conversas e gerencie times</p>
        </div>
        <Button onClick={() => setModalAberto(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Nova Atribuição
        </Button>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{conversas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Agentes Ativos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {usuariosMock.filter((u) => u.ativo && u.tipo_usuario === "agente").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Conversas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversas e Atribuições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversas.map((conversa) => (
              <div key={conversa.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{conversa.numero_ticket}</Badge>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{conversa.contato_nome}</h4>
                      {getStatusBadge(conversa.status)}
                    </div>
                    {conversa.time_atribuido && (
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: conversa.time_atribuido.cor }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Time: {conversa.time_atribuido.nome}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agentes Atribuídos */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Agentes Atribuídos ({conversa.agentes_atribuidos.length})
                  </Label>
                  {conversa.agentes_atribuidos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {conversa.agentes_atribuidos.map((agente) => (
                        <div
                          key={agente.id}
                          className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
                        >
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoverAtribuicao(conversa.id, agente.id)}
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum agente atribuído</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Atribuição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Atribuição</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selecionar Conversa */}
            <div>
              <Label htmlFor="conversa">Conversa *</Label>
              <Select value={conversaSelecionada} onValueChange={setConversaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conversa" />
                </SelectTrigger>
                <SelectContent>
                  {conversas.map((conversa) => (
                    <SelectItem key={conversa.id} value={conversa.id}>
                      {conversa.numero_ticket} - {conversa.contato_nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selecionar Time (Opcional) */}
            <div>
              <Label htmlFor="time">Time (Opcional)</Label>
              <Select value={timeSelecionado} onValueChange={setTimeSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum time</SelectItem>
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

            {/* Tipo de Atribuição */}
            <div>
              <Label className="text-base font-medium">Tipo de Atribuição</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="unico"
                    name="tipo"
                    checked={tipoAtribuicao === "unico"}
                    onChange={() => setTipoAtribuicao("unico")}
                  />
                  <Label htmlFor="unico">Atribuir um agente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="multiplos"
                    name="tipo"
                    checked={tipoAtribuicao === "multiplos"}
                    onChange={() => setTipoAtribuicao("multiplos")}
                  />
                  <Label htmlFor="multiplos">Atribuir múltiplos agentes</Label>
                </div>
              </div>
            </div>

            {/* Seleção de Agente(s) */}
            {tipoAtribuicao === "unico" ? (
              <div>
                <Label htmlFor="agente">Agente *</Label>
                <Select value={agenteSelecionado} onValueChange={setAgenteSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um agente" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuariosMock
                      .filter((u) => u.ativo)
                      .map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id}>
                          <div className="flex items-center gap-2">
                            {usuario.tipo_usuario === "gestor" ? (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <User className="w-4 h-4 text-gray-500" />
                            )}
                            {usuario.nome} - {usuario.email}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label>Agentes *</Label>
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
            )}

            {/* Ações */}
            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setModalAberto(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleAtribuirAgente}
                disabled={
                  !conversaSelecionada ||
                  (tipoAtribuicao === "unico" ? !agenteSelecionado : agentesMultiplos.length === 0)
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Atribuir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
